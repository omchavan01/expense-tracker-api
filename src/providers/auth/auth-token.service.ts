import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from 'src/entities/auth/users.entity';
import { JWTAccessTokenService } from '../jwt/jwt-access-token.service';
import { JWTRefreshTokenService } from '../jwt/jwt-refresh-token.service';
import { hashPassword } from 'src/utils/hash-password';

@Injectable()
export class AuthTokenService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly jwtAccessTokenService: JWTAccessTokenService,
    private readonly jwtRefreshTokenService: JWTRefreshTokenService,
  ) {}

  async generateTokens(user: Users) {
    const payload = { sub: user.id, email: user.authInfo.email };
    const accessToken = await this.jwtAccessTokenService.accessToken(payload);
    const refreshToken =
      await this.jwtRefreshTokenService.refreshToken(payload);

    const decodedAccessToken =
      await this.jwtAccessTokenService.verifyAccessToken(accessToken);
    const decodedRefreshToken =
      await this.jwtRefreshTokenService.verifyRefreshToken(refreshToken);
    const accessTokenExpiresAt = new Date(decodedAccessToken.exp! * 1000);
    const refreshTokenExpiresAt = new Date(decodedRefreshToken.exp! * 1000);

    const hashedAccessToken = await hashPassword(accessToken);
    const hashedRefreshToken = await hashPassword(refreshToken);
    await this.usersRepository.update(
      {
        id: user.id,
      },
      {
        tokenInfo: {
          accessToken: hashedAccessToken,
          refreshToken: hashedRefreshToken,
          accessTokenExpiresAt,
          refreshTokenExpiresAt,
        },
      },
    );

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    };
  }
}
