import {
  Controller,
  Get,
  Post,
  HttpCode,
  Body,
  HttpStatus,
  Req,
  Put,
  Param,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ResidenceService } from './residence.service';
import { Residence } from './schemas/residence.schema';
import { CreateResidenceDto } from './dtos/create-residence.dto';
import { UpdateResidenceDto } from './dtos/update-residence.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/user-role.decorator';
import { UserRole } from 'src/auth/enum/user-role.enum';
import { ResponseResidenceOverallStatsDto } from './dtos/response-residence-overallstats.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { CreateResidenceFullyDto } from './dtos/create-residence-fully.dto';

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

  @Post('/fully')
  @HttpCode(HttpStatus.CREATED)
  async createFully(
    @Body() createResidenceFullyDto: CreateResidenceFullyDto,
    @Req() req,
  ): Promise<Residence> {
    const userId = req.user.id;
    return await this.residenceService.createFully(
      userId,
      createResidenceFullyDto,
    );
  }

  @Get('/overall-stats')
  @Roles(UserRole.ADMIN)
  async overallStats() {
    return this.residenceService.overAllStats();
  }

  @Get('/pending-approve')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  async getPending() {
    return this.residenceService.findPendingResidence();
  }

  @Roles(UserRole.ADMIN)
  @Get('/approve/:residenceId')
  @HttpCode(HttpStatus.OK)
  async approve(
    @Req() req,
    @Param('residenceId') residenceId: string,
  ): Promise<object> {
    return this.residenceService.approveResidence(residenceId);
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

  @Get('/:residenceId')
  async findOne(@Param('residenceId') id: string): Promise<Residence> {
    return await this.residenceService.findOne(id);
  }

  @Get('/:residenceId/public')
  @Public()
  async findOnePublic(@Param('residenceId') id: string): Promise<Residence> {
    return await this.residenceService.findOnePublic(id);
  }

  @Put('/:residenceId')
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
      throw new ForbiddenException({
        message: 'You are not the owner of this residence',
      });
    }
  }
}
