import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la conexión a la base de datos
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Función para establecer la conexión a la base de datos
const connectToDB = async () => {
  try {
    const connection = await mysql.createConnection(config);
    console.log('Connection established to the database');
    return connection;
  } catch (err) {
    console.error('Error connecting to the database', err);
    throw err;
  }
};

export class PaymentModel {
  static connection = null;

  // GET CREDIT CARD BY NUMBER
  static async getCardByNumber(cardNumber) {
    const connection = await connectToDB();
    const [rows] = await connection.execute(
      "SELECT * FROM creditcards WHERE card_number = ?",
      [cardNumber]
    );
    return rows.length ? rows[0] : null;
  }

  // REGISTER CREDIT CARD
  static async addCreditCard(user_email, card_number, cardholder_name, expiration_date, balance = 0) {
    const connection = await connectToDB();

    const existingCard = await this.getCardByNumber(card_number);
    if (existingCard) {
      return { success: false, message: "Esta tarjeta ya está registrada" };
    }

    await connection.execute(
      `INSERT INTO creditcards (user_email, card_number, cardholder_name, expiration_date, balance)
       VALUES (?, ?, ?, ?, ?)`,
      [user_email, card_number, cardholder_name, expiration_date, balance]
    );

    return { success: true, message: "Tarjeta registrada exitosamente" };
  }

  // GET CARDS BY USER EMAIL
  static async getCardsByEmail(userEmail) {
    const connection = await connectToDB();
    const [rows] = await connection.execute(
      "SELECT * FROM creditcards WHERE user_email = ?",
      [userEmail]
    );
    return rows;
  }

  // TOP-UP
  static async topUpBalance(cardNumber, amount) {
    const connection = await connectToDB();

    const card = await this.getCardByNumber(cardNumber);
    if (!card) {
      return { success: false, message: "Tarjeta no encontrada" };
    }

    await connection.execute(
      "UPDATE creditcards SET balance = balance + ? WHERE card_number = ?",
      [amount, cardNumber]
    );

    return { success: true, message: `Saldo recargado con éxito. Nuevo saldo: $${card.balance + amount}` };
  }

  // DELETE CREDIT CARD BY NUMBER
  static async deleteCard(cardNumber) {
    const connection = await connectToDB();
    const [result] = await connection.execute(
        "DELETE FROM creditcards WHERE card_number = ?",
        [cardNumber]
    );

    if (result.affectedRows === 0) {
        return { success: false, message: "Tarjeta no encontrada" };
    }

    return { success: true, message: "Tarjeta eliminada exitosamente" };
  }

}
export default PaymentModel;
