import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ms, { StringValue } from 'ms';

import { Users } from 'src/entities/auth/users.entity';
import { JWTAccessTokenService } from '../jwt/jwt-access-token.service';
import { JWTRefreshTokenService } from '../jwt/jwt-refresh-token.service';
import { comparePassword, hashPassword } from 'src/utils/hash-password';
import { JwtPayload } from 'src/utils/types';

@Injectable()
export class AuthTokenService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly jwtAccessTokenService: JWTAccessTokenService,
    private readonly jwtRefreshTokenService: JWTRefreshTokenService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessAndRefreshTokens(user: Users) {
    const payload = { sub: user.id, email: user.authInfo.email };
    const accessToken = await this.jwtAccessTokenService.accessToken(payload);
    const refreshToken =
      await this.jwtRefreshTokenService.refreshToken(payload);

    const refreshTokenExpiresIn = this.configService.get<StringValue>(
      'JWT_REFRESH_TOKEN_EXPIRES_IN',
    );
    const refreshTokenExpiresAt = new Date(
      Date.now() + ms(refreshTokenExpiresIn!),
    );

    const hashedRefreshToken = await hashPassword(refreshToken);
    await this.usersRepository.update(
      {
        id: user.id,
      },
      {
        tokenInfo: {
          refreshToken: hashedRefreshToken,
          refreshTokenExpiresAt,
        },
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateAccessToken(user: Users) {
    const payload = { sub: user.id, email: user.authInfo.email };
    return await this.jwtAccessTokenService.accessToken(payload);
  }

  async refreshToken(userRefreshToken: string) {
    let payload: JwtPayload;
    let tokens: { accessToken: string; refreshToken: string };
    try {
      payload =
        await this.jwtRefreshTokenService.verifyRefreshToken(userRefreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.usersRepository.findOne({
      where: { id: payload?.sub },
    });
    if (!user) throw new NotFoundException('User does not exist');

    const compareRefreshToken = await comparePassword(
      userRefreshToken,
      user?.tokenInfo?.refreshToken ?? '',
    );
    if (!compareRefreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const refreshTokenThreshold = this.configService.get<StringValue>(
      'REFRESH_TOKEN_THRESHOLD',
    );
    const isNearExpiry =
      user.tokenInfo.refreshTokenExpiresAt! <
      new Date(Date.now() + ms(refreshTokenThreshold!));
    console.log('isNear expiry', isNearExpiry);
    if (isNearExpiry) {
      tokens = await this.generateAccessAndRefreshTokens(user);
    } else {
      tokens = {
        accessToken: await this.generateAccessToken(user),
        refreshToken: userRefreshToken,
      };
    }
    console.log(tokens, 'tokens');
    return tokens;
  }

  async removeToken(id: number) {
    await this.usersRepository.update(id, {
      tokenInfo: {
        refreshToken: null,
        refreshTokenExpiresAt: null,
      },
    });
  }
}
