import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultation } from './entities/consultations.entity';
import { Prescription } from './entities/prescription.entity';

@Injectable()
export class ConsultationsService {
    constructor(
        @InjectRepository(Consultation)
        private readonly consultationRepo: Repository<Consultation>,

        @InjectRepository(Prescription)
        private readonly prescriptionRepo: Repository<Prescription>
    ){}
}
