import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Notification, NotificationSchema } from "./schemas/notification.schema";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { MailModule } from "src/mail/mail.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Notification.name, schema: NotificationSchema }
        ]),
        MailModule
    ],
    exports: [NotificationService],
    providers: [NotificationService],
    controllers: [NotificationController],
})
export class NotificationModule { }