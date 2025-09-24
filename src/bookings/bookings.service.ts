import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './schemas/booking.schema';
import { Parlour } from 'src/parlours/schemas/parlour.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Parlour.name) private parlourModel: Model<Parlour>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const createdBooking = new this.bookingModel(createBookingDto);
    return createdBooking.save();
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.bookingModel.findByIdAndUpdate(id, updateBookingDto, { new: true }).exec();
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async getAvailableSlots(parlourId: string, date: Date): Promise<{ start: Date; end: Date }[]> {
    const parlour = await this.parlourModel.findById(parlourId).populate('staff').exec();
    if (!parlour) throw new NotFoundException('Parlour not found');

    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const bookings = await this.bookingModel.find({
      parlour: parlourId,
      appointmentTime: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).exec();

    const bookedTimes = bookings.map(b => b.appointmentTime);

    const availableSlots = parlour.staff.flatMap(staff =>
      staff.schedule.filter(slot =>
        slot.start >= startOfDay &&
        slot.start <= endOfDay &&
        !bookedTimes.some(bt => bt.getTime() === slot.start.getTime())
      )
    );

    return availableSlots;
  }

  async getPopularServices(): Promise<any> {
    return this.bookingModel.aggregate([
      { $unwind: '$services' },
      { $group: { _id: '$services', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $project: { _id: 0, service: '$service.name', count: 1 } },
    ]).exec();
  }

  async getCustomerPreferences(customerId: string): Promise<any> {
    return this.bookingModel.aggregate([
      { $match: { customer: customerId } },
      { $unwind: '$services' },
      { $group: { _id: '$services', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $project: { _id: 0, service: '$service.name', count: 1 } },
    ]).exec();
  }
}