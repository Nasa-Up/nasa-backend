import { Module } from "@nestjs/common";
import { NasaController } from "./nasa.controller";
import { NasaService } from "./nasa.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [NasaController],
  providers: [NasaService],
})
export class NasaModule {}