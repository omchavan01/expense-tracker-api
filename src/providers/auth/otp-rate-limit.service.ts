import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class OtpRateLimitService {
  private redis: Redis;
  private isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    if (this.isProduction) {
      const redisUrl = this.configService.get<string>('REDIS_URL');
      if (!redisUrl) {
        throw new Error('REDIS_URL is not configured in environment variables');
      }
      this.redis = new Redis(redisUrl);
    }
  }

  async rateLimit(email: string) {
    // If not production or redis is not initialized, return true
    if (!this.isProduction || !this.redis) return true;

    const key = `otp:rate:limit:${email}`;
    const limit = 3;
    const ttlSeconds = 3 * 60; // 3 minutes
    const count = (await this.redis.incr(key)) as number;

    if (count === 1) {
      await this.redis.expire(key, ttlSeconds);
    }

    return count <= limit;
  }
}
