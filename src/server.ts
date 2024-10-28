import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import csvRoutes from './routes/csvRoutes';

const env = process.env.NODE_ENV || 'local';
dotenv.config({ path: `.env.${env}` })

const app = express();

const port = process.env.port || 5000;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
// Middleware to parse JSON bodies
app.use(express.json());
app.use('/api', csvRoutes)

// Start the server
const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

if (module?.hot) {
    module?.hot.dispose(() => { server.close(() => console.log('Server closed on HMR restart')) });
}