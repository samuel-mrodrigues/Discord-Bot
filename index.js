// Libs
import { WebSocket } from "ws"
import axios from "axios"

/**
 * 
 * @param {string || object} msg 
 * @param {logs_tipos} tipo 
 */
function log(msg, tipo) {
    if (typeof msg == 'string') {
        console.log(`[${tipo}]: ${msg}`);
    } else {
        console.log(`-----------------------[${tipo}]-----------------------`);
        console.log(msg);
        console.log("-------------------------------------------------------");
    }
}

const logs_tipos = Object.freeze({
    HEARTBEAT: "HEARTBEAT",
    AUTENTICACAO: "AUTENTICACAO",
    WEBSOCKET: "WEBSOCKET",
    EVENTO: "EVENTO"
})
// ----------

// Informações da API do discord
const discord = {
    url_websocket: "wss://gateway.discord.gg/?v=10&encoding=json"
}

// Informações do BOT que eu criei
const bot = {
    token_secreto: "ODkwOTg4MjQ2Mzc5Njc5NzU1.GW31F8.jPe5RxmHtmlaLKqHzDLMN2besSZXf0gYSB6mpk",
    intents_eventos: 33280
}

let bot_status = {
    nome: "",
    id: ""
}

// Informações da conexão atual que Discord usa.
const status_conexao = {
    heartbeat: {
        taskid: -1,
        intervalo: -1
    },
    sequencia: -1,
    sessao: {
        tipo: "",
        id: ""
    },
    conectado: false,
    opcoes: {
        permite_resumir_sessao: false
    },
    esta_reconectando: false
}

// Instancia da conexão WS com o websocket do Discord
/**
 * @type {WebSocket}
 */
let conexao_discord;

conectar_bot();

// Iniciar a conexão
function conectar_bot() {
    let retorno_status = {
        sucesso: false,
        erro: {
            motivo: ""
        }
    }

    return new Promise((resolve, reject) => {
        log(`Iniciando conexão WebSocket com o gateway do Discord`, logs_tipos.WEBSOCKET)

        conexao_discord = new WebSocket(discord.url_websocket)

        conexao_discord.onopen = () => {
            status_conexao.conectado = true
            log(`Websocket com o gateway do Discord aberto`, logs_tipos.WEBSOCKET);

            retorno_status.sucesso = true
            resolve(retorno_status)
        }

        conexao_discord.onerror = (erro) => {
            log(`Erro ao estabelecer conexão com o gateway do Discord`, logs_tipos.WEBSOCKET)
            log(erro.error, logs_tipos.WEBSOCKET)

            status_conexao.opcoes.permite_resumir_sessao = false
            retorno_status.erro.motivo = erro
            resolve(retorno_status)
        }

        conexao_discord.onclose = (erro) => {
            parar_heartbeat();
            log(`Websocket com o gateway do Discord fechado, erro ${erro.code}:${erro.reason}`, logs_tipos.WEBSOCKET);


            // Se o fechamento do ws foi causado por uma das extremidades, tenta reconectar
            if (erro.wasClean) {
                // Se a opção de resumir sessão estiver ativada
                if (status_conexao.opcoes.permite_resumir_sessao) {
                    resumir_sessao()
                }
            }
            status_conexao.conectado = false
        }

        conexao_discord.onmessage = (mensagem) => {
            novaMensagemWS(JSON.parse(mensagem.data))
        }
    })
}

function novaMensagemWS(mensagem) {
    let codigo_operacao = mensagem.op;
    log(`Nova mensagem do gateway do Discord! Operação: ${codigo_operacao}`, logs_tipos.WEBSOCKET);

    switch (codigo_operacao) {
        case 10:
            iniciar_identificacao()
            enviar_heartbeat(mensagem)
            break;
        case 11:
            receber_heartbeat()
            break;
        case 7:
            fechar_conexao()
            resumir_sessao()
            break;
        case 0:
            processarEvento(mensagem)
            break;
        default:
            break;
    }
}

function processarEvento(evento) {
    // Atualiza a sequencia na conexão
    let nova_sequencia = evento.s;
    status_conexao.sequencia = nova_sequencia

    tratarEvento(evento);
}

