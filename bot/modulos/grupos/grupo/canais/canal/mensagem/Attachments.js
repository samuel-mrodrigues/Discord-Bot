export class Attachments {
    #id
    #filename
    #description
    #content_type
    #size
    #url
    #proxy_url
    #heigth
    #width
    #ephemeral

    /**
     * ID do Attachment
     * @param {Number} id 
     */
    setId(id) {
        this.#id = id
        return this
    }

    /**
     * Define o nome do arquivo anexado
     * @param {String} nome 
     */
    setNomeArquivo(nome) {
        this.#filename = nome
        return this
    }

    /**
     * Define a descrição do arquivo
     * @param {String} descricao 
     */
    setDescricao(descricao) {
        this.#description = descricao
        return this
    }

    /**
     * Define o tipo do conteudo anexado
     * @param {'application'|'audio'|'image'|'message'|'multipart'|'text'|'video'} tipo
        @description application/javascript
        @description application/json
        @description application/ld+json
        @description application/msword (.doc)
        @description application/pdf
        @description application/sql
        @description application/vnd.api+json
        @description application/vnd.ms-excel (.xls)
        @description application/vnd.ms-powerpoint (.ppt)
        @description application/vnd.oasis.opendocument.text (.odt)
        @description application/vnd.openxmlformats-officedocument.presentationml.presentation (.pptx)
        @description application/vnd.openxmlformats-officedocument.spreadsheetml.sheet (.xlsx)
        @description application/vnd.openxmlformats-officedocument.wordprocessingml.document (.docx)
        @description application/x-www-form-urlencoded
        @description application/xml
        @description application/zip
        @description application/zstd (.zst)
        @description audio/mpeg
        @description audio/ogg
        @description image/avif
        @description image/jpeg (.jpg, .jpeg, .jfif, .pjpeg, .pjp) [11]
        @description image/png
        @description image/svg+xml (.svg)
        @description multipart/form-data
        @description text/css
        @description text/csv
        @description text/html
        @description text/xml
     */
    setTipoConteudo(tipo) {
        this.#content_type = tipo
        return this
    }

    /**
     * Define o tamanho em bytes do arquivo
     * @param {Number} bytes 
     */
    setTamanho(bytes) {
        this.#size = bytes
        return this
    }

    /**
     * Define o URL do arquivo de origem
     * @param {String} url 
     * @returns 
     */
    setURL(url) {
        this.#url = url
        return this
    }

    /**
     * Define o URL Proxy do arquivo de origem
     * @param {String} url 
     */
    setProxyURL(url) {
        this.#proxy_url = url
        return this
    }

    /**
     * Define o tamanho Height da imagem(se o arquivo for imagem)
     * @param {Number} tamanho 
     */
    setHeigth(tamanho) {
        this.#heigth = tamanho
        return this
    }

    /**
     * Define o tamanho WIdth da imagem(se o arquivo for imagem)
     * @param {Number} tamanho 
     */
    setWidth(tamanho) {
        this.#width = tamanho
        return this
    }

    /**
     * Define se esse attachment será ephemeral ou não
     * @description Ephemeral attachments will automatically be removed after a set period of time. 
     * @description Ephemeral attachments on messages are guaranteed to be available as long as the message itself exists.
     * @param {Boolean} bool 
     */
    setEphemeral(bool) {
        this.#ephemeral = bool
        return this
    }
}
