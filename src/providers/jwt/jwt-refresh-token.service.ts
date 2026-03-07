import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';

import { JwtPayload } from 'src/utils/types';

@Injectable()
export class JWTRefreshTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private get secret() {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
  }
  private get expiresIn() {
    return this.configService.get<StringValue>('JWT_REFRESH_TOKEN_EXPIRES_IN');
  }

  async refreshToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload, {
      secret: this.secret,
      expiresIn: this.expiresIn,
    });
  }

  async verifyRefreshToken(token: string) {
    return await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.secret,
    });
  }
}
