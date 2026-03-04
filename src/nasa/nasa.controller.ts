import { Controller, Get, Param, Query } from "@nestjs/common";
import { EpicImageResponse, NasaService } from "./nasa.service";

@Controller('nasa/epic')
export class NasaController {
    constructor(private readonly nasaService: NasaService) {}

    @Get('latest')
    async getLatestImages(
        @Query('collection') collection: string = 'natural',
    ): Promise<EpicImageResponse[]> {
        return this.nasaService.getLatestImages(collection);
    }
    
    @Get('dates')
    async getAvailableDates(
        @Query('collection') collection: string = 'natural',
    ): Promise<{ date: string}[]> {
        return this.nasaService.getAvailableDates(collection);
    }

    @Get('date/:date')
    async getImagesByDate(
        @Param('date') date: string,
        @Query('collection') collection: string = 'natural',
    ): Promise<EpicImageResponse[]> {
        return this.nasaService.getImagesByDate(date, collection);
    }
}