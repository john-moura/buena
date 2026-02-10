import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Property, Building, Unit, Manager, Accountant } from './src/entities';

config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Property, Building, Unit, Manager, Accountant],
    migrations: [
        process.env.NODE_ENV === 'production'
            ? './dist/migrations/*.js'
            : './src/migrations/*.ts'
    ],
    synchronize: false,
});
