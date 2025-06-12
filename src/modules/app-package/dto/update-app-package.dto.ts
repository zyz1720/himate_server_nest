import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { AddAppPackageDto } from './add-app-package.dto';

// PartialType继承了AddAppPackageDto的所有属性，并会变为可选属性,需要完全继承则使用 OmitType(dto, [])等。
export class UpdateAppPackageDto extends PartialType(AddAppPackageDto) {
  @ApiProperty({ description: '应用包id', required: true })
  @IsNotEmpty({ message: '缺少应用包id' })
  id: number;
}
