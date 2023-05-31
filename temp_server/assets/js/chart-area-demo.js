const makeChart = (canvas, dataset, color) => {
    return new Chart(canvas, {
        type: "line",
        data: {
            labels: [
                "60m",
                "55m",
                "50m",
                "45m",
                "40m",
                "35m",
                "30m",
                "25m",
                "20m",
                "15m",
                "10m",
                "5m",
            ],
            datasets: [
                {
                    label: "Usage",
                    lineTension: 0.3,
                    backgroundColor: `${color}33`,
                    borderColor: `${color}FF`,
                    pointRadius: 5,
                    pointBackgroundColor: `${color}FF`,
                    pointBorderColor: "#ffffff",
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: `${color}FF`,
                    pointHitRadius: 50,
                    pointBorderWidth: 2,
                    data: dataset,
                },
            ],
        },
        options: {
            devicePixelRatio: 2,
            scales: {
                xAxes: [
                    {
                        time: {
                            unit: "date",
                        },
                        gridLines: {
                            display: false,
                        },
                        ticks: {
                            maxTicksLimit: 12,
                            fontColor: "#ffffff",
                            fontSize: 14,
                        },
                    },
                ],
                yAxes: [
                    {
                        ticks: {
                            min: -1,
                            max: 100,
                            maxTicksLimit: 5,
                            fontColor: "#ffffff",
                            fontSize: 18,
                            callback: function (value) {
                                if (value === -1) return "";
                                else {
                                    return value;
                                }
                            },
                        },
                        gridLines: {
                            color: "rgba(200, 200, 200, .125)",
                        },
                    },
                ],
            },
            legend: {
                display: false,
            },
        },
    });
};

// Ajax 요청 보내기
var xhrChart = new XMLHttpRequest();
xhrChart.open("GET", "/vs/real/usage", true);
xhrChart.onload = function () {
    if (xhrChart.status === 200) {
        var realUsage = JSON.parse(xhrChart.responseText);
        // 서버에서 가져온 데이터 사용하기
        const cpuDataSet = realUsage.values[0]["stat-list"].stat[1].data;
        const memoryDataSet = realUsage.values[0]["stat-list"].stat[0].data;

        // Set new default font family and font color to mimic Bootstrap's default styling
        Chart.defaults.global.defaultFontFamily =
            '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = "#292b2c";

        // Area Chart Example
        var ctx = document.getElementById("myCpuChart");
        var ctx2 = document.getElementById("myMemoryChart");

        makeChart(ctx, cpuDataSet, "#699ce3");
        makeChart(ctx2, memoryDataSet, "#909469");
    }
};
xhrChart.send();
