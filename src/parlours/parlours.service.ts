import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateParlourDto } from './dto/create-parlour.dto';
import { UpdateParlourDto } from './dto/update-parlour.dto';
import { Parlour } from './schemas/parlour.schema';
import { STATUS_CODES } from 'http';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ParloursService {
  constructor(@InjectModel(Parlour.name) private parlourModel: Model<Parlour>) { }

  /**
   * 
   * @param createParlourDto 
   * @returns 
   */
  @UseGuards(AuthGuard('jwt'))
  async create(createParlourDto: CreateParlourDto): Promise<Parlour> {
    const createParlor = new this.parlourModel(createParlourDto);
    return createParlor.save();
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  async findOne(id: string): Promise<Parlour> {
    try {
      const parlour = await this.parlourModel.findById(id)
        .populate('servicess')
        .populate('packages')
        .populate('staff')
        .exec();
      if (!parlour) throw new NotFoundException('Parlour not found');
      return parlour
    } catch (error) {
      const errorData = {
        error: JSON.stringify(error),
        msg: "SomeThings wet wrong ",
        Status: 500
      }

      error =errorData;
      return error
    }
  }

  /**
   * The findNearby method is an asynchronous function 
   * that queries a MongoDB database to find parlours (likely beauty salons or similar establishments) 
   * near a specified geographic location (defined by longitude lng and latitude lat) 
   * within a given maxDistance. 
   * It also applies optional filters based on service type and price range.
   *  The method returns a promise that resolves to an array of Parlour objects.
   * @param lng 
   * @param lat 
   * @param maxDistance 
   * @param filters 
   * @returns 
   */
  async findNearby(lng: number, lat: number, maxDistance: number,
    filters: { service?: string; minPrice?: number; maxPrice?: number }): Promise<Parlour[]> {
    const query: any = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
            $maxDistance: maxDistance
          }
        }
      }
    }

    if (filters.service) {
      query.services = { $in: [filters.service] }
    }
    if (filters.minPrice || filters.maxPrice) {
      query['packages.price'] = {};
      if (filters.minPrice) query['packages.price'].$gte = filters.minPrice;
      if (filters.maxPrice) query['packages.price'].$lte = filters.maxPrice;
    }

    return await this.parlourModel.find(query)
      .populate('services')
      .populate('packages')
      .exec();
  }
  /**
   * 
   * @param id 
   * @param updateParlourDto 
   * @returns 
   */
  async update(id: string, updateParlourDto: UpdateParlourDto): Promise<Parlour> {
    const parlour = await this.parlourModel.findByIdAndUpdate(id, updateParlourDto, { new: true }).exec();
    if (!parlour) throw new NotFoundException('Parlour not found');
    return parlour;
  }

  /**
   * 
   * @param parlourId 
   * @param packageId 
   * @param serviceId 
   * @param updateData 
   * @returns 
   */
  async updateNestedService(parlourId: string, packageId: string, serviceId: string, updateData: any) {
    const result = await this.parlourModel.updateOne(
      { _id: parlourId, 'packages._id': packageId },
      { $set: { 'packages.$.services.$[service].price': updateData.price } },
      { arrayFilters: [{ 'service._id': serviceId }] },
    ).exec();
    if (result.modifiedCount === 0) throw new NotFoundException('Service or package not found');
    return result;
  }

}