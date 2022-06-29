import { EVENTOS } from "../../../../../eventos/eventos.js";
import Canal from "./canal/Canal.js";

export default class Canais {

    /**
     * Instancia do modulo manager responsavel por esse modulo
     * @type {ModulosManager} 
     */
    #modulo;

    /**
     * Lista de canais existentes
     * @type {[Canal]}
     */
    #lista_canais = []

    /**
     * Registra o modulo de canais para um modulo responsavél
     * @param {ModulosManager} modulo_manager 
     */
    constructor(modulo_manager) {
        this.#modulo = modulo_manager

        this.#recebe_guild_create()
    }

    #recebe_guild_create() {
        this.#modulo.get_bot().get_handlers().add_handler(EVENTOS.GUILDS.GUILD_CREATE, (info_guild) => {
            console.log(info_guild.get_data());
            // let canal_info = this.#lista_canais.find(canal => {
            //     if (canal.get_id() == )
            // })
        })
    }
}