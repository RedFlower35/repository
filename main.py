# todo: 請建立一個 Flask 網站，並在首頁顯示 "Hello, Flask!"。

from flask import Flask
app = Flask(__name__)   
@app.route('/')
def hello():
    return "Hello, Flask!"
if __name__ == '__main__':  
    app.run(debug=True)
