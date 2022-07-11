/**
 * Este objeto representa uma thumbnail de alguma imagem que aparecerá ao lado direito do conteudo embed
 */
export class EmbedThumbnail {
    /**
     * URL da imagem
     ** Pode ser um url HTTP(S) ou um ID attachment 
     * @type {string}
     */
    url

    /**
     * URL Proxy da imagem
     ** Pode ser um url HTTP(S) ou um ID attachment 
     * @type {string}
     */
    proxy_url

    /**
     * Altura da imagem
     * @type {number}
     */
    height

    /**
     * Largura da imagem
     * @type {number}
     */
    width

    /**
     * Define o URL da thumbnail
     * Pode ser um URL ou um attachment que foi incluido na mensagem
     * @param {String} url 
     */
    setURL(url) {
        this.url = url
        return this
    }

    /**
     * Define o URL de Proxy da thumbnail
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