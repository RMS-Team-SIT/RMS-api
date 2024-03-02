import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ResponseResidenceOverallStatsDto {
  totalResidences: number;
  totalRooms: number;
  totalRenters: number;
  totalApprovedResidences: number;
  totalPendingResidences: number;
  totalRejectedResidences: number;
}
