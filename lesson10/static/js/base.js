document.addEventListener('DOMContentLoaded', function () {
	const toggle = document.querySelector('.nav-toggle');
	const navList = document.querySelector('.nav-list');

	// 檢查是否成功獲取到選單按鈕和導覽列清單元素
	// 如果任一元素不存在則中斷執行，避免後續程式碼出錯
	if (!toggle || !navList) return;

	toggle.addEventListener('click', function () {
		/*  navList.classList.toggle('open');
		在行動版網頁中特別常見這種設計模式，可以透過按鈕來控制導航選單的顯示/隱藏狀態。通常會搭配以下幾個元素：
		一個漢堡選單按鈕
		導航列本體（這裡的 navList）
		對應的 CSS 樣式切換
		點擊事件監聽來觸發 toggle()
		這是一種簡潔且效能良好的實作方式，比直接操作 style.display 更容易維護。
		*/

		navList.classList.toggle('open');
	});

	// 在視窗尺寸改變到桌機時，自動關閉手機選單以避免遺留狀態
	window.addEventListener('resize', function () {
		if (window.innerWidth > 800) {
			if (navList.classList.contains('open')) {
				navList.classList.remove('open');
			}
			// if (toggle.classList.contains('open')) {
			// 	toggle.classList.remove('open');
			// 	toggle.setAttribute('aria-expanded', 'false');
			// }
		}
	});
});