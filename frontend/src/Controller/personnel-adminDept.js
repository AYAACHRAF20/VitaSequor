// RECUPERATION DES ELEMENTS DU DOM
const ajouterMedecin = document.getElementById("ajouterMedecin");
const resetDocList = document.getElementById("resetDocList");
const docList = document.getElementById("docList");

const ajouterSecretaire = document.getElementById("ajouterSecretaire");
const resetSecretaryList = document.getElementById("resetSecretaryList");
const secretaryList = document.getElementById("secretaryList");

const current=JSON.parse(sessionStorage.getItem("currentUser"));
const deptId=current.departement.id;
// RAFRAICHIR LES LISTES
resetDocList.addEventListener("click", chargerMedecins);
resetSecretaryList.addEventListener("click", chargerSecretaires);

// CHARGER LES LISTES AU DEMARRAGE
document.addEventListener("DOMContentLoaded", async () => {
    await chargerMedecins();
    await chargerSecretaires();
});

// GESTION DES ERREURS
function afficherErreur(form, message) {
    let oldMsg = form.querySelector(".error-message");
    if (oldMsg) oldMsg.remove();

    const msg = document.createElement("div");
    msg.className = "error-message";
    msg.style.color = "red";
    msg.textContent = message;

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.parentNode.insertBefore(msg, submitBtn);
}


async function chargerMedecins() {
    docList.innerHTML = "";
    try {
        const response = await fetch(`http://localhost:3000/medecin/getDeptDoctors/${deptId}`);
        const medecins = await response.json();

        medecins.forEach(med => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${med.user.prenom}</td>
                <td>${med.user.nom}</td>
                <td>${med.user.email}</td>
                <td>${med.specialite.nom}</td>
                <td>
                    <button class="btn btn-primary" onclick='modifierMedecin(${JSON.stringify(med)})'>Modifier</button>
                    <button class="btn btn-danger" onclick='supprimerMedecin(${med.user.id})'>Supprimer</button>
                </td>
            `;
            docList.appendChild(tr);
        });
    } catch (err) {
        console.error("Erreur medecins:", err);
    }
}

// AJOUTER UN MEDECIN
ajouterMedecin.addEventListener("click", async () => {
    const modal = createModal(`
        <h2>Ajouter un médecin</h2>
        <form id="formMedecin">
            Prénom:<br><input type="text" id="prenom" required><br><br>
            Nom:<br><input type="text" id="nom" required><br><br>
            Email:<br><input type="email" id="email" required><br><br>
            Mot de passe initial:<br><input type="password" id="password" required><br><br>
            Spécialité:<br><select id="specialiteSelect" required></select><br><br>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
        </form>
    `);
    document.body.appendChild(modal);
    modal.style.display = "block";

    const selectSpec = document.getElementById("specialiteSelect");
    try {
        const resp = await fetch("http://localhost:3000/departement/allSpecialties");
        const specs = await resp.json();
        specs.filter(s => s.departement.id === current.departement.id)
             .forEach(s => selectSpec.innerHTML += `<option value="${s.id}">${s.nom}</option>`);
    } catch {
        afficherErreur(document.getElementById("formMedecin"), "Impossible de charger les spécialités");
    }

    document.getElementById("formMedecin").addEventListener("submit", async (event) => {
        event.preventDefault();
        const payload = {
            prenom: document.getElementById("prenom").value,
            nom: document.getElementById("nom").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            specialiteId: Number(selectSpec.value),
            departementId: current.departement.id
        };

        try {
            const response = await fetch("http://localhost:3000/medecin/addMedecin", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                afficherErreur(document.getElementById("formMedecin"), err.message);
                return;
            }

            modal.remove();
            chargerMedecins();
        } catch (err) {
            afficherErreur(document.getElementById("formMedecin"), `Erreur serveur: ${err}`);
        }
    });
});

// MODIFIER UN MEDECIN (SANS MOT DE PASSE)
async function modifierMedecin(med) {
    const modal = createModal(`
        <h2>Modifier un médecin</h2>
        <form id="formModifierMed">
            Prénom:<br>
            <input type="text" id="prenomMod" value="${med.user.prenom}" required><br><br>
            Nom:<br>
            <input type="text" id="nomMod" value="${med.user.nom}" required><br><br>
            Email:<br>
            <input type="email" id="emailMod" value="${med.user.email}" required><br><br>
            Spécialité:<br>
            <select id="specialiteMod" required></select><br><br>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
        </form>
    `);
    document.body.appendChild(modal);
    modal.style.display = "block";

    const selectSpec=document.getElementById("specialiteMod");

    try {
        const response = await fetch("http://localhost:3000/departement/allSpecialties");
        const specialites = await response.json();

        // Filtrer seulement les spécialités du département
        const deptSpecs = specialites.filter(s => s.departement.id === deptId);

        deptSpecs.forEach(spec => {
        const isSelected = (med.specialite && spec.id === med.specialite.id)
            ? "selected"
            : "";

        selectSpec.innerHTML += `
            <option value="${spec.id}" ${isSelected}>
                ${spec.nom}
            </option>
        `;
    });

} catch (err) {
    console.error(err);
}


    document.getElementById("formModifierMed").addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            prenom: document.getElementById("prenomMod").value,
            nom: document.getElementById("nomMod").value,
            email: document.getElementById("emailMod").value,
            specialiteId: Number(document.getElementById("specialiteMod").value)
        };

        try {
            const resp = await fetch(`http://localhost:3000/medecin/updateMedecin/${med.user.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            });
            if (!resp.ok) {
                const err = await resp.json();
                afficherErreur(document.getElementById("formModifierMed"), err.message);
                return;
            }
            modal.remove();
            chargerMedecins();
        } catch {
            afficherErreur(document.getElementById("formModifierMed"), "Erreur serveur");
        }
    });
}

