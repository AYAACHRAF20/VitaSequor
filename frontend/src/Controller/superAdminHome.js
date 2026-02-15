// RECUPERATION DES ELEMENTS DU DOM
const totalPC=document.getElementById("totalPC");
const totalDC=document.getElementById("totalDC");
const totalSC=document.getElementById("totalSC");
const revenus=document.getElementById("revenus");

const current=JSON.parse(sessionStorage.getItem("currentUser"));
console.log(current);


// LES FONCTIONS QUI PERMETTENT DE RCUPERER LES STATISTIQUES DU DASHBOARD DU SUPER ADMIN
// 1- LA FONCTION QUI RECUPERE LE TOTAL DES PATIENTS DE LA CLINIQUE
async function getClinicPatients(){
    try{
        const response=await fetch("http://localhost:3000/patients/all");

        // ON RECUPERE LA REPONSE DU SERVEUR
        const data=await response.json();

        totalPC.textContent=data.length;
    }catch(error){
        totalPC.textContent=0;
        console.log(error);
    }
}

// 2- LA FONCTION QUI RECUPERE LE TOTAL DES MEDECINS DE LA CLINIQUE
async function getClinicDoctors(){
    try{
        const response=await fetch("http://localhost:3000/medecin/selectAll");

        // ON RECUPERE LA DATA DU SERVEUR
        const data=await response.json();
        
        totalDC.textContent=data.length;
    }catch(error){
        totalDC.textContent=0;
        console.log(error);
    }
}

// 3- LA FONCTION QUI RECUPERE LE TOTAL DES SECRETAIRES DE LA CLINIQUE
async function getClinicSecretaries(){
    try{
        const response=await fetch("http://localhost:3000/user/selectAllSecretaries");

        const data=await response.json();

        totalSC.textContent=data.length;
    }catch(error){
        totalSC.textContent=0;
        console.log(error);
    }
}

// 4- LA FONCTION QUI PERMET DE CALCULER LES REVENUS MENSUELS
async function getMonthlyIncome(){
    try{
        const response=await fetch("http://localhost:3000/facture/revenus");

        const data=await response.json();
        revenus.textContent=data+" MAD";
    }catch(error){
        revenus.textContent=0+" MAD";
        console.log(error);
    }
}

// APPEL AUX FONCTIONS DEFINIES
getClinicPatients();
getClinicDoctors();
getClinicSecretaries();
getMonthlyIncome();