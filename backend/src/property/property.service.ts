import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Property, Building, Unit, Manager, Accountant } from '../entities';

@Injectable()
export class PropertyService {
    constructor(
        @InjectRepository(Property)
        private propertyRepository: Repository<Property>,
        @InjectRepository(Building)
        private buildingRepository: Repository<Building>,
        @InjectRepository(Unit)
        private unitRepository: Repository<Unit>,
        private dataSource: DataSource,
    ) { }

    async findAll() {
        return this.propertyRepository.find({
            relations: ['buildings', 'buildings.units', 'manager', 'accountant'],
        });
    }

    async findOne(id: string) {
        return this.propertyRepository.findOne({
            where: { id },
            relations: ['buildings', 'buildings.units', 'manager', 'accountant'],
        });
    }

    async create(data: any) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { buildings, ...propertyData } = data;
            const property = this.propertyRepository.create(propertyData as Property);
            const savedProperty = await queryRunner.manager.save(property);

            if (buildings && buildings.length > 0) {
                for (const buildingData of buildings) {
                    const { units, ...bData } = buildingData;
                    const building = this.buildingRepository.create({
                        ...bData,
                        propertyId: savedProperty.id,
                    });
                    const newBuilding = await queryRunner.manager.save(Building, building) as any;
                    const savedBuilding = newBuilding as Building;

                    if (units && units.length > 0) {
                        const unitsToSave = units.map((u: any) =>
                            this.unitRepository.create({
                                ...u,
                                sizeSqM: u.sizeSqM === "" || u.sizeSqM === null ? null : parseFloat(u.sizeSqM),
                                coOwnershipShare: u.coOwnershipShare === "" || u.coOwnershipShare === null ? null : parseFloat(u.coOwnershipShare),
                                rooms: u.rooms === "" || u.rooms === null ? null : parseFloat(u.rooms),
                                constructionYear: u.constructionYear === "" || u.constructionYear === null ? null : parseInt(u.constructionYear),
                                buildingId: savedBuilding.id,
                            }),
                        );
                        await queryRunner.manager.save(Unit, unitsToSave);
                    }
                }
            }

            await queryRunner.commitTransaction();
            return this.findOne(savedProperty.id);
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: string, data: any) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { buildings, ...propertyData } = data;

            // 1. Update Property
            await queryRunner.manager.update(Property, id, propertyData);
            const savedProperty = await this.findOne(id);
            if (!savedProperty) throw new Error('Property not found');

            // 2. Handle Buildings
            if (buildings) {
                const existingBuildings = await queryRunner.manager.find(Building, { where: { propertyId: id } });
                const existingBuildingIds = existingBuildings.map(b => b.id);
                const incomingBuildingIds = buildings.filter((b: any) => b.id).map((b: any) => b.id);

                // Delete removed buildings
                const buildingsToDelete = existingBuildingIds.filter(ebId => !incomingBuildingIds.includes(ebId));
                if (buildingsToDelete.length > 0) {
                    await queryRunner.manager.delete(Building, buildingsToDelete);
                }

                for (const buildingData of buildings) {
                    const { units, ...bData } = buildingData;
                    let savedBuilding: Building;

                    if (bData.id) {
                        // Update existing building
                        await queryRunner.manager.update(Building, bData.id, { ...bData, propertyId: id });
                        const updatedBuilding = (await queryRunner.manager.findOneBy(Building, { id: bData.id })) as any;
                        savedBuilding = updatedBuilding as Building;
                    } else {
                        // Create new building
                        const building = this.buildingRepository.create({ ...bData, propertyId: id });
                        const newBuilding = await queryRunner.manager.save(Building, building) as any;
                        savedBuilding = newBuilding as Building;
                    }

                    // 3. Handle Units for this building
                    if (units) {
                        const existingUnits = await queryRunner.manager.find(Unit, { where: { buildingId: savedBuilding.id } });
                        const existingUnitIds = existingUnits.map(u => u.id);
                        const incomingUnitIds = units.filter((u: any) => u.id).map((u: any) => u.id);

                        // Delete removed units
                        const unitsToDelete = existingUnitIds.filter(euId => !incomingUnitIds.includes(euId));
                        if (unitsToDelete.length > 0) {
                            await queryRunner.manager.delete(Unit, unitsToDelete);
                        }

                        for (const unitData of units) {
                            const uToSave = {
                                ...unitData,
                                sizeSqM: unitData.sizeSqM === "" || unitData.sizeSqM === null ? null : parseFloat(unitData.sizeSqM),
                                coOwnershipShare: unitData.coOwnershipShare === "" || unitData.coOwnershipShare === null ? null : parseFloat(unitData.coOwnershipShare),
                                rooms: unitData.rooms === "" || unitData.rooms === null ? null : parseFloat(unitData.rooms),
                                constructionYear: unitData.constructionYear === "" || unitData.constructionYear === null ? null : parseInt(unitData.constructionYear),
                                buildingId: savedBuilding.id,
                            };

                            if (uToSave.id) {
                                await queryRunner.manager.update(Unit, uToSave.id, uToSave);
                            } else {
                                const unit = this.unitRepository.create(uToSave);
                                await queryRunner.manager.save(unit);
                            }
                        }
                    }
                }
            }

            await queryRunner.commitTransaction();
            return this.findOne(id);
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async delete(id: string) {
        return this.propertyRepository.delete(id);
    }

    async findAllManagers() {
        return this.dataSource.getRepository(Manager).find();
    }

    async findAllAccountants() {
        return this.dataSource.getRepository(Accountant).find();
    }
}
