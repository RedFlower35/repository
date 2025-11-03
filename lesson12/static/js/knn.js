let currentK = 5;
let modelData = null;
let targetNames = null;
let featureNames = null;
let chart = null;

// 類別顏色配置
const classColors = [
    { bg: 'rgba(255,99,132,0.6)', border: 'rgba(255,99,132,1)' },
    { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)' },
    { bg: 'rgba(75, 192, 192, 0.6)', border: 'rgba(75, 192, 192, 1)' }
]


// 頁面載入完成後執行
document.addEventListener('DOMContentLoaded', function () {
    // 固定使用花瓣長度(2)和花瓣寬度(3)
    loadKnnData()
})

async function loadKnnData() {
    showLoading(true);
    try {
        const url = `/knn/api/data?k=${currentK}&feature_x=2&feature_y=3`
        const response = await fetch(url)
        const data = await response.json()
        // console.table(data)
        if (data.success) {
            modelData = data;
            // console.table(modelData);
            targetNames = data.target_names;
            featureNames = data.feature_names;
            // 繪制圖表
            renderChart(data);
            // updateMetrics(data.metrics)
            // updateModelInfo(data.description)
            // 
        } else {
            showError(data.error)
        }
    } catch (error) {
        showError(error.message)
    } finally {
        showLoading(false)
    }
}

// 繪制圖表
function renderChart(data) {
    console.table(modelData);
    console.log(chart);
    // 取得canvas的 context
    const ctx = document.getElementById('knnChart').getContext('2d');

    //如果圖表已經存在，先銷毀
    if (chart) {
        chart.destroy();
    }

    // 準備資料集_按類別分組
    const datasets = [];
    const numClasses = data.target_names.length;

    // 訓練資料(按類別)
    for (let classIdx = 0; classIdx < numClasses; classIdx++) {
        const trainDataForClass = data.data.train.x.map((x, i) => ({
            x: x,
            y: data.data.train.y[i],
            label: data.data.train.labels[i]
        })).filter(point => point.label == classIdx)

        if (trainDataForClass.length > 0) {
            datasets.push({
                label: `${data.target_names[classIdx]}(訓練)`,
                data: trainDataForClass,
                backgroundColor: classColors[classIdx].bg,
                borderColor: classColors[classIdx].border,
                pointRadius: 6,
                pointHoverRadius: 9,
                pointStyle: 'circle',
                borderWidth: 2
            })
        }
    }

    console.table(data.data.test)
    // 測試資料(按類別和預測結果)
    for (let classIdx = 0; classIdx < numClasses; classIdx++) {
        const testDataForClass = data.data.test.x.map((x, i) => ({
            x: x,
            y: data.data.test.y[i],
            label: data.data.test.labels[i],
            prediction: data.data.test.predictions[i]
        })).filter(point => point.label == classIdx)

        if (testDataForClass.length > 0) {
            //正確預測
            const correctPredictions = testDataForClass.filter(
                point => point.label === point.prediction
            )

            if (correctPredictions.length > 0) {
                datasets.push({
                    label: `${data.target_names[classIdx]}(測試-正確)`,
                    data: correctPredictions,
                    backgroundColor: classColors[classIdx].bg,
                    borderColor: classColors[classIdx].border,
                    pointRadius: 8,
                    pointHoverRadius: 11,
                    pointStyle: 'triangle',
                    borderWidth: 3
                })
            }

            //錯誤預測
            const wrongPredictions = testDataForClass.filter(
                point => point.label !== point.prediction
            )

            if (wrongPredictions.length > 0) {
                datasets.push({
                    label: `${data.target_names[classIdx]}(測試-錯誤)`,
                    data: wrongPredictions,
                    backgroundColor: 'rgba(255, 0, 0, 0.6)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    pointRadius: 10,
                    pointHoverRadius: 13,
                    pointStyle: 'crossRot',
                    borderWidth: 3
                })
            }
        }
    }

    // console.table(datasets);
    // 建立圖表
    chart = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `KNN 分類視覺化(k=${data.k_neighbors})`,
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 12,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: `${data.feature_names[2]}(cm)`,
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)' // 0.05 很淡
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: `${data.feature_names[3]}(cm)`,
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)' // 0.05 淡
                    }
                }
            },
            animation: {
                duration: 800,
                easing: 'easeInOutQuart'
            }
        }
    })

}

// 顯示/隱藏載入狀態
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.add('active')
    } else {
        loading.classList.remove('active')
    }
}
//顯示錯誤訊息
function showError(message) {
    alert('錯誤: ' + message);
    console.error(message);
}