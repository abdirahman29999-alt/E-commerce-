import express from 'express';
import cors from 'cors';
import { apiRouter } from '../server/routes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Mount routes at both /api and root to handle any Vercel rewrite configuration
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
