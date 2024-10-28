import multer, { FileFilterCallback, MulterError } from 'multer';
import { Request, Response, NextFunction } from 'express';

const MAX_MEMORY_SIZE = 5 * 1024 * 1024;

const csvFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const isCSV = file.mimetype.includes('csv');
    cb(null, isCSV);
};


export const csvFileMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.headers['content-length'] ? parseInt(req.headers['content-length'], 10) : null;
    const upload = multer({
        storage:  multer.memoryStorage(),
        fileFilter: csvFileFilter,
    }).single('csvfile');

    upload(req, res, (err: any) => {
        if (err instanceof MulterError) {
            return res.status(400).json({ error: 'Download Error', details: err.message });
        } else if (err) {
            return res.status(500).json({ error: 'Download Failed', details: err.message });
        }
        next();
    });
};