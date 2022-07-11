/**
 * O componente ActionRow não é interativo, ele serve apenas de apoio para os outros tipos de componentes
 ** Um ActionRow deve ser do tipo 1(ACTION_ROW) e seguir as seguintes regras:
 ** Maximo de 5 Actions Rows por mensagem
 ** Um ActionRow não pode ter outro ActionRow, somente outros componentes
 */
export class ComponenteActionRow {
    /**
     * O tipo do ID do componente. ActionRows são o 1
     * @type {number}
     */
    type = 1

    /**
     * Contem os outros componentes da mensagem
     * @type {[]}
     */
    components = []

    /**
     * Define os componentes que estarão presentes nesse ActionRow
     * @param {[]} componetes 
     */
    setComponents(componetes) {
        this.components = componetes
        return this
    }

    /**
     * O tipo do componente
     * @returns {number}
     */
    getTipo() {
        return this.type
    }

}

/**
 * O componente de botão é um botão interativo que pode ser clicado por usuarios e disparar interações, algumas regras:
 ** Botoes podem ser usados somente dentro de um componente ActionRow
 ** Um componente ActionRow só pode conter n omaximo 5 botoões
 ** Um componente ActionRow contendo botões não pode simultaneamente conter um componente Select
 ** Botoes com a propriedade link não disparam uma interação, devem ter obrigatoriamente a propriedade URL definida e não podem ter a propriedade custom_id
 */
export class ComponenteButton {
    /**
     * O tipo do componente, botões são tipo 2
     * @type {number}
     */
    type = 2

    /**
     * Estilo do botão
     ** Segue abaixo uma lista dos tipos de estilos:
     ** 1 = Roxo fraco
     ** 2 = Cinza
     ** 3 = Verde
     ** 4 = Vermelho
     ** 5 = Cinza
     @type {number}
     */
    style

    /**
     * Texto que aparece no botão
     * @type {string}
     */
    label

    /**
     * Um objeto emoji para aparecer
     * @type {ComponenteEmoji}
     */
    emoji

    /**
     * Um ID customizado dessa interação do botão
     ** Essa propriedade é obrigatoria se o botão não for um link
     ** O custom_id é passado quando o BOT receber o evento de interação
     * @type {string}
     */
    custom_id

    /**
     * O URL do botão, se vc quiser considerar como um link externo
     * @type {string}
     */
    url

    /**
     * Ativa ou desativa o botão(se a propriedade for oculta, por padrão será false)
     * @type {boolean}
     */
    disabled

    /**
     * Retorna o tipo do componente do botão
     * @returns {number}
     */
    getTipo() {
        return this.type
    }

    /**
     * Define o estilo do botão
     ** Segue abaixo uma lista dos tipos de estilos:
    ** 1 = Roxo fraco
    ** 2 = Cinza
    ** 3 = Verde
    ** 4 = Vermelho
    ** 5 = Cinza
    @type {number}
    */
    setSyle(style) {
        this.style = style
        return this
    }

    /**
     * Define o texto do botão
     * @param {string} nome 
     */
    setLabel(nome) {
        this.label = nome
        return this
    }

    /**
     * Define o objeto emoji para mostrar
     * @param {ComponenteEmoji} emoji_objeto
     */
    setEmoji(emoji_objeto) {
        this.emoji = emoji_objeto
        return this
    }

    /**
     * Define o custom id dessa interação
     * @param {string} id 
     */
    setCustomId(id) {
        this.custom_id = id
        return this
    }

    /**
     * Define o URL do botão ao clica-lo
     * @param {string} url 
     */
    setURL(url) {
        this.url = url
        return this
    }

    /**
     * Ativa/desativa esse botão
     * @param {boolean} bool 
     * @returns 
     */
    toggleDesativar(bool) {
        this.disabled = bool
        return this
    }
}

/**
 * Componente para criar menu, que quando clicado, abre opções configuradas aqui para o usuario selecionar
 ** É possivel definir que varias opções sejam selecionadas
 ** Esse componente só pode ser usado dentro de um componente ActionRow
 ** Um componente ActionRow só pode conter um desse menu de seleção
 ** Um componente ActionRow contendo um menu de seleção não pode ter componentes de botões
 */
export class ComponenteSelectMenu {
    /**
     * O tipo do SelectMenu é 3
     * @type {number}
     */
    type = 3

    /**
     * O ID custom dessa interação. Esse ID será passado futuramente no evento de interação, quando o usuario interagir com esse componente
     * @type {string}
     */
    custom_id

    /**
     * Contem a lista de opções que irá aparecer para selecionar
     * Maximo de 25 opções
     * @type {[ComponenteSelectMenuOpcao]}
     */
    options = []

