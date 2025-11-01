from flask import Flask,render_template
# import numpy as np
from knn.app import knn_bp
from regression.app import regression_bp


app = Flask(__name__)
app.register_blueprint(knn_bp)
app.register_blueprint(regression_bp)


# 自定義JSON序列化設定
app.json.ensure_ascii = False


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/regression_index")
def regression():
    return render_template("regression.html")

@app.route("/test1")
def test1():
    return render_template("test1.html")

def main():
    """啟動應用（教學用：啟用 debug 模式）"""
    # 在開發環境下使用 debug=True，部署時請關閉
    app.run(debug=True)

if __name__ == "__main__":
    main()