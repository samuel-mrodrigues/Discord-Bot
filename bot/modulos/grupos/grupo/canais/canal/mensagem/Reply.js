/**
 * Esse objeto representa que a mensagem é uma resposta para outra mensagem
 */
export class Reply {
    /**
     * ID da mensagem para responder/foi respondida
     * @type {string}
     */
    message_id

    /**
     * ID do canal
     ** Essa propriedade não é necessario ao enviar, é somente para receber o evento
     * @type {string}
     */
    channel_id

    /**
     * ID da guilda
     ** Essa propriedade não é necessario ao enviar, é somente para receber o evento
     * @type {string}
     */
    guild_id

    /**
     * True ou false para disparar um erro de retorno caso a mensagem respondida não exista mais. Padrão é true caso não especificado
     * essa propriedade
     * @type {boolean}
     */
    fail_if_not_exists
}