import { PARAMETROS } from "../../../discord/parametros.js";
import Servico from "../Servicos.js";
import Axios from "axios"

export default class Enviar {
    /**
     * Mostrar logs?
     */
    #mostrar_logs = true;

    /**
     * API onde as requisições serão enviadas
     */
    #rest_api_url;

    /**
     * Serviço responsavel por esse modulo
     * @type {Servico}
     */
    #servico;

    //
    //  Abaixo é listado todos os modulos que o enviar será responsavel por tratar

    /**
     * Inicia o modulo de envio do BOT
     * @param {Servico} servico_manager 
     */
    constructor(servico) {
        this.#rest_api_url = PARAMETROS.REST_URL
        this.#servico = servico
    }

    /**
     * Retorna o URL do Discord onde as requisições serão enviadas
     */
    get_rest_url() {
        return this.#rest_api_url
    }

    /**
     * Envia uma requisição para o endpoint do Discord
     * @param {{tipo: 'POST' | 'GET', endpoint_nome: string, data: {chave: valor},  propriedades: import("axios").AxiosRequestConfig}} parametros_requisição
     * @returns {{sucesso: boolean, requisicao: import("axios").AxiosResponse, erro: {}}}
     */
    async enviar_requisicao(parametros_requisição) {
        let requisicao_info = {
            sucesso: false,
            requisicao: {},
            erro: {}
        }

        if (parametros_requisição.tipo == undefined) {
            requisicao_info.erro = "O tipo da requisição esta vazio"
            return requisicao_info
        }

        let tipo_requisicao = parametros_requisição.tipo.toUpperCase()

        if (tipo_requisicao != "POST" && tipo_requisicao != "GET") {
            requisicao_info.erro = "O tipo da requisição deve ser POST ou GET"
            return requisicao_info;
        }

        let url = `https://${this.#rest_api_url}/${parametros_requisição.endpoint_nome}`
        let data = parametros_requisição.data
        let propriedades = parametros_requisição.propriedades;
        if (propriedades == undefined) {
            propriedades = {
                headers: {}
            }
        }

        propriedades.headers = this.#adicionar_headers_bot(propriedades.headers)
        this.log(`Enviando solicitação ${parametros_requisição.tipo} ${url}`)
        try {
            if (parametros_requisição.tipo == "POST") {
                requisicao_info.requisicao = await Axios.post(url, data, propriedades)
            } else {
                requisicao_info.requisicao = await Axios.get(url, propriedades)
            }
            requisicao_info.sucesso = true
        } catch (erro) {
            requisicao_info.sucesso = false
            requisicao_info.erro = {
                motivo: erro.response
            }
        }
        return requisicao_info;
    }

    /**
     * Adiciona headers necessarios para as requisições, como de enviar token do bot.
     */
    #adicionar_headers_bot(headers_atuais) {
        let autorizacao = {
            'Authorization': `Bot ${this.#servico.get_bot().get_token()}`
        }

        if (headers_atuais == null) {
            headers_atuais = autorizacao;
        } else {
            Object.assign(headers_atuais, autorizacao)
        }
        return headers_atuais
    }

    log(msg) {
        if (!this.#mostrar_logs) return;

        if (typeof msg == 'string') {
            this.#servico.log(`[ENVIAR]: ${msg}`)
        } else {
            console.log(`-----------------------[ENVIAR]-----------------------`);
            console.log(msg);
            console.log("-------------------------------------------------------");
        }
    }
}