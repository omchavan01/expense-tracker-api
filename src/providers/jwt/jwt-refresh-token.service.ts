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
export class JWTRefreshTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async refreshToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: '30d',
    });
  }

  async verifyRefreshToken(token: string) {
    return await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
    });
  }
}
