var presentButton;
let cache = localStorage.getItem("prevState");
if (cache == null) {
    presentButton = 0;
}
else {
    presentButton = parseInt(cache);
}

changeExtensionDisplay();

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     if (changeInfo.status == 'loading' && presentButton == 1) {
//         // start again because new page is loading
//         console.log("loading");
//         presentButton = 0;
//         changeExtensionDisplay();
//     }
// }) 


function onclick() {
    console.log("clicked");
    presentButton ^= 1;
    changeExtensionDisplay();
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, presentButton);
    })
}

function changeExtensionDisplay() {
    localStorage.setItem("prevState", `${presentButton}`);
    if (!presentButton) {
        document.getElementById("container").innerHTML = `
            <p id="textInfo">Click "Start" to start Monitoring Google Meet Class</p>
            <button type="button" id="btn" >Start Monitoring</button>
        `;
        document.getElementById("btn").onclick = onclick;
    }
    else {
        document.getElementById("container").innerHTML = `
           <p id="textInfo">Google Meet is now being monitored for attendance</p>
           <button type="button" id="btn" >Stop Monitoring</button>
        `;
        document.getElementById("btn").onclick = onclick;
    }
}
