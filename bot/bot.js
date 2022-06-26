import { Intent } from "./intents/bot_intents.js"
import { validarIntent, validarTokenSecreto } from "./tratativas/bot/bot_validacoes.js"
import ws, { WebSocket } from "ws"
import ERROS from "./tratativas/bot/bot_erros.js"
import { PARAMETROS } from "../discord/parametros.js"
import GatewayMensagem from "./websocket/gateway_mensagem.js"
import {
    HELLO as OPCODE_HELLO,
    IDENTIFY as OPCODE_IDENTIFY,
    HEARTBEAT as OPCODE_HEARTBEAT,
    RECONNECT as OPCODE_RECONNECT,
    RESUME as OPCODE_RESUME,
    HEARTBEAT_ACK as OPCODE_HEARTBEAT_ACK,
    DISPATCH as OPCODE_DISPATCH
}
    from "./opcodes/opcodes.js"

export class Bot {

    /**
     * Token do bot
     * @type {string}
     */
    #token_secreto = ""

    /**
     * Intent que o BOT irá precisa receber do Discord
     * @type {Intent}
     */
    #intents;

    /**
     * @type {ws.WebSocket}
     */
    #bot_conexao;

    // Mostrar logs  no console?
    #mostrar_logs = true;

    /**
     * 
     * @param {string} token - Token de acesso secreto do bot
     * @param {Intent} intent - Intent contendo os eventos que o bot precisará receber
     */
    constructor(token, intent) {
        if (!validarTokenSecreto(token)) {
            throw ERROS.TOKEN_INVALIDO
        }

        if (!validarIntent(intent)) {
            throw ERROS.INTENT_FORMATO_INCORRETO
        }

        this.#token_secreto = token
        this.#intents = intent
    }

    /**
     * Iniciar a tentativa de conectar o BOT aos servidores do Discord
     * @returns {boolean} Retorna true ou false se a conexão foi sucedida
     */
    async conectar_bot() {
        return new Promise((resolve, reject) => {

            let conexao = new WebSocket(PARAMETROS.WEBSOCKET_URL)

            conexao.onopen = () => {
                this.#websocket_aberto()
                resolve(true)
            }
            conexao.onmessage = (msg) => {
                this.#websocket_mensagem(msg)
                resolve(false)
            }

            conexao.onclose = (close) => {
                this.#websocket_fechado(close)
            }

            conexao.onerror = (error) => {
                this.#websocket_erro(error)
            }
        })
    }

    /**
     * Processa a mensagem recebida pelo gateway do Discord
     * @param {GatewayMensagem} gateway_msg 
     */
    #processar_opcode(gateway_msg) {
        let opcode = gateway_msg.get_opcode()

        switch (opcode) {
            case OPCODE_HELLO:
                break;
            default:
                break;
        }
    }

    #enviar_identificacao() {
        
    }

    // Esses callbacks são chamados pelo websocket quando alguma notificação nova vem(close, message, open)
    /**
     * Recebe as mensagens do websocket do Discord
     * Todas as mensagens recebidas pelo endpoint 
     */
    #websocket_mensagem(evento_msg = { data, target, type }) {
        let gateway_msg;
        try {
            gateway_msg = new GatewayMensagem(evento_msg)
        } catch (erro) {
            this.#log(erro)
        }

        this.#processar_opcode(gateway_msg)
    }

    /**
     * Função executada quando o websocket é fechado por alguma das extremidades, contendo o parametro do motivo do fechamento
     */
    #websocket_fechado(evento_fechou = { code, reason, target, type, wasClean }) {

    }
    /**
     * Função executada quando o websocket é aberto com o Discord
     */
    #websocket_aberto() {
        this.#log(`Conexão com o websocket do Discord estabelecida`)
    }

    /**
     * Função chamada quando ocorre um erro de conexão inicial
     */
    #websocket_erro(evento_erro = { error, message, target, type }) {

    }
    // ----------------------------------------------------

    #log(msg) {
        if (!this.#mostrar_logs) return;
        if (typeof msg == 'string') {
            console.log(`[BOT]: ${msg}`);
        } else {
            console.log(`-----------------------[BOT]-----------------------`);
            console.log(msg);
            console.log("-------------------------------------------------------");
        }
    }
}