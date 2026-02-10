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
import { EnergyModule } from './modules/energy/energy.module';
import { User } from './entities/user.entity';
import { Game } from './entities/game.entity';
import { Level } from './entities/level.entity';
import { Challenge } from './entities/challenge.entity';
import { GameAttempt } from './entities/game-attempt.entity';
import { FoodLog } from './entities/food-log.entity';
import { InBodyReport } from './entities/inbody-report.entity';
import { CorosUpload } from './entities/coros-upload.entity';

const entities = [User, Game, Level, Challenge, GameAttempt, FoodLog, InBodyReport, CorosUpload];

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
        const databaseUrl = configService.get('DATABASE_URL');

        if (databaseUrl) {
          const url = new URL(databaseUrl);
          return {
            type: 'mysql' as const,
            host: url.hostname,
            port: parseInt(url.port) || 3306,
            username: url.username,
            password: url.password,
            database: url.pathname.slice(1),
            entities,
            synchronize: true,
            logging: configService.get('NODE_ENV') === 'development',
            ssl: configService.get('NODE_ENV') === 'production'
              ? { rejectUnauthorized: false }
              : false,
            charset: 'utf8mb4',
          };
        }

        return {
          type: 'mysql' as const,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: +configService.get<string>('DB_PORT', '3306'),
          username: configService.get<string>('DB_USERNAME', 'root'),
          password: configService.get<string>('DB_PASSWORD', ''),
          database: configService.get<string>('DB_DATABASE', 'energyos'),
          entities,
          synchronize: configService.get('NODE_ENV') !== 'production',
          logging: configService.get('NODE_ENV') === 'development',
          charset: 'utf8mb4',
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    EnergyModule,
    GameModule,
    LevelModule,
    ChallengeModule,
    AttemptModule,
    AiModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
