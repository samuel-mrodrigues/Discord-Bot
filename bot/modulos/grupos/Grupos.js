import { EVENTOS } from "../../eventos/eventos.js";
import ModulosManager from "../Modulos.js";
import Grupo from "./grupo/Grupo.js";

// O Modulo de Grupos trata de receber todos os eventos de grupo, deixando disponivel ao usuario pegar esses grupos e interagir com eles
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
     * Inicia o modulo de grupos vinculado a um modulo
     * @param {ModulosManager} modulo 
     */
    constructor(modulo) {
        this.#modulo = modulo

        this.#cadastrar_handler()
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
     * Realiza o cadastro do handler que recebe os eventos de grupo
     */
    #cadastrar_handler() {
        let gerenciador_handler = this.#modulo.get_bot().get_handlers();

        // Cadastrar um handler para receber o GUILD_CREATE, que é recebido no inicio da conexão do BOT
        gerenciador_handler.add_handler(EVENTOS.GUILDS.GUILD_CREATE, (guild_dados) => {

            let novo_grupo = new Grupo(this, guild_dados.get_data())

            this.#grupos_cadastrados.push(novo_grupo)
        })
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