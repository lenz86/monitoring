$(document).ready(function () {
    getValues();
    setInterval(getValues, 1000);
});

function getValues() {
    var table = document.getElementById('tableDevicesList');
    var rows = table.rows;
    var rowCount = rows.length;
    var cells;
    var sensorId;
    for (var r = 1; r < rowCount; r++) {
        var rowIndex = r;
        cells = rows[r].cells;
        console.log(rowCount)
        console.log(cells.length)
        sensorId = cells[0].innerText;
        doAjax(sensorId, rowIndex);
    }
}

function doAjax(sensorId, rowIndex) {
    $.ajax({
        url: window.location + "/wish",
        type: "GET",
        data: "name=" + sensorId,
        success: function (data) {
            document.getElementById('tableDevicesList').rows[rowIndex].cells[5].innerHTML = data.axisX;
            document.getElementById('tableDevicesList').rows[rowIndex].cells[6].innerHTML = data.axisY;
        }
    });
}

// <script src="/js/jquery-3.6.0.js" th:href="@{/js/jquery-3.6.0.js}"></script>
