import request from 'supertest';
import express from 'express';
import csvRoutes from '@/routes/csvRoutes';

const app = express();
app.use(express.json());
app.use('/api', csvRoutes);

describe('File Upload API', () => {
    it('should return 200 on valid CSV upload', async () => {
        const response = await request(app)
            .post('/api/upload')
            .attach('csvfile', './src/tests/csvtest/test.csv');
        expect(response.status).toBe(200);
        expect(response.header['content-type']).toMatch(/zip/);
    });

    it('should return 400 on invalid file type', async () => {
        const response = await request(app)
            .post('/api/upload')
            .attach('csvfile', './src/tests/csvtest/text.txt');
        expect(response.status).toBe(400);
    });
});