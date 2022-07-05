import { MencaoPermitida } from "./MencaoPermitida.js"
import { ComponenteActionRow, ComponenteButton, ComponenteSelectMenu, ComponenteSelectMenuOpcao } from "./componente/Componente.js"
import { Reply } from "./Reply.js"
import { Attachments } from "./Attachments.js"
import { Embed } from "./embed/Embed.js"
import { Arquivos } from "./files/Files.js"


/**
 * Uma classe contendo informações da mensagem que será enviada
 * Essa classe contem embutido todas as propriedades para mandar variados tipos de mensagens
 */
export class MensagemEnviar {
    /**
     * Texto da mensagem que será exibido
     * @type {String}
     */
    content

    /**
     * Enviar mensagem como TTS?
     * @type {Boolean}
     */
    tts = false

    /**
     ** Lista de objetos embeds 
     ** Um objeto Embed é uma caixinha contendo varias informações, como titulo, imagens, descrição, headers, footers, etc..
     * @type {[Embed]}
     */
    embeds = []

    /**
     * Objeto MencaoPermitida, que controla quem poderá ser marcado nessa mensagem
     ** Apenas ignore essa propriedade se vc quiser o comportamento normal de mencionar qualquer usuario ou cargo
     * @type {MencaoPermitida}
     */
    allowed_mentions

    /**
     * Objeto para responder a uma mensagem
     * Só inclua caso queira que a mensagem seja considerada uma resposta a outra mensagem
     * @type {Reply}
     */
    message_reference

    /**
     * Lista de Componentes interativos da mensagem
     * A lista de componentes disponiveis se encontram em /componente a partir do diretorio desse arquivo
     * @type {[ComponenteActionRow | ComponenteButton | ComponenteSelectMenu]}
     */
    components = []

    /**
     * IDs de Stickers do servidor
     * @type {[Number]}
     */
    sticker_ids = []

    /**
     * Inclui arquivos para enviar junto a mensagem
     * @type {Arquivos}
     */
    files

    /**
     * String codificada em JSON contendo parametros não pertencentes a arquivos, somente para requisições multipart/form-data
     * @type {String}
     */
    payload_json

    /**
     * Lista de attachments para incluir na mensagem
     * @type {[Attachments]}
     */
    attachments = []

    /**
     * Seta as flags da mensagem
     * @type {Number}
     */
    flags

    /**
     * Define o conteudo da mensagem
     * @param {string} msg 
     */
    setContent(msg) {
        this.content = msg
        return this
    }

    /**
     * Enviar mensagem no modo TTS?
     * @param {boolean} bool 
     */
    setTTS(bool) {
        this.tts = bool
        return this
    }

    /**
    * Propriedades do objeto Embed
    * @param {[Embed]} embed_objeto 
    */
    setEmbeds(embed_objeto) {
        this.embeds = embed_objeto
        return this
    }

    /**
     * Define as menções permitidas da mensagem
     * @param {MencaoPermitida} mencao_objeto
     */
    setAllowedMentions(mencao_objeto) {
        this.allowed_mentions = mencao_objeto
        return this
    }

    /**
     * Incluir um objeto Reply considerará essa mensagem como uma resposta de outra
     * @param {Reply} msgref_objeto 
     * @returns 
     */
    setMessageReference(msgref_objeto) {
        this.message_reference = msgref_objeto
        return this
    }

    /**
     * Define uma lista de componentes para serem utilizados na mensagem
     * @param {[Componente]} param0 
     */
    setComponents(componentes) {
        this.components = componentes
        return this
    }

    /**
     * Converte todos os objetos de componentes em JSON
     */
    componentesToJSON() {
        let comps = []
        for (const componente of this.components) {
            comps.push(componente.toJSON())
        }

        return comps
    }

    /**
     * IDs dos emojis no servidor para usar na mensagem (Maximo 3)
     * @param {[Number]} ids 
     */
    setStickersID(ids) {
        this.sticker_ids = ids
        return this
    }

    /**
     * 
     * @param {Arquivos} arquivo_objeto
     */
    setFiles(arquivo_objeto) {
        this.files = arquivo_objeto
        return this
    }

    /**
     * JSON-encoded body of non-file params, only for multipart/form-data requests
     * @param {String} payload 
     */
    setPayloadJSON(payload) {
        this.payload_json = payload
        return this
    }

    /**
     * Define os attachments da mensagem
     * @param {[Attachments]} lista_attachments 
     * @returns 
     */
    setAttachments(lista_attachments) {
        this.attachments = lista_attachments
        return this
    }
}

/**
 * Classe contendo os possiveis campos que o Discord retorna quando uma mensagem é enviada
 */
export const Mensagem_Retorno = {
    id: '',
    type: 0,
    content: '',
    channel_id: '',
    author: {
        id: '',
        username: '',
        avatar: null,
        avatar_decoration: null,
        discriminator: '',
        public_flags: 0,
        bot: true
    },
    attachments: [],
    embeds: [],
    mentions: [],
    mention_roles: [],
    pinned: false,
    mention_everyone: false,
    tts: false,
    timestamp: '',
    edited_timestamp: null,
    flags: 0,
    components: [],
    referenced_message: null
}