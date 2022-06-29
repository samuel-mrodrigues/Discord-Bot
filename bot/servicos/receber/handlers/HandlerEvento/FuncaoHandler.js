/**
 * Representa uma função handler
 * 
 * Cada função handler possui um ID unico de identificação e a função que será executada
 */
export default class FuncaoHandler {
    /**
     * O ID unico desse handler
     * @type {Number}
     */
    #id = -1

    /**
     * A função que será executada
     * @type {Function}
     */
    #funcao = () => { }

    /**
     * Inicia o objeto handler
     * @param {Number} id 
     * @param {Function} funcao 
     */
    constructor(id, funcao) {
        this.#id = id
        this.#funcao = funcao
    }

    /**
     * 
     * @returns {Number} ID unico de identificação desse handler
     */
    get_id() {
        return this.#id
    }

    /**
     * 
     * @returns {Function} Função que é executada
     */
    get_funcao() {
        return this.#funcao
    }

    /**
     * Executa a função com o parametro recebido do gateway
     */
    executar(argumentos) {
        this.#funcao(argumentos)
    }
}