import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Building } from './building.entity';

export enum UnitType {
    Apartment = 'Apartment',
    Office = 'Office',
    Garden = 'Garden',
    Parking = 'Parking',
}

@Entity('units')
export class Unit {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440004' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440003' })
    @Column()
    buildingId: string;

    @ApiProperty({ example: 'A-101' })
    @Column()
    unitNumber: string;

    @ApiProperty({ enum: UnitType, default: UnitType.Apartment })
    @Column({
        type: 'enum',
        enum: UnitType,
        default: UnitType.Apartment,
    })
    type: UnitType;

    @ApiProperty({ example: '1st Floor', required: false })
    @Column({ nullable: true })
    floor: string;

    @ApiProperty({ example: 'Entrance A', required: false })
    @Column({ nullable: true })
    entrance: string;

    @ApiProperty({ example: 75.50, required: false })
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    sizeSqM: number;

    @ApiProperty({ example: 125.0, required: false })
    @Column({ type: 'decimal', precision: 10, scale: 5, nullable: true })
    coOwnershipShare: number;

    @ApiProperty({ example: 1995, required: false })
    @Column({ type: 'int', nullable: true })
    constructionYear: number;

    @ApiProperty({ example: 3.5, required: false })
    @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
    rooms: number;

    @ManyToOne(() => Building, (building) => building.units, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'buildingId' })
    building: Building;
}
