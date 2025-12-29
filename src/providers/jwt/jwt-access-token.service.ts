import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: number;
  email: string;
  exp: number;
  iat?: number;
}

@Injectable()
export class JWTAccessTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async accessToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: '30m',
    });
  }

  async verifyAccessToken(token: string) {
    return await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
}
