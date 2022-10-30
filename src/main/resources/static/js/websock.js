var stompClient = null;
var message = null;


function connect() {
    var socket = new SockJS('/wshost');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
}


function onConnected() {
    // window.alert("Connected!")
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);
}

function onError(error) {
    window.alert("Could not connect to WebSocket server. Please refresh this page to try again!");
}


function onMessageReceived(payload) {
    var message = null;
    if (isJsonString(payload)) {
        message = JSON.parse(payload.body);
        setValuesIntoTable(message);
    } else {
        message = payload.body.toString();
        console.log(message + '\n');
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

function localRateTimeConverter(regTime) {
    var result = null;
    var day = regTime.dayOfMonth;
    var month = regTime.month;
    var year = regTime.year;
    var hour = regTime.hour;
    var minute = regTime.minute;
    var second = regTime.second;
    result = day + '.' + month + '.' + year + ' ' + hour + ':' + minute + ':' + second;
    return result;
}

function setValuesIntoTable(message) {
    var table = document.getElementById('tableDevicesList');
    var rows = table.rows;
    var rowCount = rows.length;
    var cells;
    var sensorFactoryId;

    for (var r = 1; r < rowCount; r++) {
        var rowIndex = r;
        cells = rows[r].cells;
        sensorFactoryId = cells[0].innerText;
        for (var j = 0; j < message.data.length; j++) {
            if (sensorFactoryId === message.data[j].factoryID) {
                document.getElementById('tableDevicesList').rows[rowIndex].cells[5].innerHTML = message.data[j].axisX;
                document.getElementById('tableDevicesList').rows[rowIndex].cells[6].innerHTML = message.data[j].axisY;
                document.getElementById('tableDevicesList').rows[rowIndex].cells[7].innerHTML = localRateTimeConverter(message.regTime).toString();
            }
        }
    }
}

window.onload = connect;