import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

/**
 * AiService handles interactions with OpenAI's API.
 * It uses native PDF support in gpt-4o via Base64 encoded input.
 */
@Injectable()
export class AiService {
  private openai: OpenAI;
  private logPath = path.join(process.cwd(), 'ai-extraction-errors.log');

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({ apiKey });
  }

  private logError(message: string, error: any) {
    const logEntry = `[${new Date().toISOString()}] ${message}\n${error?.stack || error}\n\n`;
    try {
      fs.appendFileSync(this.logPath, logEntry);
    } catch (e) {
      console.error('Failed to write to log file', e);
    }
    console.error(message, error);
  }

  /**
   * Extracts property data from a PDF buffer by sending it directly to OpenAI
   * as a Base64 encoded string using the Responses API (/v1/responses).
   */
  async extractPropertyData(fileBuffer: Buffer) {
    try {
      const base64Pdf = fileBuffer.toString('base64');

      const prompt = `
        Extract comprehensive property information from the provided German Real Estate Document (Teilungserklärung).
        
        CRITICAL INSTRUCTIONS FOR NUMERIC VALUES:
        - The source document uses German formatting:
          - Commas (,) are decimal separators (e.g., "75,50" means 75.5).
          - Dots (.) are thousand separators (e.g., "1.200" means 1200).
        - PLEASE CONVERT ALL NUMERIC VALUES TO STANDARD JSON NUMBERS (dot as decimal separator, no thousand separators).
        
        FIELD DEFINITIONS:
        - Property: name, managementType (WEG or MV), managerName, accountantName.
        - Building: 
          - name: The name of the building, extracted from the field "Gebäudezugehörigkeit" if present.
          - street, houseNumber, postcode, additionalInfo.
        - Unit:
          - unitNumber: The unique ID or number of the unit.
          - type: ONE OF [Apartment, Office, Garden, Parking].
          - floor: The floor level (e.g., "1. OG", "Ground").
          - entrance: The identifier if present.
          - sizeSqM: Area in square meters (Number).
          - coOwnershipShare: The share value (Number).
          - constructionYear: Year of construction (Integer).
          - rooms: Number of rooms (Number, can be X.5).

        Return the data in this JSON format:
        {
          "name": "...",
          "managementType": "...",
          "managerName": "...",
          "accountantName": "...",
          "buildings": [
            {
              "name": "...",
              "street": "...",
              "houseNumber": "...",
              "postcode": "...",
              "additionalInfo": "...",
              "units": [
                {
                  "unitNumber": "...",
                  "type": "...",
                  "floor": "...",
                  "entrance": "...",
                  "sizeSqM": 0.0,
                  "coOwnershipShare": 0.0,
                  "constructionYear": 2000,
                  "rooms": 0.0
                }
              ]
            }
          ]
        }
      `;

      // Call the Responses API with Base64 PDF
      // Note: This API specifically supports the input_file format for direct Base64
      const response = await (this.openai as any).responses.create({
        model: "gpt-4o",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: prompt },
              {
                type: "input_file",
                file_data: `data:application/pdf;base64,${base64Pdf}`,
                filename: "document.pdf"
              }
            ]
          }
        ],
        text: {
          format: { type: "json_object" }
        }
      });

      // The structure of the Responses API response might differ slightly from Chat Completions
      // Extracting content based on the Responses API spec
      const content = response.output?.[0]?.content?.[0]?.text || response.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('OpenAI returned an empty response');
      }

      return JSON.parse(content);

    } catch (err) {
      this.logError('Native Base64 PDF extraction failed in AiService via Responses API:', err);
      throw err;
    }
  }
}
