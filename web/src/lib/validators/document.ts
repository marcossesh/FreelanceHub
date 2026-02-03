// web/src/lib/validators/document.ts

/**
 * Validates Brazilian CPF (Cadastro de Pessoas Físicas)
 * Checks length, repeated digits, and verification digits
 */
export function validateCPF(cpf: string): boolean {
    const clean = cpf.replace(/\D/g, "");
    if (clean.length !== 11) return false;

    // Reject known invalid patterns (all same digits)
    if (/^(\d)\1+$/.test(clean)) return false;

    // Validate first verification digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(clean[i]) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (parseInt(clean[9]) !== digit) return false;

    // Validate second verification digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(clean[i]) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (parseInt(clean[10]) !== digit) return false;

    return true;
}

/**
 * Validates Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica)
 * Checks length, repeated digits, and verification digits
 */
export function validateCNPJ(cnpj: string): boolean {
    const clean = cnpj.replace(/\D/g, "");
    if (clean.length !== 14) return false;

    // Reject known invalid patterns (all same digits)
    if (/^(\d)\1+$/.test(clean)) return false;

    // Validation weights for first digit
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    // Validation weights for second digit
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    // Validate first verification digit
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(clean[i]) * weights1[i];
    }
    let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (parseInt(clean[12]) !== digit) return false;

    // Validate second verification digit
    sum = 0;
    for (let i = 0; i < 13; i++) {
        sum += parseInt(clean[i]) * weights2[i];
    }
    digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (parseInt(clean[13]) !== digit) return false;

    return true;
}

/**
 * Validates either CPF or CNPJ document
 * Returns validation result and document type
 */
export function validateDocument(doc: string): { valid: boolean; type: 'CPF' | 'CNPJ' | null } {
    const clean = doc.replace(/\D/g, "");

    if (clean.length === 11) {
        return { valid: validateCPF(clean), type: 'CPF' };
    }
    if (clean.length === 14) {
        return { valid: validateCNPJ(clean), type: 'CNPJ' };
    }

    return { valid: false, type: null };
}
