import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { validateObjectIdFormat } from 'src/utils/mongo.utils';
import { CreateResidencePaymentDto } from './dto/create-residence-payment.dto';
import { BankService } from 'src/bank/bank.service';
import { ResidenceService } from 'src/residence/residence.service';
import { UpdateResidencePaymentDto } from './dto/update-residence-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    private readonly bankService: BankService,
    @Inject(forwardRef(() => ResidenceService))
    private readonly residenceService: ResidenceService,
  ) { }

  async createPayment(
    residenceId: string,
    createResidencePaymentDto: CreateResidencePaymentDto,
  ): Promise<Payment> {
    // Check if bank exists
    const bank = await this.bankService.findOne(
      createResidencePaymentDto.bankId,
    );
    if (!bank) {
      throw new BadRequestException('Bank not found');
    }

    // Check if residence exists
    await this.residenceService.findOne(residenceId);

    const createdPayment = await new this.paymentModel({
      ...createResidencePaymentDto,
      bank: createResidencePaymentDto.bankId,
      residence: residenceId,
    }).save();

    await this.residenceService.addPaymentToResidence(
      residenceId,
      createdPayment._id,
    );

    return createdPayment;
  }

  async createMany(
    residenceId: string,
    createResidencePaymentDto: CreateResidencePaymentDto[],
  ): Promise<Payment[]> {

    const createdFees = createResidencePaymentDto.map(dto => {
      return new this.paymentModel({
        residence: residenceId,
        ...dto
      });

    });
    return this.paymentModel.insertMany(createdFees);
  }

  async findAllPaymentInResidence(residenceId: string): Promise<Payment[]> {
    validateObjectIdFormat(residenceId, 'Residence');
    const payments = await this.paymentModel
      .find({ residence: residenceId })
      .exec();
    return payments;
  }

  async findOnePaymentInResidence(
    residenceId: string,
    paymentId: string,
  ): Promise<Payment> {
    validateObjectIdFormat(residenceId, 'Residence');
    validateObjectIdFormat(paymentId, 'Payment');

    const payment = await this.paymentModel
      .findOne({ _id: paymentId, residence: residenceId })
      .exec();

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async updatePaymentInResidence(
    residenceId: string,
    paymentId: string,
    updateResidencePaymentDto: UpdateResidencePaymentDto,
  ): Promise<Payment> {
    validateObjectIdFormat(residenceId, 'Residence');
    validateObjectIdFormat(paymentId, 'Payment');

    const payment = await this.paymentModel
      .findOne({ _id: paymentId, residence: residenceId })
      .exec();

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const updatedPayment = await this.paymentModel.findByIdAndUpdate(
      paymentId,
      {
        ...updateResidencePaymentDto,
        updated_at: Date.now(),
      },
      { new: true },
    );

    return updatedPayment;
  }
}
