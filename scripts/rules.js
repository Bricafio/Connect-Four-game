document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 300);
});

document.getElementById("rulesBtn").addEventListener("click", () => {
    document.body.style.opacity = "0";
    setTimeout(() => {
        window.location.href='../index.html'
    }, 300);
});