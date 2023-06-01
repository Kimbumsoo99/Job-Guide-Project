const makeCircleChart = (canvas, data, color) => {
    return new Chart(canvas, {
        type: "doughnut",
        data: {
            datasets: [
                {
                    label: "Usage",
                    percent: data,
                    backgroundColor: [color, "#333333"],
                    borderColor: [color, "#999999"], // border 색상 지정
                    borderWidth: 1, // border 두께 설정
                },
            ],
        },
        plugins: [
            {
                beforeInit: (chart) => {
                    const dataset = chart.data.datasets[0];
                    chart.data.labels = [dataset.label];
                    dataset.data = [dataset.percent, 100 - dataset.percent];
                },
            },
            {
                beforeDraw: (chart) => {
                    var width = chart.chart.width,
                        height = chart.chart.height,
                        ctx = chart.chart.ctx;
                    ctx.restore();
                    var fontSize = (height / 150).toFixed(2);
                    ctx.font = fontSize + "em sans-serif";
                    ctx.fillStyle = "#ffffff";
                    ctx.textBaseline = "middle";
                    var text = chart.data.datasets[0].percent + "%",
                        textX = Math.round(
                            (width - ctx.measureText(text).width) / 2
                        ),
                        textY = height / 2;
                    ctx.fillText(text, textX, textY);
                    ctx.save();
                },
            },
        ],
        options: {
            devicePixelRatio: 2,
            maintainAspectRatio: false,
            cutoutPercentage: 85,
            rotation: Math.PI / 2,
            legend: {
                display: false,
            },
            tooltips: {
                filter: (tooltipItem) => tooltipItem.index == 0,
            },
        },
    });
};

// Ajax 요청 보내기
var xhrCircle = new XMLHttpRequest();
xhrCircle.open("GET", "/vs/real/usage", true);
xhrCircle.onload = function () {
    if (xhrCircle.status === 200) {
        var realUsage = JSON.parse(xhrCircle.responseText);
        // 서버에서 가져온 데이터 사용하기
        console.log(realUsage);
        const cpuAvg = realUsage.cpuAvg;
        const memoryAvg = realUsage.memoryAvg;

        // Set new default font family and font color to mimic Bootstrap's default styling
        Chart.defaults.global.defaultFontFamily =
            '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = "#292b2c";

        // Area Chart Example
        var cpuCircle = document.getElementById("cpuCircle");
        var memoryCircle = document.getElementById("memoryCircle");

        makeCircleChart(cpuCircle, cpuAvg, "#699ce3");
        makeCircleChart(memoryCircle, memoryAvg, "#909469");
    }
};
xhrCircle.send();
