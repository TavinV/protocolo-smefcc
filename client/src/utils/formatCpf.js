/**
 * Formata um cpf no padrão XXX.XXX.XXX-XX
 * @param {String} value CPF apenas com números 
 * @returns {String} formatedCpf 
 */
const formatCpf = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return numbers.substring(0, 14);
};

export default formatCpf;
