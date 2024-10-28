import { Request, Response } from 'express';
import { Readable } from 'stream';
import archiver from 'archiver';
import csv from 'csv-parser';
import fs from 'fs';

import path from 'path';
import os from 'os';
import { CSVGenerator } from '@/services/CSVGenerator';
import { Person } from '@/types/Person';
import { cleanupFiles, processRow, zipFiles } from '@/utils/csvUtils';

export const csvFileController = async (req: Request, res: Response): Promise<void> => {
    const file = req.file;
    if (!file) {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
    }

    const csvGenerator = new CSVGenerator();
    const malesFilePath = path.join(os.tmpdir(), 'males.csv');
    const femalesFilePath = path.join(os.tmpdir(), 'females.csv');

    const malesWriteStream = fs.createWriteStream(malesFilePath);
    const femalesWriteStream = fs.createWriteStream(femalesFilePath);

    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);

    const readStream = csv();
    bufferStream
        .pipe(readStream)
        .on('data', (data: Person) => processRow(data, malesWriteStream, femalesWriteStream, csvGenerator))
        .on('end', async () => {
            malesWriteStream.end();
            femalesWriteStream.end();

            // Wait for streams to finish writing
            await Promise.all([
                new Promise((resolve) => malesWriteStream.on('finish', resolve)),
                new Promise((resolve) => femalesWriteStream.on('finish', resolve))
            ]);

            try {
                if (fs.statSync(malesFilePath).size === 0 || fs.statSync(femalesFilePath).size === 0) {
                    return res.status(500).json({ error: 'CSV files are empty.' });
                }
            } catch (error) {
                console.error('Error checking file:', error);
                return res.status(500).json({ error: 'Failed to check file sizes.' });
            }

            await zipFiles(malesFilePath, femalesFilePath, res);
        })
        .on('error', (err) => {
            console.error('Stream error:', err);
            res.status(500).json({ error: 'Failed to process file' });
        })
        .on('close', () => {
            // Cleanup temporary files
            cleanupFiles([malesFilePath, femalesFilePath]);
        });
};
