import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
import { encode } from 'querystring';

import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Redirect,
  Render,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { ForbidRefresh, IsStep } from '@fc/flow-steps';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import {
  GetOidcCallback,
  OidcClientConfig,
  OidcClientRoutes,
  OidcClientService,
  OidcClientSession,
  RedirectToIdp,
} from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import {
  ISessionService,
  Session,
  SessionCsrfService,
  SessionInvalidCsrfSelectIdpException,
  SessionService,
} from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import {
  GetOidcCallbackOidcClientSessionDto,
  GetOidcCallbackSessionDto,
  GetRedirectToIdpOidcClientSessionDto,
  OidcIdentityDto,
} from '../dto';
import { CoreFcaInvalidIdentityException } from '../exceptions';

@Controller()
export class OidcClientController {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly oidcClient: OidcClientService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    private readonly csrfService: SessionCsrfService,
    private readonly oidcProvider: OidcProviderService,
    private readonly sessionService: SessionService,
    private readonly tracking: TrackingService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * @todo #242 get configured parameters (scope and acr)
   */
  @Post(OidcClientRoutes.REDIRECT_TO_IDP)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Header('cache-control', 'no-store')
  @IsStep()
  @ForbidRefresh()
  // eslint-disable-next-line complexity
  async redirectToIdp(
    @Req() req,
    @Res() res,
    @Body() body: RedirectToIdp,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient', GetRedirectToIdpOidcClientSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<void> {
    const { providerUid: idpId, csrfToken } = body;

    const { spId } = await sessionOidc.get();

    const { scope } = this.config.get<OidcClientConfig>('OidcClient');
    const { params } = await this.oidcProvider.getInteraction(req, res);

    const {
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values,
    } = params as Record<string, string>;

    // -- control if the CSRF provided is the same as the one previously saved in session.
    try {
      await this.csrfService.validate(sessionOidc, csrfToken);
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new SessionInvalidCsrfSelectIdpException(error);
    }

    await this.oidcClient.utils.checkIdpBlacklisted(spId, idpId);

    await this.oidcClient.utils.checkIdpDisabled(spId, idpId);

    const { state, nonce } =
      await this.oidcClient.utils.buildAuthorizeParameters();

    const authorizeParams = {
      state,
      scope,
      idpId,
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values,
      nonce,
      /**
       * @todo #1021 Récupérer la vraie valeur du claims envoyé par le FS
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1021
       * @ticket FC-1021
       */
      claims: '{"id_token":{"amr":{"essential":true}}}',
      // No prompt is sent to the identity provider voluntary
    };

    const authorizationUrlRaw = await this.oidcClient.utils.getAuthorizeUrl(
      authorizeParams,
    );

    let authorizationUrl = authorizationUrlRaw;
    if (spId) {
      authorizationUrl = this.appendSpIdToAuthorizeUrl(
        spId,
        authorizationUrlRaw,
      );
    }

    const { name: idpName, title: idpLabel } =
      await this.identityProvider.getById(idpId);
    const session: OidcClientSession = {
      idpId,
      idpName,
      idpLabel,
      idpState: state,
      idpNonce: nonce,
      idpIdentity: undefined,
      spIdentity: undefined,
      accountId: undefined,
    };

    await sessionOidc.set(session);

    this.logger.trace({
      route: OidcClientRoutes.REDIRECT_TO_IDP,
      method: 'POST',
      name: 'OidcClientRoutes.REDIRECT_TO_IDP',
      body,
      res,
      session,
      redirect: authorizationUrl,
    });

    res.redirect(authorizationUrl);
  }

  /**
   * @TODO #141 implement proper well-known
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/141
   *  - generated by openid-client
   *  - pub keys orverrided by keys from HSM
   */
  @Get(OidcClientRoutes.WELL_KNOWN_KEYS)
  @Header('cache-control', 'public, max-age=600')
  async getWellKnownKeys() {
    this.logger.trace({
      route: OidcClientRoutes.WELL_KNOWN_KEYS,
      method: 'GET',
      name: 'OidcClientRoutes.WELL_KNOWN_KEYS',
    });
    return await this.oidcClient.utils.wellKnownKeys();
  }

  @Post(OidcClientRoutes.DISCONNECT_FROM_IDP)
  @Header('cache-control', 'no-store')
  async logoutFromIdp(
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    this.logger.trace({
      route: OidcClientRoutes.DISCONNECT_FROM_IDP,
      method: 'POST',
      name: 'OidcClientRoutes.DISCONNECT_FROM_IDP',
    });
    const { idpIdToken, idpState, idpId } = await sessionOidc.get();

    const endSessionUrl: string =
      await this.oidcClient.getEndSessionUrlFromProvider(
        idpId,
        idpState,
        idpIdToken,
      );

    return res.redirect(endSessionUrl);
  }

