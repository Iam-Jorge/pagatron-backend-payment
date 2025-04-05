import { PaymentModel } from '../models/paymentModel.js';
import { validateCardDetails, convertExpirationDate } from '../config/validateCard.js';

export class PaymentController {
    // Registrar tarjeta
    static async addCard(req, res) {
        const { user_email, card_number, cardholder_name, expiration_date } = req.body;

        // Validar los detalles de la tarjeta
        const validation = validateCardDetails(card_number, expiration_date);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        const formattedExpirationDate = convertExpirationDate(expiration_date);

        const result = await PaymentModel.addCreditCard(user_email, card_number, cardholder_name, formattedExpirationDate);
        if (!result.success) {
            return res.status(400).json({ error: result.message });
        }

        res.status(201).json({ message: result.message });
    }

    // GET CARDS BY USER EMAIL
    static async getAllCards(req, res) {
        try {
            const userEmail = req.query.user_email;

            if (!userEmail) {
                return res.status(400).json({ error: "El correo del usuario es necesario" });
            }

            const cards = await PaymentModel.getCardsByEmail(userEmail);

            console.log('Cards fetched from DB:', cards); // Log para ver las tarjetas obtenidas de la base de datos

            if (cards.length === 0) {
                console.log('No cards found for user:', userEmail);
                return res.status(404).json({ message: "No se encontraron tarjetas para este usuario." });
            }

            console.log('Sending cards to client:', cards);
            res.json(cards);
        } catch (error) {
            console.error('Error al obtener las tarjetas:', error); // Log para ver el error
            res.status(500).json({ error: 'Error al obtener las tarjetas' });
        }
    }

    // Validar los detalles de la tarjeta
    static async validateCard(req, res) {
        const { card_number, expiration_date } = req.body;

        const validation = validateCardDetails(card_number, expiration_date);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        const card = await PaymentModel.getCardByNumber(card_number);
        if (!card) {
            return res.status(404).json({ error: "Tarjeta no encontrada" });
        }

        res.json({ message: "Tarjeta válida", card });
    }

    // Recargar saldo
    static async topUp(req, res) {
        const { card_number, amount } = req.body;

        if (amount <= 0) {
            return res.status(400).json({ error: "Monto inválido" });
        }

        const result = await PaymentModel.topUpBalance(card_number, amount);
        if (!result.success) {
            return res.status(400).json({ error: result.message });
        }

        res.json({ message: result.message });
    }

    // Método para eliminar tarjeta
    static async deleteCard(req, res) {
        try {
            const cardNumber = req.params.cardNumber;
            
            if (!cardNumber) {
                return res.status(400).json({ error: "El número de tarjeta es necesario" });
            }
            
            const result = await PaymentModel.deleteCard(cardNumber);
            if (!result.success) {
                return res.status(404).json({ error: result.message });
            }
            
            res.json({ message: result.message });
        } catch (error) {
            console.error('Error al eliminar la tarjeta:', error);
            res.status(500).json({ error: 'Error al eliminar la tarjeta' });
        }
    }

    static async getBalance(req, res) {
        const { user_email } = req.query;
        if (!user_email) {
            return res.status(400).json({ error: "El correo del usuario es necesario" });
        }
    
        const result = await PaymentModel.getBalance(user_email);
        if (!result.success) {
            return res.status(400).json({ error: result.message });
        }
    
        res.json({ balance: result.balance });
    }
}