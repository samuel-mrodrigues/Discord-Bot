/**
 * Um objeto video para aparecer no conteudo embed
 */
export class EmbedVideo {

    /**
     * URL do video
     * @type {string}
     */
    url

    /**
     * URL Proxy do video
     * @type {string}
     */
    proxy_url

    /**
     * Altura do video
     * @type {number}
     */
    height

    /**
     * Largura do video
     * @type {number}
     */
    width

    /**
     * Define o URL do video
     * @param {String} url 
     */
    setURL(url) {
        this.url = url
        return this
    }

    /**
     * Define o URL de Proxy do video
     * @param {String} url 
     */
    setProxyURL(url) {
        this.proxy_url = url
        return this
    }

    /**
     * Define o tamanho HEIGHT
     * @param {Number} tamanho 
     */
    setHeight(tamanho) {
        this.height = tamanho
        return this
    }

    /**
     * Define o tamanho WIDTH
     * @param {Number} tamanho 
     */
    setWidth(tamanho) {
        this.width = tamanho
        return this
    }
}