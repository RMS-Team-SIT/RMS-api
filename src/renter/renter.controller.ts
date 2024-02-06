import { Body, Controller, Delete, Get, Param, Post, Put, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RenterService } from "./renter.service";
import { ResidenceService } from "src/residence/residence.service";
import { CreateRenterDto } from "./dto/create-renter.dto";
import { Renter } from "./schemas/renter.schema";
import { UpdateRenterDto } from "./dto/update-renter.dto";

@ApiTags('Renter')
@Controller('/residence/:residenceId/renter')
@ApiBearerAuth()
export class RenterController {
    constructor(
        private readonly renterService: RenterService,
        private readonly residenceService: ResidenceService,
    ) { }

    @Post('')
    async createRenter(
        @Req() req,
        @Param('residenceId') residenceId: string,
        @Body() dto: CreateRenterDto,
    ): Promise<Renter> {
        const userId = req.user.id;

        await this.residenceService.checkOwnerPermission(userId, residenceId);

        return await this.renterService.createRenter(residenceId, dto);
    }

    @Get('')
    async findAllRenterInResidence(
        @Req() req,
        @Param('residenceId') residenceId: string,
    ): Promise<Renter[]> {
        const userId = req.user.id;

        await this.residenceService.checkOwnerPermission(userId, residenceId);

        return await this.renterService.findAllRenterInResidence(residenceId);
    }

    @Get('/:renterId')
    async findOneRenterInResidence(
        @Req() req,
        @Param('residenceId') residenceId: string,
        @Param('renterId') renterId: string,
    ): Promise<Renter> {
        const userId = req.user.id;

        await this.residenceService.checkOwnerPermission(userId, residenceId);

        return await this.renterService.findOneRenter(renterId);
    }

    @Put('/:renterId')
    async updateRenterInResidence(
        @Req() req,
        @Param('residenceId') residenceId: string,
        @Param('renterId') renterId: string,
        @Body() updateRenterDto: UpdateRenterDto,
    ): Promise<Renter> {
        const userId = req.user.id;

        await this.residenceService.checkOwnerPermission(userId, residenceId);

        return await this.renterService.updateRenter(residenceId, renterId, updateRenterDto);
    }

    @Put('/:renterId/reactive')
    async reactiveRenter(
        @Req() req,
        @Param('residenceId') residenceId: string,
        @Param('renterId') renterId: string,
    ): Promise<Renter> {
        const userId = req.user.id;

        await this.residenceService.checkOwnerPermission(userId, residenceId);

        return await this.renterService.reactiveRenter(renterId);
    }

    @Delete('/:renterId')
    async deleteRenterInResidence(
        @Req() req,
        @Param('residenceId') residenceId: string,
        @Param('renterId') renterId: string,
    ): Promise<Renter> {
        const userId = req.user.id;

        await this.residenceService.checkOwnerPermission(userId, residenceId);

        return await this.renterService.deleteRenter(renterId, "soft");
    }
}