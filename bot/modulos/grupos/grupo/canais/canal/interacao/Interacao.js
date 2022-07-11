import { EVENTOS } from "../../../../../../eventos/eventos.js"
import { gerar_mensagem_multipart, RequisicaoStatus } from "../../../../../utils/Utils.js";
import Grupo from "../../../Grupo.js"
import { MensagemEnviar } from "../mensagem/Mensagem.js";
import { Interacao_Resposta, Interacao_Tipo_Resposta } from "./Interacao_Estrutura.js"

/**
 * A classe de interacao é responsavel por todas as interações de um grupo
 */
export class Interacao {

    /**
     * O grupo vinculado a esse notificador de interação
     * @type {Grupo}
     */
    #grupo_vinculado

    /**
     * Função do usuario. Essa função é chamada passando os seguintes argumentos:
     ** 1o argumento: informação da interaction disparada
     ** 2o argumento: ações que o usuario pode realizar
     */
    #funcao_interacao = () => { }

    /**
     * Vincula esse notificador de interação a um grupo
     * @param {Canal} grupo_vinculado 
     */
    constructor(grupo_vinculado) {
        this.#grupo_vinculado = grupo_vinculado

        this.#cadastra_handler()
    }

    /**
    * Atribuia uma função de callback sua para ser chamada quando uma interação nesse grupo é disparada
    ** O 1o argumento será as informações da interação, como id dela, usuario que interagiu, etc.. 
    ** O 2o argumento será um objeto contendo as ações que vc pode realizar com a interação
    ** As ações que possuem um ok_ só podem ser usadas uma vez, elas servem para confirmar
    * ao Discord que a interação foi recebida, chama-las novamente não fará efeito
    ** Quanto as outras ações, vc pode chama-las quantas vezes quiser.
    *
    *
    * @param {(interacao_dados: Interacao_Resposta, acoes: CallbackFuncaoAcoes) => {}} funcao_executar 
    */
    nova_interacao(funcao_executar) {
        this.#funcao_interacao = funcao_executar
    }

    /**
     * Dispara o evento de interação, chamando a função customizada do usuario
     * @param {string} interacao_custom_id 
     * @param {string} interacao_dados 
     */
    #disparar_interacao(interacao_custom_id, interacao_dados) {
        console.log(`Notificando interação ${interacao_custom_id}`);

        // Informações da interação
        let interaction_id = interacao_dados.id
        let interaction_token = interacao_dados.token

        //Ações que o usuario pode executar com a interação

        //Responde a mensagem, dando reply na mensagem inicial do componente contendo a interação clicada
        let responder = async (msg_objeto) => {
            return await this.#responder_com_mensagem(interaction_id, interaction_token, msg_objeto)
        }

        //Envia no chat uma msg de "bot pensando"
        let ok_mostrar_pensando = async () => {
            return await this.#ok_mostrar_pensando(interaction_id, interaction_token)
        }

        //Não envia nada no chat, só confirmar o recebimento
        let ok_oculta_pensando = async () => {
            return await this.#ok_ocultar_pensando(interaction_id, interaction_token)
        }

        //Edita a mensagem inicial que disparou a interação
        let ok_editar_mensagem_componente = async (msg_objeto) => {
            return await this.#atualizar_mensagem(interaction_id, interaction_token, msg_objeto)
        }

        //Exclui a mensagem que o BOT envia após as ações de "ok_" que enviam alguma mensagem
        let deletar_interacao_mensagem = async () => {
            return await this.#deletar_interacao_msg(interaction_token)
        }

        //Edita a mensagem que o BOT envia após as ações de "ok_" que enviam alguma mensagem
        let editar_interacao_mensagem = async (msg_objeto) => {
            return await this.#editar_interacao_mensagem(interaction_token, msg_objeto)
        }

        //Retorna a mensagem da interação original
        let get_interacao_mensagem = async () => {
            return await this.#get_interacao_mensagens(interaction_token)
        }

