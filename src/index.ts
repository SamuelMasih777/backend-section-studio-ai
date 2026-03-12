import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './models/config';
import sectionRouter from './routes/sectionRouter';

const app = express();
const port = config.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/sections', sectionRouter);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Section Studio AI Backend is running!' });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
