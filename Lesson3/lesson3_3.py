import tools
import sys

if __name__ == '__main__':
    try:
        url = 'https://data.ntpc.gov.tw/api/datasets/010E5B15-3823-4B20-B401-B1CF000550C5/json?page=0&size=1000'
        data = tools.download_youbike_data(url)
        print(data)

        areas = tools.get_area(data)
        print(areas)

        # selected = input('請輸入你要查詢的區域: ')
        selected = '林口區'
        sites_of_area = tools.get_sites_of_area(data, selected)
        print(sites_of_area)
    except Exception as e:
        print('發生錯誤: \n',e)
        sys.exit(1)
    