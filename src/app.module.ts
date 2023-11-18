import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { HistoricModule } from './historic/historic.module';
import { Historic } from './historic/historic.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'desafiodb',
    entities: [User, Historic],
    synchronize: true,
  }), UsersModule, AuthModule, HistoricModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
