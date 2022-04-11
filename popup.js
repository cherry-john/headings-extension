document.getElementById("highlight").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.insertCSS({
        files: ["highlighted.css"],
        target: { tabId: tab.id },
    });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: highlightHeadings
    });
});

document.getElementById("correct").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: CorrectHeadings
    });
});

document.getElementById("save").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: saveChanges
    });
});

document.getElementById("reset").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.reload(tab.id);
})

const highlightHeadings = () => {
    for (i=1; i<=6; i++) {
        var headers = document.getElementsByTagName('h'+i);
        for (j=0; j<headers.length; j++) {
            headers[j].classList.toggle("highlighted");
        }
    }
}

const CorrectHeadings = () => {
    /**
     * Returns the next valid heading level, based on the given currentHeading.
     * eg if heading="h3" and currentHeading="h1", this returns "h2", as that has been missed 
     * @param {String} heading tagName to verify
     * @param {String} currentHeading current highest relevant heading tagName
     * @returns {String}
     */
    const getValidHeading = (heading, currentHeading) => {
        const headingLevel = parseInt(heading.charAt(1));
        const currentHeadingLevel = parseInt(currentHeading.charAt(1));
        if (headingLevel <= currentHeadingLevel || headingLevel == currentHeadingLevel + 1){
            return heading;
        }
        return "h" + (currentHeadingLevel + 1).toString();
    }

    let currentHeading = "h0";
    let tags = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    tags.forEach((elem) => {
        //create replacement element
        var new_element = document.createElement(getValidHeading(elem.tagName, currentHeading));
        //add attributes
        for(var i = 0; i < elem.attributes.length; ++i){
            let attribute = elem.attributes.item(i);
            new_element.setAttribute(attribute.nodeName, attribute.nodeValue);
        }
        //add children
        while (elem.firstChild) {
            new_element.appendChild(elem.firstChild);
        }
        //replace element
        elem.parentNode.replaceChild(new_element, elem);
        currentHeading = new_element.tagName;
    })
}

const saveChanges = () => {
    const dataBlob = new Blob([document.documentElement.innerHTML], {type: "text/html"});

    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(dataBlob);
    elem.download = "updatedContent.html";
    document.body.appendChild(elem);
    elem.click();//trigger the download
    document.body.removeChild(elem);
}