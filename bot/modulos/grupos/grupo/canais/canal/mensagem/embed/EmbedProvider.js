export class EmbedProvider {
    /**
     * Nome do provedor
     * @type {string}
     */
    name

    /**
     * URL do provedor
     * @type {string}
     */
    url

    /**
     * Define o nome do provedor
     * @param {String} nome 
     */
    setNome(nome) {
        this.name = nome
        return this
    }

    /**
     * Define o URL do provedor
     * @param {String} url 
     */
    setURL(url) {
        this.url = url
        return this
    }
}