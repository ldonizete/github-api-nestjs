import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly httpService: HttpService
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  async update(id: number, newData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, newData);
    return this.usersRepository.findOneBy({ id });
  }

  async getUserRepositories(username: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.httpService
        .get(`https://api.github.com/users/${username}/repos`)
        .toPromise();

      const repositories = response.data.map(repo => ({
        name: repo.name,
        description: repo.description || 'Sem descrição',
        language: repo.language || 'Não especificada',
        link: repo.html_url,
      }));

      return {
        totalRepositories: repositories.length,
        repositories,
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new NotFoundException('Usuário não encontrado no GitHub');
      } else {
        throw error;
      }
    }
  }

  async getUserInfo(username: string): Promise<any[]> {
    try {
      const response: AxiosResponse<any> = await this.httpService
        .get(`https://api.github.com/users/${username}`)
        .toPromise();

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new NotFoundException('Usuário não encontrado no GitHub');
      } else {
        throw error;
      }
    }
  }
}