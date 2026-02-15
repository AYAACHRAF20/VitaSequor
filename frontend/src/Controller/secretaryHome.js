// RECUPERATION DES ELEMENTS DU DOM
const todayRDV=document.getElementById("todayRDV");
const waitingAppoints=document.getElementById("waitingAppoints");
const doneConsultations=document.getElementById("doneConsultations");
const unpaidFactures=document.getElementById("unpaidFactures");

const current=JSON.parse(sessionStorage.getItem("currentUser"));
const deptId=current.departement.id;

// 1- LA FONCTION QUI PERMET DE RECUPERER LE TOTAL DES RENDEZ VOUS D'AUJOURD'HUI
async function getTodayAppointments(){
    try{
        const response=await fetch("http://localhost:3000/appointments/forToday");
        if(!response.ok) throw new Error("Impossible de charger les rendez vous d'aujourd'hui!");

        const todayAppointments=await response.json();
        const deptTodayAppointments = todayAppointments.filter(app =>app.medecin?.departement?.id === deptId);


        todayRDV.textContent=deptTodayAppointments.length;
    }catch(error){
        console.log(error);
    }
}

//2- LA FONCTION QUI PERMET DE RECUPERER LE TOTAL DES RDV EN ATTENTE
async function getWaitingAppointments(){
    try{
        const response=await fetch("http://localhost:3000/appointments/waitingAppointments");
        if(!response.ok) throw new Error("Impossible de charger les rendez vous en attente");

        const waitingRDV=await response.json();
        const deptWaitingRDV=waitingRDV.filter(rdv=>rdv.medecin.departement.id === deptId);

        waitingAppoints.textContent=deptWaitingRDV.length;
    }catch(error){
        console.log(error);
    }
}

//3- LA FONCTION QUI PERMET DE RECUPERER LE TOTAL DES CONSULTATIONS TERMINEES
async function getfinishedConsultations(){
    try{
        const response=await fetch("http://localhost:3000/appointments/getCompletedAppoints");
        if(!response.ok) throw new Error("Impossible de charger les consultations/rdv termines");

        const finished=await response.json();
        const deptFinsihed=finished.filter(app=>app.medecin.departement.id === deptId);
        doneConsultations.textContent=deptFinsihed.length;
    }catch(error){
        console.log(error);
    }
}

// 4- LA FONCTION QUI PERMET DE RECUPERER LE TOTAL DES FACTURES EN ATTENTE
async function getUnpaidFactures(){
    try{
        const response=await fetch(`http://localhost:3000/facture/getDeptFacturesAttente/${deptId}`);
        if(!response.ok) throw new Error("Impossible de recuperer les factures en attente!");

        const factures=await response.json();
        unpaidFactures.textContent=factures.length;
    }catch(error){
        console.log(error);
    }
}


// APPEL AUX FONCTIONS DE RECUPERATION DES STATISTIQUES DU DASHBOARD DE LA SECRETAIRE
getTodayAppointments();
getWaitingAppointments();
getfinishedConsultations();
getUnpaidFactures();