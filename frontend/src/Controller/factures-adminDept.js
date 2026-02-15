// RECUPERATION DES ELEMENTS DU DOM
const dateDebut = document.getElementById("dateDebut");
const dateFin = document.getElementById("dateFin");
const statut = document.getElementById("status");
const paymentMode = document.getElementById("paymentMode");
const filterBtn = document.getElementById("filterBtn");
const facturesList = document.getElementById("facturesList");

const current = JSON.parse(sessionStorage.getItem("currentUser"));
const deptId = current.departement.id;

document.addEventListener("DOMContentLoaded", chargerFactures);
filterBtn.addEventListener("click", chargerFactures);


// POUR CHARGER LES FACTURES
async function chargerFactures() {
    facturesList.innerHTML = '';
    try {
        const filters = {};
        if (dateDebut.value) filters.dateDebut = dateDebut.value;
        if (dateFin.value) filters.dateFin = dateFin.value;
        if (statut.value) filters.statut = statut.value;
        if (paymentMode.value) filters.paymentMode = paymentMode.value;

        const response = await fetch(`http://localhost:3000/facture/selectDeptFactures/${deptId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filters)
        });

        if (!response.ok) throw new Error("Impossible de charger les factures !");
        const factures = await response.json();

        if(factures.length === 0){
            facturesList.innerHTML = `<tr><td colspan="5" style="color:red">Aucune facture trouvée</td></tr>`;
            return;
        }

        factures.forEach(f => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${f.patient ? f.patient.prenom + ' ' + f.patient.nom : '--'}</td>
                <td>${new Date(f.date).toLocaleDateString()}</td>
                <td>${f.montant} MAD</td>
                <td>${f.status}</td>
                <td>${f.modePaiement || '--'}</td>
            `;
            facturesList.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        facturesList.innerHTML = `<tr><td colspan="5" style="color:red">Erreur lors du chargement</td></tr>`;
    }
}

