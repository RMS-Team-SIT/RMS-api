import { Body, Controller, Get, Param, Post, Put, Req, UnauthorizedException } from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dtos/create-rental.dto';
import { ResidentService } from 'src/resident/resident.service';
import { Rental } from './schemas/rental.schema';
import { ApiTags } from '@nestjs/swagger';

@Controller('rental')
@ApiTags('rental')
export class RentalController {
    constructor(
        private readonly rentalService: RentalService,
        private readonly residentService: ResidentService,
    ) { }

    @Post("/create/:residentId")
    async createRental(
        @Req() req,
        @Param("residentId") residentId: string,
        @Body() dto: CreateRentalDto,
    ): Promise<Rental> {
        const userId = req.user.id;
        
        // check permission req.user is onwer of resident or not ?
        const resident = await this.residentService.findOne(residentId);
        if (resident.owner._id.toString() != userId.toString()) {
            throw new UnauthorizedException("You are not owner of this resident");
        }

        return await this.rentalService.create(residentId, dto);
    }

    @Get()
    async findAllRental(): Promise<Rental[]> {
        return await this.rentalService.findAll();
    }

    @Get("/:id")
    async findOneRental(@Param("id") id: string): Promise<Rental> {
        return await this.rentalService.findOne(id);
    }

    @Put("/update/:id")
    async updateRental() {
    }
}
