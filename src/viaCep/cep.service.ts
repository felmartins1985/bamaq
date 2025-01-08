import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';

import axios from 'axios';
export class CepService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly address: number,
  ) {  }
  async getCep(address: number){
    try {
      const cachedCep = await this.cacheManager.get(`cep_${address}`);
      if (cachedCep) {
        return cachedCep;
      }
      const result = await axios.get(`https://viacep.com.br/ws/${address}/json/`)
      if(!result.data.cep) throw new NotFoundException('CEP not found');
      await this.cacheManager.set(`cep_${address}`, result.data, 60);
      return result.data;
    } catch (error) {
      throw new BadRequestException('API error');
    }
  }
}


