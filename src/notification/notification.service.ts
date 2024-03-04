import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    private readonly mailService: MailService,
  ) { }

  async create(createNotificationDto: CreateNotificationDto) {
    const createdNotification = new this.notificationModel({
      ...createNotificationDto,
      created_at: new Date(),
      updated_at: new Date(),
    });

    if (createNotificationDto.isSentEmail) {
      // Send email
      const { toEmails, title, content } = createNotificationDto;

      for (const toEmail of toEmails) {
        this.mailService.sendNotification({ to: toEmail, title, content });
      }
    }
    return await createdNotification.save();
  }

  async createMany(createNotificationDto: CreateNotificationDto[]) {
    const createdNotification = await this.notificationModel.insertMany(
      createNotificationDto,
    );
    return createdNotification;
  }

  async findAll(): Promise<Notification[]> {
    const notifications = await this.notificationModel.find().exec();
    return notifications;
  }

  async findByTo(to: string): Promise<Notification[]> {
    const notifications = await this.notificationModel.find({ tos: to }).exec();
    return notifications;
  }
}
