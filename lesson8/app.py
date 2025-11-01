from flask import Flask,render_template, jsonify
from sklearn.datasets import fetch_california_housing
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
import numpy as np
import matplotlib.pyplot as plt

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/regression")
def regression():
    return render_template("regression.html")

@app.route("/knn")
def knn():
    return render_template("knn.html")

@app.route("/lesson6_1")
def lesson6_1():
    page_tile = "我的首頁Robert"
    users = [
        {"name": "小明", "is_vip": True},
        {"name": "小華", "is_vip": False},
        {"name": "小英", "is_vip": True}
    ]
    return  render_template("lesson6_1.html",title=page_tile, user_list = users)

@app.route("/test")
def test():
    return render_template("test.html")

@app.route("/test2")
def test2():
    return render_template("test2.html")

@app.route("/api/regression/data")
def regression_data():
    '''
    線性迴歸分析的 API *** 使用 加州房價資料 ***
    '''
    # 載入加州房價資料集
    housing = fetch_california_housing()

    sample_size = 200 # 只取前200筆資料來做示範
    x_full = housing.data[:sample_size]
    y_full = housing.target[:sample_size] # 房價 (單位: 十萬美元)
    print(x_full.shape, y_full.shape)

    # 使用**平均房間數**作為預測特徵(索引2)
    feature_idx = 2
    x = x_full[:,feature_idx].reshape(-1, 1) # 轉成二維陣列。若是全部特徵，則使用 x = x_full
    # x = x_full[:,:] # 使用全部特徵
    y = y_full * 10 # 轉換成十萬美元單位

    # 切分訓練資料與測試資料
    x_train,x_test,y_train, y_test = train_test_split(x,y,test_size=0.2, random_state=42)

    # 訓練線性迴歸的模型
    model = LinearRegression() # 建立模型
    model.fit(x_train, y_train) # 訓練模型

    # 預測
    y_train_pred = model.predict(x_test)
    #測試資料的預法  
    y_test_pred = model.predict(x_test)

    # 計算評估指標: 平均絕對誤差 (MAE)
    r2 = r2_score(y_test, y_test_pred)
    mse = mean_absolute_error(y_test, y_test_pred)
    rmse=np.sqrt(mse)

    # 生成迴歸線資料(用於繪圖)
    x_line = np.linspace(x.min(),x.max(), 100).reshape(-1,1)
    y_line = model.predict(x_line)
    
    try:
        # 準備回傳的資料
        response = {
            "success": True,
            "data":{
                "train":{
                    "x": x_train.flatten().tolist(),
                    "y": y_train.tolist(),
                    "y_pred": y_train_pred.tolist()
                },
                "test":{
                    "x": x_test.flatten().tolist(),
                    "y": y_test.tolist(),
                    "y_pred": y_test_pred.tolist()
                },
                "regression_line":{
                    "x": x_line.flatten().tolist(),
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
        return jsonify({"success": False, "error": str(e)}), 500


def main():
    """啟動應用（教學用：啟用 debug 模式）"""
    # 在開發環境下使用 debug=True，部署時請關閉
    app.run(debug=True)

if __name__ == "__main__":
    main()