    /**
     * Uma mensagem de placeholder no campo de seleção, caso nenhuma opção esteja selecionada
     * @type {string}
     */
    placeholder;

    /**
     * Minimo de items que precisam ser selecionados. Por padrão, o padrão é 1, minimo 0, e o maximo de 25
     * @type {number}
     */
    min_values

    /**
     * Maximo de itens que podem ser selecionados. Por padrão é minimo 1, maximo 25
     * @type {number}
     */
    max_values

    /**
     * Ativar ou desativar esse menu de seleção
     * @type {boolean}
     */
    disabled

    /**
     * Retorna o tipo do componente de select menu
     * @returns {number}
     */
    getTipo() {
        return this.type
    }

    /**
     * Define o custom_id desse select menu
     * @param {string} id
     */
    setCustomID(id) {
        this.custom_id = id
        return this
    }

    /**
     * Define as opções que devem aparecer para selecionar
     * @param {[ComponenteSelectMenuOpcao]} opcoes 
     */
    setOptions(opcoes) {
        this.options = opcoes
        return this
    }

    /**
     * Define o que irá aparecer no menu de seleção quando nenhuma opção estiver selecionada
     * @param {string} nome 
     */
    setPlaceholder(nome) {
        this.placeholder = nome
        return this
    }

    /**
     * Define o minimo de opções que precisam ser selecionadas
     * @param {number} total 
     */
    setMinValues(total) {
        this.min_values = total
        return this
    }

    /**
     * Define o maximo de opções que podem ser selecionadas
     * @param {number} total 
     */
    setMaxValues(total) {
        this.max_values = total
    }

    /**
     * Ativa ou desativa esse select menu
     * @param {boolean} bool 
     */
    toggleDesativar(bool) {
        this.disabled = bool
    }

    /**
     * Retorna um JSON contendo as informações desse componente de Select Menu
     * @returns {{type: number, custom_id: string, options: [ComponenteSelectMenuOpcao], placeholder: string, min_values: number, max_values: number, disabled: boolean}}
     */
    toJSON() {
        let opcoes_json = []

        for (const opcao of this.options) {
            opcoes_json.push(opcao.toJSON())
        }

        return {
            type: this.type,
            custom_id: this.custom_id,
            options: opcoes_json,
            placeholder: this.placeholder,
            min_values: this.min_values,
            max_values: this.max_values,
            disabled: this.disabled
        }
    }
}

/**
 * Um componente pertencente ao componente SelectMenu. Representa uma opção em um menu de select
 */
export class ComponenteSelectMenuOpcao {
    /**
     * Nome da opção
     * @type {string}
     */
    label

    /**
     * O valor da opção
     * @type {String}
     */
    value

    /**
     * Se a opção será a padrão a ser selecionada
     * @type {boolean}
     */
    default;

    /**
     * Uma descrição da opção
     * @type {string}
     */
    description

    /**
     * Um objeto emoji.
     * Nome e ID do emoji
     * @type {ComponenteEmoji}
     */
    emoji

    /**
     * Define o nome do label que irá aparecer para selecionar
     * @param {string} nome 
     */
    setLabel(nome) {
        this.label = nome
        return this
    }

    /**
     * Define o valor da opção
     * @param {string} valor 
     */
    setValue(valor) {
        this.value = valor
        return this
    }

    /**
     * Define um emoji para mostrar
     * @param {ComponenteEmoji} emoji 
     */
    setEmoji(emoji) {
        this.emoji = emoji
        return this
    }

    /**
     * Define a descrição dessa opção
     * @param {string} desc 
     */
    setDescription(desc) {
        this.description = desc
        return this
    }

    /**
     * Define se essa opção será a padrão
     * @param {boolean} bool 
     */
    setDefault(bool) {
        this.default = bool
        return this
    }
}

/**
 * Representa um objeto EMOJI para utilizar em componentes de mensagens
 */
export class ComponenteEmoji {
    /**
     * ID do emoji
     * @type {number}
     */
    id

    /**
     * Nome do emoji
     * @type {string}
     */
    name

    /**
     * Emoji animado?
     * @type {boolean}
     */
    animated

    /**
     * Define o ID do emoji
     * @param {number} id_emoji 
     */
    setID(id_emoji) {
        this.id = id_emoji
        return this
    }

    /**
     * Define o nome do emoji
     * @param {string} nome 
     */
    setName(nome) {
        this.name = nome
        return this
    }

    /**
     * Define se o emoji é animado
     * @param {boolean} bool 
     */
    setAnimated(bool) {
        this.animated = bool
        return this
    }

}