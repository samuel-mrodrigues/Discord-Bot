export class EmbedField {
    #name
    #value
    #inline

    /**
     * Define o nome do campo/field
     * @param {String} nome 
     */
    setNome(nome) {
        this.#name = nome
        return this
    }

    /**
     * Define o valor do campo
     * @param {String} valor 
     */
    setValor(valor) {
        this.#value = valor
        return this
    }

    /**
     * Se esse campo deve ser mostrado em uma linha ou não
     * @param {Boolean} bool 
     */
    setIsInline(bool) {
        this.#inline = bool
        return this
    }
}