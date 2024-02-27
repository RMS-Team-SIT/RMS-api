import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Notification } from "./schemas/notification.schema";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<Notification>
    ) { }

    async create(createNotificationDto: CreateNotificationDto) {
        const createdNotification = new this.notificationModel({ ...createNotificationDto });
        return await createdNotification.save();
    }

    async findAll(): Promise<Notification[]> {
        const notifications = await this.notificationModel.find().exec();
        return notifications;
    }
}
