import ServicoManager from "../Modulos.js"
import { Mensagem } from "./Mensagem.js"

export class EnviarMensagem {

    /**
     * Instancia do ServicoManager ao qual é responsavel por esse objeto
     * @type {ServicoManager}
     */
    #servico_manager;

    /**
     * Cadastra esse modulo de envio de mensagens passando o serviço manager responsavel por ele
     */
    constructor(servico_manager) {
        this.#servico_manager = servico_manager
        this.#servico_manager.log(`Envio de mensagens cadastrado!`)
    }

    /**
    * Envia uma mensagem de texto
    * @param {Mensagem} mensagem 
    */
    enviar(mensagem) {
        this.#servico_manager.log("Enviando mensagem de texto:")
        this.#servico_manager.log(mensagem)
    }
}