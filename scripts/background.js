
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
            // console.log("Active tab URL:", activeTab.url);
            if (bannedSites.includes(activeTab.url)){
                console.log(activeTab.url)
                chrome.runtime.sendMessage({message: "active"})
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

chrome.storage.local.onChanged.addListener((changes) => {
    bannedSites = [...changes.bannedSites.newValue]
    console.log(bannedSites)
})
