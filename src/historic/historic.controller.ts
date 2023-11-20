import { Controller, Post, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { HistoricService } from './historic.service';
import { Historic } from './historic.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('historic')
export class HistoricController {
  constructor(private readonly historicService: HistoricService) {}
  
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() historicData: Partial<Historic>): Promise<Historic> {

    const data = {
        date: new Date(), 
        username: historicData.username,
        sessionUsername: historicData.sessionUsername || '',
        status: historicData.status,
        repositories: historicData.repositories
      };

    return this.historicService.create(data);
  }

  @UseGuards(AuthGuard)
  @Get('lastTwenty')
  async findLastTwenty(): Promise<Historic[]> {
    return this.historicService.findLastTwenty();
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<boolean> {
    return this.historicService.delete(id);
  }
}