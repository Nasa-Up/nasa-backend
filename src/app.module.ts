import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NasaModule } from './nasa/nasa.module';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    NasaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}