window.onload = function() {
    // TODO:: Do your initialization job

    var jid;
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName == "back")
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
    });

    $(document).ready(function() {
        $("#connectBut").click(function() {

            jid = $('input[name="user"]:checked').val();
            var password = "Senha2015"
            var logContainer = $("#log");
            var contactList = $("#contacts");
            var messageTo = "";

            //An example of bosh server. This site is working but it can change or go down.
            //If you are going to have a production site, you must install your own BOSH server
            var url = "http://jabber.rootbash.com:7070/http-bind/";
            $.xmpp.connect({
                url: url,
                jid: jid,
                password: password,
                onConnect: function() {
                    alert("Connected");
                    logContainer.html("Connected");
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
                    alert("Disconnected");
                    logContainer.html("Disconnected");
                },

                onMessage: function(message) {
                    var user = message.from.split("@", 1);
                    alert(user + "\n" + message.body);
                },
                onError: function(error) {
                    alert(error.error);
                }
            });
        });

        $("#disconnectBut").click(function() {
            $.xmpp.disconnect();
        });

        $("#sendMessage").click(function() {
            var messageTo;
            if (jid == "renannery10") {
                messageTo = "ursinho@jabber.rootbash.com";
            } else {
                messageTo = "renannery10@jabber.rootbash.com";
            }

            $.xmpp.sendMessage({
                body: "Yo",
                to: messageTo
            });

            getUserLocation();
        });

    });

    function getUserLocation() {
        var options = {
            enableHighAccuracy: true,
            maximumAge: 600000,
            timeout: 5
        };

        function successCallback(position) {
            console.log(position);
        }

        function errorCallback(error) {
            console.log(error);
        }

        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    }

    function openChat(options) {
        var id = MD5.hexdigest(options.to);

        var chat = $("<div style='border: 1px solid #000000; float:left' id='" + id + "'><div style='border: 1px solid #000000;'>Chat with " + options.to + "</div><div style='height:150px;overflow: auto;' class='conversation'></div><div><input type='text' /><button>Send</button></div></div>");
        var input = chat.find("input");
        var sendBut = chat.find("button");
        var conversation = chat.find(".conversation");
        sendBut.click(function() {
            $.xmpp.sendMessage({
                to: options.to,
                body: input.val()
            });
            conversation.append("<div>" + $.xmpp.jid + ": " + input.val() + "</div>");
            input.val("");
        });
        $("body").append(chat);
    }



};
