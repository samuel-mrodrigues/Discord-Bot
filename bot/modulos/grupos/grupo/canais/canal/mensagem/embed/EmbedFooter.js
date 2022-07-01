export class EmbedFooter {
    #text
    #icon_url
    #proxy_icon_url

    /**
     * Define o texto do footer
     * @type {String} texto
     */
    setTexto(texto) {
        this.#text = texto
        return this
    }

    /**
     * Define o URL do icone
     * @param {String} url 
     */
    setIconeURL(url) {
        this.#icon_url = url
        return this
    }

    /**
     * Define o URL Proxy do icone
     * @param {String} url 
     */
    setProxyIconeURL(url) {
        this.#proxy_icon_url = url
        return this
    }
}