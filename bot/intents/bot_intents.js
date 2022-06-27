export const TIPOS_INTENTS = {
    /**
    Disparado em ações gerais dentro de um grupo
    - GUILD_CREATE
    - GUILD_UPDATE
    - GUILD_DELETE
    - GUILD_ROLE_CREATE
    - GUILD_ROLE_UPDATE
    - GUILD_ROLE_DELET
    - CHANNEL_CREATE
    - CHANNEL_UPDATE
    - CHANNEL_DELETE
    - CHANNEL_PINS_UPDATE
    - THREAD_CREATE
    - THREAD_UPDATE
    - THREAD_DELETE
    - THREAD_LIST_SYNC
    - THREAD_MEMBERS_UPDATE *
    - THREAD_MEMBER_UPDATE
    - STAGE_INSTANCE_CREATE
    - STAGE_INSTANCE_UPDATE
    - STAGE_INSTANCE_DELETE
    */
    INTENT_GRUPOS: 1 << 0,
    /**
    Disparado em ações relecionadas a algum usuario do grupo:
    - GUILD_MEMBER_ADD
    - GUILD_MEMBER_UPDATE
    - GUILD_MEMBER_REMOVE
    - THREAD_MEMBERS_UPDATE *
    */
    INTENT_GRUPOS_MEMBROS: 1 << 1,
    /**
    Disparado em ações relecionadas a banimentos:
    - GUILD_BAN_ADD
    - GUILD_BAN_REMOVE
    */
    INTENT_GRUPOS_BANS: 1 << 2,
    /**
    Disparado em ações relecionadas ao envio de emojis e stickers:
    - GUILD_EMOJIS_UPDATE
    - GUILD_STICKERS_UPDATE
    */
    INTENT_GRUPOS_EMOJIS_STICKERS: 1 << 3,
    /**
    Disparado em eventos de integração de um grupo, quando algum bot, 
    webhook, etc... é alterado/adicionado/removido
    - GUILD_INTEGRATIONS_UPDATE
    - INTEGRATION_CREATE
    - INTEGRATION_UPDATE
    - INTEGRATION_DELETE
    */
    INTENT_GRUPOS_INTEGRACOES: 1 << 4,
    /**
    Disparado em eventos de integração de um grupo, quando algum bot, 
    webhook, etc... é alterado/adicionado/removido
    - WEBHOOKS_UPDATE
    */
    INTENT_GRUPOS_WEBHOOKS: 1 << 5,
    /**
    Disparado em ações relecionadas a convites
    - INVITE_CREATE
    - INVITE_DELETE
    */
    INTENT_GRUPOS_CONVITES: 1 << 6,
    /**
    Disparado em mudança de status em canal de voz do usuario
    - VOICE_STATE_UPDATE
    */
    INTENT_GRUPOS_VOZ_STATUS: 1 << 7,
    /**
    Disparado em quando algum usuario altera seus status no servidor
    - PRESENCE_UPDATE
    */
    INTENT_GRUPOS_PRESENCA: 1 << 8,
    /**
    Disparado quando algum usuario interage com o chat de texto
    - MESSAGE_CREATE
    - MESSAGE_UPDATE
    - MESSAGE_DELETE
    - MESSAGE_DELETE_BULK
    */
    INTENT_GRUPOS_MENSAGENS: 1 << 9,
    /**
    Disparado quando o usuario reage a mensagens
    - MESSAGE_REACTION_ADD
    - MESSAGE_REACTION_REMOVE
    - MESSAGE_REACTION_REMOVE_ALL
    - MESSAGE_REACTION_REMOVE_EMOJI
    */
    INTENT_GRUPOS_REAGIR_MENSAGEM: 1 << 10,
    /**
    Disparado quando o usuario esta digitando
    - TYPING_START
    */
    INTENT_GRUPOS_DIGITANDO: 1 << 11,
    /**
    Disparado quando o usuario envia mensagem direta para outro
    - MESSAGE_CREATE
    - MESSAGE_UPDATE
    - MESSAGE_DELETE
    - CHANNEL_PINS_UPDATE
    */
    INTENT_GRUPOS_MENSAGEM_DIRETA: 1 << 12,
    /**
    Disparado quando o usuario reage a mensagens diretas
    - MESSAGE_REACTION_ADD
    - MESSAGE_REACTION_REMOVE
    - MESSAGE_REACTION_REMOVE_ALL
    - MESSAGE_REACTION_REMOVE_EMOJI
    */
    INTENT_GRUPOS_MENSAGEM_DIRETA_REAGIR: 1 << 13,
    /**
    Disparado quando o usuario esta digitando para uma mensagem direta
    - TYPING_START
    */
    INTENT_GRUPOS_MENSAGEM_DIRETA_DIGITANDO: 1 << 14,
    /**
    Por padrão, eventos disparados de mensagens do usuario não irão conter o conteudo do que foi digitado.
    Esse intent notifica o Discord para mandar também o conteudo das mensagens
    */
    INTENT_GRUPOS_RECEBER_MENSAGEM_CONTEUDO: 1 << 15,
    /**
    Recebe todos os eventos que o Discord lançar, sem exceções
    */
    INTENT_TUDO: -1
}
Object.freeze(TIPOS_INTENTS)

export class Intent {

    // Intents adicinados
    /**
     * Lista de intents selecionadas
     * @type {[{intent: string, hex: number}]}
     */
    #lista_de_intents = []

    /**
     * 
     * @param {TIPOS_INTENTS} intents_desejadas - Eventos que o BOT deverá receber do Discord, selecione a permissão e marque como true
     */
    constructor(intents_desejadas) {
        if (intents_desejadas == null) {
            return;
        }

        this.adicionar_intent(intents_desejadas)
    }

    // Intents adicinados
    /**
     * @returns {[TIPOS_INTENTS]} Array contendo intents selecionados
     */
    listar_intents() {
        return this.#lista_de_intents;
    }

    // Intents adicinados
    /**

     * @returns {number} Peso combinado dos intents selecionados
     */
    total_intent() {
        let total = 0;

        for (const intent of this.#lista_de_intents) {
            total += intent.hex
        }
        return total;
    }

    /**
     * Adiciona uma intent para a lista de intents. 
     * @param {TIPOS_INTENTS} intent 
     */
    adicionar_intent(intent) {
        for (const intent_nome in intent) {

            if (intent_nome == "INTENT_TUDO") {
                let todas_as_intents = {}

                for (const intent_nome2 in TIPOS_INTENTS) {
                    if (intent_nome2 == "INTENT_TUDO") continue;

                    Object.assign(todas_as_intents, {
                        [intent_nome2]: true
                    })
                }

                this.adicionar_intent(todas_as_intents)
                return;
            }

            if (this.#lista_de_intents.find((intent_existente) => {
                if (intent_existente.intent == intent_nome) {
                    return true;
                }
            }) != undefined) continue;

            this.#lista_de_intents.push({
                intent: intent_nome,
                hex: TIPOS_INTENTS[intent_nome]
            })
        }
    }

    /**
     * Remover uma intent da lista de intents
     * @param {TIPOS_INTENTS} intent 
     */
    remover_intent(intent) {
        for (const intent_nome in intent) {
            this.#lista_de_intents = this.#lista_de_intents.filter((intent_info) => {
                if (intent_info.intent != intent_nome) {
                    return true;
                }
            })
        }
    }

}