
/**
 * Um objeto footer, que ficara localizado ao fim do objeto embed
 */
 export class EmbedFooter {

  /**
   * Texto do footer
   * @type {string}
   */
  text

  /**
   * URL de algum icone
   * @type {string}
   */
  icon_url

  /**
   * URL Proxy de algum icone
   * @type {string}
   */
  proxy_icon_url

  /**
* Define o texto do footer
* @type {String} texto
*/
  setTexto(texto) {
      this.text = texto
      return this
  }

  /**
   * Define o URL do icone
   * Pode ser um URL ou um attachment que foi incluido na mensagem
   * @param {String} url 
   */
  setIconeURL(url) {
      this.icon_url = url
      return this
  }

  /**
   * Define o URL Proxy do icone
   * @param {String} url 
   */
  setProxyIconeURL(url) {
      this.proxy_icon_url = url
      return this
  }
}