def cale(a,b):
    ans = a+b
    return ans

def main():
    a = 10
    b = 15
    total = cale(a,b)
    print(total)

# print(__name__)
if __name__ == '__main__':
    main()
    print('In Main')
else:
    print('Not Main')