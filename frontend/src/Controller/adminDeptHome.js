// RECUPERATION DES ELEMENTS DU DOM
const totalDD=document.getElementById("totalDD");
const totalSD=document.getElementById("totalSD");
const totalPD=document.getElementById("totalPD");
const revenusDept=document.getElementById("revenusDept");
const factureAttente=document.getElementById("factureAttente");
const department=document.getElementById("dept");

const current=JSON.parse(sessionStorage.getItem("currentUser"));
if(current.departement){
    department.textContent=current.departement.nom;
}else{
    department.textContent="Département non défini!";
}

const deptId=current.departement.id;
console.log("Departement courant:", deptId);
// LES FONCTIONS QUI GERENT LES CARTES DU DASHBOARD
//1- LA FONCTION QUI RECUPERE LE TOTAL DES DOCTEURS DU DEPARTEMENT
async function getDeptDoctors(){
    try{
        const response=await fetch(`http://localhost:3000/medecin/getDeptDoctors/${deptId}`);
        if(!response.ok) throw new Error('Erreur docteurs');

        const doctors=await response.json();
        totalDD.textContent=doctors.length;
    }catch(error){
        totalDD.textContent=0;
        console.log("Erreur medecins:",error);
    }
}

// 2- LA FONCTION QUI PERMET DE RECUPERER LE TOTAL DES SECRETAIRES DU DEPARTEMENTS
async function getDeptSecretaries(){
    try{
        const response=await fetch(`http://localhost:3000/user/getDeptSecretaries/${deptId}`);
        if(!response.ok) throw new Error('Erreur secrétaires');
        const secretaries=await response.json();
        totalSD.textContent=secretaries.length;

    }catch(error){
        totalSD.textContent=0;
        console.log("Erreur secretaires:",error);
    }
}

// 3- LA FONCTION QUI PERMET DE RECUPERER LE TOTAL DES PATIENTS ATTACHES AU DEPARTEMENT
async function getDeptPatients(){
    try{
        const response=await fetch(`http://localhost:3000/patients/getDeptPatients/${deptId}`);
        if(!response.ok) throw new Error('Erreur patients');
        const patients=await response.json();
        totalPD.textContent=patients.length;
    }catch(error){
        totalPD.textContent=0;
        console.log("Erreur patients:",error);
    }
}

// 4- LA FONCTION QUI RECUPERE LE TOTAL DES REVENUS MENSUELS DU DEPARTEMENT
async function getDeptMonthlyIncome(){
    try{
        const response= await fetch(`http://localhost:3000/facture/getDeptMonthlyIncome/${deptId}`);
        if(!response.ok) throw new Error('Erreur revenus');
        const deptRevenus=await response.json();
        revenusDept.textContent=`${deptRevenus} MAD`;
    }catch(error){
        revenusDept.textContent="0 MAD";
        console.log("Erreur revenus mensuels:",error);
    }
}

// 5- LA FONCTION QUI PERMET DE RECUPERER LE TOTAL DES FACTURES DU DEPARTEMENT EN ATTENTE 
async function getDeptFacturesAttente(){
    try{
        const response=await fetch(`http://localhost:3000/facture/getDeptFacturesAttente/${deptId}`);
        if(!response.ok) throw new Error('Erreur factures');
        const factures=await response.json();
        factureAttente.textContent=factures.length;
    }catch(error){
        factureAttente.textContent=0;
        console.log("Erreur factures en attente:",error);
    }
}



// APPEL AUX FONCTIONS
getDeptDoctors();
getDeptSecretaries();
getDeptPatients();
getDeptMonthlyIncome();
getDeptFacturesAttente();

