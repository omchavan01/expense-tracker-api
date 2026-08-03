import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class OtpRateLimitService {
  private readonly logger = new Logger(OtpRateLimitService.name);
  private redis?: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (redisUrl) {
      this.redis = new Redis(redisUrl);
    } else {
      this.logger.warn(
        'REDIS_URL is not configured — OTP rate limiting is disabled',
      );
    }
  }

  async rateLimit(email: string) {
    if (!this.redis) return true;

    const key = `otp:rate:limit:${email}`;
    const limit = 3;
    const ttlSeconds = 60; // 1 minute
    const count = await this.redis.incr(key);

    if (count === 1) {
      await this.redis.expire(key, ttlSeconds);
    }

    return count <= limit;
  }
}
