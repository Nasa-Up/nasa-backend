import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

export interface EpicImage {
    identifier: string;
    caption: string;
    image: string;
    date: string;
    version: string;
    centroid_coordinates: {
        lat: number;
        lon: number;
    };
    dscovr_j2000_position: {
        x: number;
        y: number;
        z: number;
    };
    lunar_j2000_position: {      // posición de la Luna en espacio
        x: number;
        y: number;
        z: number;
    };
    sun_j2000_position: {
        x: number;
        y: number;
        z: number;
    };
    attitude_quaternions: {
        q0: number;
        q1: number;
        q2: number;
        q3: number;
    };
    coords: {                    // objeto coords completo que devuelve la API
        centroid_coordinates: { lat: number; lon: number };
        dscovr_j2000_position: { x: number; y: number; z: number };
        lunar_j2000_position:  { x: number; y: number; z: number };
        sun_j2000_position:    { x: number; y: number; z: number };
        attitude_quaternions:  { q0: number; q1: number; q2: number; q3: number };
    };
}

export interface EpicImageResponse extends EpicImage {
    imageUrl: string;
}

@Injectable()
export class NasaService {

    private readonly baseUrl: string;
    private readonly imageBaseUrl: string;
    private readonly apikey: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.baseUrl = this.configService.get<string>('nasaEpicBaseUrl')!;
        this.imageBaseUrl = this.configService.get<string>('nasaEpicImageUrl')!;
        this.apikey = this.configService.get<string>('nasaApiKey')!;
    }

    private buildImageUrl(image: EpicImage, collection: string): string {
        const datePart = image.date.split(' ') [0];
        const [year, month, day] = datePart.split('-');

        return `${this.imageBaseUrl}/${collection}/${year}/${month}/${day}/png/${image.image}.png`
    }

    async getLatestImages(collection: string = 'natural'): Promise<EpicImageResponse[]> {
        try {
            const url = `${this.baseUrl}/${collection}`;
            const response = await firstValueFrom(
                this.httpService.get<EpicImage[]>(url)
            );

            return response.data.map((image) => ({
                ...image,
                imageUrl: this.buildImageUrl(image, collection)
            }));

        } catch (error) {
            throw new HttpException(
                'Error al obtener imágenes',
                HttpStatus.BAD_GATEWAY,
            );
        }
    }

    async getAvailableDates(collection: string = 'natural'): Promise<{ date: string }[]> {
        try {
            const url = `${this.baseUrl}/${collection}/all`;
            const response = await firstValueFrom(
                this.httpService.get<{ date: string }[]>(url),
            );

            return response.data;

            } catch (error) {
            throw new HttpException(
                'Error al obtener fechas disponibles',
                HttpStatus.BAD_GATEWAY,
            );
        }
    }

    async getImagesByDate(date: string, collection: string = 'natural'): Promise<EpicImageResponse[]> {
        try {
            const url = `${this.baseUrl}/${collection}/date/${date}`;
            const response = await firstValueFrom(
                this.httpService.get<EpicImage[]>(url),
            );
        
            return response.data.map((image) => ({
                ...image,
                imageUrl: this.buildImageUrl(image, collection),
            }));

        } catch (error) {
            throw new HttpException(
                `Error al obtener imágenes de la fecha ${date}`,
                HttpStatus.BAD_GATEWAY,
            );
        }
    }
}