    // RECUPERATION DES ELEMENTS DU DOM
    const refreshPatient=document.getElementById("refreshPatients");
    const patientsList=document.getElementById("patientsList");


    const current=JSON.parse(sessionStorage.getItem("currentUser"));
    const deptId=current.departement.id;

    refreshPatient.addEventListener("click", chargerPatients);
    document.addEventListener("DOMContentLoaded", async ()=>{
        await chargerPatients();
    });

    // POUR CHARGER LES PATIENTS
    async function chargerPatients(){
        patientsList.innerHTML='';
        try{
            const response=await fetch(`http://localhost:3000/patients/getDeptPatients/${deptId}`);
            if(!response.ok) throw new Error("Impossible de recuperer les patients");
            const patients=await response.json();

            patients.forEach(p=>{
                const tr=document.createElement("tr");

                const medecins = p.consultations?.length ? p.consultations.filter(c => c.medecin && c.medecin.user).map(c => `${c.medecin.user.prenom} ${c.medecin.user.nom}`).join(', '): '--';

                tr.innerHTML=`
                    <td>${p.prenom}</td>
                    <td>${p.nom}</td>
                    <td>${p.email || '--'}</td>
                    <td>${p.cin || '--'}</td>
                    <td>${p.date_naissance}</td>
                    <td>${p.telephone}</td>
                    <td>${p.adresse || '--'}</td>
                    <td>${p.genre}</td>
                    <td>${medecins}</td>
                `;
                patientsList.appendChild(tr);
            });
        }catch(error){
            console.log(error);
        }
    }
