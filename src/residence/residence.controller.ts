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
import { UpdateUtilityDto } from './dtos/update-utility.dto';

@ApiTags('residence')
@ApiBearerAuth()
@Controller('residence')
export class ResidenceController {
  constructor(private readonly residenceService: ResidenceService) { }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createFully(
    @Body() createResidenceFullyDto: CreateResidenceFullyDto,
    @Req() req,
  ): Promise<Residence> {
    const userId = req.user.id;
    return await this.residenceService.create(
      userId,
      createResidenceFullyDto,
    );
  }

  @Put('/:residenceId/utility')
  @HttpCode(HttpStatus.OK)
  async updateUtility(
    @Req() req,
    @Param('residenceId') id: string,
    @Body() updateUtilDto: UpdateUtilityDto,
  ): Promise<Residence> {
    const userId = req.user.id;
    const userRole = req.user.roles[0];
    const residence = await this.residenceService.findOne(id);

    await this.checkResidenceOwnership(userId, residence, userRole);

    if (residence.owner._id.toString() !== userId.toString()) {
      throw new ForbiddenException();
    }
    return await this.residenceService.updateUtility(id, updateUtilDto);
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
  async findOne(@Req() req: any, @Param('residenceId') id: string): Promise<Residence> {
    const userId = req.user.id;
    const userRole = req.user.roles[0];
    const residence = await this.residenceService.findOne(id);

    await this.checkResidenceOwnership(userId, residence, userRole);

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
    const userRole = req.user.roles[0];
    const residence = await this.residenceService.findOne(id);

    await this.checkResidenceOwnership(userId, residence, userRole);

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

  private async checkResidenceOwnership(userId: string, residence: Residence, role?: UserRole) {
    if (!residence) {
      throw new NotFoundException({
        message: 'Residence not found',
      });
    }

    if (role && role === UserRole.ADMIN) return;

    if (residence.owner._id.toString() !== userId.toString()) {
      throw new ForbiddenException({
        message: 'You are not the owner of this residence',
      });
    }
  }
}
