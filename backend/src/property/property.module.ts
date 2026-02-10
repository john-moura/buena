import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { Property, Building, Unit, Manager, Accountant } from '../entities';
import { AiService } from '../ai/ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Property, Building, Unit, Manager, Accountant])],
  controllers: [PropertyController],
  providers: [PropertyService, AiService],
  exports: [PropertyService],
})
export class PropertyModule { }
