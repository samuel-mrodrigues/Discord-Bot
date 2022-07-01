export class Reply {
    #mensagem_id
    #channel_id
    #guild_id
    #fail_if_not_exists

    /**
     * ID da mensagem que se pretende responder
     * @param {Number} id 
     */
    setMsgId(id) {
        this.#mensagem_id = id
        return this
    }

    /**
     * ID do canal da mensagem
     * @param {Number} id 
     */
    setCanalId(id) {
        this.#channel_id = id
        return this
    }

    /**
     * ID da guilda da mensagem
     * @param {Number} id 
     */
    setGuildId(id) {
        this.#guild_id = id
        return this
    }
}