
let sec = 0
let min = 0
let hour = 0
let timerId;
let isPaused = false

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
                console.log(hour, min, sec)
                startTimer()
            }
            else {
                pauseTimer()
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
    if (changes.bannedSites){
        bannedSites = [...changes.bannedSites.newValue]
        console.log(bannedSites)
    }
    if (changes.time){
        console.log(changes.time)
    }
    
})


function setTime(s, m, h) {
    sec = s
    min = m
    hour = h
    console.log(sec, min, hour)
}

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "setTime" && message.time) {
        setTime(message.time.sec, message.time.min, message.time.hour);
        sendResponse({ status: "Time set successfully" });
    }
});

function startTimer() {
    if (!timerId) {
        timerId = setInterval(() => {
            sec--;
            if (sec == -1) {
                min--;
                sec = 59;
            }
            if (min == -1) {
                hour--;
                min = 59;
            }
            time = {"hour": hour, "min":min, "sec":sec}
            chrome.storage.local.set({"time" : time})

            console.log(hour, min, sec)
        }, 1000)
    }
}

function pauseTimer() {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
        isPaused = true
    }
}