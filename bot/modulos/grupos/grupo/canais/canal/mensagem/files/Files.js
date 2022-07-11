import mime_tipos from "mime-types"
/**
 * Essa classe cuida de salvar todos os documentos que se deseja enviar junto a uma mensagem ao Discord
 * Não é possível enviar anexos sem essa classe auxiliar.
 */
export class Arquivos {
    /**
     * Mostrar logs?
     */
    #mostrar_logs = true

    /**
     * Contem a lista de todos os arquivos já adicionados, com suas informações...
     * @type {[ArquivoInfo]}
     */
    arquivos_adicionados = []

    /**
     * Retorna o arquivo que será utilizado em alguma propriedade(nos embeds na maioria das vezes).
     ** Essa função só irá retornar arquivos que vc especificou na função setFiles(), se especificar um arquivo que não existe, não sera retornado nada!
     * @returns {string}
     */
    get_arquivo(arquivo_nome) {
        let existe = this.arquivos_adicionados.find(arquivo => {
            if (arquivo.nome_arquivo == arquivo_nome) {
                return true;
            }
        })

        if (existe != undefined) {
            return `attachment://${arquivo_nome}`
        }
    }

    /**
     * Adicionar um novo arquivo junto as mensagens
     * @param {string} arquivo_nome O nome do arquivo(esse nome será utilizado para referencia-lo em outras partes da mensagem)
     * @param {Buffer} arquivo_bytes O buffer contendo os bytes da imagem
     * @param {PropsArquivo} props_arquivo Informações basicas do arquivo
     * @return {Arquivos}
     */
    add_arquivo(arquivo_nome, arquivo_bytes, props_arquivo) {
        let checa_nome = this.#nomeArquivoOk(arquivo_nome)

        if (!checa_nome.valido) {
            throw checa_nome.msg
        }

        let arquivo_objeto = new ArquivoInfo(arquivo_nome, arquivo_bytes, props_arquivo)
        this.arquivos_adicionados.push(arquivo_objeto)
        return this
    }

    /**
     * Ativar logs?
     * @param {boolean} bool 
     */
    ativar_logs(bool) {
        this.#mostrar_logs = bool
        return this
    }

    log(msg) {
        if (!this.#mostrar_logs) return;
        if (typeof msg == 'string') {
            console.log(`[ARQUIVOS]: ${msg}`);
        } else {
            console.log(`-----------------------[ARQUIVOS]-----------------------`);
            console.log(msg);
            console.log("-------------------------------------------------------");
        }
        return this
    }

    /**
     * Verifica se o nome do arquivo informado é valido
     * @param {string} nome 
     * @returns {{valido: boolean, msg: string}}
     */
    #nomeArquivoOk(nome) {
        let ok = {
            valido: false,
            msg: false
        }

        if (nome == undefined || nome == "") {
            ok.msg = "Especifique um nome do arquivo"
            return ok
        }

        let nome_ext = nome.split(".")
        if (nome_ext.length == 1) {
            ok.msg = "Digite a extensão do arquivo!"
            return ok
        }

        ok.valido = true
        return ok
    }
}

/**
 * Um arquivo info é um objeto que é gerado apos a adição do arquivo a lista de arquivos.
 * Esse objeto contem todas as informações do arquivo e seu id unico gerado
 */
export class ArquivoInfo {

    /**
     * ID unico gerado na hora da adição desse arquivo
     * @type {number}
     */
    id_unico

    /**
     * Nome do arquivo originalmente com a sua extensão
     * @type {string}
     */
    nome_arquivo;

    /**
     * O tipo do conteudo desse arquivo. Esse tipo deve ser um tipo MIME valido. Por exemplo,
     * image/png, video/mp4, etc.
     * @type {string}
     */
    tipo_conteudo;

    /** 
     * O Buffer contendo os bytes do arquivo
     * @type {Buffer}
     */
    dados_buffer;

    /**
     * Informações basicas do arquivo
     * @type {PropsArquivo}
     */
    propriedades;

    /**
     * Constrói um novo arquivo
     * @param {number} id ID unico gerado
     * @param {string} nome Nome do arquivo
     * @param {Buffer} buffer Buffer do arquivo lido
     * @param {PropsArquivo} props Informações do arquivo
     */
    constructor(nome, buffer, props = PropsArquivo) {
        this.nome_arquivo = nome
        this.dados_buffer = buffer
        this.propriedades = props

        this.#define_tipo_conteudo()
    }

    /**
     * Gera o tipo do conteudo desse arquivo
     * Esse tipo MIME é usado na montagem da mensagem
     */
    #define_tipo_conteudo() {
        let tipo_conteudo = mime_tipos.lookup(this.nome_arquivo)

        if (tipo_conteudo != false) {
            this.tipo_conteudo = tipo_conteudo
        }
    }

    /**
     * Retorna a extensão do arquivo
     * @returns {string}
     */
    get_extensao() {
        return this.nome_arquivo.split(".")[1]
    }
}

/**
 * Propriedades de um arquivo file sendo adicionado
 */
export const PropsArquivo = {
    /**
     * Descrição do arquivo
     * @type {string}
     */
    descricao: undefined,
    /**
     * Se o arquivo for uma imagem, é possivel definir o heigth
     * @type {number}
     */
    heigth: undefined,
    /**
     * Se o arquivo for uma imagem, é possivel definir o width
     * @type {number}
     */
    width: undefined,

    /**
     * Vincula a imagem a mensagem, enquanto a mensagem existir, esse arquivo não será excluido futuramente.
     ** Caso a mensagem seja excluida, o Discord irá automaticamente deletar após um determinado tempo.
     ** Desative para manter o arquivo sem dependencia com a mensagem
     */
    vincular_a_mensagem: true
}