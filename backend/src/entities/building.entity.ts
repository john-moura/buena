import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Property } from './property.entity';
import { Unit } from './unit.entity';

@Entity('buildings')
export class Building {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440003' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @Column()
    propertyId: string;

    @ApiProperty({ example: 'Main Wing', required: false })
    @Column({ nullable: true })
    name: string;

    @ApiProperty({ example: 'Musterstraße' })
    @Column()
    street: string;

    @ApiProperty({ example: '123' })
    @Column()
    houseNumber: string;

    @ApiProperty({ example: '10115', required: false })
    @Column({ nullable: true })
    postcode: string;

    @ApiProperty({ example: 'Side entrance', required: false })
    @Column({ nullable: true })
    additionalInfo: string;

    @ManyToOne(() => Property, (property) => property.buildings, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @ApiProperty({ type: () => Unit, isArray: true })
    @OneToMany(() => Unit, (unit) => unit.building, { cascade: true })
    units: Unit[];
}
