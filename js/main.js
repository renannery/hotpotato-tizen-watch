var flagConsole = false,
    // battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery,interval;
function displayWeekDay(date) {
    var str_day = document.getElementById('str_day'),
        get_day = date.getDay(),
        str_allday;
        arr_day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        arr_month = ["Jan", "Fab", "Mar", "Apr", "May", "Jul", "Jun","Aug", "Sep", "Oct", "Nov", "Dec" ], 
        get_date = date.getDate(),
        
        month = date.getMonth();

    if (get_date < 10) {
        get_date = "0" + get_date;
    }

    str_allday = arr_day[get_day] + " " + get_date + " " + arr_month[month];
    str_day.innerHTML = str_allday;
}

<<<<<<< HEAD
=======

>>>>>>> bc5f9a2fc8f5b587a64d1d453388a8a148bc84da
function openSendPotato() {
    window.location="sendpotato.html"
}

function displayTime() {
    var str_hours = document.getElementById('str_hours'),
        str_console = document.getElementById('str_console'),
        str_minutes = document.getElementById('str_minutes'),
        str_ampm = document.getElementById('str_ampm'),
        date;

    try{
        date  = tizen.time.getCurrentDateTime();
        // date = new Date("July 21, 1983 01:15:00");
    }catch(e) {
        alert(e.message);
    }

    displayWeekDay(date);

    hours = date.getHours();
    str_hours.innerHTML = date.getHours();
    str_minutes.innerHTML = date.getMinutes();

    if (hours < 12) {
        str_ampm.innerHTML = "AM";

        if (hours < 10) {
            str_hours.innerHTML = "0" + date.getHours();
        }
    } else {
        str_ampm.innerHTML = "PM";
    }

    if (date.getMinutes() < 10) {
        str_minutes.innerHTML = "0" + date.getMinutes();
    }
    if (flagConsole) {
        str_console.style.visibility = 'visible';
        flagConsole = false;
    } else {
        str_console.style.visibility = 'hidden';
        flagConsole = true;
    }
}

function initDigitalWatch() {
    interval = setInterval(displayTime, 500);
}

function ambientDigitalWatch() {
    clearInterval(interval);
    document.getElementsByTagName('body')[0].style.backgroundImage = "none";
    displayTime();
    document.getElementById('str_console').style.visibility = 'visible';
}

function getBatteryState() {
    
}

function bindEvents() {
    // add eventListener for timetick
    window.addEventListener('timetick', function() {
        ambientDigitalWatch();
    });

    // add eventListener for ambientmodechanged
    window.addEventListener('ambientmodechanged', function(e) {
        console.log("ambientmodechanged : " + e.detail.ambientMode);
        if (e.detail.ambientMode === true) {
            // rendering ambient mode case
            ambientDigitalWatch();

        } else {
            // rendering normal case
            initDigitalWatch();
        }
    });
}


window.onload = function() {
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });

    displayTime();
    initDigitalWatch();
    bindEvents();
    // pulseBackground();
};

$(document).ready(function() {
    $("#page-body").on("tap", function(event) {
        event.preventDefault();
        //console.log("AAA");
        window.location = "sendpotato.html";
    });
});
