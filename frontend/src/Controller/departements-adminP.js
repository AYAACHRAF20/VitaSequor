// RECUPERATION DES ELEMENTS DU DOM
const ajouterDepart = document.getElementById("ajouterDepart");
const resetDepartList = document.getElementById("resetDepartList");
const departList = document.getElementById("departList");
const ajouterSpecialite = document.getElementById("ajouterSpecialite");
const resetSpecList = document.getElementById("resetSpecList");
const specList = document.getElementById("specList");

// POUR FAIRE DU REFRESH AUX LISTES
resetDepartList.addEventListener("click", chargerDepartements);
resetSpecList.addEventListener("click", chargerSpecialites);

// POUR CHARGER LA PAGE AU DEMARRAGE
document.addEventListener("DOMContentLoaded", async () => {
    await chargerDepartements();
    await chargerSpecialites();
});


// POUR GERER LES ERREURS
function afficherErreur(form, message) {
    let oldMsg = form.querySelector(".error-message");
    if(oldMsg){
        oldMsg.remove();
    } 

    const msg = document.createElement("div");
    msg.className = "error-message";
    msg.style.color = "red";
    msg.textContent = message;

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.parentNode.insertBefore(msg, submitBtn);
}

// GESTION DES DEPARTEMENTS
async function chargerDepartements() {
    departList.innerHTML = '';
    try {
        const response = await fetch("http://localhost:3000/departement/allDepartments");
        if (!response.ok) throw new Error("Impossible de charger les départements");
        const departements = await response.json();

        departements.forEach(dep => {
            // LOGIQUE CORRIGÉE : On cherche l'utilisateur qui a le rôle ADMIN_DEPT dans les membres
            const admin = dep.membres ? dep.membres.find(m => m.role === "ADMIN_DEPT") : null;
            const adminNom = admin ? `${admin.prenom} ${admin.nom}` : "Non assigné";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${dep.nom}</td>
                <td>${adminNom}</td> 
                <td>${dep.specialites ? dep.specialites.length : 0}</td>
                <td>
                    <button class="btn btn-secondary" onclick='alertSpecialites(${JSON.stringify(dep)})'>
                        Voir spécialités
                    </button>
                    <button class="btn btn-primary" onclick='modifierDepart(${JSON.stringify(dep)})'>
                        Modifier
                    </button>
                    <button class="btn btn-danger" onclick="deleteDepartement(${dep.id})">
                        Supprimer
                    </button>
                </td>
            `;
            departList.appendChild(tr);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des départements:", error);
    }
}

// UNE ALERTE POUR VOIR LES SPECIALITES D'UN DEPARTEMENT
function alertSpecialites(dep) {
    if (!dep.specialites || dep.specialites.length === 0) {
        alert(`Le département "${dep.nom}" ne contient aucune spécialité.`);
        return;
    }
    const noms = dep.specialites.map(spec => `- ${spec.nom}`).join('\n');
    alert(`Le département "${dep.nom}" contient ${dep.specialites.length} spécialité(s):\n${noms}`);
}

// AFIN D'AJOUTER UN DEPARTEMENT
ajouterDepart.addEventListener("click", () => {
    const modal = createModal(`
        <h2>Ajouter un département</h2>
        <form id="formDepart">
            Nom du département:<br>
            <input type="text" id="depNom" placeholder="Nom du département..." required><br><br>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
        </form>
    `);
    document.body.appendChild(modal);
    modal.style.display = "block";

    const form = document.getElementById("formDepart");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const nom = document.getElementById("depNom").value;

        try {
            const response = await fetch("http://localhost:3000/departement/addDepart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nom })
            });

            if (!response.ok) {
                const err = await response.json();
                afficherErreur(form, err.message);
                return;
            }

            modal.remove();
            chargerDepartements();
        } catch {
            afficherErreur(form, "Erreur serveur ou connexion refusée");
        }
    });
});

// AFIN DE MODIFIER UN DEPARTEMENT
async function modifierDepart(dep) {
    const modal = createModal(`
        <h2>Modifier le département</h2>
        <form id="formModifierDepart">
            Nom du département:<br>
            <input type="text" id="depNomMod" value="${dep.nom}" required><br><br>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
        </form>
    `);
    document.body.appendChild(modal);
    modal.style.display = "block";

    const form = document.getElementById("formModifierDepart");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const nom = document.getElementById("depNomMod").value;

        try {
            const response = await fetch(`http://localhost:3000/departement/updateDepart/${dep.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nom })
            });

            if (!response.ok) {
                const err = await response.json();
                afficherErreur(form, err.message);
                return;
            }

            modal.remove();
            chargerDepartements();
        } catch {
            afficherErreur(form, "Erreur serveur ou connexion refusée");
        }
    });
}