        let acoes = {
            ok_enviar_mensagem: responder,
            ok_pensando: ok_mostrar_pensando,
            ok_ocultar_pensando: ok_oculta_pensando,
            ok_editar_mensagem_componente: ok_editar_mensagem_componente,

            get_interacao_mensagem: get_interacao_mensagem,
            editar_interacao_mensagem: editar_interacao_mensagem,
            deletar_interacao_mensagem: deletar_interacao_mensagem
        }

        this.#funcao_interacao(interacao_dados, acoes)
    }

    async #responder_com_mensagem(interacao_id, interacao_token, msg_objeto) {
        // Serviço de enviar mensagens ao endpoint
        let servico_enviar = this.#grupo_vinculado.get_bot().get_servicos().get_servico_enviar()

        // Infos da requisição atual
        // tipo_dados define o tipo do conteudo que será enviado no body
        // data contem os dados a enviar.
        let info_requisicao = {
            tipo_dados: "application/json",
            data: msg_objeto != undefined ? msg_objeto.toJSON() : undefined
        }

        if (msg_objeto != undefined) {
            // Se a mensagem contiver arquivos, preciso enviar uma mensagem compativel com o tipo multipart
            if (msg_objeto.files != undefined) {

                // Chama o gerador de multipart
                let multipart_dados = gerar_mensagem_multipart(msg_objeto)

                // Altera o tipo de dados da requisição para multipart, contendo o boundary gerado pelo gerador
                info_requisicao.tipo_dados = `multi-part/formdata; boundary=${multipart_dados.getBoundary()}`

                // Define a informação do multipart para enviar no body da requisição
                info_requisicao.data = multipart_dados
            }
        }

        // Informações que serão enviadas no corpo da requisição
        let payload_resposta = {
            type: Interacao_Tipo_Resposta.CHANNEL_MESSAGE_WITH_SOURCE,
            data: info_requisicao.data
        }

        let resposta_interacao = await servico_enviar.enviar_requisicao({
            tipo: "POST",
            endpoint_nome: `interactions/${interacao_id}/${interacao_token}/callback`,
            data: payload_resposta,
            propriedades: {
                headers: {
                    'Content-Type': `${info_requisicao.tipo_dados}`
                }
            }
        })
        return new RequisicaoStatus(resposta_interacao)
    }

    async #ok_mostrar_pensando(interacao_id, interacao_token) {
        let servico_enviar = this.#grupo_vinculado.get_bot().get_servicos().get_servico_enviar()

        let payload_resposta = {
            type: Interacao_Tipo_Resposta.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
            data: {}
        }

        let resposta_interacao = await servico_enviar.enviar_requisicao({
            tipo: "POST",
            endpoint_nome: `interactions/${interacao_id}/${interacao_token}/callback`,
            data: payload_resposta,
            propriedades: {
                headers: {
                    'Content-Type': `application/json`
                }
            }
        })
        return new RequisicaoStatus(resposta_interacao)
    }

    async #ok_ocultar_pensando(interacao_id, interacao_token) {
        let servico_enviar = this.#grupo_vinculado.get_bot().get_servicos().get_servico_enviar()

        let payload_resposta = {
            type: Interacao_Tipo_Resposta.DEFERRED_UPDATE_MESSAGE,
            data: {}
        }

        let resposta_interacao = await servico_enviar.enviar_requisicao({
            tipo: "POST",
            endpoint_nome: `interactions/${interacao_id}/${interacao_token}/callback`,
            data: payload_resposta,
            propriedades: {
                headers: {
                    'Content-Type': `application/json`
                }
            }
        })
        return new RequisicaoStatus(resposta_interacao)
    }

    async #atualizar_mensagem(interacao_id, interacao_token, msg_objeto) {
        // Serviço de enviar mensagens ao endpoint
        let servico_enviar = this.#grupo_vinculado.get_bot().get_servicos().get_servico_enviar()

        // Infos da requisição atual
        // tipo_dados define o tipo do conteudo que será enviado no body
        // data contem os dados a enviar.
        let info_requisicao = {
            tipo_dados: "application/json",
            data: msg_objeto != undefined ? msg_objeto.toJSON() : undefined
        }

        if (msg_objeto != undefined) {
            // Se a mensagem contiver arquivos, preciso enviar uma mensagem compativel com o tipo multipart
            if (msg_objeto.files != undefined) {

                // Chama o gerador de multipart
                let multipart_dados = gerar_mensagem_multipart(msg_objeto)

                // Altera o tipo de dados da requisição para multipart, contendo o boundary gerado pelo gerador
                info_requisicao.tipo_dados = `multi-part/formdata; boundary=${multipart_dados.getBoundary()}`

                // Define a informação do multipart para enviar no body da requisição
                info_requisicao.data = multipart_dados
            }
        }

        // Informações que serão enviadas no corpo da requisição
        let payload_resposta = {
            type: Interacao_Tipo_Resposta.UPDATE_MESSAGE,
            data: info_requisicao.data
        }

        let resposta_interacao = await servico_enviar.enviar_requisicao({
            tipo: "POST",
            endpoint_nome: `interactions/${interacao_id}/${interacao_token}/callback`,
            data: payload_resposta,
            propriedades: {
                headers: {
                    'Content-Type': `${info_requisicao.tipo_dados}`
                }
            }
        })
        return new RequisicaoStatus(resposta_interacao)
    }

    async #editar_interacao_mensagem(interacao_token, msg_objeto) {
        // Serviço de enviar mensagens ao endpoint
        let servico_enviar = this.#grupo_vinculado.get_bot().get_servicos().get_servico_enviar()

        // Infos da requisição atual
        // tipo_dados define o tipo do conteudo que será enviado no body
        // data contem os dados a enviar.
        let info_requisicao = {
            tipo_dados: "application/json",
            data: msg_objeto != undefined ? msg_objeto.toJSON() : undefined
        }

        if (msg_objeto != undefined) {
            // Se a mensagem contiver arquivos, preciso enviar uma mensagem compativel com o tipo multipart
            if (msg_objeto.files != undefined) {

                // Chama o gerador de multipart
                let multipart_dados = gerar_mensagem_multipart(msg_objeto)

                // Altera o tipo de dados da requisição para multipart, contendo o boundary gerado pelo gerador
                info_requisicao.tipo_dados = `multi-part/formdata; boundary=${multipart_dados.getBoundary()}`

                // Define a informação do multipart para enviar no body da requisição
                info_requisicao.data = multipart_dados
            }
        }

        // Informações que serão enviadas no corpo da requisição
        let payload_resposta = {
            data: info_requisicao.data
        }

        let resposta_interacao = await servico_enviar.enviar_requisicao({
            tipo: "PATCH",
            endpoint_nome: `webhooks/${this.#grupo_vinculado.get_bot().get_application_id()}/${interacao_token}/messages/@original`,
            data: payload_resposta.data,
            propriedades: {
                headers: {
                    'Content-Type': `${info_requisicao.tipo_dados}`
                }
            }
        })
        return new RequisicaoStatus(resposta_interacao)
    }

    async #deletar_interacao_msg(interacao_token) {
        let servico_enviar = this.#grupo_vinculado.get_bot().get_servicos().get_servico_enviar()

        let resposta_interacao = await servico_enviar.enviar_requisicao({
            tipo: "DELETE",
            endpoint_nome: `webhooks/${this.#grupo_vinculado.get_bot().get_application_id()}/${interacao_token}/messages/@original`,
            propriedades: {
                headers: {
                    'Content-Type': `application/json`
                }
            }
        })

        console.log(resposta_interacao.erro);
        return new RequisicaoStatus(resposta_interacao)
    }

    async #get_interacao_mensagens(interacao_token) {
        let servico_enviar = this.#grupo_vinculado.get_bot().get_servicos().get_servico_enviar()

        let resposta_interacao = await servico_enviar.enviar_requisicao({
            tipo: "GET",
            endpoint_nome: `webhooks/${this.#grupo_vinculado.get_bot().get_application_id()}/${interacao_token}/messages/@original`,
            propriedades: {
                headers: {
                    'Content-Type': `application/json`
                }
            }
        })

        console.log(resposta_interacao.erro);
        return new RequisicaoStatus(resposta_interacao)
    }

    /**
     * Cadastra o handler que irá receber os eventos de interação
     */
    #cadastra_handler() {
        this.#grupo_vinculado.on(EVENTOS.INTERACOES.INTERACTION_CREATE, (interacao_info) => {
            let interacao_custom_id = interacao_info.custom_id
            this.#disparar_interacao(interacao_custom_id, interacao_info)
        })
    }
}

