var button = document.getElementById("new-tab");
var timerStart = document.getElementById('start-timer')
var form = document.getElementById('website-input')
var banned = document.getElementById('ban-list')
var debugDelete = document.getElementById('delete')
var timerReset = document.getElementById('reset-timer')


let timer;
let sec = 0;
let min = 30;
let hour = 0;

function updateTime() {
    let secPretty = sec < 10 ? "0" + sec : sec;
    let minPretty = min < 10 ? "0" + min : min;
    let hourPretty = hour < 10 ? "0" + hour : hour;
    document.getElementById("timer").innerText = `${hourPretty}:${minPretty}:${secPretty}`;
}

timerReset.addEventListener('click', () => {
    clearInterval(timer)
    document.getElementById("timer").innerHTML = '00:30:00'
    min = 30
    sec = 0
    timerStart.style.display = 'inline-block'
    timerReset.style.display = 'none'
})


timerStart.addEventListener('click', () => {
    timer = setInterval(() => {
        sec--;
        if (sec == -1) {
            min--;
            sec = 59;
        }
        if (min == -1) {
            hour--;
            min = 59;
        }
        updateTime();
    }, 1000)
    timerStart.style.display = 'none'
    timerReset.style.display = 'inline-block'
})

form.addEventListener('submit', (event) => {
    event.preventDefault()
    var websiteName = document.getElementById('web-name').value;
    var li = document.createElement("li")
    li.appendChild(document.createTextNode(websiteName))
    banned.appendChild(li)
    document.getElementById('web-name').value = ''
    saveList(li)
})

function saveList(li) {
    var items = []
    items.push(li.textContent)
    
    chrome.storage.local.get(['bannedSites'])
        .then((result) => {
            let currentList = result.bannedSites || []
            let updatedList = [...currentList, ...items]

            items = []
            return chrome.storage.local.set({'bannedSites': updatedList})
        })
        .then(() => {
            return chrome.storage.local.get(['bannedSites']);
        })
        .then((result) => {
            console.log(result.bannedSites)
        })
        .catch(e => console.log(e))
    
   
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['bannedSites'])
    .then((data) => {
        if (data.bannedSites) {
            data.bannedSites.forEach((wname) => {
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(wname))
                banned.appendChild(li);
            })
        }
    })
    .catch(e => console.log(e))
});

debugDelete.addEventListener('click', () => {
    chrome.storage.local.set({'bannedSites': []})
})


chrome.runtime.sendMessage({message: {}})

updateTime()