// POUR SUPPRIMER UN DEPARTEMENT
async function deleteDepartement(id) {
    if (!confirm("Supprimer ce département ?")) return;
    await fetch(`http://localhost:3000/departement/deleteDep/${id}`, { method: "DELETE" });
    chargerDepartements();
}

// GESTION DES SPECIALITES
async function chargerSpecialites() {
    specList.innerHTML = '';
    try {
        const response = await fetch("http://localhost:3000/departement/allSpecialties");
        if (!response.ok) throw new Error("Impossible de charger les spécialités");
        const specialites = await response.json();

        specialites.forEach(spec => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${spec.nom}</td>
                <td>${spec.departement.nom}</td>
                <td>${spec.medecins.length}</td>
                <td>
                    <button class="btn btn-primary" onclick='modifierSpec(${JSON.stringify(spec)})'>
                        Modifier
                    </button>
                    <button class="btn btn-danger" onclick="deleteSpecialite(${spec.id})">
                        Supprimer
                    </button>
                </td>
            `;
            specList.appendChild(tr);
        });
    } catch (error) {
        console.log(error);
    }
}

// AFIN D'AJOUTER UNE SPECIALITE
ajouterSpecialite.addEventListener("click", async () => {
    const modal = createModal(`
        <h2>Ajouter une spécialité</h2>
        <form id="formSpec">
            Nom:<br>
            <input type="text" id="specNom" placeholder="Nom de la spécialité..." required><br><br>
            Département:<br>
            <select id="depSelect"></select><br><br>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
        </form>
    `);
    document.body.appendChild(modal);
    modal.style.display = "block";

    const selectDep = document.getElementById("depSelect");
    const form = document.getElementById("formSpec");

    try {
        const responseDep = await fetch("http://localhost:3000/departement/allDepartments");
        const departements = await responseDep.json();
        departements.forEach(dep => selectDep.innerHTML += `<option value="${dep.id}">${dep.nom}</option>`);
    } catch {
        afficherErreur(form, "Impossible de charger les départements");
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const nom = document.getElementById("specNom").value;
        const departementId = Number(selectDep.value);

        try {
            const response = await fetch("http://localhost:3000/departement/addSpec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nom, departementId })
            });

            if (!response.ok) {
                const err = await response.json();
                afficherErreur(form, err.message);
                return;
            }

            modal.remove();
            chargerSpecialites();
        } catch {
            afficherErreur(form, "Erreur serveur ou connexion refusée");
        }
    });
});

// POUR MODIFIER UNE SPECIALITE
async function modifierSpec(spec) {
    const modal = createModal(`
        <h2>Modifier la spécialité</h2>
        <form id="formModifierSpec">
            Nom:<br>
            <input type="text" id="specNomMod" value="${spec.nom}" required><br><br>
            Département:<br>
            <select id="depSelectMod"></select><br><br>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
        </form>
    `);
    document.body.appendChild(modal);
    modal.style.display = "block";

    const selectDep = document.getElementById("depSelectMod");
    const form = document.getElementById("formModifierSpec");

    try {
        const responseDep = await fetch("http://localhost:3000/departement/allDepartments");
        const departements = await responseDep.json();
        departements.forEach(dep => {
            const selected = dep.id === spec.departement.id ? "selected" : "";
            selectDep.innerHTML += `<option value="${dep.id}" ${selected}>${dep.nom}</option>`;
        });
    } catch {
        afficherErreur(form, "Impossible de charger les départements");
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const nom = document.getElementById("specNomMod").value;
        const departementId = Number(selectDep.value);

        try {
            const response = await fetch(`http://localhost:3000/departement/updateSpec/${spec.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nom, departementId })
            });

            if (!response.ok) {
                const err = await response.json();
                afficherErreur(form, err.message);
                return;
            }

            modal.remove();
            chargerSpecialites();
        } catch {
            afficherErreur(form, "Erreur serveur ou connexion refusée");
        }
    });
}

// POUR SUPPRIMER UNE SPECIALITE
async function deleteSpecialite(id) {
    if (!confirm("Supprimer cette spécialité ?")) return;
    await fetch(`http://localhost:3000/departement/deleteSpec/${id}`, { method:"DELETE" });
    chargerSpecialites();
}

// LA FONCTION QUI PERMET DE CREER UN MODAL
function createModal(contenu) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">X</span>
            ${contenu}
        </div>
    `;
    return modal;
}
