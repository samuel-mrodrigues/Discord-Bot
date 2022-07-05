/**
 * Essa classe cuida de salvar todos os documentos que se deseja enviar junto a uma mensagem ao Discord
 * Não é possível enviar anexos sem essa classe auxiliar.
 */
export class Arquivos {

    /**
     * O contador unico atual. Cada vez que um novo arquivo é adicionado, esse contador irá incrementar em 1,
     * fazendo com que cada arquivo sempre tenha um ID unico
     * @type {number}
     */
    id_contador = 0;

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
     * Adicionar um novo arquivo junto as mensagens
     * @param {string} arquivo_nome O nome do arquivo(esse nome será utilizado para referencia-lo em outras partes da mensagem)
     * @param {Buffer} arquivo_bytes O buffer contendo os bytes da imagem
     * @return {Arquivos}
     */
    add_arquivo(arquivo_nome, arquivo_bytes) {

        let checa_nome = this.#nomeArquivoOk(arquivo_nome)

        if (!checa_nome.valido) {
            throw checa_nome.msg
        }

        let arquivo_objeto = new ArquivoInfo(this.id_contador, arquivo_nome, arquivo_bytes)
        this.log(`Novo arquivo ${arquivo_nome} adicionado com o ID ${this.id_contador}`);

        this.arquivos_adicionados.push(arquivo_objeto)
        this.id_contador++
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

        let nome_arquivo = nome_ext[0]
        let extensao = nome_ext[1]

        switch (extensao.toLowerCase()) {
            case 'png':
                break;
            case 'jpeg':
                break;
            case 'jpg':
                break;
            case 'txt':
                break;
            case 'gif':
                break;

            default:
                ok.msg = `A extensão ${extensao} não é suportada!`
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
     * Constrói um novo arquivo
     * @param {number} id ID unico gerado
     * @param {string} nome Nome do arquivo
     * @param {Buffer} buffer Buffer do arquivo lido
     */
    constructor(id, nome, buffer) {
        this.id_unico = id
        this.nome_arquivo = nome
        this.dados_buffer = buffer

        this.#define_tipo_conteudo()
    }

    /**
     * Gera o tipo do conteudo desse arquivo
     * Esse tipo MIME é usado na montagem da mensagem
     */
    #define_tipo_conteudo() {
        if (this.is_imagem()) {
            this.tipo_conteudo = `image/${this.get_extensao().toLowerCase()}`
        } else if (this.is_texto()) {
            this.tipo_conteudo = `text/plain`
        }
    }

    /**
     * Retorna true se esse arquivo é uma imagem
     * @returns {boolean}
     */
    is_imagem() {
        let tipo_ext = this.nome_arquivo.split(".")[1].toLowerCase()

        if (tipo_ext == 'png' || tipo_ext == 'jpeg' || tipo_ext == 'svg+xml' || tipo_ext == 'svg' || tipo_ext == 'webp' || tipo_ext == 'gif' || tipo_ext == 'jpg') {
            return true
        } else {
            return false;
        }
    }

    /**
     * Retorna a extensão do arquivo
     * @returns {string}
     */
    get_extensao() {
        return this.nome_arquivo.split(".")[1]
    }

    /**
     * Retorna true se esse arquivo é um arquivo de texto 
     * @returns {boolean}
     */
    is_texto() {
        let tipo_ext = this.nome_arquivo.split(".")[1].toLowerCase()

        if (tipo_ext == 'txt') {
            return true
        } else {
            return false;
        }
    }
}

/**
 * Representa um anexo que se deseje usar em alguma parte da mensagem
 * 
 */
export class ArquivoAnexo {
    /**
     * Nome do arquivo que se deseja anexar nessa propriedade
     * @type {string}
     */
    nome_arquivo

    /**
     * Nome do arquivo para usar como anexo, pode ser texto, imagem, video..
     * Lembrando que esse nome deve ser IDENTICO ao nome que foi usado para adicionar o arquivo na classe de adicionar arquivos,
     * caso contrario, nada será adicionado
     * @type {string}
     */
    constructor(nome) {
        this.nome_arquivo = nome
    }
}

