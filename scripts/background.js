
let sec = 0
let min = 0
let hr = 0

bannedSites = []


chrome.tabs.onActivated.addListener(async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    getActiveTabURL()
});

function getActiveTabURL() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions, (tab) => {
        const activeTab = tab[0]
        if (activeTab && activeTab.url) {
            if (bannedSites.includes(activeTab.url)){
                console.log(activeTab.url)
                // chrome.runtime.sendMessage({message: "active"})
            }
        }
    })
}

// Listen for any updates to any tab.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url) {
        getActiveTabURL()
    }
});

// Listens to any changes on the banned sites
chrome.storage.local.onChanged.addListener((changes) => {
    bannedSites = [...changes.bannedSites.newValue]
    console.log(bannedSites)
})


function setTime(s, m, h) {
    sec = s
    min = m
    hr = h
    console.log(sec, min, hr)
}

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "setTime" && message.time) {
        setTime(message.time.sec, message.time.min, message.time.hour);
        sendResponse({ status: "Time set successfully" });
    }
});

