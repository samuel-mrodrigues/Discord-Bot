import { Intent } from "./intents/bot_intents.js"
import { validarIntent as VALIDAR_validarIntent, validarTokenSecreto as VALIDAR_validarTokenSecreto } from "./tratativas/bot/bot_validacoes.js"
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
    DISPATCH as OPCODE_DISPATCH,
    INVALID_SESSION as OPCODE_SESSAO_INVALIDA
}
    from "./opcodes/opcodes.js"
import { EVENTOS } from "./eventos/eventos.js"

import Servicos from "./servicos/Servicos.js"
import Handler from "./servicos/receber/handlers/Handler.js"

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

    // Status da conexão WebSocket com o Discord
    #bot_conexao_status = {
        estados: {
            autenticando: false,
            conectado: false,
            reconectando: false,
            autenticado: false,
        },
        sessao: {
            id: '',
        },
        informacoes: {
            botuser_id: 0,
            nome_bot: ""
        },
        heartbeat: {
            taskid: 0,
            intervalo: 0,
            ativo: false
        },
        sequencia: null
    }

    /**
     * Modulo de serviço que registra todas as funções do bot
     * @type {Servicos}
     */
    #servico_modulo;

    // Mostrar logs  no console?
    #mostrar_logs = true;

    /**
     * 
     * @param {string} token - Token de acesso secreto do bot
     * @param {Intent} intent - Intent contendo os eventos que o bot precisará receber
     */
    constructor(token, intent) {
        if (!VALIDAR_validarTokenSecreto(token)) {
            throw ERROS.TOKEN_INVALIDO
        }

        if (!VALIDAR_validarIntent(intent)) {
            throw ERROS.INTENT_FORMATO_INCORRETO
        }

        this.#token_secreto = token
        this.#intents = intent

        this.#servico_modulo = new Servicos(this)
    }

    /**
     * Retorna se o BOT está autenticado, ou seja, pronto para enviar e receber eventos do Discord
     */
    esta_autenticado() {
        return this.#bot_conexao_status.estados.autenticado
    }

    /**
     * Retorna todos os status do bot
     */
    get_status() {
        return this.#bot_conexao_status
    }

    /**
    * Retorna o token secreto do BOT
    */
    get_token() {
        return this.#token_secreto
    }

    /**
     * Retorna os serviços para interagir com o BOT
     * Modulos fornecem todas as funções necessaria para as interações de texto, voz, administrar usuarios, etc...
     * @returns {Servicos} Servico controlador de envio e recebimento
     */
    get_servicos() {
        return this.#servico_modulo
    }

    /**
     * Retorna o serviço manager de handlers, que é responsavel por disparar funções quando chegam novos eventos
     * @returns {Handler}
     */
    get_handlers() {
        return this.#servico_modulo.get_modulo_receber().get_handler_manager()
    }

    /**
     * Iniciar a tentativa de conectar o BOT aos servidores do Discord
     * @returns {Promise<{autenticado: boolean, erro: string}>} Retorna true ou false se a conexão foi sucedida
     */
    async conectar_bot() {

        // Estado autenticado como true representa que o bot esta conectado e pronto para enviar e receber informações
        let status_retorno = {
            autenticado: false,
            erro: ""
        }

        // Registra o status da tentativa de conexão atual
        // O parametro ok é apenas para saber se já pode retornar a promise com a resposta pra quem invocou a função
        let status_conexao = {
            taskid_verificar: 0,
            token_incorreto: false,
            erro_conexao: false,
            ok: false,
            checagens_atual: 0
        }

        if (this.#bot_conexao_status.estados.conectado && this.#bot_conexao_status.estados.reconectando == false) {
            this.#log(`Ignorando tentativa de conexão pois o BOT já esta conectado!`);
            return;
        }

        return new Promise((resolve, reject) => {

            // A função abaixo retorna se o bot esta conectado e autenticado
            // A partir do momento que ele for autenticado, a função retorna um ok imediatamente apos a verificação
            // Caso não tenha sucesso, ele tentará novamente 1 vez pelos proximos 5 segundos, caso ainda sem sucesso,
            // Retornará false e o motivo do erro
            status_conexao.taskid_verificar = setInterval(() => {
                status_conexao.checagens_atual++

                if (this.#bot_conexao_status.estados.autenticado) {
                    status_retorno.autenticado = true
                    status_conexao.ok = true
                }

                if (status_conexao.ok || status_conexao.checagens_atual > 5) {
                    clearInterval(status_conexao.taskid_verificar)
                    resolve(status_retorno)
                }
            }, 1000);

            let conexao = new WebSocket(PARAMETROS.WEBSOCKET_URL)

            conexao.onopen = () => {
                this.#websocket_aberto()
            }

            conexao.onclose = (close) => {
                // O Discord fecha o WebSocket se o token enviado na identificação for invalido
                // Por isso, verifico se o close não é pelo motivo de ter enviado um token invalido
                if (this.#bot_conexao_status.estados.autenticando) {
                    status_retorno.erro = ERROS.ERRO_CONECTAR_VERIFIQUE_TOKEN_BOT
                    status_conexao.token_incorreto = 1
                    status_conexao.ok = true
                    this.#bot_conexao_status.estados.autenticado = false
                }
                this.#websocket_fechado(close)
            }


            conexao.onerror = (error) => {
                this.#websocket_erro(error)
                status_retorno.erro = ERROS.ERRO_CONECTAR_VERIFIQUE_CONEXAO.replace("@erro@", `${error.error} ${error.message}`)
                status_conexao.erro_conexao = true
                status_conexao.ok = true
            }

            conexao.onmessage = (msg) => {
                this.#websocket_mensagem(msg)
            }

            this.#bot_conexao = conexao
        })
    }

    /**
     * Processar eventos(opcode 0) recebidos pelo Discord
     * @param {GatewayMensagem} gateway_msg 
     */
    #processar_evento(gateway_msg) {
        let seq_recebida = gateway_msg.get_sequencia()
        let nome_evento = gateway_msg.get_evento();

        this.#bot_conexao_status.sequencia = seq_recebida
        this.#log(`Processando Evento: ${nome_evento}, sequencia: ${seq_recebida}`)
        switch (nome_evento) {
            case EVENTOS.INTERNO.RESUMED:
                let dados_sessao = gateway_msg.get_data()
                this.#evento_bot_autorizado(dados_sessao)
                break;
            case EVENTOS.INTERNO.RESUMED:
                this.#log("Sessão anterior resumida com sucesso!")
                break
            default:
                // Notificar o modulo de receber eventos
                this.#servico_modulo.get_modulo_receber().novo_evento(nome_evento, gateway_msg)
                break;
        }
    }

    /**
     * Processa a mensagem recebida pelo gateway do Discord
     * @param {GatewayMensagem} gateway_msg 
     */
    #processar_opcode(gateway_msg) {
        let opcode = gateway_msg.get_opcode()
        this.#log(`Processando mensagem com OP CODE: ${opcode}`)
        switch (opcode) {
            case OPCODE_HELLO:
                if (this.#bot_conexao_status.estados.reconectando) {
                    this.#enviar_resumirsessao()
                } else {
                    this.#enviar_identificacao()
                }
                this.#iniciar_heartbeat(gateway_msg.get_data())
                break;
            case OPCODE_HEARTBEAT_ACK:
                this.#log(`Heartbeat recebido pelo Discord!`)
                break;
            case OPCODE_RECONNECT:
                this.#log(`Gateway informou que é necessario reconectar! Enviando reconexão em 5 segundos...`)

                this.#bot_conexao_status.estados.reconectando = true;
                this.#bot_conexao_status.estados.autenticado = false
                setTimeout(() => {
                    this.conectar_bot()
                }, 5000);
                break;
            case OPCODE_SESSAO_INVALIDA:

                this.#log(`Gateway informou que o login se tornou invalido, enviando pedido de resumo de sessão em 5 segundos...`)
                this.#bot_conexao_status.estados.reconectando = true
                this.#bot_conexao_status.estados.autenticado = false
                setTimeout(() => {
                    this.conectar_bot()
                }, 5000);
                break;
            case OPCODE_DISPATCH:
                this.#processar_evento(gateway_msg)
                break;
        }
    }

    // Enviar um paylod OP 2 para o gateway do Discord, iniciando a autenticação do bot
    #enviar_identificacao() {
        this.#log(`Enviando uma nova solicitação de autenticação para o Discord...`)
        let objeto_id = {
            op: OPCODE_IDENTIFY,
            d: {
                token: this.#token_secreto,
                intents: this.#intents.total_intent(),
                properties: {
                    os: "windows"
                }
            }
        }

        this.#bot_conexao_status.estados.autenticando = true;
        this.#bot_conexao.send(JSON.stringify(objeto_id))
    }

    /**
     * Enviar um paylod OP 6 para resumir uma sessão que foi desconectada
     * 
     */
    #enviar_resumirsessao() {
        if (!this.#bot_conexao_status.estados.conectado) {
            log(`Não é possivel resumir sessão, o websocket não esta conectado!`)
            return;
        }

        if (this.#bot_conexao_status.sequencia == null) {
            this.#log(`Iniciando nova sessão, pois a sequencia atual é 0`)
            this.#bot_conexao_status.estados.reconectando = false;
            this.#enviar_identificacao()
            return;
        }

        let objeto_reconectar = {
            op: OPCODE_RESUME,
            d: {
                token: this.#token_secreto,
                session_id: this.#bot_conexao_status.sessao.id,
                seq: this.#bot_conexao_status.sequencia
            }
        }

        this.#log(`Enviando solicitação de resumir sessão, ID: ${this.#bot_conexao_status.sessao.id}, ultima sequencia: ${this.#bot_conexao_status.sequencia}`)
        this.#log(objeto_reconectar)
        this.#bot_conexao.send(JSON.stringify(objeto_reconectar))
        this.#bot_conexao_status.estados.reconectando = false
    }

    /**
     * Função chamada quando é recebido o evento READY do gateway to discord, contendo informações importantes
     */
    #evento_bot_autorizado(payload_autenticacao) {
        this.#bot_conexao_status.sessao.id = payload_autenticacao.session_id
        this.#bot_conexao_status.informacoes.botuser_id = payload_autenticacao.user.id
        this.#bot_conexao_status.informacoes.nome_bot = payload_autenticacao.user.username
        this.#bot_conexao_status.estados.autenticado = true
        this.#bot_conexao_status.estados.autenticando = false;
        this.#log(`Confirmação de autenticação recebida! Sessão iniciada com o id ${this.#bot_conexao_status.sessao.id}`)
    }

    /**
     * Inicia o envio de "heartbeats" para o Discord
     * Para manter uma conexão via websocket com o Discord, é necessario que o BOT envie suas "batidas"/solicitações
     * A cada x millisegundos, caso contrario, o Discord fecha a conexão
     * @param {{heartbeat_interval}} heartbeat_info 
     */
    #iniciar_heartbeat(heartbeat_info) {
        if (this.#bot_conexao_status.heartbeat.ativo) {
            this.#log(`O heartbeat já esta ativo!`)
            return;
        }

        let intervalo = heartbeat_info.heartbeat_interval

        this.#bot_conexao_status.heartbeat.intervalo = intervalo

        this.#log(`Iniciando heartbeat com o intervalo de ${intervalo} millisegundos`);

        const heartbeat = () => {
            let objeto_heartbeat = {
                op: OPCODE_HEARTBEAT,
                d: {},
                s: null,
                t: null
            }
            this.#bot_conexao.send(JSON.stringify(objeto_heartbeat))
        }

        setTimeout(() => {
            heartbeat();
            this.#bot_conexao_status.heartbeat.taskid = setInterval(() => {
                if (this.#bot_conexao_status.estados.conectado) {
                    this.#log(`Enviando heartbeat <3...`);
                    heartbeat();
                } else {
                    this.#log(`Ignorando envio de heartbeat pois a conexão websocket está fechada!`)
                }
            }, intervalo);
        }, intervalo * Math.random());

        this.#bot_conexao_status.heartbeat.ativo = true;
    }

    /**
     * Para o envio de heartbeats
     */
    #parar_heartbeat() {
        clearInterval(this.#bot_conexao_status.heartbeat.taskid)
        this.#log(`Envio de heartbeats parado!`)
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
     * Essa função é dispara também quando ocorre um erro no websocket, WEBSOCKET_ERROR -> WEBSOCKET_CLOSED
     */
    #websocket_fechado(evento_fechou = { code, reason, target, type, wasClean }) {
        this.#bot_conexao_status.estados.conectado = false
        this.#bot_conexao_status.estados.autenticado = false;


        this.#parar_heartbeat()
    }
    /**
     * Função executada quando o websocket é aberto com o Discord
     */
    #websocket_aberto() {
        this.#log(`Conexão com o websocket do Discord estabelecida`)
        this.#bot_conexao_status.estados.conectado = true
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