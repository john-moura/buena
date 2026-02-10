import { Test, TestingModule } from '@nestjs/testing';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { AiService } from '../ai/ai.service';

describe('PropertyController', () => {
  let controller: PropertyController;
  let service: PropertyService;
  let aiService: AiService;

  const mockPropertyService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAllManagers: jest.fn(),
    findAllAccountants: jest.fn(),
  };

  const mockAiService = {
    extractPropertyData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyController],
      providers: [
        {
          provide: PropertyService,
          useValue: mockPropertyService,
        },
        {
          provide: AiService,
          useValue: mockAiService,
        },
      ],
    }).compile();

    controller = module.get<PropertyController>(PropertyController);
    service = module.get<PropertyService>(PropertyService);
    aiService = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      const id = '123';
      await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should call service.create with data', async () => {
      const data = { name: 'Test' };
      await controller.create(data);
      expect(service.create).toHaveBeenCalledWith(data);
    });
  });

  describe('update', () => {
    it('should call service.update with id and data', async () => {
      const id = '123';
      const data = { name: 'Updated' };
      await controller.update(id, data);
      expect(service.update).toHaveBeenCalledWith(id, data);
    });
  });

  describe('remove', () => {
    it('should call service.delete with id', async () => {
      const id = '123';
      await controller.remove(id);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('extract', () => {
    it('should call aiService.extractPropertyData with file buffer', async () => {
      const mockFile = { buffer: Buffer.from('test') };
      await controller.extract(mockFile);
      expect(aiService.extractPropertyData).toHaveBeenCalledWith(mockFile.buffer);
    });

    it('should throw error if no file provided', async () => {
      await expect(controller.extract(null)).rejects.toThrow('No file uploaded');
    });
  });
});
