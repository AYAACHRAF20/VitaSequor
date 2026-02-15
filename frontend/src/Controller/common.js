// MESSAGE DE BIENVENUE
function afficherBienvenue() {
    const current = JSON.parse(sessionStorage.getItem("currentUser"));
    const welcomeElement = document.getElementById("welcome_message");

    if (current && welcomeElement) {
        welcomeElement.textContent = "Bienvenue, " + current.prenom + " " + current.nom;
    }
}


// DATE DU JOUR
function TodayDate() {
    const today = new Date(); 
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const dateFormatee = today.toLocaleDateString("fr-FR", options);

    const dateElement = document.getElementById("date");
    if (dateElement) {
        dateElement.textContent = dateFormatee.toUpperCase();
    }
}

// LA FONCTION DE DECONNEXION
function logout(){
    sessionStorage.removeItem("currentUser");
    sessionStorage.clear();
    window.location.replace("index.html");
}

// LANCEMENT AUTOMATIQUE
document.addEventListener("DOMContentLoaded", () => {
    TodayDate();
    afficherBienvenue();
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
});


