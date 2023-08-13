import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Worker } from './schemas/worker.schema';
import mongoose, { Model, ObjectId, isValidObjectId } from 'mongoose';
import { SpecialityService } from '../speciality/speciality.service';
import { Speciality } from '../speciality/schemas/speciality.schema';

@Injectable()
export class WorkerService {
  constructor(
    @InjectModel(Worker.name) private workerModel: Model<Worker>,
    @InjectModel(Speciality.name) private specialityModel: Model<Speciality>,
    private readonly specialityService: SpecialityService,
  ) {}
  async create(createWorkerDto: CreateWorkerDto) {
    const isSpeciality = await this.specialityService.findOne(
      createWorkerDto.speciality,
    );
    if (!isSpeciality) {
      throw new NotFoundException('There is no such a speciality');
    }
    const newWorker = await this.workerModel.create(createWorkerDto);
    if (!newWorker) {
      throw new InternalServerErrorException('Error creating worker');
    }

    isSpeciality.worker.push(newWorker);
    isSpeciality.save();

    return newWorker;
  }

  async findAll() {
    const workers = await this.workerModel.find().populate('speciality');
    return workers;
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id ');
    }
    const worker = await this.workerModel.findOne({ _id: id });
    if (!worker) {
      throw new NotFoundException('There is no worker with that id ');
    }
    return worker;
  }

  async update(
    id: mongoose.Schema.Types.ObjectId,
    updateWorkerDto: UpdateWorkerDto,
  ) {
    const { username, phone_number } = updateWorkerDto;
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Id must be a valid object Id');
    }

    if (username) {
      const isWorker = await this.workerModel.findOne({ username: username });
      if (isWorker) {
        throw new BadRequestException('Worker username is already in use');
      }
    }
    if (phone_number) {
      const isWorker = await this.workerModel.findOne({ phone_number });
      if (isWorker) {
        throw new BadRequestException('Worker phone number is already in use');
      }
    }

    const updatedWorker = await this.workerModel.findOneAndUpdate(
      { _id: id },
      updateWorkerDto,
      { new: true },
    );
    if (!updatedWorker) {
      throw new InternalServerErrorException('Error updating worker');
    }
    return updatedWorker;
  }

  async remove(id: ObjectId) {
    const worker = await this.workerModel.findOneAndDelete({ _id: id });

    if (!worker) {
      throw new NotFoundException('Worker with such id does not exist');
    }
    return { message: 'Successfully deleted' };
  }
}