/**
 * A ação que se deseja executar com a interação
 ** As ações que possuem um ok_ só podem ser usadas uma vez, elas servem para confirmar
 * ao Discord que a interação foi recebida, chama-las novamente não fará efeito
 ** Quanto as outras ações, vc pode chama-las quantas vezes quiser.
 */
class CallbackFuncaoAcoes {

    /**
     * Confirma o recebimento da interação, e envia de volta uma mensagem ao usuario que interagiu.
     * A mensagem usara a mensagem inicial da interação anexada como reply
     ** Essa ação junto com as outras que começam com ok_, só pode ser chamada uma unica vez durante o periodo que a 
     * interação é recebida, serve para configurar o comportamento futuro da sua interação, chama-la mais de uma vez não fará diferença.
     * @param {MensagemEnviar} MensagemEnviar Objeto mensagem para enviar como resposta 
     * @return {Promise<RequisicaoStatus>} Objeto resposta contendo o status da solicitação
     */
    ok_enviar_mensagem(MensagemEnviar) {

    }

    /**
     * Confirma o recebimento da interação e envia uma mensagem no chat que o bot esta pensando...
    ** Essa ação junto com as outras que começam com ok_, só pode ser chamada uma unica vez durante o periodo que a 
     * interação é recebida, serve para configurar o comportamento futuro da sua interação, chama-la mais de uma vez não fará diferença.
     * @return {Promise<RequisicaoStatus>} Objeto resposta contendo o status da solicitação
     */
    ok_pensando() {

    }

