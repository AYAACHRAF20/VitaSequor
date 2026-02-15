// RECUPERATION DES ELEMENTS DU DOM
const dateDebut=document.getElementById("dateDebut");
const dateFin=document.getElementById("dateFin");
const statut=document.getElementById("status");
const paymentMode=document.getElementById("paymentMode");
const filterBtn=document.getElementById("filterBtn");
const facturesList=document.getElementById("facturesList");
// ON GERE LE FILTRE SELON LES INFORMATIONS DONNEES
filterBtn.addEventListener("click",chargerFactures);

// LA FONCTION QUI PERMET DE CHARGER LA LISTE DES FACTURES DE TOUTE LA CLINIQUE
async function chargerFactures(){
    facturesList.innerHTML='';
    try{
        const filters={};
        if(dateDebut.value){
            filters.dateDebut=dateDebut.value;
        }

        if(dateFin.value){
            filters.dateFin=dateFin.value;
        }

        if(statut.value){
            filters.statut=statut.value;
        }

        if(paymentMode.value){
            filters.paymentMode=paymentMode.value;
        }

        const response=await fetch("http://localhost:3000/facture/selectAll",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(filters)
        });
        if(!response.ok) throw new Error("Erreur lors du chargement des factures!");
        const facturesData=await response.json();
        facturesData.forEach((facture)=>{
            const tr=document.createElement("tr");
            tr.innerHTML=`
            <td>${facture.id}</td>
            <td>${facture.patient ? facture.patient.prenom+" "+facture.patient.nom :"--"}</td>
            <td>${new Date(facture.date).toLocaleDateString()}</td>
            <td>${facture.montant}</td>
            <td>${facture.status}</td>
            <td>${facture.modePaiement || "--"}</td>
        `;
        facturesList.appendChild(tr);
        });
    }catch(error){
        console.log(error);
    }
}

