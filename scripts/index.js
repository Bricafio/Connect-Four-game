document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 300);
});

document.getElementById("btnCPU").addEventListener("click", ()=> {
    document.body.style.opacity = "0";
    const botActive = encodeURIComponent(true);
    setTimeout(() => {
        window.location.href = `pages/game.html?botActive=${botActive}`;
    }, 300);
})

document.getElementById("btnPlayer").addEventListener("click", ()=> { 
    document.body.style.opacity = "0";
    const botActive = encodeURIComponent(false);
    setTimeout(() => {
        window.location.href = `pages/game.html?botActive=${botActive}`;
    }, 300);
})

document.getElementById("btnRules").addEventListener("click", ()=> { 
    document.body.style.opacity = "0";
    setTimeout(() => {
        window.location.href = "pages/rules.html";
    }, 300);
})