    /**
     * Confirma o recebimento da interação e não avisa nada sobre a confirmação do recebimento
    ** Essa ação junto com as outras que começam com ok_, só pode ser chamada uma unica vez durante o periodo que a 
    * interação é recebida, serve para configurar o comportamento futuro da sua interação, chama-la mais de uma vez não fará diferença.
    * @return {Promise<RequisicaoStatus>} Objeto resposta contendo o status da solicitação
    */
    ok_ocultar_pensando() {

    }

    /**
     * Confirma o recebimento da interação e edita a mensagem aonde a interação foi clicada, normalmente usado somente em componentes
    ** Essa ação junto com as outras que começam com ok_, só pode ser chamada uma unica vez durante o periodo que a 
    * interação é recebida, serve para configurar o comportamento futuro da sua interação, chama-la mais de uma vez não fará diferença.
    * @param {MensagemEnviar} MensagemEnviar Objeto mensagem para substituir a mensagem antiga
    * @return {Promise<RequisicaoStatus>} Objeto resposta contendo o status da edição
     */
    ok_editar_mensagem_componente(MensagemEnviar) {

    }

    /**
     * Retorna a mensagem original da interação que foi disparada
    * @return {Promise<RequisicaoStatus>} Objeto resposta contendo o status da mensagem
     */
    get_interacao_mensagem() {

    }

    /**
     * Edita a mensagem disparada quando é usada o "ok_pensando" ou "ok_enviar_mensagem"
     * @param {MensagemEnviar} MensagemEnviar Objeto mensagem para substituir a mensagem antiga
    * @return {Promise<RequisicaoStatus>} Objeto resposta contendo o status da edição
    */
    editar_interacao_mensagem(MensagemEnviar) {

    }

    /**
    * Exclui a mensagem disparada dos metodos "ok_pensando" e "ok_enviar_mensagem"
    * @return {Promise<RequisicaoStatus>} Objeto resposta contendo o status da exclusão
    */
    deletar_interacao_mensagem() {

    }
}