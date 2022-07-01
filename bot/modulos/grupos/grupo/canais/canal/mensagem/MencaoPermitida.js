export class MencaoPermitida {
    #parse
    #roles
    #users
    #replied_user

    /**
     * Define os tipos de menções permitidas
     * @param {['roles' | 'users' | 'everyone']} tipos
     */
    setParseMencoesPermitidas(tipos) {
        this.#parse = tipos
        return this
    }

    /**
     * Um Array de IDs das roles(cargos) que serão mencionados
     * @param {[Number]} ids 
     */
    setRoles(ids) {
        this.#roles = ids
        return this
    }

    /**
     * Um array de IDs dos usuarios que serão mencionados
     * @param {[Number]} ids 
     */
    setUsers(ids) {
        this.#users = ids
        return this
    }

    /**
     * Para respostas, marcar ou nao o autor da mensagem que foi respondida
     * @param {Boolean} bool 
     */
    setMencionarReplyUser(bool) {
        this.#replied_user = bool
        return this
    }
}