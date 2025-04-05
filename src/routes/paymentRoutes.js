import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController.js';

export const paymentRouter = Router();

// Root route
paymentRouter.get('/', (req, res) => {
  res.send("En pagos");
});

paymentRouter.post('/add-card', PaymentController.addCard);
paymentRouter.post('/validate-card', PaymentController.validateCard);
paymentRouter.post('/top-up', PaymentController.topUp);
paymentRouter.get('/cards', PaymentController.getAllCards);
paymentRouter.delete('/delete-card/:cardNumber', PaymentController.deleteCard);
paymentRouter.get('/balance', PaymentController.getBalance);