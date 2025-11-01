// debugger;
let chart = null;  //圖表實體
let modelData = null; //儲存模型資料
console.log(chart); //儲存模型資料

// 頁面載入完成後才執行
document.addEventListener('DOMContentLoaded', function () {
    console.log("頁面載入了");
    loadRegressionData();
});

async function loadRegressionData() {
    console.log("loadRegressionData 被執行");
    showLoading(true);
    try {
        const response = await fetch('api/regression/data');
        if (!response.ok) {
            throw new Error('網路回應有錯誤 !!' + response.statusText);
        }
        const data = await response.json();
        if (!data.success) {
            throw new Error("解析 json失敗");
        }
        console.log("完整取得資料"); // 老師後來拿掉了
        modelData = data;
        console.log(modelData); // 老師後來拿掉了
        // 繪制圖表
        renderChart(modelData);
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false); // 不要再執行了
    }

};

// 繪制圖表
function renderChart(data) {
    const ctx = document.getElementById('regressionChart').getContext('2d')

    // 如果圖表已經存在,先銷毀
    if (chart) {
        chart.destroy();
    }
    //準備訓練資料集
    const trainData = data.data.train.x.map((xvalue, index) =>
    ({
        x: xvalue,
        y: data.data.train.y[index]
    })
    )

    //準備測試資料集
    const testData = data.data.test.x.map((xvalue, index) =>
    ({
        x: xvalue,
        y: data.data.test.y[index]
    })
    )

    //準備迴歸線資料集
    const regressionLine = data.data.regression_line.x.map((xvalue, index) =>
    (
        {
            x: xvalue,
            y: data.data.regression_line.y[index]
        }
    )
    )

    //建立圖表
    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: '訓練資料',
                    data: trainData,
                    backgroundColor: 'rgba(102, 126, 234, 0.6)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: '測試資料',
                    data: testData,
                    backgroundColor: 'rgba(237, 100, 166, 0.6)',
                    borderColor: 'rgba(237, 100, 166, 1)',
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: '迴歸線',
                    data: regressionLine,
                    type: 'line',
                    borderColor: '#f59e0b',
                    borderWidth: 3,
                    fill: false,
                    pointRadius: 0,
                    tension: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: function () {
                console.table("evt:", evt);
                console.table("activeElements", activeElements);
                if (activeElements.length > 0) {
                    const element = activeElements[0];
                    const datasetIndex = element.datasetIndex;
                    const index = element.index;
                    const dataset = chart.data.datasets[datasetIndex];
                    // console.table(dataset);

                    if (datasetIndex === 0 || datasetIndex === 1) {  // 訓練或測試資料
                        const point = dataset.data[index]
                        const rooms = point.x;
                        // console.log(x);
                        //更新輸入框
                        document.getElementById('rooms-input').value = rooms.toFixed(1);
                        predictPrice(rooms);
                    }
                }
            },
            plugins: {
                title: {  // 圖的標題
                    display: true,
                    text: '平均房間數 vs 房價 ',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                },
                tooltip: { // 滑鼠移到圖的點時，會彈出提示字
                    callbacks: {
                        label: function (context) {
                            console.table(context)
                            const datasetLabel = context.dataset.label || ''; // 如果 context.dataset.label，沒有值，就回傳空字串
                            const xValue = context.parsed.x.toFixed(2);
                            const yValue = context.parsed.y.toFixed(2);
                            return `${datasetLabel}: (平均房間數:${xValue}, 房價:${yValue} )`;
                        },
                        afterLabel: function (context) { // 會顯示在 callback下的label後面
                            if (context.datasetIndex === 0 || context.datasetIndex === 1) {
                                return '點擊可預測此資料點';
                            }
                            return "";
                        }
                    }
                }
            },
            animation: { // 動畫效果
                duration: 1000,  // 1秒鐘
                easing: 'easeInOutQuart'
            },

            scales: {
                x: {
                    title: {
                        display: true,
                        text: `${data.description.feature_name} (${data.description.feature_unit})`,
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: `${data.description.target_name} (${data.description.target_unit})`,
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    })
}

async function predictPrice(rooms) {
    console.log('rooms:', rooms);
    if (isNaN(rooms) || rooms < 1 || rooms > 15) {
        alert('請輸入有效房間數(1~15間)');
        return;
    }
    const response = await fetch(`/api/regression/predict?rooms=${rooms}`)
    console.table(response)
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.add('active');
    } else {
        loading.classList.add('active');
    }
};

function showError(message) {
    alert("錯誤: " + message);
    console.log("錯誤: " + message);
}




