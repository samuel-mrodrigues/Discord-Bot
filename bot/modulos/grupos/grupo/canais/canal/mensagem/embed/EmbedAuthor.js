export class EmbedAuthor {
    #nome
    #url
    #icon_url
    #proxy_icon_url

    /**
     * Define o nome do autor
     * @param {String} nome 
     */
    setNome(nome) {
        this.#nome = nome
        return this
    }

    /**
     * Define o url do autor
     * @param {String} url 
     */
    setURL(url) {
        this.#url = url
        return this
    }

    /**
     * Define o URL do icone
     * @param {String} nome 
     */
    setIconURL(url) {
        this.#icon_url = url
        return this
    }

    /**
     * Define o URL proxy do icone
     * @param {String} url 
     */
    setProxyIronURL(url) {
        this.#proxy_icon_url
        return this
    }
}