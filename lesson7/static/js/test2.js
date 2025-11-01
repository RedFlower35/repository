//  document.addEventListener("DOMContentLoaded", function () {
//         const titleElement = document.querySelector("#title");
//         const buttonElement = document.querySelector("#myButton");

//         // 設置標題顏色
//         titleElement.style.color = "blue";

//         buttonElement.addEventListener("click", function () {
//             titleElement.textContent = "標題已被改變！";
//         });
//     });

document.getElementById("toggle-button").addEventListener("click", function () {
    document.getElementById("answer-content").style.display = 'none';
});