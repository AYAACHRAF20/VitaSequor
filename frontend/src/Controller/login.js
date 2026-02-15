// RECUPERATION DES ELEMENTS DU DOM
const emailInput=document.getElementById("email");
const passInput=document.getElementById("pass");
const displayPass=document.getElementById("display");
const result=document.getElementById("result");
const loginBtn=document.getElementById("loginBtn");

loginBtn.addEventListener("click", handleLogin);
displayPass.addEventListener("click", displayPassword);

// FONCTION POUR VALIDER LE FORMAT DE L'EMAIL
function isValidEmail(email){
    const format=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;      // ON UTILISE UNE XPRESSION REGULIERE
    return format.test(email);
}

// FONCTION POUR AFFICHER OU MASQUER LE MOT DE PASSE
function displayPassword(){
    if(passInput.type==="password"){
        passInput.type="text";
    }else{
        passInput.type="password";
    }
}


// FONCTION POUR GERER LA CONNEXION
async function handleLogin(event){
    event.preventDefault();
    let email=emailInput.value.trim();
    let password=passInput.value.trim();


    // SI AU MOINS UN CHAMP EST VIDE
    if(!email || !password){
        result.textContent="Veuillez remplir tous les champs!";
        result.style.color="red";
        return;
    }

    // ON VERIFIE LE FORMAT DE L'ADRESSE E-MAIL
    if(!isValidEmail(email)){
        result.textContent="Format d'email invalide!";
        result.style.color="red";
        return;
    }

    // SI LE PASSWORD DONNE CONTIENT MOINS DE 8 CARACTERES
    if(password.length<8){
        result.textContent="le mot de passe doit contenir au moins 8 caractères!";
        result.style.color="red";
        return;
    }

    loginBtn.textContent="Vérification...";
    loginBtn.disabled=true;

    // SI TOUT EST BIEN COTE FRONTEND, ON ENOIE UN REQUEST AU BACKEND
    try{
        // ON RECUPERE LA REPONSE DU SERVEUR 
        const response=await fetch("http://localhost:3000/vita/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({email, password})
        });

        const data=await response.json();
        if(data.success){
            result.textContent=data.message;
            result.style.color="green";
            sessionStorage.setItem("currentUser", JSON.stringify(data.user));
            [emailInput, passInput].forEach(input=>input.value="");
            // REDIRECTION VERS LA PAGE ADEQUATE SELON LE ROLE DE LUTILISATEUR
            if(data.user.role==="ADMIN_CLINIQUE"){
                window.location.href="../View/superAdminHome.html";
            }else if(data.user.role==="ADMIN_DEPT"){
                window.location.href="../View/adminDeptHome.html";
            }else if(data.user.role==="MEDECIN"){
                window.location.href="../View/doctorHome.html";
            }else{
                window.location.href="../View/secretaryHome.html";
            }
        }
        else{
            result.textContent=data.message;
            result.style.color="red";
        }
    }catch(error){
        result.textContent="Erreur de connexion au serveur!";
        result.style.color="red";
        console.log("Erreur:", error);
    }finally{
        loginBtn.textContent="Se connecter";
        loginBtn.disabled=false;
    }
}