/**
 * Um template de como será um objeto retornado pelo Discord desse evento
 */
export const Interacao_Resposta = {
    version: 0,
    type: 0,
    token: '',
    message: {
        type: 0,
        tts: false,
        timestamp: '',
        pinned: false,
        mentions: [],
        mention_roles: [],
        mention_everyone: false,
        id: '',
        flags: 0,
        embeds: [],
        edited_timestamp: null,
        content: '',
        components: [[Object]],
        channel_id: '',
        author: {
            username: '',
            public_flags: 0,
            id: '',
            discriminator: '',
            bot: true,
            avatar_decoration: null,
            avatar: null
        },
        attachments: []
    },
    member: {
        user: {
            username: '',
            public_flags: 0,
            id: '',
            discriminator: '',
            avatar_decoration: null,
            avatar: ''
        },
        roles: [],
        premium_since: null,
        permissions: '',
        pending: false,
        nick: '',
        mute: false,
        joined_at: '',
        is_pending: false,
        flags: 0,
        deaf: false,
        communication_disabled_until: null,
        avatar: null
    },
    locale: '',
    id: '',
    guild_locale: '',
    guild_id: '',
    data: { custom_id: '', component_type: 0 },
    channel_id: '',
    application_id: '',
    app_permissions: ''
}

export const Interacao_Tipo_Resposta = {
    /**
     * Responde a interação com uma mensagem
     */
    CHANNEL_MESSAGE_WITH_SOURCE: 4,
    /**
     * Confirma a interação e edita a resposta depois, no chat irá aparecer como carregando
     */
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
    /**
     * Somente para componentes
     ** Confirma a interação e edita a resposta depois, no chat não aparece como carregando
     */
    DEFERRED_UPDATE_MESSAGE: 6,
    /**
     * Somente para componentes
     ** Edita a mensagem do componente vinculado
     */
    UPDATE_MESSAGE: 7,
    /**
     * Responde para uma interação de auto complete de comandos
     */
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: 8,
    /**
     * Responde para uma interação com menu modal
     */
    MODAL: 9
}