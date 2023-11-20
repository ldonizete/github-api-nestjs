// user.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, UseGuards  } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { HttpService } from '@nestjs/axios';
import { AuthGuard } from '../auth/auth.guard';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService,private readonly httpService: HttpService) {}
  
  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
  
  @UseGuards(AuthGuard)
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
        email: userData.email, 
        twitter: twitter_username,
        companyName: company,
        website: blog,
        password: userData.password, 
        avatar_url
      });    

    return this.userService.create(newUser);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Put('update/:id')
  async update(@Param('id') id: number, @Body() userData: Partial<User>): Promise<User> {
    const existingUser = await this.userService.findOne(id);
    
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const updatedUser = await this.userService.update(id, userData);

    return updatedUser;
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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