function tratarEvento(evento) {
    let log_tipo = logs_tipos.EVENTO

    let tipo_evento = evento.t.toUpperCase();
    log(`Tratando evento do tipo: ${tipo_evento}`, log_tipo);

    switch (tipo_evento) {
        case "READY":
            let info_autenticacao = evento.d

            // Salva as informações da sessão gerada pelo discord
            status_conexao.sessao.id = info_autenticacao.session_id
            status_conexao.sessao.tipo = info_autenticacao.session_type

            // Salva as informações recebidos do gateway do bot
            bot_status.id = info_autenticacao.user.id
            bot_status.nome = info_autenticacao.user.username

            log(`Sessão autenticada recebida do gateway, sessão ${status_conexao.sessao.id}`, logs_tipos.AUTENTICACAO)

            // Habilita a reconexão quando a conexão cai
            status_conexao.opcoes.permite_resumir_sessao = true
            break;
        case "RESUMED":
            log(`Sessão resumida com sucesso...`, log_tipo)
            break;
        case "MESSAGE_CREATE":
            eventoMensagemUsuario(evento.d)
            break;
        default:
            log(`Não existe tratativa para o evento: ${tipo_evento}`, log_tipo)
            break;
    }
}

async function eventoMensagemUsuario(mensagem) {
    console.log(mensagem);

    if (mensagem.author.id != bot_status.id) {
        let grupo_id = mensagem.channel_id
        let url_msg = `https://discord.com/api/channels/${grupo_id}/messages`

        let enviar_msg = await axios.post(url_msg, {
            content: `${mensagem.content}? Vai toma no cu mano '-'`,
            tts: false
        }, {
            headers: {
                'Authorization': `Bot ${bot.token_secreto}`
            }
        })

        console.log(enviar_msg.status);
        console.log(enviar_msg.data);
    }
}

async function resumir_sessao() {
    log(`Tentando resumir a sessão com o gateway do Discord...`, logs_tipos.WEBSOCKET);
    status_conexao.esta_reconectando = true

    let status_reconnect = await conectar_bot()
    if (status_reconnect.sucesso) {
        let objeto_reconectar = {
            op: 6,
            d: {
                token: bot.token_secreto,
                session_id: status_conexao.sessao.id,
                seq: status_conexao.sequencia
            }
        }

        conexao_discord.send(JSON.stringify(objeto_reconectar))
    } else {
        log(`Não foi possível resumir a sessão`, logs_tipos.WEBSOCKET)
        log(status_reconnect.erro, logs_tipos.WEBSOCKET)
    }
}

function fechar_conexao() {
    status_conexao.opcoes.permite_resumir_sessao = false
    conexao_discord.close();
}

function iniciar_identificacao() {
    // Se já estiver reconectando, ignora o inicio de identificação
    if (status_conexao.esta_reconectando) return;
    log(`Enviando solicitação de autenticação ao gateway...`, logs_tipos.AUTENTICACAO);

    let objeto_id = {
        op: 2,
        d: {
            token: bot.token_secreto,
            intents: bot.intents_eventos,
            properties: {
                os: "windows"
            }
        }
    }

    conexao_discord.send(JSON.stringify(objeto_id))
}

function enviar_heartbeat(heartbeat_info) {
    if (!status_conexao.conectado) return;
    let tipo_log = logs_tipos.HEARTBEAT

    let intervalo = heartbeat_info.d.heartbeat_interval
    status_conexao.heartbeat.intervalo = intervalo

    log(`Iniciando com o intervalo de ${intervalo}`, tipo_log);

    const heartbeat = () => {
        let objeto_heartbeat = {
            op: 1,
            d: {},
            s: null,
            t: null
        }

        log(`Enviando heartbeat...`, tipo_log);
        conexao_discord.send(JSON.stringify(objeto_heartbeat))
    }

    setTimeout(() => {
        heartbeat();
        status_conexao.heartbeat.taskid = setInterval(() => {
            heartbeat();
        }, intervalo);
    }, intervalo * Math.random());
}

function parar_heartbeat() {
    if (!status_conexao.conectado) return;
    log(`Parando envio de heartbeat...`, logs_tipos.HEARTBEAT);
    clearInterval(status_conexao.heartbeat.taskid)
}

function receber_heartbeat() {
    if (!status_conexao.conectado) return;
    log(`Heartbeat aceito pelo gateway!`, logs_tipos.HEARTBEAT);
}
