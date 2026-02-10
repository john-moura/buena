import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Building } from './building.entity';
import { Manager } from './manager.entity';
import { Accountant } from './accountant.entity';

export enum ManagementType {
  WEG = 'WEG',
  MV = 'MV',
}

@Entity('properties')
export class Property {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Buena Plaza' })
  @Column()
  name: string;

  @ApiProperty({ enum: ManagementType, default: ManagementType.WEG })
  @Column({
    type: 'enum',
    enum: ManagementType,
    default: ManagementType.WEG,
  })
  managementType: ManagementType;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', required: false })
  @Column({ nullable: true })
  managerId: string;

  @ManyToOne(() => Manager, (manager) => manager.properties, { nullable: true })
  manager: Manager;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002', required: false })
  @Column({ nullable: true })
  accountantId: string;

  @ManyToOne(() => Accountant, (accountant) => accountant.properties, { nullable: true })
  accountant: Accountant;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: () => Building, isArray: true })
  @OneToMany(() => Building, (building) => building.property, { cascade: true })
  buildings: Building[];
}
