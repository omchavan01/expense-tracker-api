import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWTAccessTokenService } from 'src/providers/jwt/jwt-access-token.service';
import { JWTRefreshTokenService } from 'src/providers/jwt/jwt-refresh-token.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [JwtService, JWTAccessTokenService, JWTRefreshTokenService],
  exports: [JwtModule, JWTAccessTokenService, JWTRefreshTokenService],
})
export class JWTTokenModule {}