// SUPPRIMER UN MEDECIN
async function supprimerMedecin(userId) {
    if (!confirm("Supprimer ce médecin ?")) return;
    await fetch(`http://localhost:3000/medecin/deleteMedecin/${userId}`, {method:"DELETE"});
    chargerMedecins();
}


async function chargerSecretaires() {
    secretaryList.innerHTML = "";
    try {
        const response = await fetch(`http://localhost:3000/user/getDeptSecretaries/${deptId}`);
        const secretaires = await response.json();

        secretaires.forEach(sec => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${sec.prenom}</td>
                <td>${sec.nom}</td>
                <td>${sec.email}</td>
                <td>
                    <button class="btn btn-primary" onclick='modifierSecretaire(${JSON.stringify(sec)})'>Modifier</button>
                    <button class="btn btn-danger" onclick='supprimerSecretaire(${sec.id})'>Supprimer</button>
                </td>
            `;
            secretaryList.appendChild(tr);
        });
    } catch (err) {
        console.log("Erreur secrétaires:", err);
    }
}

// AJOUTER UNE SECRETAIRE AVEC MOT DE PASSE INITIAL
ajouterSecretaire.addEventListener("click", () => {
    const modal = createModal(`
        <h2>Ajouter une secrétaire</h2>
        <form id="formSecretaire">
            Prénom:<br><input type="text" id="prenom" required><br><br>
            Nom:<br><input type="text" id="nom" required><br><br>
            Email:<br><input type="email" id="email" required><br><br>
            Mot de passe initial:<br><input type="password" id="password" required><br><br>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
        </form>
    `);
    document.body.appendChild(modal);
    modal.style.display = "block";

    document.getElementById("formSecretaire").addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            prenom: document.getElementById("prenom").value,
            nom: document.getElementById("nom").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            departementId: current.departement.id
        };

        try {
            const resp = await fetch("http://localhost:3000/user/addSecretary", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            });

            if (!resp.ok) {
                const err = await resp.json();
                afficherErreur(document.getElementById("formSecretaire"), err.message);
                return;
            }

            modal.remove();
            chargerSecretaires();
        } catch {
            afficherErreur(document.getElementById("formSecretaire"), "Erreur serveur");
        }
    });
});

// MODIFIER UNE SECRETAIRE (SANS MOT DE PASSE)
function modifierSecretaire(sec) {
    const modal = createModal(`
        <h2>Modifier une secrétaire</h2>
        <form id="formModifierSec">
            Prénom:<br><input type="text" id="prenomMod" value="${sec.prenom}" required><br><br>
            Nom:<br><input type="text" id="nomMod" value="${sec.nom}" required><br><br>
            Email:<br><input type="email" id="emailMod" value="${sec.email}" required><br><br>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
        </form>
    `);
    document.body.appendChild(modal);
    modal.style.display = "block";

    document.getElementById("formModifierSec").addEventListener("submit", async (event) => {
        event.preventDefault();
        const payload = {
            prenom: document.getElementById("prenomMod").value,
            nom: document.getElementById("nomMod").value,
            email: document.getElementById("emailMod").value
        };

        try {
            const resp = await fetch(`http://localhost:3000/user/updateSecretary/${sec.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            });

            if (!resp.ok) {
                const err = await resp.json();
                afficherErreur(document.getElementById("formModifierSec"), err.message);
                return;
            }

            modal.remove();
            chargerSecretaires();
        } catch {
            afficherErreur(document.getElementById("formModifierSec"), "Erreur serveur");
        }
    });
}

// SUPPRIMER UNE SECRETAIRE
async function supprimerSecretaire(id) {
    if (!confirm("Supprimer cette secrétaire ?")) return;
    await fetch(`http://localhost:3000/user/deleteSecretary/${id}`, {method:"DELETE"});
    chargerSecretaires();
}

// CREATION D'UN MODAL
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
