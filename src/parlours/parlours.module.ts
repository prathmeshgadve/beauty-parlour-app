import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParloursController } from './parlours.controller';
import { ParloursService } from './parlours.service';
import { Parlour, ParlourSchema } from './schemas/parlour.schema';
import { ServicesModule } from 'src/services/services.module';
import { PackagesModule } from 'src/packages/packages.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Parlour.name, schema: ParlourSchema }]),
    ServicesModule,
    PackagesModule,
    StaffModule,
  ],
  controllers: [ParloursController],
  providers: [ParloursService],
  exports: [ParloursService],
})
export class ParloursModule {}