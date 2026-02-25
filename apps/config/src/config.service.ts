import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  get<T>(key: string): T {
    return this.nestConfigService.getOrThrow<T>(key);
  }
}
