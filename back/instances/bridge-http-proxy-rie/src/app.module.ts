/* istanbul ignore file */

// Declarative code
import { DynamicModule, Module } from '@nestjs/common';

import { BridgeHttpProxyModule } from '@fc/bridge-http-proxy';
import { ConfigModule, ConfigService } from '@fc/config';
import { LoggerModule } from '@fc/logger';

@Module({})
export class AppModule {
  static forRoot(configService: ConfigService): DynamicModule {
    return {
      module: AppModule,
      imports: [
        // 1. Load config module first
        ConfigModule.forRoot(configService),
        // 2. Load logger module next
        LoggerModule,
        // 3. Load other modules
        BridgeHttpProxyModule,
      ],
    };
  }
}