  @Get(OidcClientRoutes.CLIENT_LOGOUT_CALLBACK)
  @Header('cache-control', 'no-store')
  @Render('oidc-provider-logout-form')
  async redirectAfterIdpLogout(
    @Req() req,
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { oidcProviderLogoutForm } = await sessionOidc.get();

    const trackingContext: TrackedEventContextInterface = { req };
    const { FC_SESSION_TERMINATED } = this.tracking.TrackedEventsMap;
    await this.tracking.track(FC_SESSION_TERMINATED, trackingContext);

    await this.sessionService.destroy(req, res);

    return { oidcProviderLogoutForm };
  }

  /**
   * Append the sp_id query param to the authorize url
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/475
   *
   * @param serviceProviderId The client_id of the SP
   * @param authorizationUrl The authorization url built by the library oidc-client
   * @returns The final url
   */
  private appendSpIdToAuthorizeUrl(
    serviceProviderId: string,
    authorizationUrl: string,
  ): string {
    return `${authorizationUrl}&sp_id=${serviceProviderId}`;
  }

  @Get(OidcClientRoutes.OIDC_CALLBACK_LEGACY)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Header('cache-control', 'no-store')
  @Redirect()
  getLegacyOidcCallback(@Query() query, @Param() params: GetOidcCallback) {
    const { urlPrefix } = this.config.get<AppConfig>('App');

    const response = {
      statusCode: 302,
      url: `${urlPrefix}${OidcClientRoutes.OIDC_CALLBACK}?${encode(query)}`,
    };

    this.logger.trace({
      method: 'GET',
      name: 'OidcClientRoutes.OIDC_CALLBACK_LEGACY',
      providerUid: params.providerUid,
    });

    return response;
  }

  /**
   * @TODO #308 ETQ DEV je veux éviter que deux appels Http soient réalisés au lieu d'un à la discovery Url dans le cadre d'oidc client
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/308
   */
  @Get(OidcClientRoutes.OIDC_CALLBACK)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @IsStep()
  @ForbidRefresh()
  async getOidcCallback(
    @Req() req,
    @Res() res,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient', GetOidcCallbackOidcClientSessionDto)
    _sessionOidc: ISessionService<OidcClientSession>,
  ) {
    await this.sessionService.detach(req, res);
    await this.sessionService.duplicate(req, res, GetOidcCallbackSessionDto);

    const newSessionOidc = SessionService.getBoundSession<OidcClientSession>(
      req,
      'OidcClient',
    );

    const { IDP_CALLEDBACK } = this.tracking.TrackedEventsMap;
    await this.tracking.track(IDP_CALLEDBACK, { req });

    const { idpId, idpNonce, idpState, interactionId, spId } =
      await newSessionOidc.get();

    const tokenParams = {
      state: idpState,
      nonce: idpNonce,
    };

    const extraParams = {
      // OIDC inspired variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      sp_id: spId,
    };

    const { accessToken, idToken, acr, amr } =
      await this.oidcClient.getTokenFromProvider(
        idpId,
        tokenParams,
        req,
        extraParams,
      );

    const { FC_REQUESTED_IDP_TOKEN } = this.tracking.TrackedEventsMap;
    await this.tracking.track(FC_REQUESTED_IDP_TOKEN, { req });

    const userInfoParams = {
      accessToken,
      idpId,
    };

    const identity = await this.oidcClient.getUserInfosFromProvider(
      userInfoParams,
      req,
    );

    const { FC_REQUESTED_IDP_USERINFO } = this.tracking.TrackedEventsMap;
    await this.tracking.track(FC_REQUESTED_IDP_USERINFO, { req });

    await this.validateIdentity(idpId, identity);

    const identityExchange: OidcSession = {
      amr,
      idpAccessToken: accessToken,
      idpIdToken: idToken,
      idpAcr: acr,
      idpIdentity: identity,
    };
    await newSessionOidc.set({ ...identityExchange });

    // BUSINESS: Redirect to business page
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const url = `${urlPrefix}/interaction/${interactionId}/verify`;

    this.logger.trace({
      method: 'GET',
      name: 'OidcClientRoutes.OIDC_CALLBACK',
      redirect: url,
      route: OidcClientRoutes.OIDC_CALLBACK,
      identityExchange,
    });

    res.redirect(url);
  }

  private async validateIdentity(
    idpId: string,
    identity: Partial<OidcIdentityDto>,
  ): Promise<boolean> {
    const validatorOptions: ValidatorOptions = {
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    };
    const transformOptions: ClassTransformOptions = {
      excludeExtraneousValues: true,
    };

    const errors = await validateDto(
      identity,
      OidcIdentityDto,
      validatorOptions,
      transformOptions,
    );

    if (errors.length) {
      this.logger.trace({ errors }, LoggerLevelNames.WARN);
      throw new CoreFcaInvalidIdentityException();
    }

    this.logger.trace({ validate: { identity, idpId } });
    return true;
  }
}
