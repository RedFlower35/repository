from flask import Flask,render_template, jsonify, response
from sklearn.datasets import fetch_california_housing
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import numpy as np

app = Flask(__name__)


# 自定義JSON序列化設定
app.json.ensure_ascii = False


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/knn")
def knn():
    return render_template("knn.html")

@app.route("/regression")
def regression():
    return render_template("regression.html")

@app.route("/test")
def test():
    return render_template("test.html")

@app.route("/test1")
def test1():
    return render_template("test1.html")

@app.route("/test2")
def test2():
    return render_template("test2.html")

@app.route("/api/regression/data")
def regression_data():
    """線性迴歸 API - 使用加州房價資料集（簡化版）"""
    try:  

        # 載入加州房價資料集
        housing = fetch_california_housing()

        # 只使用前200筆資料作為展示
        sample_size = 200
        X_full = housing.data[:sample_size]
        y_full = housing.target[:sample_size] #房價(單位:十萬美元)

        # 使用**平均房間數**作為預測特徵(索引2)
        feature_idx = 2
        X = X_full[:,feature_idx].reshape(-1,1)
        y = y_full * 10

        # 分割訓練和測試資料(80/20)
        X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.2,random_state=42)

        # 訓練線性迴歸模型
        model = LinearRegression()
        model.fit(X_train, y_train)

        # 預測
        # 訓練資料的預測
        y_train_pred = model.predict(X_train)

        #測試資料的預測
        y_test_pred = model.predict(X_test)

        # 計算評估指標
        r2 = r2_score(y_test, y_test_pred)
        mse = mean_squared_error(y_test, y_test_pred)
        rmse = np.sqrt(mse)

        # 生成迴歸線資料(用於繪圖)
        X_line = np.linspace(X.min(),X.max(), 100).reshape(-1,1)
        y_line = model.predict(X_line)

        # 準備回應資料
        response = {
            "success": True,
            "data":{
                "train":{
                    "x": X_train.flatten().tolist(),
                    "y": y_train.tolist(),
                    "y_pred": y_train_pred.tolist()
                },
                "test":{
                    "x": X_test.flatten().tolist(),
                    "y": y_test.tolist(),
                    "y_pred": y_test_pred.tolist()
                },
                "regression_line":{
                    "x": X_line.flatten().tolist(),
                    "y": y_line.tolist()
                }        
            },
            "metrics":{
                "r2_score": round(r2, 4),
                "mse": round(mse, 2),
                "rmse": round(rmse, 2),
                "coefficient": round(model.coef_[0], 2),
                "intercept": round(model.intercept_, 2)
            },
            "description":{
                "dataset":"加州房價資料集",
                "samples": len(y),
                "train_size": len(y_train),
                "test_size": len(y_test),
                "feature_name": "平均房間數",
                "feature_unit": "間",
                "target_name": "房價",
                "target_unit": "萬美元",
                "info": "此資料集取自 1990 年加州人口普查資料"
            }
        }

        return jsonify(response)
    except Exception as e:
        return jsonify(
            {
                "success": False,
                "error": str(e)
            }, 500
        )

    

def main():
    """啟動應用（教學用：啟用 debug 模式）"""
    # 在開發環境下使用 debug=True，部署時請關閉
    app.run(debug=True)

if __name__ == "__main__":
    main()