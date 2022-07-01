import { Bot } from "../../../../../bot.js";
import { EVENTOS } from "../../../../../eventos/eventos.js";
import { Handler_Info } from "../../../../../servicos/receber/handlers/Handler.js";
import GatewayMensagem from "../../../../../websocket/gateway_mensagem.js";

import Canais from "../Canais.js";
import CANAL_CAMPOS from "./Canal_Estrutura.js"
import { MensagemEnviar } from "./mensagem/Mensagem.js";
/**
 * Representa um canal do Discord
 */
export default class Canal {

    /**
     * Mostrar logs?
     */
    #mostrar_logs = true

    /**
     * O Canal Manager responsavel por esse canal
     * @type {Canais}
     */
    #canais_manager;

    /**
     * Objeto dados desse canal
     * @type {CANAL_CAMPOS}
     */
    #canal_dados;

    /**
     * Handlers de evento vinculado ao canal
     * @type {[Handler_Info]}
     */
    #handlers = []

    /**
     * Armazena a lista de mensagens enviadas neste canal desde o momento em que o BOT estava conectado
     */
    #mensagens = []

    /**
     * Inicia um novo objeto canal
     * @param {Canais} canais_manager
     * @param {CANAL_CAMPOS} canal_objeto 
     */
    constructor(canais_manager, canal_objeto) {
        this.#canais_manager = canais_manager
        this.#canal_dados = canal_objeto

        this.cadastra_handlers()
    }

    /**
     * Retorna os dados objeto desse canal
     */
    get_dados() {
        return this.#canal_dados
    }

    /**
     * Retorna o BOT vinculado a esse canal
     * @returns {Bot}
     */
    get_bot() {
        return this.#canais_manager.get_grupo().get_grupo_manager().get_modulo().get_bot()
    }

    /**
     * Envia uma mensagem ao canal atual 
     * @param {MensagemEnviar} MensagemObjeto mensagem para enviar
     * @return {Promise<{sucesso: boolean, data: import("axios").AxiosResponse, erro: string}>} Retorna um objeto contendo as informações da requisição
     */
    async enviar_mensagem(MensagemObjeto) {

        // Objeto de retorno para quem chamar essa função..
        let retorno = {
            sucesso: false,
            data: null,
            erro: null
        }

        // Verifica se o objeto mensagem é valido
        if (!(MensagemObjeto instanceof MensagemEnviar)) {
            throw "A mensagem deve ser um tipo Mensagem valido!"
        }

        // Uma mensagem ao Discord é necessario pelo menos conter o conteudo, enbds, sticker ids or arquivos
        if ((MensagemObjeto.getConteudo() == undefined || MensagemObjeto.getConteudo() == "") && MensagemObjeto.getEmbeds().length == 0 && MensagemObjeto.getStickersIDs().length == 0) {
            throw "Um dos campos é necessario para enviar: Conteudo, Embeds, Sticker IDs ou Files"
        }

        // Prepara o objeto mensagem para enviar, setando as propriedades da mensagem
        let objeto_msg = {}
        objeto_msg.content = MensagemObjeto.getConteudo()
        objeto_msg.tts = MensagemObjeto.getTTS()
        if (MensagemObjeto.getEmbeds().length != 0) objeto_msg.embeds = MensagemObjeto.getEmbeds()
        if (MensagemObjeto.getMencoesPermitidas() != undefined) objeto_msg.allowed_mentions = MensagemObjeto.getMencoesPermitidas()
        if (MensagemObjeto.getMensagemReferencia() != undefined) objeto_msg.message_reference = MensagemObjeto.getMensagemReferencia()
        if (MensagemObjeto.getComponentes().length != 0) objeto_msg.components = MensagemObjeto.getComponentes()
        if (MensagemObjeto.getStickersIDs().length != 0) objeto_msg.sticker_ids = MensagemObjeto.getStickersIDs()
        if (MensagemObjeto.getPayloadJSON() != undefined) objeto_msg.payload_json = MensagemObjeto.getPayloadJSON()
        if (MensagemObjeto.getAttachments().length != 0) objeto_msg.attachments = MensagemObjeto.getAttachments()

        this.log(`Enviando nova mensagem, informações:`)
        this.log(objeto_msg)

        let servico_enviar = this.get_bot().get_servicos().get_servico_enviar()

        let resposta_envio = await servico_enviar.enviar_requisicao({
            tipo: "POST",
            data: objeto_msg,
            endpoint_nome: `channels/${this.#canal_dados.id}/messages`
        })

        if (resposta_envio.sucesso) {
            retorno.sucesso = true
            retorno.data = resposta_envio.requisicao
        } else {
            retorno.erro = resposta_envio.erro
        }

        return retorno
    }

