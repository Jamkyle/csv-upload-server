
import request from 'supertest';
import express from 'express';
import multer from 'multer';
import { csvFileController } from '@/controllers/csvFileController';
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.post('/upload', upload.single('file'), csvFileController);

describe('Controller', () => {
    describe('csvController', () => {
        it('should return 400 if no file is uploaded', async () => {
            const response = await request(app).post('/upload');
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('No file uploaded.');
        });

        it('should handle males and females correctly and return a zip file', async () => {
            const mockCSVContent = `gender,name\nmale,John Doe\nfemale,Jane Doe`;
            const mockFileBuffer = Buffer.from(mockCSVContent);

            const response = await request(app)
                .post('/upload')
                .attach('file', mockFileBuffer, {
                    filename: 'test.csv',
                    contentType: 'text/csv'
                });

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toBe('application/zip');

            const buffer = response.body; // This should be a Buffer for the ZIP
            expect(buffer).toBeInstanceOf(Buffer); // Ensure the response is a Buffer
        });
    });

})
