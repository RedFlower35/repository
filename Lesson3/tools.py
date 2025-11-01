import requests


# def download_youbike_data(url)->list:
def download_youbike_data(url):
    data = ''
    
    try:
        response = requests.get(url,timeout=7)
        print('下載成功')  
        data = response.json()
    except requests.exceptions.Timeout:
        raise Exception("連線超時！請檢查網絡或伺服器狀態。")
    except requests.exceptions.ConnectionError:
        raise Exception("無法連線！可能是網絡問題或目標伺服器不可用。")
    except requests.exceptions.HTTPError as e:
        raise Exception(f"HTTP 錯誤：{e}")
    except requests.exceptions.RequestException as e:
        raise Exception(f"請求錯誤：{e}")
    except ValueError:
        raise Exception("回傳資料不是合法的 JSON 格式")
    except Exception as e: 
        raise Exception('下載失敗')
    else:
        print('下載成功')
        
    return data

# def get_area(data)->list:
def get_area(data):
    print('in get_area',data)
    areas = set()
    for item in data:
        areas.add(item['sarea'])
    
    return list(areas)


def get_sites_of_area(data,area)->list:
    sites = []
    for item in data:
        if item['sarea'] == area:
            sites.append(item)
    return sites



