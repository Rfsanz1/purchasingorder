import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LegacyBridgeService {
  private readonly logger = new Logger(LegacyBridgeService.name);

  getLegacyStatus() {
    this.logger.log('Fetching data from legacy Laravel bridge');
    return {
      legacy: true,
      message: 'Bridge service available for incremental migration',
    };
  }
}
