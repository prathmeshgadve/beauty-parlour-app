import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { ParloursModule } from 'src/parlours/parlours.module';
import { Parlour, ParlourSchema } from 'src/parlours/schemas/parlour.schema';

@Module({
  imports: [
    ParloursModule,
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema },{ name: Parlour.name, schema: ParlourSchema }]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}