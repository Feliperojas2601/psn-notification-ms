import {
  IsDefined,
  IsInt,
  IsPositive,
  IsString,
  Min,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateNotificationDto {
  @IsDefined()
  @IsInt()
  @IsPositive()
  @Min(1)
  actorId: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  actorName: string;

  @IsDefined()
  @IsInt()
  @IsPositive()
  @Min(1)
  notifierId: number;

  @IsDefined()
  @IsString()
  @MinLength(1)
  type: string;
}
