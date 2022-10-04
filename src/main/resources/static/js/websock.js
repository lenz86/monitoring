var stompClient = null;
var message = null;

function connect() {
    var socket = new SockJS('/wshost');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
}

function send() {
    var messageArea = document.getElementById('name');
    message = messageArea.value.trim();
    stompClient.send("/app/chat.send", {}, message);
}

function onConnected() {
    window.alert("Connected!")
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);
}

function onError(error) {
    window.alert("Could not connect to WebSocket server. Please refresh this page to try again!");
}


function onMessageReceived(payload) {
    var messageLog = document.getElementById('message-log');
    // var message = JSON.parse(payload.body);
    var message = null;
    if (isJsonString(payload)) {
        message = JSON.parse(payload.body);
        messageLog.value = (messageLog.value + 'firstname = ' + message.firstName + ' lastname = ' + message.lastName + '\n');
    } else {
        message = payload.body.toString();
        messageLog.value = (messageLog.value + message + '\n');
    }
}

function isJsonString(payload) {
    try {
        JSON.parse(payload.body);
    } catch (e) {
        return false;
    }
    return true;
}
