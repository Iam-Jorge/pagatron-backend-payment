import express, { json } from 'express';
import cors from 'cors'
import { PORT } from './src/config/config.js';
import { paymentRouter } from './src/routes/paymentRoutes.js';
import { corsMiddleware } from './src/middlewares/cors.js';
import { createDB } from './src/config/dbConfig.js'; 

const app = express();
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')
app.use('/payment', paymentRouter);

{ /* This functions checks and creates the scheme and tables */ }
{ /* createDB(); */ }

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
