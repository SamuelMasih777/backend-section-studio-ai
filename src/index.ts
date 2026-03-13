import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './models/config';
import sectionRouter from './routes/sectionRouter';
import categoryRouter from './routes/categoryRouter';
import tagRouter from './routes/tagRouter';
import bundleRouter from './routes/bundleRouter';
import authRouter from './routes/authRouter';

import sequelize from './models/db';

const app = express();
const port = config.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/sections', sectionRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/tags', tagRouter);
app.use('/api/bundles', bundleRouter);
app.use('/api/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Section Studio AI Backend is running!' });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('[database]: Connection has been established successfully.');
        
        // Sync models to database (creates missing tables)
        await sequelize.sync({ alter: false }); 
        console.log('[database]: Database models synced successfully.');
        
        app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('[database]: Unable to connect to the database:', error);
        process.exit(1);
    }
};

startServer();
