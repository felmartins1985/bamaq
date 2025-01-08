import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import globalConfig from 'src/global-config/global-config';
import { GlobalConfigModule } from 'src/global-config/global-config.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CepModule } from 'src/viaCep/cep.module';
import { CepService } from 'src/viaCep/cep.service';
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 10000, // time to live em ms
        limit: 10, // máximo de requests durante o ttl
        blockDuration: 5000, // tempo de bloqueio
      },
    ]), // para cada 10 segundos, uma pessoa pode fazer 10 requisicoes, no maximo. Se passar disso, bloqueio por 5 segundos
    ConfigModule.forFeature(globalConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(globalConfig)],
      inject: [globalConfig.KEY],
      useFactory: async (
        globalConfigurations: ConfigType<typeof globalConfig>,
      ) => {
        return {
          type: globalConfigurations.database.type,
          host: globalConfigurations.database.host,
          port: globalConfigurations.database.port,
          username: globalConfigurations.database.username,
          database: globalConfigurations.database.database,
          password: globalConfigurations.database.password,
          autoLoadEntities: globalConfigurations.database.autoLoadEntities,
          synchronize: globalConfigurations.database.synchronize,
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', '..', 'pictures'),
      serveRoot: '/pictures',
    }),
    CepModule,
    GlobalConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CepService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [],
})
export class AppModule {}

