
import request from 'supertest';
import express from 'express';
import multer from 'multer';
import { csvFileController } from '@/controllers/csvFileController';
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.post('/upload', upload.single('file'), csvFileController);

describe('Controller', () => {

    describe('POST /upload', () => {
        it('should return 400 if no file is uploaded', async () => {
            const response = await request(app).post('/upload');
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('No file uploaded.');
        });

        it('should return a ZIP file on successful upload', async () => {
            const mockCSVContent = `gender,name\nmale,John Doe\nfemale,Jane Doe`;
            const mockFileBuffer = Buffer.from(mockCSVContent);

            const response = await request(app)
                .post('/upload')
                .attach('file', mockFileBuffer, {
                    filename: 'test.csv',
                    contentType: 'text/csv'
                }).buffer()
                .parse((res, callback) => {
                    res.setEncoding('binary');
                    res.on('data', (chunk) => {
                        callback(null, Buffer.from(chunk, 'binary')); // Convert to Buffer
                    });
                });
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toBe('application/zip');

            expect(response.body).toBeInstanceOf(Buffer);
        });

        it('should return 500 if CSV files are empty', async () => {
            // Simulate an upload where the processing results in empty CSV files
            const mockCSVContent = `gender,name\n`;
            const mockFileBuffer = Buffer.from(mockCSVContent);

            const response = await request(app)
                .post('/upload')
                .attach('file', mockFileBuffer, {
                    filename: 'empty.csv',
                    contentType: 'text/csv'
                })

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('CSV files are empty.');
        });
    });

})
