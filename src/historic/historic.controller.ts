import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { HistoricService } from './historic.service';
import { Historic } from './historic.entity';

@Controller('historic')
export class HistoricController {
  constructor(private readonly historicService: HistoricService) {}

  @Post()
  async create(@Body() historicData: Partial<Historic>): Promise<Historic> {

    const data = {
        date: new Date(), 
        username: historicData.username,
        sessionUsername: historicData.sessionUsername,
        status: historicData.status,
        repositories: historicData.repositories
      };

    return this.historicService.create(data);
  }

  @Get('lastTwenty')
  async findLastTwenty(): Promise<Historic[]> {
    return this.historicService.findLastTwenty();
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<boolean> {
    return this.historicService.delete(id);
  }
}