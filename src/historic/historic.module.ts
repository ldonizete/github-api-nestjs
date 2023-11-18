import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { HistoricService } from './historic.service';
import { HistoricController } from './historic.controller';
import { Historic } from './historic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Historic]), HttpModule],
  providers: [HistoricService],
  controllers: [HistoricController],
  exports: [HistoricService],
})
export class HistoricModule {}