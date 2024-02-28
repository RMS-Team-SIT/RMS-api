import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Notification } from "./schemas/notification.schema";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<Notification>,
        private readonly mailService: MailService,
    ) { }

    async create(createNotificationDto: CreateNotificationDto) {
        const createdNotification = new this.notificationModel({ ...createNotificationDto });

        if (createNotificationDto.isSentEmail) {
            // Send email
            const { to, title, content } = createNotificationDto;
            await this.mailService.sendNotification({ to, title, content });
        }

        return await createdNotification.save();
    }

    async createMany(createNotificationDto: CreateNotificationDto[]) {
        const createdNotification = await this.notificationModel.insertMany(createNotificationDto);
        return createdNotification;
    }

    async findAll(): Promise<Notification[]> {
        const notifications = await this.notificationModel.find().exec();
        return notifications;
    }

    async findByTo(to: string): Promise<Notification[]> {
        const notifications = await this.notificationModel.find({ to }).exec();
        return notifications;
    }
}
