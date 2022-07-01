export class EmbedThumbnail {
    #url
    #proxy_url
    #height
    #width

    /**
     * Define o URL da thumbnail
     * @param {String} url 
     */
    setURL(url) {
        this.#url = url
        return this
    }

    /**
     * Define o URL de Proxy da thumbnail
     * @param {String} url 
     */
    setProxyURL(url) {
        this.#proxy_url = url
        return this
    }

    /**
     * Define o tamanho HEIGHT
     * @param {Number} tamanho 
     */
    setHeight(tamanho) {
        this.#height = tamanho
        return this
    }

    /**
     * Define o tamanho WIDTH
     * @param {Number} tamanho 
     */
    setWidth(tamanho) {
        this.#width = tamanho
        return this
    }
}