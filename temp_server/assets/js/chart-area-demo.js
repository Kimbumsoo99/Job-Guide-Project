// Ajax 요청 보내기
var xhr = new XMLHttpRequest();
xhr.open("GET", "/vs/real/usage", true);
xhr.onload = function () {
    if (xhr.status === 200) {
        var realUsage = JSON.parse(xhr.responseText);
        console.log(realUsage);
        // 서버에서 가져온 데이터 사용하기
        var cpuUsage = realUsage.values[0]["stat-list"].stat[1].data;
        var memoryUsage = realUsage.values[0]["stat-list"].stat[0].data;

        // Set new default font family and font color to mimic Bootstrap's default styling
        Chart.defaults.global.defaultFontFamily =
            '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = "#292b2c";

        const memoryDataSet = memoryUsage;

        const cpuDataSet = cpuUsage;
        // Area Chart Example
        var ctx = document.getElementById("myCpuChart");
        var ctx2 = document.getElementById("myMemoryChart");

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
                            pointBorderColor: "rgba(255,255,255,0.8)",
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
                                },
                            },
                        ],
                        yAxes: [
                            {
                                ticks: {
                                    min: 0,
                                    max: 100,
                                    maxTicksLimit: 5,
                                },
                                gridLines: {
                                    color: "rgba(0, 0, 0, .125)",
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

        const chart = makeChart(ctx, cpuDataSet, "#2756D6");
        const chart2 = makeChart(ctx2, memoryDataSet, "#909469");
    }
};
xhr.send();
