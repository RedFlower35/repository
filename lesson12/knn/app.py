from flask import Blueprint,render_template,jsonify,request
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score,confusion_matrix,classification_report # 分類評估準確度

knn_bp = Blueprint(
    'knn',
    __name__,
    url_prefix='/knn',
    template_folder='../templates',
    static_folder='../static'
)

@knn_bp.route('/knn_index')
def knn_index():
    return render_template('knn.html')

@knn_bp.route('/api/data')
def knn_data():
    try:
        """knn 分類 API - 使用鳶尾花資料集"""
        # 載入鳶尾花的資料
        iris = load_iris()
        # print(iris)
        X = iris.data
        y = iris.target

        # 特徵名稱翻譯為中文
        feature_name = iris.feature_names  # sepal n.【植】萼片    # petal 花瓣
        target_name = iris.target_names   # setosa   versicolor  virginica
        feature_names_zh = ["花萼長度", "花萼寬度", "花瓣長度", "花瓣寬度"]
        target_names_zh = ["山鳶尾", "變色鳶尾", "維吉尼亞鳶尾"]
        print(X)
        print(y)
        print(feature_name)
        print(target_name)
        print(feature_names_zh)
        print(target_names_zh)
    
    # 取得特徵索引(預設使用花瓣長度和花瓣寬度)
        feature_x = int(request.args.get('feature_x',2)) # 長度
        feature_y = int(request.args.get('feature_y',3)) # 寬度
        k_neighbors = int(request.args.get('k',5))
        
        print(feature_x)
        #驗證參數 (確保資料不會超出欄位)
        if feature_x < 0 or feature_x >= X.shape[1]:
            feature_x = 2
            
        if feature_y < 0 or feature_y >= X.shape[1]:
            feature_y = 3
            
        if k_neighbors < 1 or k_neighbors > 20:
            k_neighbors = 5

        X_2d = X[:, [feature_x, feature_y]]

        # 分割訓練和測試資料
        X_train, X_test, y_train, y_test = train_test_split(X_2d, y, test_size=0.3, random_state=12)
        # X: 資料  y:目標  train:訓練資料   test: 測試資料  random_state: 資料打亂  X_2d: 有2欄資料

        # 訓練 KNN 分類器
        knn = KNeighborsClassifier(n_neighbors=k_neighbors)
        knn.fit(X_train, y_train)

        # 預測測試資料
        y_pred = knn.predict(X_test)  # 評估準確度  

        # 計算評估指標
        accuracy= accuracy_score(y_test,y_pred)
        conf_matric = confusion_matrix(y_test, y_pred)
        # print(f'accuracy:{accuracy}')
        # print(f'conf_matric:{conf_matric}')
        
    # 準備回應資料
        response = {
            "success":True,
            "feature_names": feature_names_zh,
            "target_names": target_names_zh,
            "current_features":{
                "x": feature_names_zh[feature_x],
                "y": feature_names_zh[feature_y],
                "x_idx": feature_x,
                "y_idx": feature_y
            },
            "k_neighbors": k_neighbors,
            "data":{
                "train":{
                    "x": X_train[:, 0].tolist(),
                    "y": X_train[:, 1].tolist(),
                    "labels": y_train.tolist()
                },
                "test":{
                    "x": X_test[:, 0].tolist(),
                    "y": X_test[:, 1].tolist(),
                    "labels": y_test.tolist(),
                    "predictions": y_pred.tolist()
                }
            },
            "metrics":{
                "accuracy": round(accuracy,4),
                "confusion_matric": conf_matric.tolist()
            },
            "description":{
                "dataset": "鳶尾花資料集",
                "samples": len(y),
                "train_size": len(y_train),
                "test_size": len(y_test),
                "classes": len(target_names_zh)
            }
        }
        
        return jsonify(response) # 轉為 json 格式
    except Exception as error:
        return jsonify({
            "success":False,
            "error":str(error)
        }),500