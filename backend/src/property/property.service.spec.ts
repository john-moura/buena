import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PropertyService } from './property.service';
import { Property, Building, Unit, Manager, Accountant } from '../entities';

describe('PropertyService', () => {
  let service: PropertyService;
  let propertyRepo: Repository<Property>;
  let buildingRepo: Repository<Building>;
  let unitRepo: Repository<Unit>;
  let dataSource: DataSource;

  const mockPropertyRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  const mockBuildingRepo = {
    create: jest.fn(),
  };

  const mockUnitRepo = {
    create: jest.fn(),
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
      findOneBy: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    getRepository: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        {
          provide: getRepositoryToken(Property),
          useValue: mockPropertyRepo,
        },
        {
          provide: getRepositoryToken(Building),
          useValue: mockBuildingRepo,
        },
        {
          provide: getRepositoryToken(Unit),
          useValue: mockUnitRepo,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
    propertyRepo = module.get<Repository<Property>>(getRepositoryToken(Property));
    buildingRepo = module.get<Repository<Building>>(getRepositoryToken(Building));
    unitRepo = module.get<Repository<Unit>>(getRepositoryToken(Unit));
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all properties with relations', async () => {
      const result = [{ id: '1', name: 'Test' }];
      mockPropertyRepo.find.mockResolvedValue(result);

      const properties = await service.findAll();

      expect(properties).toEqual(result);
      expect(mockPropertyRepo.find).toHaveBeenCalledWith({
        relations: ['buildings', 'buildings.units', 'manager', 'accountant'],
      });
    });
  });

  describe('create', () => {
    it('should create a property with buildings and units in a transaction', async () => {
      const propertyData = { name: 'New Property', buildings: [{ street: 'Main St', units: [{ unitNumber: '1' }] }] };
      const mockSavedProperty = { id: 'prop-1', name: 'New Property' };
      const mockSavedBuilding = { id: 'b-1', street: 'Main St' };

      mockPropertyRepo.create.mockReturnValue(mockSavedProperty);
      mockQueryRunner.manager.save.mockResolvedValueOnce(mockSavedProperty);
      mockBuildingRepo.create.mockReturnValue(mockSavedBuilding);
      mockQueryRunner.manager.save.mockResolvedValueOnce(mockSavedBuilding);
      mockUnitRepo.create.mockReturnValue({ unitNumber: '1' });

      mockPropertyRepo.findOne.mockResolvedValue({ ...mockSavedProperty, buildings: [] });

      const result = await service.create(propertyData);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(3); // Property, Building, Units array
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      const propertyData = { name: 'Error Property' };
      mockQueryRunner.manager.save.mockRejectedValue(new Error('Save failed'));

      await expect(service.create(propertyData)).rejects.toThrow('Save failed');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a property and buildings/units', async () => {
      const id = 'prop-1';
      const updateData = {
        name: 'Updated Name',
        buildings: [
          { id: 'b-1', street: 'Updated St', units: [{ id: 'u-1', unitNumber: '101' }] }
        ]
      };

      mockQueryRunner.manager.update.mockResolvedValue({ affected: 1 });
      mockPropertyRepo.findOne.mockResolvedValue({ id, name: 'Updated Name' });
      mockQueryRunner.manager.find.mockResolvedValueOnce([{ id: 'b-1' }]); // existing buildings
      mockQueryRunner.manager.findOneBy.mockResolvedValue({ id: 'b-1' });
      mockQueryRunner.manager.find.mockResolvedValueOnce([{ id: 'u-1' }]); // existing units

      const result = await service.update(id, updateData);

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(Property, id, { name: 'Updated Name' });
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should delete buildings that are not in the update data', async () => {
      const id = 'prop-1';
      const updateData = { buildings: [] }; // All buildings removed

      mockPropertyRepo.findOne.mockResolvedValue({ id });
      mockQueryRunner.manager.find.mockResolvedValueOnce([{ id: 'b-old' }]); // legacy building

      await service.update(id, updateData);

      expect(mockQueryRunner.manager.delete).toHaveBeenCalledWith(Building, ['b-old']);
    });
  });
});
