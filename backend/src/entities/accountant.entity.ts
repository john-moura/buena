import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Property } from './property.entity';

@Entity('accountants')
export class Accountant {
    @ApiProperty({ example: 'c1f0e4b8-2d3e-4f5a-8b9c-0d1e2f3a4b5c' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'Jane Smith' })
    @Column()
    name: string;

    @ApiProperty({ example: 'jane.smith@example.com', required: false })
    @Column({ nullable: true })
    email: string;

    @OneToMany(() => Property, (property) => property.accountant)
    properties: Property[];
}
