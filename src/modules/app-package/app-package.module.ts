import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppPackageController } from './app-package.controller';
import { AppAppPackageController } from './app-app-package.controller';
import { AppPackageService } from './app-package.service';
import { AppPackageEntity } from './entity/app-package.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppPackageEntity])],
  controllers: [AppPackageController, AppAppPackageController],
  providers: [AppPackageService],
  exports: [AppPackageService],
})
export class AppPackageModule {}
