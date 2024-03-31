import { Module } from "@nestjs/common";
import { InjectConnection, MongooseModule } from "@nestjs/mongoose";
import { RMSConfig, RMSConfigSchema } from "./schemas/rms-config.schema";
import { RMSConfigController } from "./rms-config.controller";
import { RMSConfigService } from "./rms-config.service";
import { Connection, Types } from "mongoose";
import * as RMSConfigData from '../data/rms_config_data.json';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: RMSConfig.name, schema: RMSConfigSchema }
        ])
    ],
    controllers: [
        RMSConfigController
    ],
    providers: [
        RMSConfigService
    ],
    exports: [
        RMSConfigService
    ]
})
export class RMSConfigModule {
    @InjectConnection() private connection: Connection;

    async onModuleInit() {
        try {
            console.log('RMSConfigModule initialized');
            await this.initRMSConfig();
        } catch (error) {
            console.error('Error initializing RMSConfigModule:', error);
        }
    }

    private async initRMSConfig() {
        const rmsConfigCollection = this.connection.collection('rmsconfigs');
        const count = await rmsConfigCollection.countDocuments();

        if (count === 0) {
            console.log('\n\nInitializing config from JSON file...');
            for (const config of RMSConfigData) {
                const objId = new Types.ObjectId(config.objId);
                await rmsConfigCollection.insertOne({
                    _id: objId,
                    ...config,
                });
            }
            console.log('RMS Config initialized successfully.\n\n');
        } else {
            console.log('RMS Config already exists.');
        }
    }
}
