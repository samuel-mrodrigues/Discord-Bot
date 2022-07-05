//Importações para ter o autocomplete
import { Bot } from "../../../../../bot.js";
import { EVENTOS } from "../../../../../eventos/eventos.js";
import { Handler_Info } from "../../../../../servicos/receber/handlers/Handler.js";
import GatewayMensagem from "../../../../../websocket/gateway_mensagem.js";
import Canais from "../Canais.js";
import FormData from "form-data"

import fs from "fs"

// Objeto mensagem que é enviado
import { MensagemEnviar, Mensagem_Retorno } from "./mensagem/Mensagem.js";

// Estruturas de certos campos para ter o auto complete
import { Canal_Estrutura } from "./Canal_Estrutura.js"

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
     * @type {Canal_Estrutura}
     */
    #canal_dados;

    /**
     * Handlers de evento vinculado ao canal
     * @type {[Handler_Info]}
     */
    #handlers = []

    /**
     * Inicia um novo objeto canal
     * @param {Canais} canais_manager
     * @param {Canal_Estrutura} canal_objeto 
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
     * @return {Promise<EnvioMensagemRetorno>} Retorna um objeto contendo as informações da requisição
     * 
     */
    async enviar_mensagem(MensagemObjeto) {

        // Verifica se o objeto mensagem é valido
        if (!(MensagemObjeto instanceof MensagemEnviar)) {
            throw "A mensagem deve ser um tipo Mensagem!"
        }

        // Uma mensagem ao Discord é necessario pelo menos conter o conteudo, enbds, sticker ids or arquivos
        if ((MensagemObjeto.content == undefined || MensagemObjeto.content == "") && MensagemObjeto.embeds.length == 0 && MensagemObjeto.sticker_ids.length == 0 && MensagemObjeto.files == undefined) {
            throw "Para enviar uma mensagem, um desses campos devem estar preenchidos: content, embeds, stickers ou files"
        }

        // Prepara o objeto mensagem para enviar, setando as propriedades da mensagem
        let objeto_msg = {}

        // Verifica as propriedades que foram enviadas
        if (MensagemObjeto.content != undefined) objeto_msg.content = MensagemObjeto.content
        if (MensagemObjeto.tts != undefined) objeto_msg.tts = MensagemObjeto.tts
        if (MensagemObjeto.embeds.length != 0) objeto_msg.embeds = MensagemObjeto.embeds
        if (MensagemObjeto.allowed_mentions != undefined) objeto_msg.allowed_mentions = MensagemObjeto.allowed_mentions
        if (MensagemObjeto.message_reference != undefined) objeto_msg.message_reference = MensagemObjeto.message_reference
        if (MensagemObjeto.components.length != 0) objeto_msg.components = MensagemObjeto.componentesToJSON()
        if (MensagemObjeto.sticker_ids.length != 0) objeto_msg.sticker_ids = MensagemObjeto.sticker_ids
        if (MensagemObjeto.payload_json != undefined) objeto_msg.payload_json = MensagemObjeto.payload_json
        if (MensagemObjeto.attachments != 0) objeto_msg.attachments = MensagemObjeto.attachments

        // Referencia do serviço que envia mensagens
        let servico_enviar = this.get_bot().get_servicos().get_servico_enviar()

        // Prepara a resposta de retorno pro usuario que chamou essa função
        let resposta = new EnvioMensagemRetorno()

        // Infos da requisição atual
        let info_requisicao = {
            is_multipart: false,
            formdata_multipart: {}
        }

        // Se a mensagem contiver arquivos, a mensagem será enviada de forma diferente
        // Será mandado no formato multipart/form-data, contendo inicialmente o payload_json, que é todo os dados da mensagem codificado em uma string JSON
        // E logo apos o payload_json, contem os arquivos e seus dados que serão feito upload no CDN do Discord
        if (MensagemObjeto.files != undefined) {
            info_requisicao.is_multipart = true
            let formdata = new FormData()

            formdata.append("payload_json", JSON.stringify(objeto_msg), {
                contentType: "application/json"
            })

            // Anexa os arquivos 
            for (const arquivo of MensagemObjeto.files.arquivos_adicionados) {
                if (arquivo.tipo_conteudo == undefined) continue;
                formdata.append(`files[${arquivo.id_unico}]`, arquivo.dados_buffer, { contentType: arquivo.tipo_conteudo, filename: arquivo.nome_arquivo })
            }

            info_requisicao.formdata_multipart = formdata
        }

        console.log(objeto_msg);
        console.log(info_requisicao.formdata_multipart);
        // return;

        // Solicita o envio da informação
        let resposta_envio = await servico_enviar.enviar_requisicao({
            tipo: "POST",
            // Se for uma requisição multipart, envio o formdata acima, caso contrario, envio o objeto_msg que é um JSON da data
            data: info_requisicao.is_multipart ? info_requisicao.formdata_multipart : objeto_msg,
            // Endpoint do discord que irá receber
            endpoint_nome: `channels/${this.#canal_dados.id}/messages`,
            // Propriedades da requisição
            // Se tiver arquivos na mensagem, defino o type como multipart, caso contrario, deixo como JSON por padrão
            propriedades: {
                headers: {
                    'Content-Type': `${info_requisicao.is_multipart ? `multipart/form-data; boundary=${info_requisicao.formdata_multipart.getBoundary()}` : 'application/json'}`
                }
            }
        })

        // Objeto de resposta enviado novamente para quem chamou a função
        // Se sucesso, anexo as informações recebidas ao objeto de retorno
        if (resposta_envio.sucesso) {
            resposta.sucesso = true
            resposta.data.requisicao = resposta_envio.requisicao
            resposta.data.discord_data = resposta.data.requisicao.data
        } else {
            resposta.erro = resposta_envio.erro
        }

        return resposta
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

/**
 * Corpo de um objeto que é retornado quando é enviado alguma mensagem ao canal de Discord
 */
export class EnvioMensagemRetorno {
    /**
 * @description True se a requisição for realizada com sucesso, falso caso contrario.
 * @description Esse sucesso é apenas se a mensagem foi enviada com sucesso até o destino, se o Discord retornou um erro com relação a algum campo incorreto na mensagem
 * a requisição ainda é considerada como true, somente erros de conexão irão fazer essa opção ser false
 * @type {boolean}
 */
    sucesso = false;

    /**
     * Informações retornadas pela requisição e pelo Discord
     */
    data = {
        /**
         * Informações da requisição enviada, url, headers, cookies, etc...
         * @type {import("axios").AxiosResponse}
         */
        requisicao: null,
        /**
         * Retorna um objeto, que contem as informações da mensagem que foi criada. Essa informação é enviada pelo Discord.
         * @type {Mensagem_Retorno}
         */
        discord_data: null
    }

    /**
     * Informações de erro caso ocorra algum
     ** Se nenhum erro acontecer, essa propriedade estara nula!
     */
    erro
}
