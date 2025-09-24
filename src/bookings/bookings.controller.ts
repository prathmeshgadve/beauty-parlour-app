import { Controller, Post, Body, Get, Param, Put, UseGuards, Query } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Get('available-slots/:parlourId')
  async getAvailableSlots(
    @Param('parlourId') parlourId: string,
    @Query('date') date: string,
  ) {
    return this.bookingsService.getAvailableSlots(parlourId, new Date(date));
  }

  @Get('popular-services')
  async getPopularServices() {
    return this.bookingsService.getPopularServices();
  }

  @Get('customer-preferences/:customerId')
  async getCustomerPreferences(@Param('customerId') customerId: string) {
    return this.bookingsService.getCustomerPreferences(customerId);
  }
}