import { EmbedAuthor } from "./EmbedAuthor.js"
import { EmbedField } from "./EmbedField.js"
import { EmbedFooter } from "./EmbedFooter.js"
import { EmbedImage } from "./EmbedImage.js"
import { EmbedProvider } from "./EmbedProvider.js"
import { EmbedThumbnail } from "./EmbedThumbnail.js"
import { EmbedVideo } from "./EmbedVideo.js"

/**
 * A classe Embed permite adicionar varias informações ao conteudo que será mostrada
 ** É possivel adicionar imagens, fotos, videos, headers, footers, thumbnails
 */
export class Embed {

    /**
     * Titulo do conteudo embed que aparece no topo
     * @type {String}
     */
    title

    /**
     * Tipo do conteudo embed que será mostrada.
     * @type {'rich' | 'image' | 'video' | 'gifv' | 'article' | 'link'}
     */
    type

    /**
     * Descrição do conteudo embed, que fica abaixo do titulo
     * @type {String}
     */
    description

    /**
     * URL para abrir ao clicar no titulo
     * @type {String}
     */
    url

    /**
     * Timestamp do conteudo embed, contendo as informações de data/hora
     * @type {ISO8601}
     */
    timestamp

    /**
     * Cor
     * @type {Number}
     */
    color

    /**
     * Objeto Footer
     ** Um footer para o embed, aparecendo logo apos o conteudo
     * @type {EmbedFooter} 
     */
    footer

    /**
     * Objeto Imagem
     * @type {EmbedImage}
     */
    image

    /**
     * Objeto Thumbnail
     * @type {EmbedThumbnail}
     */
    thumbnail

    /**
     * Objeto Video
     * @type {EmbedVideo}
     */
    video

    /**
     * Objeto Provider
     * @type {EmbedProvider}
     */
    provider

    /**
     * Objeto Author
     ** As informações do autor aparecem em cima do titulo do embed
     * @type {EmbedAuthor}
     */
    author

    /**
     * Objeto Fields
     * @type {[EmbedField]}
     */
    fields

    /**
     * Define o titulo do embed
     * @param {string} titulo 
     */
    setTitle(titulo) {
        this.title = titulo
        return this
    }

    /**
     * Define o tipo do conteudo a ser mostrado
     * @param {string} type
     */
    setType(type) {
        this.type = type
        return this
    }

    /**
     * Define a descrição do embed
     * @param {string} descricao 
     */
    setDescription(descricao) {
        this.description = descricao
        return this
    }

    /**
     * Define o URL que irá abrir ao clicar no titulo
     * @param {string} url 
     */
    setURL(url) {
        this.url = url
        return this
    }

    /**
     * Define as informações de data do embed
     * @param {string} timestamp 
     */
    setTimestamp(timestamp) {
        this.timestamp = timestamp
        return this
    }

    /**
     * Define a cor da caixinha do embed
     * @param {number} cor 
     */
    setColor(cor) {
        this.color = cor
        return this
    }

    /**
     * Define o footer do embed
     * @param {EmbedFooter} footer_objeto Classe footer
    */
    setFooter(footer_objeto) {
        this.footer = footer_objeto
        return this;
    }

    /**
     * Define a imagem que aparece no embed
     * @param {EmbedImage} imagem_objeto Classe imagem
     */
    setImage(imagem_objeto) {
        this.image = imagem_objeto
        return this
    }

    /**
     * Define a thumbnail que será mostrada do embed
     * @param {EmbedThumbnail} thumbnail_objeto Classe thumbnail
     */
    setThumbnail(thumbnail_objeto) {
        this.thumbnail = thumbnail_objeto
        return this
    }

    /**
     * Define o video que será mostrado no embed
     * @param {EmbedVideo} video_objeto Classe video
     */
    setVideo(video_objeto) {
        this.video = video_objeto
        return this
    }

    /**
     * Define o provider desse conteudo embed
     * @param {EmbedProvider} provider_objeto Classe provider
     */
    setProvider(provider_objeto) {
        this.provider = provider_objeto
        return this
    }

    /**
     * Define o author do embed
     * @param {EmbedAuthor} author_objeto Classe autor
     */
    setAuthor(author_objeto) {
        this.author = author_objeto
        return this
    }

    /**
     * Fields
     * @param {EmbedField} fields Classe field
     */
    setFields(fields) {
        this.fields = fields
    }
}