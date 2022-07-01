export class MensagemFlag {
    FLAGS = {
        /**
         * this message has been published to subscribed channels (via Channel Following)

         */
        CROSSPOSTED: 1 << 0,
        /**
         * this message originated from a message in another channel (via Channel Following)

         */
        IS_CROSSPOST: 1 << 1,
        /**
         * do not include any embeds when serializing this message
         */
        SUPPRESS_EMBDS: 1 << 2,
        /**
         * the source message for this crosspost has been deleted (via Channel Following)
         */
        SOURCE_MESSAGE_DELETED: 1 << 3,
        /**
         * this message came from the urgent message system
         */
        URGENT: 1 << 4,
        /**
         * this message has an associated thread, with the same id as the message
         */
        HAS_THREAD: 1 << 5,
        /**
         * this message is only visible to the user who invoked the Interaction
         */
        EPHEMERAL: 1 << 6,
        /**
         * this message is an Interaction Response and the bot is "thinking"
         */
        LOADING: 1 << 7,
        /**
         * this message failed to mention some roles and add their members to the thread
         */
        FAILED_TO_MENTION_SOME_ROLES_IN_THREAD: 1 << 8
    }

    /**
     * Armazena as flags ativadas
     * @type {[{nome, hex}]}
     */
    #flags = []

    /**
     * 
     * @param {FLAGS} flags 
     */
    constructor(flags) {
        if (flags == null) {
            return;
        }
    }

    /**
     * Adicionar flags
     * @param {FLAGS} flags 
     */
    adicionar_flag(flags) {
        for (const flag_nome in flags) {

            if (this.#flags.find(flag_existente => {
                if (flag_existente.nome == flag_nome) {
                    return true;
                }
            }) != undefined) continue;

            this.#flags.push({
                nome: flag_nome,
                hex: FLAGS[flag_nome]
            })
        }
    }

    /**
     * Remover flags
     * @param {FLAGS} flag 
     */
    remover_intent(flag) {
        for (const flag_nome in flag) {
            this.#flags = this.#flags.filter((flag_info) => {
                if (flag_info.nome != flag_nome) {
                    return true;
                }
            })
        }
    }

    /**
     * Retorna um numero unico, que é a combinação de todas as flags ativadas
     * @returns {Number}
     */
    get_flag_numero() {
        let total = 0;

        for (const flag of this.#flags) {
            total += flag.hex
        }
        return total;
    }
}