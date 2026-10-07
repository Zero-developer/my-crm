import express, { type Express, type Request, type Response } from 'express';
import { prisma } from './lib/prisma.js';
import clientsRouter from './routes/clients.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app: Express = express();

app.use(express.json());

app.use('/api/clients', clientsRouter);

//health of the api and database
app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'ok',
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected'
    });
  }
});

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("app listen port 3000");
});