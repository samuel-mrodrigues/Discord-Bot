import { MencaoPermitida } from "./MencaoPermitida.js"
import { Reply } from "./Reply.js"
import { Componente } from "./Componente.js"
import { Attachments } from "./Attachments.js"
import { Embed } from "./embed/Embed.js"

export class MensagemEnviar {

    /**
     * Texto da mensagem por exemplo
     * @type {String}
     */
    #conteudo

    /**
     * Enviar mensagem como TTS?
     * @type {Boolean}
     */
    #tts = false

    /**
     * Lista de objetos embds
     * @type {[Embed]}
     */
    #embeds = []

    /**
     * Lista de menções permitidas na mensagem
     * @type {MencaoPermitida}
     */
    #allowed_mentions

    /**
     * Objeto para responder a uma mensagem
     * Só inclua caso queira que a mensagem seja considerada uma resposta a outra mensagem
     * @type {Reply}
     */
    #message_reference

    /**
     * Lista de Componentes interativos da mensagem
     * @type {[Componente]}
     */
    #components = []

    /**
     * IDs de Stickers do servidor
     * @type {[Number]}
     */
    #sticker_ids = []

    /**
     * ?????
     * @type {String}
     */
    #files

    /**
     * String codificada em JSON contendo parametros não pertencentes a arquivos, somente para requisições multipart/form-data
     * @type {String}
     */
    #payload_json

    /**
     * Lista de attachments para incluir na mensagem
     * @type {[Attachments]}
     */
    #attachments = []

    /**
     * Seta as flags da mensagem
     * @type {Number}
     */
    #flags

    /**
     * Define o conteudo da mensagem
     * @param {string} msg 
     */
    setConteudo(msg) {
        this.#conteudo = msg
        return this
    }

    /**
     * Retorna o conteudo da mensagem
     * @returns {String}
     */
    getConteudo() {
        return this.#conteudo
    }

    /**
     * Enviar mensagem no modo TTS?
     * @param {boolean} bool 
     */
    ativaTTS(bool) {
        this.#tts = bool
        return this
    }

    /**
     * Retorna se a mensagem é modo TTS
     * @returns {Boolean}
     */
    getTTS() {
        return this.#tts
    }

    /**
     * Propriedades do objeto Embed
     * @param {[Embed]} embed_objeto 
     */
    setEmbeds(embed_objeto) {
        this.#embeds = embed_objeto
        return this
    }

    /**
     * Retorna os objetos Embeds da mensagem
     * @returns {[Embed]}
     */
    getEmbeds() {
        return this.#embeds
    }

    /**
     * Define as menções permitidas da mensagem
     * @param {MencaoPermitida} mencao_objeto
     */
    setMencoesPermitida(mencao_objeto) {
        this.#allowed_mentions = mencao_objeto
        return this
    }

    /**
     * Retorna o objeto Menções, que mostra pra quem é permitido as menções
     * @returns {MencaoPermitida}
     */
    getMencoesPermitidas() {
        return this.#message_reference
    }

    /**
     * Incluir um objeto Reply considerará essa mensagem como uma resposta de outra
     * @param {Reply} msgref_objeto 
     * @returns 
     */
    setMensagemReferencia(msgref_objeto) {
        this.#message_reference = msgref_objeto
        return this
    }

    /**
     * Retorna o objeto Reply, que é uma resposta a uma mensagem
     * @returns {Reply}
     */
    getMensagemReferencia() {
        return this.#message_reference
    }

    /**
     * Define uma lista de componentes para serem utilizados na mensagem
     * @param {[Componente]} param0 
     */
    setComponentes(componentes) {
        this.#components = componentes
        return this
    }

    /**
     * Retorna os componentes de interações vinculado a essa mensagem
     * @returns {[Componente]}
     */
    getComponentes() {
        return this.#components
    }

    /**
     * IDs dos emojis no servidor para usar na mensagem (Maximo 3)
     * @param {[Number]} ids 
     */
    setStickersID(ids) {
        this.#sticker_ids = ids
        return this
    }

    /**
     * Retorna uma lista de IDs com os emojis selecionados
     * @returns {[Number]}
     */
    getStickersIDs() {
        return this.#sticker_ids
    }

    /**
     * JSON-encoded body of non-file params, only for multipart/form-data requests
     * @param {String} payload 
     */
    setPayloadJSON(payload) {
        this.#payload_json = payload
        return this
    }

    /**
     * Retorna o payload JSON codificado em String
     * @returns {String}
     */
    getPayloadJSON() {
        return this.#payload_json
    }

    /**
     * Define os attachments da mensagem
     * @param {[Attachments]} lista_attachments 
     * @returns 
     */
    setAttachments(lista_attachments) {
        this.#attachments = lista_attachments
        return this
    }

    /**
     * Retorna uma lista de attachments vinculados a mensagem
     * @returns {[Attachments]}
     */
    getAttachments() {
        return this.#attachments
    }

    /**
     * Retorna uma string contendo as informações da mensagem
     */
    toString() {
        let str = ""

        str += `Content: ${this.#conteudo} \n`
        str += `TTS?: ${this.#tts} \n`
        str += `Embeds: ${this.#embeds} \n`
        str += `Allowed Mentions: ${this.#allowed_mentions} \n`
        str += `Message_Refenrece: ${this.#message_reference} \n`
        str += `Components: ${this.#components} \n`
        str += `Sticker IDs: ${this.#sticker_ids} \n`
        str += `Files: ${this.#files} \n`
        str += `Payload JSON: ${this.#payload_json} \n`
        str += `Attachments: ${this.#attachments} \n`
        str += `Flags: ${this.#flags} \n`

        return str
    }

}
