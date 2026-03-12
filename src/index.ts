import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http') && !supabaseUrl.includes('your_supabase_url_here')) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('[supabase]: Client initialized successfully');
  } catch (error) {
    console.error('[supabase]: Failed to initialize client:', error);
  }
} else {
  console.warn('[supabase]: Supabase credentials missing or invalid. Client not initialized.');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
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
