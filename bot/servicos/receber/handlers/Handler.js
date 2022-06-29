import { Bot } from "../../../bot.js";
import GatewayMensagem from "../../../websocket/gateway_mensagem.js";
import HandlerEvento from "./HandlerEvento/HandlerEvento.js"

/**
 * O handler é responsavél por receber os eventos disparados pelo WebSocket, e 
 * notifica todos os "handlers" que querem receber um evento especifico
 * 
 * 
 * Por exemplo, é possivel ao usuario cadastrar um handler(função) de um evento especifico, por exemplo, MESSAGE_CREATE,
 * e então, toda vez que esse evento for disparado, essa função, junto com outras, serão executadas, fornecendo assim uma
 * forma de poder executar ações quando algo acontecer
 */
export default class Handler {
    /**
     * Exibir logs?
     */
    #mostrar_logs = true;

    /**
     * Armazena os handlers de cada evento disponivel
     * @type {[HandlerEvento]}
     */
    #handlers_eventos = []

    /**
     * Instancia do BOT que esse Handler pertence
     * @type {Bot}
     */
    #bot;

    /**
     * Inicia o handler para algum BOT
     * @param {Bot} bot 
     */
    constructor(bot) {
        this.#bot = bot
    }

    /**
     * 
     * @returns {[HandlerEvento]} Todos os tipos de eventos cadastrados atualmente
     */
    get_handlers() {
        return this.#handlers_eventos;
    }

    /**
     * Adiciona um novo handler para um tipo especifico de evento
     * 
     * Por exemplo, adicione um handler do evento MESSAGE_CREATE com uma função, assim, toda vez que uma mensagem
     * for disparado, a sua função será executada.
     * @param {String} tipo_evento Nome do evento que se deseja saber quando é disparado
     * @param {function(GatewayMensagem):void} funcao_executar Sua função de callback que será chamada, passando como parametro oque foi recebido no disparo
     */
    add_handler(tipo_evento, funcao_executar) {
        this.#log(`Adicionando novo handler do tipo: ${tipo_evento}`)

        // Verifica se já não existe um handler cadastrado para esse tipo de evento
        let handler_evento = this.#handlers_eventos.find(handler => {
            if (handler.get_evento_tipo() == tipo_evento) {
                return true
            }
        })

        // Handler já existe, adicionando função nova ao objeto do handler existente
        if (handler_evento != undefined) {
            this.#log(`Adicionando nova função ao handler existente: ${tipo_evento}`)
            handler_evento.add_handler(funcao_executar)
        } else {
            this.#log(`Criando um novo handler ${tipo_evento} e adicionando a nova função..`)

            handler_evento = new HandlerEvento(tipo_evento)
            handler_evento.add_handler(funcao_executar)

            // Insere esse novo handler na lista
            this.#handlers_eventos.push(handler_evento)
        }
    }

    /**
     * Notifica o Handler para disparar esse evento, fazendo com que todos os handlers cadastrados com esse evento
     * sejam disparados e suas funções cadastradas executadas, passando como parametro a informação que veio no disparo
     * @param {{nome}} evento_tipo Evento que foi disparado
     * @param {GatewayMensagem} gateway_mensagem Informações do evento disparado
     */
    disparar_evento(evento_tipo, gateway_mensagem) {
        // Encontra o handler desse evento previamente cadastrado

        let evento_handler = this.#handlers_eventos.find(handler => {
            if (handler.get_evento_tipo() == evento_tipo) {
                return true;
            }
        })

        // Se algum evento desse handler existir, dispara
        if (evento_handler != undefined) {
            this.#log(`Disparando evento handler: ${evento_tipo}`)
            evento_handler.disparar(gateway_mensagem)
        } else {
            this.#log(`Ignorando disparo do evento ${evento_tipo} pois não existe nenhum cadastrado!`)
        }
    }

    /**
     * 
     * @returns {Bot} Retorna o BOT vinculado a esse Handler
     */
    get_bot() {
        return this.#bot;
    }

    /**
     * Mostra um log detalhado de todos os handlers cadastrados
     */
    listar_handlers() {
        for (const handler_evento of this.#handlers_eventos) {
            this.#log(`Handlers do evento: ${handler_evento.get_evento_tipo()}`)
            this.#log(`----------------------------------------------------------------`)
            for (const handler_funcao of handler_evento.get_handlers()) {
                this.#log(`ID unico: ${handler_funcao.get_id()}, funcao: ${handler_funcao.get_funcao().toString()}`)
            }
            this.#log(`----------------------------------------------------------------`)
        }
    }

    #log(msg) {
        if (!this.#mostrar_logs) return;
        if (typeof msg == 'string') {
            console.log(`[BOT]: ${msg}`);
        } else {
            console.log(`-----------------------[HANDLERS]-----------------------`);
            console.log(msg);
            console.log("-------------------------------------------------------");
        }
    }
}