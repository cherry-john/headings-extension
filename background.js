
chrome.runtime.onInstalled.addListener(() => {
    // action disabled by default
    chrome.action.disable();

    // Clear all rules to ensure only expected rules are set
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        // Declare a rule to enable the action on any http or https file
        let websiteRule = {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {schemes: ['https', 'http']},
                })
            ],
            actions: [new chrome.declarativeContent.ShowAction()],
        };

        chrome.declarativeContent.onPageChanged.addRules([websiteRule]);
  });
});