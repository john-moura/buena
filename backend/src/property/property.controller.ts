import { Controller, Get, Post, Patch, Body, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { PropertyService } from './property.service';
import { AiService } from '../ai/ai.service';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('properties')
@Controller('properties')
export class PropertyController {
    private logPath = path.join(process.cwd(), 'property-controller-errors.log');

    constructor(
        private readonly propertyService: PropertyService,
        private readonly aiService: AiService,
    ) { }

    private logError(message: string, error: any) {
        const logEntry = `[${new Date().toISOString()}] ${message}\n${error?.stack || error}\n\n`;
        fs.appendFileSync(this.logPath, logEntry);
        console.error(message, error);
    }

    @Get('contacts/managers')
    @ApiOperation({ summary: 'Get all property managers' })
    @ApiResponse({ status: 200, description: 'Return all managers.' })
    getManagers() {
        return this.propertyService.findAllManagers();
    }

    @Get('contacts/accountants')
    @ApiOperation({ summary: 'Get all property accountants' })
    @ApiResponse({ status: 200, description: 'Return all accountants.' })
    getAccountants() {
        return this.propertyService.findAllAccountants();
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all properties' })
    @ApiResponse({ status: 200, description: 'Return all properties.' })
    findAll() {
        return this.propertyService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a property by ID' })
    @ApiResponse({ status: 200, description: 'Return the property details.' })
    findOne(@Param('id') id: string) {
        return this.propertyService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new property' })
    @ApiResponse({ status: 201, description: 'The property has been successfully created.' })
    create(@Body() data: any) {
        return this.propertyService.create(data);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing property' })
    @ApiResponse({ status: 200, description: 'The property has been successfully updated.' })
    update(@Param('id') id: string, @Body() data: any) {
        return this.propertyService.update(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a property by ID' })
    @ApiResponse({ status: 200, description: 'The property has been successfully deleted.' })
    remove(@Param('id') id: string) {
        return this.propertyService.delete(id);
    }

    @Post('extract')
    @ApiOperation({ summary: 'Extract property data from a PDF file using AI' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Data successfully extracted.' })
    @UseInterceptors(FileInterceptor('file'))
    async extract(@UploadedFile() file: any) {
        try {
            if (!file) {
                throw new Error('No file uploaded');
            }
            return await this.aiService.extractPropertyData(file.buffer);
        } catch (err) {
            this.logError('Extraction failed in Controller:', err);
            throw err;
        }
    }
}
