export class Componente {
    #tipo_componente
    #label
    #style
    #custom_id
    #components = []

    /**
     * Define o tipo do componente. As opções abaixo são:
     * @description 1: Action Row - Um container para outros componentes
     * @description 2: Button - Um botão
     * @description 3: Select Menu - Um menu de select para selecionar alguma opção
     * @description 4: Text Input - Um campo de texto para digitar
     * @param {Number} tipo Tipo do componente
     */
    setTipoComponente(tipo) {
        this.#tipo_componente = tipo
        return this
    }

    /**
     * Define o label do componente
     * @param {String} nome 
     */
    setLabel(nome) {
        this.#label = nome
        return this
    }

    /**
     * Define o estilo do componente
     * @param {Number} numero 
     */
    setEstilo(numero) {
        this.#style = numero
        return this
    }

    /**
     * Define o custom id desse componente para receber depois em eventos
     * @param {String} id
    */
    setCustomID(id) {
        this.#custom_id = id
        return this
    }

    /**
     * Adiciona um outro componente neste mesmo componente
     * @param {Componente} componente
     */
    addComponentes(componente) {
        this.#components.push(componente)
        return this
    }
}