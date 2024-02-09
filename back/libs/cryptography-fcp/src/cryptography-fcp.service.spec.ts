import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';

import { CryptographyFcpService } from './cryptography-fcp.service';
import { IPivotIdentity } from './interfaces';

describe('CryptographyFcpService', () => {
  let service: CryptographyFcpService;

  const configMock = {
    get: jest.fn(),
  };

  const mockEncryptKey = 'p@ss p@rt0ut';
  const cryptographyKeyMock = 'Méfaits accomplis...';

  const cryptographyServiceMock = {
    hash: jest.fn(),
    decrypt: jest.fn(),
  };

  const pivotIdentityMock: Pick<
    IPivotIdentity,
    | 'given_name'
    | 'family_name'
    | 'birthdate'
    | 'gender'
    | 'birthplace'
    | 'birthcountry'
  > = {
    // scope openid @see https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Jean Paul Henri',
    // scope openid @see https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: 'Dupont',
    gender: 'male',
    birthdate: '1970-01-01',
    birthplace: '95277',
    birthcountry: '99100',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptographyService, ConfigService, CryptographyFcpService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyServiceMock)
      .compile();

    service = module.get<CryptographyFcpService>(CryptographyFcpService);

    configMock.get.mockImplementation(() => ({
      // Cryptography config
      clientSecretEncryptKey: mockEncryptKey,
      sessionIdLength: 42,
      subSecretKey: cryptographyKeyMock,
    }));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('computeIdentityHash', () => {
    it('should call cryptography service hash function with given parameters', () => {
      // Given
      const serial = 'Jean Paul HenriDupont1970-01-01male9527799100';
      const inputEncoding = 'binary';
      const alg = 'sha256';
      const ouputDigest = 'base64';
      cryptographyServiceMock.hash.mockReturnValueOnce('totoIsHashed');
      // action
      const result = service.computeIdentityHash(pivotIdentityMock);

      // expect
      expect(cryptographyServiceMock.hash).toHaveBeenCalledTimes(1);
      expect(cryptographyServiceMock.hash).toHaveBeenCalledWith(
        serial,
        inputEncoding,
        alg,
        ouputDigest,
      );
      expect(result).toEqual('totoIsHashed');
    });
  });

  describe('computeSubV1', () => {
    const providerRefMock = 'providerRefMockValue';
    const identityHashMock = 'identityHashValue';

    it('should crypto service hash function with joined parameters', () => {
      cryptographyServiceMock.hash.mockReturnValueOnce('totoHasASub');
      // action
      const result = service.computeSubV1(providerRefMock, identityHashMock);

      // expect
      expect(cryptographyServiceMock.hash).toHaveBeenCalledTimes(1);
      expect(cryptographyServiceMock.hash).toHaveBeenCalledWith(
        'providerRefMockValue' + 'identityHashValue' + 'Méfaits accomplis...',
      );
      expect(result).toEqual('totoHasASubv1');
    });
  });
});
