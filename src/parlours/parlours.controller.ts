import { Controller, Post, Body, Get, Param, Put, UseGuards, Query } from '@nestjs/common';
import { ParloursService } from './parlours.service';
import { CreateParlourDto } from './dto/create-parlour.dto';
import { UpdateParlourDto } from './dto/update-parlour.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('parlours')
export class ParloursController {
    constructor(private readonly parloursService: ParloursService) { }

    @Post('register')
    @UseGuards()
    async register(@Body() createParlourDto: CreateParlourDto) {
        return this.parloursService.create(createParlourDto);
    }

    @Get('nearby')
    async findNearby(
        @Query('lng') lng: number,
        @Query('lat') lat: number,
        @Query('maxDistance') maxDistance: number,
        @Query('service') service?: string,
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number,
    ) {
        return this.parloursService.findNearby(lng, lat, maxDistance, { service, minPrice, maxPrice });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.parloursService.findOne(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id: string, @Body() updateParlourDto: UpdateParlourDto) {
        return this.parloursService.update(id, updateParlourDto);
    }
}