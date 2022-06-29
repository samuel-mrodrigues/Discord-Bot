/**
 * Representa um canal do Discord
 */
export default class Canal {

    /**
     * ID do canal
     */
    #canal_id = -1
    constructor(id_canal) {
        this.#canal_id = id_canal
    }

    get_id() {
        return this.#canal_id
    }
}