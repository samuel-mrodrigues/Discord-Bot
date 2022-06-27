import { Mensagem } from "./Mensagem.js"
import Enviar from "../../Enviar.js";

export default class EnviarMensagem {

    /**
     * Instancia do modulo Enviar
     * @type {Enviar}
     */
    #modulo_enviar;

    /**
     * Cadastra esse modulo de envio de mensagens passando o serviço manager responsavel por ele
     */
    constructor(modulo) {
        this.#modulo_enviar = modulo
        this.#modulo_enviar.log(`EnviarMensagens cadastrado!`)
    }

    /**
    * Envia uma mensagem de texto
    * @param {Mensagem} mensagem 
    * @returns {{sucesso: boolean, data: {}, erro: {motivo: {}}}} Se enviada com sucesso, retorna as informações da mensagem criada.
    * Caso ocorra algum erro, retorna um objeto erro, contendo detalhes mais avançados do erro. Se for algum erro em relação ao Discord,
    * ele estará incluso no objeto do erro
    */
    async enviar(mensagem) {
        let endpoint_nome = `channels/${mensagem.canal_id}/messages`

        let status_retorno = {
            sucesso: false,
            data: {},
            erro: {}
        }

        let resposta = await this.#modulo_enviar.enviar_requisicao({
            tipo: "POST",
            endpoint_nome: endpoint_nome,
            data: {
                content: mensagem.conteudo,
            }
        })

        if (resposta.sucesso) {
            status_retorno.sucesso = true
            status_retorno.data = resposta.requisicao
        } else {
            status_retorno.sucesso = false
            status_retorno.erro = resposta.erro
        }
        return status_retorno
    }
}