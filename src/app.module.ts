import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ParloursModule } from './parlours/parlours.module';
import { BookingsModule } from './bookings/bookings.module';
import { StaffModule } from './staff/staff.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { PackagesModule } from './packages/packages.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/beauty-parlour-db'),
    UsersModule,
    ParloursModule,
    ServicesModule,
    PackagesModule,
    BookingsModule,
    StaffModule,
    AuthModule,
  ],
})
export class AppModule {}