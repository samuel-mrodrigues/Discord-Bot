import { MensagemEnviar } from "../grupos/grupo/canais/canal/mensagem/Mensagem.js";

/**
 * Corpo de um objeto que é retornado quando é enviado alguma mensagem ao canal de Discord
 */
export class RequisicaoStatus {
    /**
     ** True se a requisição for realizada com sucesso, falso caso contrario.
    ** Esse sucesso é apenas se a mensagem foi enviada com sucesso até o destino, se o Discord retornou um erro com relação a algum campo incorreto na mensagem
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
         * @type {{}}
         */
        discord_data: null
    }

    /**
     * Informações de erro caso ocorra algum
     ** Se nenhum erro acontecer, essa propriedade estara nula!
     */
    erro

    /**
     * Um objeto resposta
     * @param {{sucesso: boolean, requisicao: import("axios").AxiosResponse, erro: {}}} objeto_requisicao
     */
    constructor(objeto_requisicao) {
        if (objeto_requisicao.sucesso) {
            this.sucesso = true
            this.data.requisicao = objeto_requisicao.requisicao
            this.data.discord_data = objeto_requisicao.requisicao.data
        } else {
            this.erro = objeto_requisicao.erro
        }
    }
}

/**
 * Se a mensagem que for enviada tiver anexos, é necessario enviar como multipart. Essa função recebe um objeto de mensagem
 * e gera uma string multipart valida para enviar ao Discord
 * @param {MensagemEnviar} MensagemObjeto
 * @return {FormData}
 */
export function gerar_mensagem_multipart(MensagemObjeto) {
    // Lib que appenda os dados que eu quero e no final retorna o body formatado no multipart
    let formdata = new FormData()

    formdata.append("payload_json", JSON.stringify(MensagemObjeto.toJSON()), {
        contentType: "application/json"
    })

    // Anexa os arquivos que o usuario especificou
    for (const arquivo of MensagemObjeto.files.arquivos_adicionados) {
        if (arquivo.tipo_conteudo == undefined) continue;
        formdata.append(`files[${arquivo.id_unico}]`, arquivo.dados_buffer, { contentType: arquivo.tipo_conteudo, filename: arquivo.nome_arquivo })
    }

    return formdata
}