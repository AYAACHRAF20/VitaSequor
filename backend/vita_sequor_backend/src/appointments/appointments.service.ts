import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, AppointmentStatus } from './entities/appointments.entity';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private readonly appointmentRepo: Repository<Appointment>
    ) {}


    // RECUPERER LES RENDEZ VOUS D'AUJOURD'HUI
    async getTodayAppointments(){
        const today = new Date();

        const debutJour = new Date(today);
        debutJour.setHours(8, 0, 0, 0);

        const finJour = new Date(today);
        finJour.setHours(21, 0, 0, 0);

        return await this.appointmentRepo.find({
            where: {
                datetime: Between(debutJour, finJour),
            },
            relations: ['patient', 'medecin','medecin.departement'],
            order: { datetime: 'ASC' },
        });
    }


    // RECUPERER LES RENDEZ VOUS EN ATTENTE
    async getWaitingAppointments(){
        const today = new Date();
        const debutJour = new Date(today);
        debutJour.setHours(8, 0, 0, 0);

        const finJour = new Date(today);
        finJour.setHours(21, 0, 0, 0);

        return await this.appointmentRepo.find({
            where: {
                datetime: Between(debutJour, finJour),
                status: AppointmentStatus.EN_ATTENTE,
            },
            relations: ['patient', 'medecin','medecin.departement'],
            order: { datetime: 'ASC' },
        });
    }


    // RECUPERER LES RENDEZ VOUS FAITS
    async getCompletedAppointments(){
        const today = new Date();
        const debutJour = new Date(today);
        debutJour.setHours(8, 0, 0, 0);

        const finJour = new Date(today);
        finJour.setHours(21, 0, 0, 0);

        return await this.appointmentRepo.find({
            where: {
                datetime: Between(debutJour, finJour),
                status: AppointmentStatus.FAIT,
            },
            relations: ['patient', 'medecin','medecin.departement'],
            order: { datetime: 'ASC' },
        });
    }

    // RECUPERER LES RENDEZ VOUS PAR PATIENT
    async getAppointmentsByPatient(patientId: number){
        return await this.appointmentRepo.find({
            where: { patient: { id: patientId } },
            relations: ['patient', 'medecin','medecin.user','medecin.departement'],
            order: { datetime: 'ASC' },
        });
    }

    // RECUPERER LES RENDEZ VOUS PAR MEDECIN
    async getAppointmentsByMedecin(medecinId: number){
        return await this.appointmentRepo.find({
            where: { medecin: { id: medecinId } },
            relations: ['patient', 'medecin'],
            order: { datetime: 'ASC' },
        });
    }

    // RECUPERER TOUS LES RENDEZ VOUS
    async getAll() {
        return this.appointmentRepo.find({
            relations: ['patient', 'medecin','medecin.user','medecin.specialite'],
            order: { datetime: 'ASC' }
        });
    }

    // AJOUTER UN RENDEZ VOUS
    async addAppointment(data: { patient: { id: number }; medecin: { id: number }; date: string; heure: string; motif: string }) {

        const datetime = new Date(`${data.date}T${data.heure}:00`);

        const existing = await this.appointmentRepo.findOne({
            where: {
                medecin: { id: data.medecin.id },
                datetime: datetime,
                status: AppointmentStatus.EN_ATTENTE
            }
        });

        if (existing) {
            throw new BadRequestException("Ce médecin a déjà un rendez-vous à ce créneau");
        }

        const appointment = this.appointmentRepo.create({
            patient: { id: data.patient.id },
            medecin: { id: data.medecin.id },
            datetime: datetime,
            motif: data.motif,
            status: AppointmentStatus.EN_ATTENTE
        });

        return this.appointmentRepo.save(appointment);
    }

    // MODIFIER UN RENDEZ VOUS
    async updateAppointment(id: number, data: Partial<Appointment>) {
        const appt = await this.appointmentRepo.findOne({ where: { id } });
        if (!appt) throw new NotFoundException("Rendez-vous introuvable");

        if ((data.medecin && data.medecin.id !== appt.medecin?.id) || data.datetime) {
            const datetime = data.datetime || appt.datetime;
            const medecinId = data.medecin?.id || appt.medecin?.id;

            const conflict = await this.appointmentRepo.findOne({
                where: { medecin: { id: medecinId }, datetime, status: AppointmentStatus.EN_ATTENTE }
            });
            if (conflict) throw new BadRequestException("Médecin déjà occupé à ce créneau");
        }

        await this.appointmentRepo.update(id, data);
        return this.appointmentRepo.findOne({ where: { id }, relations: ['patient', 'medecin', 'medecin.user', 'medecin.specialite'] });
    }

    // SUPPRIMER UN RENDEZ VOUS
    async deleteAppointment(id: number) {
        const appt = await this.appointmentRepo.findOne({ where: { id } });
        if (!appt) throw new NotFoundException("Rendez-vous introuvable");
        return await this.appointmentRepo.delete(id);
    }


    // RECUPERER TOUS LES RENDEZ VOUS DU DEPARTEMENT
    async getDeptAppointments(deptId: number) {

        return this.appointmentRepo.find({
            where: {
                patient: { createdBy: { departement: { id: deptId } } }
            },
            relations: ['patient', 'medecin', 'medecin.user', 'medecin.specialite']
        });
    }

    // MODIFIER LE STATUT DU RENDEZ VOUS 
    async updateStatus(id:number, status:AppointmentStatus){
        const rdv = await this.appointmentRepo.findOne({ where: { id } });
        if(!rdv) throw new Error("Rendez-vous introuvable");
        rdv.status = status;
        return this.appointmentRepo.save(rdv);
    }


    // RECUPERER LES CRENEAUX DISPONIBLES D'UN CERTAIN MEDECIN DANS UNE CERTAINE DATE
    async getDisponibilites(medecinId: number, date: string): Promise<string[]> {
        medecinId = Number(medecinId);

        // créneaux horaires de 08:00 à 21:00 toutes les 30 min
        const creneaux: string[] = [];
        for (let h = 8; h < 21; h++) {
            creneaux.push(`${h.toString().padStart(2, '0')}:00`);
            creneaux.push(`${h.toString().padStart(2, '0')}:30`);
        }

        // RDV déjà pris ce jour
        const rdvs: Appointment[] = await this.appointmentRepo.find({
            where: {
                medecin: { id: medecinId },
                datetime: Between(
                    new Date(`${date}T00:00:00Z`),
                    new Date(`${date}T23:59:59Z`)
                )
            }
        });


        const pris: string[] = rdvs.map(r => {
            const d = new Date(r.datetime);
            return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        });

        return creneaux.filter(c => !pris.includes(c)) || [];
    }

}
