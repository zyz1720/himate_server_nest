import { Module } from '@nestjs/common';
import { AppPackageController } from './app-package.controller';
import { AppPackageService } from './app-package.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appPackageEntity } from 'src/entities/app-package.entity';

@Module({
  imports: [TypeOrmModule.forFeature([appPackageEntity])],
  controllers: [AppPackageController],
  providers: [AppPackageService],
  exports: [AppPackageService],
})
export class AppPackageModule {}
