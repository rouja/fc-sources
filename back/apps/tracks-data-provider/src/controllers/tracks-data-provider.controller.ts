import { Controller, Get } from '@nestjs/common';

import {
  DataProviderCoreAuthService,
  HttpAuthToken,
} from '@fc/data-provider-core-auth';
import { LoggerService } from '@fc/logger-legacy';
import { TrackDto, TracksService } from '@fc/tracks';

import { TracksDataProviderRoutes } from '../enums';

@Controller()
export class TracksDataProviderController {
  constructor(
    private readonly logger: LoggerService,
    private readonly coreAuth: DataProviderCoreAuthService,
    private readonly tracks: TracksService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Get(TracksDataProviderRoutes.CONNEXION_TRACKS)
  async getTracks(@HttpAuthToken() token): Promise<TrackDto[]> {
    this.logger.debug('getTracks');

    const identity = await this.coreAuth.getIdentity(token);
    this.logger.trace({ identity });

    const tracks = await this.tracks.getList(identity);
    /**
     * @todo Add Dto Validatation with TrackDto
     *
     * Author: Arnaud
     * Date: 18/02/2022
     */
    this.logger.trace({ tracks });

    return tracks;
  }
}
