const validateCardNumber = (cardNumber) => {
    const cardRegex = /^\d{16}$/;
    if (!cardRegex.test(cardNumber)) {
        return { valid: false, message: "Número de tarjeta inválido" };
    }
    return { valid: true };
};

const validateExpirationDate = (expirationDate) => {
    const dateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!dateRegex.test(expirationDate)) {
        return { valid: false, message: "Fecha de expiración inválida (MM/YY)" };
    }

    const [month, year] = expirationDate.split('/').map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return { valid: false, message: "La tarjeta ha expirado" };
    }

    return { valid: true };
};

const convertExpirationDate = (expirationDate) => {
    const [month, year] = expirationDate.split('/');
    const currentYear = new Date().getFullYear();
    const fullYear = `20${year}`;
    const formattedDate = `${fullYear}-${month.padStart(2, '0')}-01`;
    return formattedDate;
};

export const validateCardDetails = (cardNumber, expirationDate) => {
    const cardNumberValidation = validateCardNumber(cardNumber);
    if (!cardNumberValidation.valid) {
        return cardNumberValidation;
    }

    const expirationDateValidation = validateExpirationDate(expirationDate);
    if (!expirationDateValidation.valid) {
        return expirationDateValidation;
    }

    return { valid: true };
};

export { convertExpirationDate };
