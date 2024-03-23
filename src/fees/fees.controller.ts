import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeesService } from './fees.service';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { CreateFeeDto } from './dto/create-fee.dto';

@Controller('/residence/:residenceId/fees')
@ApiTags('fees')
export class FeesController {
    constructor(private readonly feesService: FeesService) {
    }

    @Post('/bulk')
    async createMany(
        @Param('residenceId') residenceId: string,
        @Body() createFeeDto: CreateFeeDto[]) {
        return await this.feesService.createMany(residenceId, createFeeDto);
    }

    @Get('')
    async findAll(
        @Param('residenceId') residenceId: string) {
        return await this.feesService.findAll(residenceId);
    }

    @Get('/:feeId')
    async findOne(
        @Param('residenceId') residenceId: string,
        @Param('feeId') feeId: string) {
        return await this.feesService.findOne(residenceId, feeId);
    }

    @Put('/:feeId')
    async update(
        @Param('residenceId') residenceId: string,
        @Param('feeId') feeId: string,
        @Body() updateFeeDto: UpdateFeeDto
    ) {
        return await this.feesService.update(residenceId, feeId, updateFeeDto);
    }

    @Delete('/:feeId')
    async remove(
        @Param('residenceId') residenceId: string,
        @Param('feeId') feeId: string) {
        return await this.feesService.remove(residenceId, feeId);
    }
}
