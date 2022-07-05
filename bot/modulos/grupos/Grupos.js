import { EVENTOS } from "../../eventos/eventos.js";
import { Handler_Info } from "../../servicos/receber/handlers/Handler.js";
import ModulosManager from "../Modulos.js";
import Grupo from "./grupo/Grupo.js";

// O Modulo de Grupos trata de receber todos os eventos de grupo, deixando disponivel ao usuario pegar esses grupos e interagir com eles
// Todos os grupos em que o BOT se encontra, essa classe é responsavel por eles.
export default class Grupos {

    /**
     * Mostrar logs?
     */
    #mostrar_logs = true

    /**
     * Modulo responsavel por cuidar dos grupos
     * @type {ModulosManager}
     */
    #modulo

    /**
     * Lista de grupos que o BOT atualmente está adicionado
     * @type {[Grupo]}
     */
    #grupos_cadastrados = []

    /**
     * Os handlers são eventos que são chamados pelo serviço de receber eventos
     * @type {[Handler_Info]}
     */
    #handlers = []

    /**
     * Inicia o modulo de grupos vinculado a um modulo
     * @param {ModulosManager} modulo 
     */
    constructor(modulo) {
        this.#modulo = modulo

        this.cadastrar_handlers()
    }

    /**
     * Retorna o modulo vinculado a essa instancia de Grupos
     * @returns {ModulosManager}
     */
    get_modulo() {
        return this.#modulo;
    }

    /**
     * Retorna uma lista contendo todos os grupos que o BOT esta adicionado
     * @returns {[Grupo]}
     */
    get_grupos_cadastrados() {
        return this.#grupos_cadastrados
    }

    /**
     * Retorna um objeto Grupo
     * @param {String} id O ID do grupo
     * @returns {Grupo}
     */
    get_grupo_por_id(id) {
        let grupo_procurado = this.#grupos_cadastrados.find(grupo => {
            if (grupo.get_grupo_dados().id == id) {
                return true
            }
        })

        if (grupo_procurado != undefined) {
            return grupo_procurado
        }
    }

    /**
     * Realiza o cadastro do handler que recebe os eventos de grupo
     */
    cadastrar_handlers() {
        let gerenciador_handler = this.#modulo.get_bot().get_handlers();

        // Cadastrar um handler para receber o GUILD_CREATE, que é recebido no inicio da conexão do BOT
        let handler_criar_grupo = gerenciador_handler.add_handler(EVENTOS.GUILDS.GUILD_CREATE, (guild_dados) => {
            let novo_grupo = new Grupo(this, guild_dados.get_data())

            this.#grupos_cadastrados.push(novo_grupo)
        })

        this.#handlers.push(handler_criar_grupo)
    }

    /**
     * Excluir todos os handlers cadastrados 
     */
    excluir_handlers() {
        let gerenciador_handler = this.#modulo.get_bot().get_handlers();
        for (const handler_cadastrado of this.#handlers) {
            gerenciador_handler.remove_handler(handler_cadastrado)
        }
    }

    log(msg) {
        if (!this.#mostrar_logs) return;
        if (typeof msg == 'string') {
            console.log(`[GRUPOS]: ${msg}`);
        } else {
            console.log(`-----------------------[GRUPOS]-----------------------`);
            console.log(msg);
            console.log("-------------------------------------------------------");
        }
    }
}