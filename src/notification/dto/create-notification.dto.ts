import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tos?: string[];
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  toRenters?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  toEmails?: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isRead: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isSentEmail: boolean;
}
