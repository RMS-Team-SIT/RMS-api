import {
  Controller,
  Get,
  Post,
  HttpCode,
  Body,
  HttpStatus,
  Req,
  Put,
  Delete,
  Param,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ResidenceService } from './residence.service';
import { Residence } from './schemas/residence.schema';
import { CreateResidenceDto } from './dtos/create-residence.dto';
import { UpdateResidenceDto } from './dtos/update-residence.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Renter } from '../renter/schemas/renter.schema';
import { CreateRenterDto } from '../renter/dto/create-renter.dto';
import { UpdateRenterDto } from '../renter/dto/update-renter.dto';

@ApiTags('residence')
@ApiBearerAuth()
@Controller('residence')
export class ResidenceController {
  constructor(private readonly residenceService: ResidenceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createResidenceDto: CreateResidenceDto,
    @Req() req,
  ): Promise<Residence> {
    const userId = req.user.id;
    return await this.residenceService.create(userId, createResidenceDto);
  }

  @Get('/my')
  async findMyResidence(@Req() req): Promise<Residence[]> {
    const userId = req.user.id;
    try {
      return await this.residenceService.findMyResidence(userId);
    } catch (err) {
      console.log(err);
      throw new NotFoundException('Residence not found');
    }
  }

  @Get(':residenceId')
  async findOne(@Param('residenceId') id: string): Promise<Residence> {
    return await this.residenceService.findOne(id);
  }

  @Put(':residenceId')
  async update(
    @Req() req,
    @Param('residenceId') id: string,
    @Body() updateResidenceDto: UpdateResidenceDto,
  ): Promise<Residence> {
    const userId = req.user.id;
    const residence = await this.residenceService.findOne(id);

    await this.checkResidenceOwnership(userId, residence);

    if (residence.owner._id.toString() !== userId.toString()) {
      throw new ForbiddenException();
    }
    return await this.residenceService.update(id, updateResidenceDto);
  }

  // @Delete(':residenceId')
  // async delete(@Req() req, @Param('id') id: string): Promise<Residence> {
  //   const userId = req.user.id;
  //   const residence = await this.residenceService.findOne(id);

  //   await this.checkResidenceOwnership(userId, residence);

  //   return await this.residenceService.delete(id);
  // }

  private async checkResidenceOwnership(userId: string, residence: Residence) {
    if (!residence || residence.owner._id.toString() !== userId.toString()) {
      throw new ForbiddenException();
    }
  }
}
