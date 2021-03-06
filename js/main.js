var flagConsole = false;
var secondsToBurn = 10;
var countdownInterval;
var countdownField;
var host = "jabber.rootbash.com";
var jid;
var potatoReceived = false;
var randomId;
var burned = false;
var Parse;
var savedParse = false;

function displayCountdown() {
    countdownField = document.getElementById('countdown');
    startCountdown();
}

function startCountdown() {
    countdownInterval = setInterval(function() {
        countdown();
    }, 1000);
}

function countdown() {
    if (secondsToBurn > 0) {
        secondsToBurn -= 1;
        countdownField.innerHTML = secondsToBurn;
        return;
    };
    burned = true;
    stopCountdown();
    burnedPotatoImage(true);
}

function stopCountdown() {
    clearInterval(countdownInterval);
    secondsToBurn = 10;
    countdownField.innerHTML = "";
}

function displayTime() {
    var str_hours = document.getElementById('str_hours'),
        str_console = document.getElementById('str_console'),
        str_minutes = document.getElementById('str_minutes'),
        str_ampm = document.getElementById('str_ampm'),
        date;

    try {
        date = tizen.time.getCurrentDateTime();
        // date = new Date("July 21, 1983 01:15:00");
    } catch (e) {
        alert(e.message);
    }

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

function xmppConnect() {
    randomId = Math.floor(Math.random() * 2) + 1;
//    jid = randomId == 1 ? "renannery10" : "ursinho";
    jid = "ursinho";
    var password = "Senha2015"
    var messageTo = "";
    var url = "http://" + host + ":7070/http-bind/";
    $.xmpp.connect({
        url: url,
        jid: jid,
        password: password,
        onConnect: function() {
            alert("You are\nPotato P" + randomId);
            $.xmpp.setPresence(null);
        },
        onPresence: function(presence) {},
        onDisconnect: function() {},
        onMessage: function(message) {
            animateReceivedPotato();
            displayCountdown();
        },
        onError: function(error) {
            xmppConnect();
        }
    });
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

function sendMessage() {
    var messageTo;
    var messageTo = (jid == "renannery10") ? "ursinho" : "renannery10";

    $.xmpp.sendMessage({
        body: "YO",
        to: messageTo + "@" + host
    });
    animateSendPotato();
    stopCountdown();
    savedParse = false;
    savePotatoLocation();
    burnedPotatoImage(false);
}

function savePotatoLocation() {
    var options = {
        enableHighAccuracy: true,
        maximumAge: 600000,
        timeout: 5000
    };

    var watchID;

    function successCallback(position) {

        if (!savedParse) {
            var Path = Parse.Object.extend("Path");
            var potatoPath = new Path();
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var userLocation = new Parse.GeoPoint(latitude, longitude);
            potatoPath.save({
                location: userLocation,
                userId: "P" + randomId,
                burned: burned
            }).then(function(object) {
                burned = false;
                savedParse = true;
                navigator.geolocation.clearWatch(watchID);
            });
        };
    }

    function errorCallback(error) {}

    var watchID = navigator.geolocation.watchPosition(successCallback, errorCallback, options);

}

function animateSendPotato() {
    potatoReceived = false
    $("#potato").animate({
        right: -1000,
        top: -1000
    }, 500);
}

function animateReceivedPotato() {
    $("#potato").animate({
        right: -150,
        top: 150
    }, 500);
    potatoReceived = true;
}

function burnedPotatoImage(burnedPotato) {
    document.getElementById("potato").src = burnedPotato ? "images/burnedpotato.png" : "images/potato.png";
}

window.onload = function() {
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
    Parse.initialize("1YUyKkLv9N8FxHAp8ivS6WluD8JCbxYTm4JK8bgW", "7SDxfjnVqLUOPoAUlURxCvKIYfgSJTv2mosIqoKL");

    displayTime();
    initDigitalWatch();
    bindEvents();
    xmppConnect();
};

$("#page-body").on("tap", function(event) {
    event.preventDefault();
    if (potatoReceived) {
        sendMessage();
    }
});

$(document).ready(function() {
    animateSendPotato();
    Parse = require('parse');
});
