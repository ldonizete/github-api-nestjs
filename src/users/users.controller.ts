// user.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException  } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs/internal/Observable';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService,private readonly httpService: HttpService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  @Post('create')
  async create(@Body() userData: Partial<User>): Promise<User> {
    const githubUsername = userData.userTag; 
    const githubUser = await this.httpService.get(`https://api.github.com/users/${githubUsername}`).toPromise()
    
    const { name, login, followers, following, public_repos, bio, twitter_username, company, blog, avatar_url } = githubUser.data;
    
    const newUser = await this.userService.create({
        name,
        userTag: login,
        followers,
        following,
        repositories: public_repos,
        biography: bio,
        email: userData.email, // Usar o email fornecido no corpo da requisição
        twitter: twitter_username,
        companyName: company,
        website: blog,
        password: userData.password, // Usar a senha fornecida no corpo da requisição
        avatar_url
      });    

    return this.userService.create(newUser);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(+id);
  }

  @Put('update/:id')
  async update(@Param('id') id: number, @Body() userData: Partial<User>): Promise<User> {
    // Verificar se o usuário com o ID fornecido existe
    const existingUser = await this.userService.findOne(id);
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Atualizar os campos fornecidos no corpo da requisição
    const updatedUser = await this.userService.update(id, userData);

    return updatedUser;
  }

  @Post('repositories')
  async getUserRepositories(@Body() userData: { username: string }): Promise<any> {
    const { username } = userData;

    try {
      const repositories = await this.userService.getUserRepositories(username);

      return {
        totalRepositories: repositories.length,
        repositories,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new NotFoundException('Usuário não encontrado no GitHub');
      }
    }
  }

  @Post('userinfo')
  async getUserInfo(@Body() userData: { username: string }): Promise<any> {
    const { username } = userData;

    try {
       return await this.userService.getUserInfo(username);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new NotFoundException('Usuário não encontrado no GitHub');
      }
    }
  }
}
