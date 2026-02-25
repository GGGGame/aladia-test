import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class NetworkingService {
  constructor(
    @Inject('AUTHENTICATION_SERVICE') private readonly client: ClientProxy,
  ) {}

  async send<TResult = any, TInput = any>(
    pattern: string,
    data: TInput,
  ): Promise<TResult> {
    return await lastValueFrom(
      this.client.send<TResult, TInput>(pattern, data),
    );
  }
}
