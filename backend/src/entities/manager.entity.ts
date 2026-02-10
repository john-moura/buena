import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Property } from './property.entity';

@Entity('managers')
export class Manager {
    @ApiProperty({ example: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'John Doe' })
    @Column()
    name: string;

    @ApiProperty({ example: 'john.doe@example.com', required: false })
    @Column({ nullable: true })
    email: string;

    @OneToMany(() => Property, (property) => property.manager)
    properties: Property[];
}
