//Importações para ter o autocomplete
import { Bot } from "../../../../../bot.js";
import { EVENTOS } from "../../../../../eventos/eventos.js";
import { Handler_Info } from "../../../../../servicos/receber/handlers/Handler.js";
import GatewayMensagem from "../../../../../websocket/gateway_mensagem.js";
import Canais from "../Canais.js";
import FormData from "form-data"

// Objeto mensagem que é enviado
import { MensagemEnviar, Mensagem_Retorno } from "./mensagem/Mensagem.js";

// Estruturas de certos campos para ter o auto complete
import { Canal_Estrutura } from "./Canal_Estrutura.js"

import { gerar_mensagem_multipart, RequisicaoStatus } from "../../../../utils/Utils.js"

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
     * @return {Promise<RequisicaoStatus>} Retorna um objeto contendo as informações da requisição
     * 
     */
    async enviar_mensagem(MensagemObjeto) {

        // Verifica se o objeto mensagem é valido
        if (!(MensagemObjeto instanceof MensagemEnviar)) {
            throw "A mensagem deve ser um tipo Mensagem!!"
        }

        // Uma mensagem ao Discord é necessario pelo menos conter o conteudo, enbds, sticker ids or arquivos
        if ((MensagemObjeto.content == undefined || MensagemObjeto.content == "") && MensagemObjeto.embeds.length == 0 && MensagemObjeto.sticker_ids.length == 0 && MensagemObjeto.files == undefined) {
            throw "Para enviar uma mensagem, um desses campos devem estar preenchidos: content, embeds, stickers ou files"
        }

        // Referencia do serviço que envia mensagens
        let servico_enviar = this.get_bot().get_servicos().get_servico_enviar()

        // Infos da requisição atual
        // tipo_dados define o tipo do conteudo que será enviado no body
        // data contem os dados a enviar.
        let info_requisicao = {
            tipo_dados: "application/json",
            data: MensagemObjeto.toJSON()
        }

        // Se a mensagem contiver arquivos, preciso enviar uma mensagem compativel com o tipo multipart
        if (MensagemObjeto.files != undefined) {

            // Chama o gerador de multipart
            let multipart_dados = gerar_mensagem_multipart(MensagemObjeto)

            // Altera o tipo de dados da requisição para multipart, contendo o boundary gerado pelo gerador
            info_requisicao.tipo_dados = `multi-part/formdata; boundary=${multipart_dados.getBoundary()}`

            // Define a informação do multipart para enviar no body da requisição
            info_requisicao.data = multipart_dados
        }

        // Solicita o envio da informação
        let resposta_envio = await servico_enviar.enviar_requisicao({
            tipo: "POST",
            endpoint_nome: `channels/${this.#canal_dados.id}/messages`,
            data: info_requisicao.data,
            propriedades: {
                headers: {
                    'Content-Type': `${info_requisicao.tipo_dados}`
                }
            }
        })

        // Objeto de resposta enviado novamente para quem chamou a função
        return new RequisicaoStatus(resposta_envio)
    }

    /**
     * Cadastra os handlers desse canal
     */
    cadastra_handlers() {
        let handler_manager = this.#canais_manager.get_grupo().get_grupo_manager().get_modulo().get_bot().get_handlers()

        let handler_atualizou_canal = handler_manager.add_handler(EVENTOS.GUILDS.CHANNEL_UPDATE, (update) => {
            let channel_id = update.get_data().id
            if (channel_id == this.#canal_dados.id) {
                this.#evento_atualizou_canal(update)
            }
        })
        this.#handlers.push(handler_atualizou_canal)
    }

    /**
     * Permite que vc inclua uma função para executar quando certo evento for disparado em relação a esse canal
     * @param {EVENTOS} tipo_evento 
     * @param {Function} funcao_executar 
     */
    on(tipo_evento, funcao_executar) {
        this.log(`Adicionando novo evento ON ${tipo_evento}`)
        let handler_manager = this.#canais_manager.get_grupo().get_grupo_manager().get_modulo().get_bot().get_handlers()

        let handler_usuario = handler_manager.add_handler(tipo_evento, dados_gateway => {
            let canal_id;

            if (dados_gateway.get_data().channel_id != undefined) {
                canal_id = dados_gateway.get_data().channel_id
            } else if (dados_gateway.get_data().id != undefined) {
                canal_id = dados_gateway.get_data().id
            }

            if (canal_id != undefined && canal_id == this.#canal_dados.id) {
                funcao_executar(dados_gateway.get_data())
            }
        })
        this.#handlers.push(handler_usuario)
    }

    /**
     * Quando o canal é atualizado com alguma informação nova
     * @param {GatewayMensagem} objeto_atualizar 
     */
    #evento_atualizou_canal(objeto_atualizar) {
        let discord_data = objeto_atualizar.get_data()
        for (const propriedade in discord_data) {
            if (this.#canal_dados[propriedade] != undefined && this.#canal_dados[propriedade] != discord_data[propriedade]) {
                this.#canal_dados[propriedade] = discord_data[propriedade]
            }
        }
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