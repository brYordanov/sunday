import { Controller, Post } from '@nestjs/common';
import { Crypto } from './crypto.entity';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post()
  async RegisterCrypto(symbol: string): Promise<any> {
    return 123;
  }
}
