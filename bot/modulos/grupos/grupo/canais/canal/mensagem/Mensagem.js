import { MencaoPermitida } from "./MencaoPermitida.js"
import { ComponenteActionRow, ComponenteButton, ComponenteSelectMenu, ComponenteSelectMenuOpcao } from "./componente/Componente.js"
import { Reply } from "./Reply.js"
import { Attachment } from "./attachments/Attachments.js"
import { Embed } from "./embed/Embed.js"
import { Arquivos } from "./files/Files.js"
import { MensagemFlag } from "./MensagemFlag.js"


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
   * Attachments para incluir na mensagem
   * @type {[Attachment]}
   */
  attachments = []

  /**
   * Seta as flags da mensagem
   * @type {MensagemFlag}
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
  * @param {[Embed]} embed_objeto Um array contendo objetos do tipo Embed
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
   * @param {[Componente]} componentes 
   */
  setComponents(componentes) {
    this.components = componentes
    return this
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
   * Define arquivos(imagens ou texto) para utilizar em outros componentes, como Embeds.
   ** Essa função só serve para arquivos que vc possui "em disco", tipo uma imagem no seu codigo-fonte
   ** Essa função automaticamente cria o attachment com o nome exato que vc espeficiar nos arquivos, sendo 
   assim possivel utilizar em outros lugares na mensagem, como embeds por exemplo
   * @param {Arquivos} arquivo_objeto
   */
  setFiles(arquivo_objeto) {
    this.files = arquivo_objeto

    for (const arquivo of this.files.arquivos_adicionados) {
      let objeto_attach = new Attachment()

      objeto_attach.filename = arquivo.nome_arquivo
      objeto_attach.content_type = arquivo.tipo_conteudo

      if (arquivo.propriedades != undefined) {
        objeto_attach.description = arquivo.propriedades.descricao
        objeto_attach.heigth = arquivo.propriedades.heigth
        objeto_attach.width = arquivo.propriedades.width
        objeto_attach.ephemeral = arquivo.propriedades.vincular_a_mensagem
      }

      let ultimo_id = 0
      if (this.attachments.length != 0) {
        ultimo_id = this.attachments[this.attachments.length - 1].id
        ultimo_id++
      }
      arquivo.id_unico = ultimo_id

      this.addAttachment(objeto_attach)
    }
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
   * Adiciona um objeto attachment a lista de attachments
   ** Attachments são arquivos que vc anexa em algum local da mensagem, sendo no proprio corpo da mensagem ou em embds
   * @param {Attachment} objeto_attachment 
   */
  addAttachment(objeto_attachment) {
    if (objeto_attachment.id == undefined) {
      let ultimo_id = 0

      if (this.attachments.length != 0) {
        ultimo_id = this.attachments[this.attachments.length - 1].id
        ultimo_id++
      }
      objeto_attachment.id = ultimo_id
    }

    this.attachments.push(objeto_attachment)
    return this
  }

  /**
   * Adicionar varios attachments a mensagem. Isso irá excluir previamente outros attachments e adicionar somente os especificados aqui
   ** Attachments são arquivos que vc anexa em algum local da mensagem, sendo no proprio corpo da mensagem ou em embds
   * @param {[Attachment]} objetos_attachments 
   */
  setAttachments(objetos_attachments) {
    this.attachments = []
    for (const attachment of objetos_attachments) {
      this.addAttachment(attachment)
    }
    return this
  }

  /**
   * Objeto flag, contendo as regras dessa mensagem
   * @type {MensagemFlag} Objeto flag
   */
  setFlags(flag_objeto) {
    this.flags = flag_objeto
    return this
  }

  toJSON() {
    let obj_msg = {}

    Object.assign(obj_msg,
      { content: this.content },
      { tts: this.tts },
      { embeds: this.embeds },
      { allowed_mentions: this.allowed_mentions },
      { message_reference: this.message_reference },
      { components: this.components },
      { sticker_ids: this.sticker_ids },
      { attachments: this.attachments },
      { flags: this.flags != undefined ? this.flags.get_flag_numero() : 0 }
    )

    return obj_msg
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