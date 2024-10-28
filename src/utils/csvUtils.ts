import { CSVGenerator } from '@/services/CSVGenerator';
import { Person } from '@/types/Person';
import archiver from 'archiver';
import { Response } from 'express';
import fs from 'fs';

export const isValidCSV = (file: Express.Multer.File | undefined): boolean => {
    if (!file) {
        return false;
    }
    return file.mimetype === 'text/csv' || file.mimetype === 'application/csv';
};

export const createDirectoryIfNotExists = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }); // Utiliser 'recursive' pour s'assurer que tous les niveaux sont créés
    }
};

export const processRow = (data: Person, malesWriteStream: fs.WriteStream, femalesWriteStream: fs.WriteStream, csvGenerator: CSVGenerator) => {
    const row = csvGenerator.formatRow(data);
    if (data.gender === 'male') {
        malesWriteStream.write(row);
    } else if (data.gender === 'female') {
        femalesWriteStream.write(row);
    }
};

export const cleanupFiles = (files: string[]) => {
    for (const file of files) {
        fs.unlink(file, (err) => {
            if (err) {
                console.error(`Failed to delete file ${file}:`, err);
            }
        });
    }
};

export const zipFiles = async (malesFilePath: string, femalesFilePath: string, res: Response) => {
    const zip = archiver('zip');
    res.attachment('results.zip');
    zip.pipe(res);
    zip.file(malesFilePath, { name: 'males.csv' });
    zip.file(femalesFilePath, { name: 'females.csv' });
    await zip.finalize();
};