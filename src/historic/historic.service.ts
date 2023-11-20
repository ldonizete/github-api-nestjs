import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historic } from './historic.entity';

@Injectable()
export class HistoricService {
  constructor(
    @InjectRepository(Historic)
    private readonly historicRepository: Repository<Historic>,
  ) {}

  async create(data: Partial<Historic>): Promise<Historic> {
    const newHistoric = this.historicRepository.create(data);
    return this.historicRepository.save(newHistoric);
  }

  async findLastTwenty(): Promise<Historic[]> {
    return this.historicRepository.find({
      order: {
        date: 'DESC', 
      },
      take: 20, 
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.historicRepository.delete(id);
    return result.affected !== 0;
  }
}
