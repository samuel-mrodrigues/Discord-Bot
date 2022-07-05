/**
 * Este objeto imagem permite adicionar uma imagem ao conteudo Embed
 */
export class EmbedImage {
    /**
     * URL da imagem
     ** Pode ser um URL HTTP(S) ou ID do attachment
     * @type {string}
     */
    url

    /**
     * URL Proxy da imagem
     ** Pode ser um URL HTTP(S) ou ID do attachment
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
 * Define o URL da imagem
 * @param {String} url 
 */
    setURL(url) {
        this.url = url
        return this
    }

    /**
     * Define o URL de Proxy da imagem
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