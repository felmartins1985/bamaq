import { Module } from '@nestjs/common';
import { CepController } from './cep.controller';
import { CepService } from './cep.service';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [CacheModule.register({
    ttl: 60,
    max: 10,
  })],
  controllers: [CepController],
  providers: [CepService],
  exports: [CepService],
})
export class CepModule {}