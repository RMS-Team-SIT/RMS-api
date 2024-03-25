import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Renter } from './schemas/renter.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRenterDto } from './dto/create-renter.dto';
import { validateObjectIdFormat } from 'src/utils/mongo.utils';
import { ResidenceService } from 'src/residence/residence.service';
import { UpdateRenterDto } from './dto/update-renter.dto';

@Injectable()
export class RenterService {
  constructor(
    @InjectModel(Renter.name)
    private readonly renterModel: Model<Renter>,
    private readonly residenceService: ResidenceService,
  ) {}

  private async checkRenterUsernameExist(
    username: string,
    residenceId: string,
    renterId?: string,
  ): Promise<void> {
    const filter = { username, residence: residenceId };

    if (renterId) {
      filter['_id'] = { $ne: renterId };
    }

    const renter = await this.renterModel.findOne(filter).exec();

    if (renter) {
      throw new BadRequestException('Renter username is exist');
    }
  }

  async createRenter(
    residenceId: string,
    createRenterDto: CreateRenterDto,
  ): Promise<Renter> {
    validateObjectIdFormat(residenceId, 'Residence');

    // check residence is exist
    await this.residenceService.findOne(residenceId);


    // check renter username is exist
    await this.checkRenterUsernameExist(createRenterDto.email, residenceId);

    const createdRenter = await new this.renterModel({
      ...createRenterDto,
      username: createRenterDto.email,
      residence: residenceId,
      created_at: new Date(),
      updated_at: new Date(),
    }).save();

    // Save renter to residence
    await this.residenceService.addRenterToResidence(
      residenceId,
      createdRenter._id,
    );

    return createdRenter;
  }

  async signInRenter(
    residenceId: string,
    username: string,
    password: string,
  ): Promise<Renter> {
    validateObjectIdFormat(residenceId, 'Residence');

    const renter = await this.renterModel
      .findOne({
        residence: residenceId,
        username,
        password,
      })
      .exec();

    if (!renter) {
      throw new NotFoundException('Renter not found');
    }

    return renter;
  }

  async findAllRenterInResidence(residenceId: string): Promise<Renter[]> {
    validateObjectIdFormat(residenceId, 'Residence');

    return this.renterModel
      .find({
        residence: residenceId,
      })
      .populate({
        path: 'room',
        select: {
          _id: 1,
          name: 1,
        },
      })
      .exec();
  }

  async findOneRenter(renterId: string, isActive?: boolean): Promise<Renter> {
    validateObjectIdFormat(renterId, 'Renter');

    const filter = { _id: renterId };
    if (isActive) {
      filter['isActive'] = true;
    }

    const renter = await this.renterModel
      .findOne(filter)
      .populate({
        path: 'room',
        select: {
          _id: 1,
          name: 1,
        },
      })
      .exec();

    if (!renter) {
      throw new NotFoundException('Renter not found');
    }

    return renter;
  }

  async updateRenter(
    residenceId: string,
    renterId: string,
    updateRenterDto: UpdateRenterDto,
  ): Promise<Renter> {
    validateObjectIdFormat(renterId, 'Renter');
    validateObjectIdFormat(residenceId, 'Residence');

    // check residence is exist
    await this.residenceService.findOne(residenceId);

    // check renter is exist
    const renter = await this.findOneRenter(renterId);

    // Check renter is active or not
    if (!renter.isActive) {
      throw new BadRequestException(
        'Renter is inactive. Please reactive renter first.',
      );
    }

    // check renter username is exist in this residence except this renter
    this.checkRenterUsernameExist(
      updateRenterDto.email,
      residenceId,
      renterId,
    );

    // update renter
    const updatedRenter = await this.renterModel
      .findByIdAndUpdate(
        renterId,
        {
          ...updateRenterDto,
          username: updateRenterDto.email,
          updated_at: Date.now(),
        },
        { new: true },
      )
      .exec();
    return updatedRenter;
  }

  async deleteRenter(
    renterId: string,
    deleteType: 'soft' | 'hard',
  ): Promise<Renter> {
    const renter = await this.findOneRenter(renterId);

    if (renter.room) {
      throw new BadRequestException(
        'Renter is in room. Please remove renter from room first.',
      );
    }

    // delete renter
    if (deleteType === 'soft') {
      return this.renterModel.findByIdAndUpdate(renterId, {
        isActive: false,
      });
    } else {
      // delete renter in residence
      await this.residenceService.removeRenterFromResidence(
        renter.residence._id,
        renterId,
      );

      return this.renterModel.findByIdAndDelete(renterId).exec();
    }
  }

  async reactiveRenter(renterId: string): Promise<Renter> {
    validateObjectIdFormat(renterId, 'Renter');

    await this.findOneRenter(renterId);

    // reactive renter
    return this.renterModel
      .findByIdAndUpdate(renterId, {
        isActive: true,
      })
      .exec();
  }

  async addRoomToRenter(renterId: string, roomId: string): Promise<Renter> {
    // add room to renter
    return this.renterModel
      .findByIdAndUpdate(
        renterId,
        { room: roomId, updated_at: Date.now() },
        { new: true },
      )
      .exec();
  }

  async removeRoomFromRenter(renterId: string | Renter): Promise<Renter> {
    return this.renterModel
      .findByIdAndUpdate(renterId, { room: null }, { new: true })
      .exec();
  }
}