    /**
     * Cadastra os handlers desse canal
     */
    cadastra_handlers() {
        let handler_manager = this.#canais_manager.get_grupo().get_grupo_manager().get_modulo().get_bot().get_handlers()

        let handler_nova_mensagem = handler_manager.add_handler(EVENTOS.GUILD_MESSAGES.MESSAGE_CREATE, (mensagem_info) => {
            let channel_id = mensagem_info.get_data().channel_id;

            if (channel_id == this.#canal_dados.id) {
                this.#evento_nova_mensagem(mensagem_info)
            }
        })

        let handler_mensagem_editada = handler_manager.add_handler(EVENTOS.GUILD_MESSAGES.MESSAGE_UPDATE, (mensagem_editada) => {
            let channel_id = mensagem_editada.get_data().channel_id
            if (channel_id == this.#canal_dados.id) {
                this.#evento_editou_mensagem(mensagem_editada)

            }
        })

        let handler_mensagem_excluida = handler_manager.add_handler(EVENTOS.GUILD_MESSAGES.MESSAGE_DELETE, (mensagem_excluida) => {
            let channel_id = mensagem_excluida.get_data().channel_id
            if (channel_id == this.#canal_dados.id) {
                this.#evento_excluiu_mensagem(mensagem_excluida)

            }
        })

        let handler_esta_digitando = handler_manager.add_handler(EVENTOS.GUILD_MESSAGE_TYPING.TYPING_START, (digitando) => {
            let channel_id = digitando.get_data().channel_id
            if (channel_id == this.#canal_dados.id) {
                this.#evento_digitando(digitando)
            }
        })

        this.#handlers.push(handler_nova_mensagem)
        this.#handlers.push(handler_mensagem_editada)
        this.#handlers.push(handler_mensagem_excluida)
        this.#handlers.push(handler_esta_digitando)
    }

    /**
     * Ao chegar uma nova mensagem
     * @param {GatewayMensagem} objeto_gateway 
     */
    #evento_nova_mensagem(objeto_gateway) {

    }

    /**
     * Ao editar uma nova mensagem
     * @param {GatewayMensagem} objeto_gateway 
     */
    #evento_editou_mensagem(objeto_gateway) {

    }

    /**
     * Ao excluir uma nova mensagem
     * @param {GatewayMensagem} objeto_gateway 
     */
    #evento_excluiu_mensagem(objeto_gateway) {

    }

    /**
     * Ao começar escrever uma mensagem
     * @param {GatewayMensagem} objeto_gateway 
     */
    #evento_digitando(objeto_gateway) {
        console.log(`Usuario ${objeto_gateway.get_data().member.user.username} está digitando algo no canal ${this.#canal_dados.name}`);
    }

    /**
     * Exclui os handlers desse canal
     */
    excluir_handlers() {
        let handler_manager = this.#canais_manager.get_grupo().get_grupo_manager().get_modulo().get_bot().get_handlers()
        for (const handler_info of this.#handlers) {
            handler_manager.remove_handler(handler_info)
        }
    }

    /**
     * Ativar ou desativar logs desse canal
     * @param {Boolean} bool 
     */
    ativar_logs(bool) {
        this.#mostrar_logs = bool
    }

    log(msg) {
        if (!this.#mostrar_logs) return;
        if (typeof msg == 'string') {
            console.log(`[CANAL ${this.#canal_dados.name}]: ${msg}`);
        } else {
            console.log(`-----------------------[${this.#canal_dados.name}]-----------------------`);
            console.log(msg);
            console.log("-------------------------------------------------------");
        }
    }
}