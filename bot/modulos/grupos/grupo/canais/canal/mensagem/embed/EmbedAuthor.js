
/**
 * Informações de Autor do embed
 */
export class EmbedAuthor {
    /**
     * Nome do autor
     * @type {string}
     */
    name

    /**
     * URL do autor
     * @type {string}
     */
    url

    /**
     * URL do icone do autor
     * @type {string}
     */
    icon_url

    /**
     * URL Proxy do icone do autor
     * @type {string}
     */
    proxy_icon_url

    /**
     * Define o nome do autor
     * @param {String} nome 
     */
    setNome(nome) {
        this.name = nome
        return this
    }

    /**
     * Define o url do autor
     * @param {String} url 
     */
    setURL(url) {
        this.url = url
        return this
    }

    /**
     * Define o URL do icone
     * @param {String} nome 
     */
    setIconURL(url) {
        this.icon_url = url
        return this
    }

    /**
     * Define o URL proxy do icone
     * @param {String} url 
     */
    setProxyIronURL(url) {
        this.proxy_icon_url = url
        return this
    }
}