// web/src/lib/validation-constants.ts

/**
 * Centralized validation rules to avoid magic numbers throughout codebase.
 * Change here to update globally.
 */
export const VALIDATION_RULES = {
    PASSWORD: {
        MIN_LENGTH: 8, // Increased from 6 for better security
        MAX_LENGTH: 72, // bcrypt maximum
    },
    NAME: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 50,
    },
    DOCUMENT: {
        CPF_LENGTH: 11,
        CNPJ_LENGTH: 14,
    },
    EMAIL: {
        MAX_LENGTH: 254, // RFC 5321
    },
    INVOICE: {
        MAX_AMOUNT: 1_000_000, // R$ 1.000.000
        MIN_AMOUNT: 0.01,      // R$ 0,01
        NOTES_MAX_LENGTH: 500,
    },
    SHARE_LINK: {
        EXPIRY_DAYS: 7, // Share links expire after 7 days
    },
} as const;

/**
 * Validation error messages
 */
export const VALIDATION_MESSAGES = {
    PASSWORD: {
        TOO_SHORT: `Senha deve ter pelo menos ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} caracteres`,
        TOO_LONG: `Senha deve ter no máximo ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} caracteres`,
    },
    NAME: {
        TOO_SHORT: `Nome deve ter pelo menos ${VALIDATION_RULES.NAME.MIN_LENGTH} caracteres`,
        TOO_LONG: `Nome deve ter no máximo ${VALIDATION_RULES.NAME.MAX_LENGTH} caracteres`,
    },
    INVOICE: {
        TOO_SMALL: "Valor deve ser maior que zero",
        TOO_LARGE: `Valor máximo: R$ ${VALIDATION_RULES.INVOICE.MAX_AMOUNT.toLocaleString('pt-BR')}`,
        INVALID_DATE: "Data de vencimento deve ser futura",
    },
} as const;
