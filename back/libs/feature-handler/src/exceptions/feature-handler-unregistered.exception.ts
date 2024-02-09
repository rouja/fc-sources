import { ErrorCode } from '../enums';
import { FeatureHandlerBaseException } from './feature-handler-base.exception';

export class FeatureHandlerUnregisteredException extends FeatureHandlerBaseException {
  code = ErrorCode.UNREGISTERED_FEATURE_HANDLER;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
