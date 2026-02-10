import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PropertyService } from './property/property.service';
import { ManagementType } from './entities/property.entity';
import { UnitType } from './entities/unit.entity';
import { DataSource } from 'typeorm';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const propertyService = app.get(PropertyService);

    console.log('Seeding database with 10 properties...');

    // Clear existing data to ensure clean seed
    await propertyService.findAll(); // relations included
    const properties = await propertyService.findAll();
    if (properties.length > 0) {
        console.log(`Clearing ${properties.length} existing properties...`);
        for (const p of properties) {
            await propertyService.delete(p.id);
        }
    }

    // Create Managers
    const managersData = [
        { name: 'John Smith', email: 'john@buena.com' },
        { name: 'Sarah Connor', email: 'sarah@buena.com' },
    ];
    const managers: any[] = [];
    const dataSource = app.get(DataSource);
    const managerRepoReal = dataSource.getRepository('Manager');
    const accountantRepoReal = dataSource.getRepository('Accountant');

    for (const m of managersData) {
        managers.push(await managerRepoReal.save(managerRepoReal.create(m)));
    }

    // Create Accountants
    const accountantsData = [
        { name: 'Michael Scott', email: 'michael@buena.com' },
        { name: 'Pam Beesly', email: 'pam@buena.com' },
    ];
    const accountants: any[] = [];
    for (const a of accountantsData) {
        accountants.push(await accountantRepoReal.save(accountantRepoReal.create(a)));
    }

    for (let i = 1; i <= 10; i++) {
        const manager = managers[i % managers.length];
        const accountant = accountants[i % accountants.length];

        const propertyData = {
            name: `Buena Plaza ${i}`,
            managementType: i % 2 === 0 ? ManagementType.WEG : ManagementType.MV,
            managerId: manager.id,
            accountantId: accountant.id,
            buildings: [
                {
                    name: `Building ${i}`,
                    street: `Musterstraße`,
                    houseNumber: `${100 + i}`,
                    postcode: `10115`,
                    units: Array.from({ length: 5 }, (_, j) => ({
                        unitNumber: `${i}${j + 1}`,
                        type: j === 0 ? UnitType.Office : UnitType.Apartment,
                        floor: `${Math.floor(j / 2) + 1}`,
                        entrance: 'Main',
                        sizeSqM: 45 + Math.random() * 50,
                        coOwnershipShare: 10 + Math.random() * 20,
                        rooms: 2 + (j % 3),
                        constructionYear: 2000 + i
                    }))
                }
            ]
        };

        await propertyService.create(propertyData);
        console.log(`Created property: ${propertyData.name}`);
    }

    console.log('Seeding complete!');
    await app.close();
}

bootstrap();
