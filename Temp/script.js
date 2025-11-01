// const toggleButton = document.getElementsByClassName("toggle-button")[0]
// const answerContent = document.getElementsByClassName("answer-content")[0]

// if (answerContent.style.display === "block") {
//     toggleButton.addEventListener("click", function () {
//         answerContent.style.display = "none"
//         toggleButton.innerText = "顯示答案"

//     });
// }
// if (answerContent.style.display === "none" || answerContent.style.display === "") {
//     toggleButton.addEventListener("click", function () {
//         answerContent.style.display = "block"
//         toggleButton.innerText = "隱藏答案"
//     });
// }

//---------------------
const toggleButton = document.getElementsByClassName("toggle-button")[0];
const answerContent = document.getElementsByClassName("answer-content")[0];
window.console

toggleButton.addEventListener("click", function () {
    if (answerContent.style.display === "block") {
        answerContent.style.display = "none";
        toggleButton.innerText = "顯示答案";
    } else {
        answerContent.style.display = "block";
        toggleButton.innerText = "隱藏答案";
    }
});

// -----------------------------------------
// const qaContainers = document.querySelectorAll(".qa-container");

// qaContainers.forEach(container => {
//     const button = container.querySelector(".toggle-button");
//     const answer = container.querySelector(".answer-content");

//     button.addEventListener("click", function () {
//         answer.classList.toggle("visible");
//         button.innerText = answer.classList.contains("visible")
//             ? "隱藏答案"
//             : "顯示答案";
//     });
// });

// -----------------------------------------

// document.querySelector(".toggle-button").addEventListener("click", function () {
//     document.querySelector(".answer-content").classList.toggle("visible");
// });

// document.querySelector(".toggle-button").addEventListener("click", function () {
//     document.getElementById("answer-content").style.display = "block"
// });

