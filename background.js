/*
Off: JHK7jb Nep7Ue FTMc0c
On: JHK7jb Nep7Ue
*/

const timeInterval = 1000;  //  Loops after every this interval
const micOnTimeGap = 20;   // checks if mic is on between this time gap (in seconds)
const numberOfMicon = 10;  // Number of different mic on to be checked at a time


var intervalID;

chrome.runtime.onMessage.addListener(function (presentButton) {
    if (presentButton) {
        console.log("Started Monitoring");
        addIconToDom();
        monitorClass();
    }
    else {
        stop();
        console.log("Stopped Monitoring");
    }
})

let showAllButtonFlag = -1;
function addIconToDom() {
    let img;
    if (checkAllParticipantButton()) {
        if(showAllButtonFlag == 0){
            // An oposite icon is already present. So we remove that
            document.getElementById("markIcon").remove();
        }
        console.log("working");

        showAllButtonFlag = 1;
        img = document.createElement("img");
        img.setAttribute("id", "markIcon");
        img.src = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDM7lqeNEzE2VmoW2wOmOZZMIEOm03p5mW2tp71WjyvdFLcdL2kKxu1UcaYUrLg4QpRWM&usqp=CAU`
        img.style.width = "40px";
        img.style.height = "40px";
    }
    else {
        if(showAllButtonFlag == 1){
            // An oposite icon is already present. So we remove that
            document.getElementById("markIcon").remove();
        }
        console.log("Click on all Participants Button");

        showAllButtonFlag = 0;
        img = document.createElement("img");
        img.setAttribute("id", "markIcon");
        img.src = `https://thumbs.dreamstime.com/b/red-cross-symbol-icon-as-delete-remove-fail-failure-incorr-incorrect-answer-89999776.jpg`
        img.style.width = "40px";
        img.style.height = "40px";
    }
    document.getElementsByClassName("m3oeU")[0].appendChild(img);
}

function checkAllParticipantButton() {
    // checks if show all participant button in Meet is clicked or not
    if (document.querySelector("#ow3 > div.T4LgNb > div > div:nth-child(9) > div.crqnQb > div.rG0ybd.xPh1xb.P9KVBf > div.TqwH9c > div.SZfyod > div > div > div:nth-child(2) > span > button").getAttribute("aria-pressed") == "true") return 1;
    else return 0;
}

function stop() {
    localStorage.removeItem("data");
    clearInterval(intervalID);
    document.getElementById("markIcon").remove();
    showAllButtonFlag = -1;
}

function monitorClass() {
    intervalID = setInterval(() => {
        if (showAllButtonFlag != checkAllParticipantButton()) addIconToDom();
        let presentMicID = getWhoseMicOn();
        if (typeof presentMicID === "undefined") {
            return;
        }
        let arr = [];
        arr = localStorage.getItem("data");
        arr = JSON.parse(arr);
        if (arr != null) {
            let elem = arr[arr.length - 1];
            if (elem.uniqueId == presentMicID) {
                arr.pop();
            }
            let flag = 0;
            arr.forEach(elem => {
                if (elem.uniqueId == presentMicID) flag = 1;
            });
            if (flag) return;
        }
        else {
            arr = [];
        }
        
        arr.push({
            "uniqueId": `${presentMicID}`,
            "time": `${getPresentTime()}`
        })

        localStorage.setItem("data", JSON.stringify(arr));
        checkArrayForAttendance(arr);

    }, timeInterval);
}

function getPresentTime() {
    return Math.floor(new Date().getTime() / 1000);
}

function getWhoseMicOn() {
    let allParticipants = document.querySelectorAll(".KV1GEc"), answer;
    allParticipants.forEach(elem => {
        let allClass = elem.querySelector(".JHK7jb").getAttribute("class");
        if (!allClass.includes("FTMc0c")) {
            answer = elem.getAttribute("data-participant-id");
        }
    });
    return answer;
}

function checkArrayForAttendance(arr) {
    let prev = 0, flag = 1;
    arr.forEach(elem => {
        if (prev != 0 && elem.time - prev > micOnTimeGap) flag = 0;
        prev = elem.time;
    });
    if (arr.length < numberOfMicon) flag = 0;
    if (arr.length > 10) {
        arr.shift();    //  removing first element from array
    }
    // console.log(arr);
    if (flag) {
        notifyMe();
        notifyMe();
        setTimeout(() => { }, 15000);   //  wait sometime (15 secs)
    }
}



function notifyMe() {
    if (!window.Notification) {
        console.log('Browser does not support notifications.');
    } else {
        // check if permission is already granted
        if (Notification.permission === 'granted') {
            // show notification here
            var notify = new Notification('Meet Notification', {
                body: 'Attendance has started',
            });
        } else {
            // request permission from user
            Notification.requestPermission().then(function (p) {
                if (p === 'granted') {
                    // show notification here
                    var notify = new Notification('Meet Attendance Notifier', {
                        body: 'Attendance has started',
                    });
                } else {
                    console.log('User blocked notifications.');
                }
            }).catch(function (err) {
                console.error(err);
            });
        }
    }
}
