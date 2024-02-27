import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Notification, NotificationSchema } from "./schemas/notification.schema";
import { NotificationService } from "./notification.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Notification.name, schema: NotificationSchema }
        ])
    ],
    exports: [NotificationService],
    providers: [NotificationService],
    controllers: [],
})
export class NotificationModule { }