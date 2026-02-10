import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodLog } from '../../entities/food-log.entity';
import { InBodyReport } from '../../entities/inbody-report.entity';
import { CorosUpload } from '../../entities/coros-upload.entity';
import { User } from '../../entities/user.entity';
import { FoodController } from './food.controller';
import { InBodyController } from './inbody.controller';
import { CorosController } from './coros.controller';
import { EnergyController } from './energy.controller';
import { FoodService } from './food.service';
import { InBodyService } from './inbody.service';
import { CorosService } from './coros.service';
import { EnergyService } from './energy.service';
import { AiParseService } from './parse.service';

@Module({
  imports: [TypeOrmModule.forFeature([FoodLog, InBodyReport, CorosUpload, User])],
  controllers: [FoodController, InBodyController, CorosController, EnergyController],
  providers: [FoodService, InBodyService, CorosService, EnergyService, AiParseService],
})
export class EnergyModule {}
