import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';

import { createMockCacheService } from '../cache/factories';
import { createMockCounterService } from '../counter/factories';
import { createMockSymbolService } from '../crypto-symbol/factories';
import { createMockHttpService, createMockRepo } from './factories';

import { CryptoService } from '../../modules/crypto/crypto.service';
import { CacheService } from '../../modules/cache/cache.service';
import { CryptoSymbolsService } from '../../modules/crypto-symbols/crypto-symbols.service';
import { RegisterCounterService } from '../../modules/core/register-counter.service';

export async function createTestCryptoService(overrides: { providers?: any[] } = {}) {
  const http = createMockHttpService();
  const cacheService = createMockCacheService();
  const symbolService = createMockSymbolService();
  const counterService = createMockCounterService();

  const module = await Test.createTestingModule({
    providers: [
      CryptoService,
      { provide: getRepositoryToken(Crypto), useValue: createMockRepo() },
      { provide: HttpService, useValue: http },
      { provide: CacheService, useValue: cacheService },
      { provide: CryptoSymbolsService, useValue: symbolService },
      { provide: RegisterCounterService, useValue: counterService },
      ...(overrides.providers || []),
    ],
  }).compile();

  const repo = module.get(getRepositoryToken(Crypto));

  return {
    service: module.get(CryptoService),
    mocks: { repo, http, cacheService, symbolService, counterService },
  };
}
