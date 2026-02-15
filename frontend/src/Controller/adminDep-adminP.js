
let adminsData = [];

// RECUPERATION DES ELEMENTS DU DOM
const ajouterAdmin = document.getElementById("ajouterAdmin");
const refreshAdmin = document.getElementById("refreshAdmin");
const adminList = document.getElementById("adminList");

// REFRESH
refreshAdmin.addEventListener("click", chargerAdmins);

// DEMARRAGE
document.addEventListener("DOMContentLoaded", chargerAdmins);

// FONCTIONS DE CHARGEMENT 
async function chargerAdmins() {
    adminList.innerHTML = '';
    try {
        const response = await fetch("http://localhost:3000/user/allAdmins");
        if (!response.ok) throw new Error("Erreur lors du chargement des admins");
        
        adminsData = await response.json();

        adminsData.forEach((admin, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${admin.prenom}</td>
                <td>${admin.nom}</td>
                <td>${admin.email}</td>
                <td>${admin.departement ? admin.departement.nom : "Non assigné"}</td>
                <td>
                    <button class="btn btn-primary" onclick="preparerModification(${index})">Modifier</button>
                    <button class="btn btn-danger" onclick="deleteAdmin(${admin.id})">Supprimer</button>
                </td>
            `;
            adminList.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
    }
}

function preparerModification(index) {
    const admin = adminsData[index];
    modifierAdmin(admin);
}

// POUR AJOUTER UN ADMIN
ajouterAdmin.addEventListener("click", async () => {
    const modal = createModal(`
        <h2>Ajouter un admin de département</h2>
        <form id="formAddAdmin">
            <div id="errorMsg" style="color:red; margin-bottom:10px;"></div>
            Prénom:<br><input type="text" id="prenom" required><br><br>
            Nom:<br><input type="text" id="nom" required><br><br>
            Email:<br><input type="email" id="email" required><br><br>
            Mot de passe initial:<br><input type="password" id="password" required><br><br>
            Département:<br><select id="depSelect" required></select><br><br>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
        </form>
    `);
    document.body.appendChild(modal);
    modal.style.display = "block";

    const selectDep = document.getElementById("depSelect");

    // CHARGER LES DEPARTEMENTS DE LA CLINIQUE
    try {
        const response = await fetch("http://localhost:3000/departement/allDepartments");
        const departements = await response.json();
        selectDep.innerHTML = '<option value="">-- Choisir un département --</option>';
        departements.forEach(dep => {
            selectDep.innerHTML += `<option value="${dep.id}">${dep.nom}</option>`;
        });
    } catch (err) {
        console.error("Erreur departements:", err);
    }

    document.getElementById("formAddAdmin").addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const data = {
            prenom: document.getElementById("prenom").value,
            nom: document.getElementById("nom").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            departementId: Number(selectDep.value)
        };

        try {
            const response = await fetch("http://localhost:3000/user/addAdmin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                document.getElementById("errorMsg").textContent = error.message;
                return;
            }

            modal.remove();
            chargerAdmins();
        } catch (error) {
            console.error(error);
        }
    });
});

// POUR MODIFIER UN ADMIN
async function modifierAdmin(admin) {
    const modal = createModal(`
        <h2>Modifier l'admin</h2>
        <form id="formUpdateAdmin">
            Prénom:<br><input type="text" id="prenomMod" value="${admin.prenom}" required><br><br>
            Nom:<br><input type="text" id="nomMod" value="${admin.nom}" required><br><br>
            Email:<br><input type="email" id="emailMod" value="${admin.email}" required><br><br>
            Mot de passe:<br><input type="password" id="passwordMod" placeholder="Laisser vide pour ne pas changer"><br><br>
            Département:<br><select id="depSelectMod" required></select><br><br>
            <div id="errorMsgMod" style="color:red; margin-bottom:10px;"></div>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
        </form>
    `);
    document.body.appendChild(modal);
    modal.style.display = "block";

    const selectDep = document.getElementById("depSelectMod");

    try {
        const response = await fetch("http://localhost:3000/departement/allDepartments");
        const departements = await response.json();
        departements.forEach(dep => {
            const isSelected = (admin.departement && dep.id === admin.departement.id) ? "selected" : "";
            selectDep.innerHTML += `<option value="${dep.id}" ${isSelected}>${dep.nom}</option>`;
        });
    } catch (err) {
        console.error(err);
    }

    document.getElementById("formUpdateAdmin").addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
            prenom: document.getElementById("prenomMod").value,
            nom: document.getElementById("nomMod").value,
            email: document.getElementById("emailMod").value,
            departementId: Number(selectDep.value)
        };

        const password = document.getElementById("passwordMod").value;
        if (password) data.password = password; 

        try {
            const response = await fetch(`http://localhost:3000/user/updateAdmin/${admin.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const err = await response.json();
                document.getElementById("errorMsgMod").textContent = err.message;
                return;
            }

            modal.remove();
            chargerAdmins();
        } catch (error) {
            console.error(error);
        }
    });
}

// SUPPRESSION
async function deleteAdmin(id) {
    if (!confirm("Voulez-vous vraiment supprimer cet administrateur ?")) return;
    try {
        const response = await fetch(`http://localhost:3000/user/deleteAdmin/${id}`, { method: "DELETE" });
        if(response.ok) chargerAdmins();
    } catch (error) {
        console.error(error);
    }
}

// FONCTION QUI PERMET DE CREER UN MODAL
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