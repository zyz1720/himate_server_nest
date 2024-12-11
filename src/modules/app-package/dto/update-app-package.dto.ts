import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { AddAppPackageDto } from './add-app-package.dto';

export class UpdateAppPackageDto extends PartialType(AddAppPackageDto) {
  @ApiProperty({ description: '应用包id', required: true })
  @IsNotEmpty({ message: '缺少应用包id' })
  @IsNumber()
  id: number;
}
