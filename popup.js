const highlight = document.getElementById("highlight");

highlight.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: highlightHeadings
    });
});

const highlightHeadings = () => {
    for (i=1; i<=6; i++) {
        var headers = document.getElementsByTagName('h'+i);
        for (j=0; j<headers.length; j++) {
            headers[j].classList.toggle("highlighted");
        }
    }
}