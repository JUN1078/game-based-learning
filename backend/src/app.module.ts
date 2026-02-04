import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './modules/game/game.module';
import { LevelModule } from './modules/level/level.module';
import { ChallengeModule } from './modules/challenge/challenge.module';
import { AttemptModule } from './modules/attempt/attempt.module';
import { AiModule } from './modules/ai/ai.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Support both DATABASE_URL (Railway) and individual params (local dev)
        const databaseUrl = configService.get('DATABASE_URL');

        if (databaseUrl) {
          // Production: Use DATABASE_URL from Railway
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: configService.get('NODE_ENV') === 'development',
            logging: configService.get('NODE_ENV') === 'development',
            ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
          };
        }

        // Development: Use individual connection params
        return {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST'),
          port: +configService.get<string>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('NODE_ENV') === 'development',
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    GameModule,
    LevelModule,
    ChallengeModule,
    AttemptModule,
    AiModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
