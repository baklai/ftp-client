import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';

import appConfig from './config/configuration';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessTokenStrategy } from './common/strategies/accessToken.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig]
    }),
    JwtModule.register({ global: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'dist/client'),
      exclude: ['/(.*)']
    })
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService, AccessTokenStrategy]
})
export class AppModule {}
