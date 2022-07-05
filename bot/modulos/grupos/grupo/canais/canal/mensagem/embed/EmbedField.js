/**
 * Um Field representa tipo um topico dentro do objeto Embed.
 */
export class EmbedField {
    /**
     * Nome/titulo desse campo
     * @type {string}
     */
    name

    /**
     * A descrição logo após o titulo
     * @type {string}
     */
    value

    /**
     * Se esse campo deve ser considerado como 'inline' ou 'block'. Mesma logica da propriedade CSS
     ** Se true, esse field ficara alinhado na mesma linha que outros fields proximos que estejam como inline também
     ** Se falso, esse field irá quebrar a linha para não ficar na mesma linha que outros fields
    * @type {boolean}
     */
    inline

    /**
     * Define o nome do campo/field
     * @param {String} nome 
     */
    setNome(nome) {
        this.name = nome
        return this
    }

    /**
     * Define o valor do campo
     * @param {String} valor 
     */
    setValor(valor) {
        this.value = valor
        return this
    }

    /**
     * Se esse campo deve ser mostrado em uma linha ou não
     * @param {Boolean} bool 
     */
    setIsInline(bool) {
        this.inline = bool
        return this
    }
}