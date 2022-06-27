export class Mensagem {
    /**
     * Conteudo que será enviado na mensagem ao canal de chat
     * @type {string}
     */
    conteudo = ""

    /**
     * ID do canal em que a mensagem será enviada
     * @type {number}
     */
    canal_id = 0

    constructor() {

    }

    /**
     * Seta o conteudo da mensagem
     * @param {string} valor
     */
    set conteudo(valor) {
        if (valor != null && valor.length != 0) {
            this.conteudo = valor;
        } else {
            throw new "O conteudo da mensagem não pode ser vazio"
        }
    }

    /**
     * Seta o id do canal que será enviado a mensagem
 * @param {number} valor
 */
    set canal_id(valor) {
        if (valor != null && valor.length > 0) {
            this.canal_id = valor;
        } else {
            throw new "O ID do grupo não pode ser nullo ou <= 0"
        }
    }
} 