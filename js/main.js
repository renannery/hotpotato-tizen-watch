var flagConsole = false;
var secondsToBurn = 10;
var countdownInterval;
var countdownField;
var host = "54.94.241.117:9090";

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
    clearInterval(countdownInterval);
}

function openSendPotato() {
    window.location = "sendpotato.html"
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
    jid = $('input[name="user"]: checked ').val();
    var password = "Senha2015"
    var logContainer = $("#log");
    var contactList = $("#contacts");
    var messageTo = "";
    $.xmpp.connect({
        url: url,
        jid: jid,
        password: password,
        onConnect: function() {
            alert(jid + "\nConnected");
            $.xmpp.setPresence(null);
        },
        onPresence: function(presence) {

            var contact = $("<li>");
            messageTo = presence.from;
            contact.append("<a href='javascript:void(0)'>" + presence.from + "</a>");
            contact.find("a").click(function() {
                var id = MD5.hexdigest(presence.from);
                var conversation = $("#" + id);
                if (conversation.length == 0)
                    openChat({
                        to: presence.from
                    });
            });
            contactList.append(contact);
        },
        onDisconnect: function() {
            alert(jid + "\nDesconnected");
        },

        onMessage: function(message) {
            alert("test");
            currentPotatoId = message.body;
            var user = message.from.split("@", 1);
            alert(user + "\n" + message.body);
        },
        onError: function(error) {
            alert(error.error);
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

function createUser() {
    $.ajaxSetup({
        headers: {
            "Authorization": "koNH9NW6U11Ws23g",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
        }
    });

    var user = '{"username": "teste10","password": "p4ssword"}';

    $.ajax({
        url: 'http://' + host + '/plugins/restapi/v1/users',
        type: "POST",
        crossDomain: true,
        data: JSON.stringify(user),
        success: function(data) {
            console.log("JSON Data: " + data + " status " + status);
        }
    });
}

function getUser() {
    $.ajaxSetup({
        headers: {
            "Authorization": "koNH9NW6U11Ws23g",
            "Accept": "application/json"
        }
    });

    $.get('http://' + host + '/plugins/restapi/v1/users', function(data, status) {
        console.log("JSON Data: " + data.user.length);
    });
}

function getUserTeste() {
    $.get('http://54.94.241.117:2403/index.html', function(data, status) {
        console.log("JSON Data: " + data.user.length);
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

    // displayTime();
    // initDigitalWatch();
    // bindEvents();
    // getUserTeste();
    // getUser();
    createUser();
    // displayCountdown();

    // pulseBackground();
};

$(document).ready(function() {
    $("#page-body").on("tap", function(event) {
        event.preventDefault();
        //console.log("AAA");
        openSendPotato();
    });
});
