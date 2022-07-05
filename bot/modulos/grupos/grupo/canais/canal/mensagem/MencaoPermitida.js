/**
 * Esse objeto controla quem poderá ser marcado na mensagem
 */
export class MencaoPermitida {

    /**
     * Controla a menção de usuarios/cargos da mensagem
     ** Por padrão, ao usar menções @everyone, @here, etc.. no content da mensagem, a menção será permitida, marcando a pessoa/cargo.
     ** Ao passar parametros para a propriedade parse, vc estará dizendo qual menção será permitida, se será somente usuario, grupo,
     * somente um grupo ou todos. Somente as menções dentro do parse será permitido na mensagem
     * 
     ** Por exemplo, se voce quiser desabilitar qualquer menção na mensagem, supondo que ela tenha um @everyone,
     * passe um array vazio parse = [], e essas menções serão ignoradas e enviadas como um simples texto
     * @type {['roles' | 'users' | 'everyone']} Tipos de menções permitidas - Não inclua essa propriedade caso queira que todas as menções sejam validas
     */
    parse

    /**
     * Controla quais os cargos que serão permitidos para serem citados na mensagem
     ** Caso queira que qualquer cargo seja mencionado, apenas ignore essa propriedade
     * @type {[number]} Um array dos IDs dos cargos daquele grupo
     */
    roles

    /**
     * Controla quais os usuarios que serão permitidos para serem citados na mensagem
     ** Caso queira que qualquer usuario seja mencionado, apenas ignore essa propriedade
     * @type {[number]} Um array dos IDs dos usuarios 
     */
    users

    /**
     * Esconder ou não o nome do autor da mensagem respondida
     * @type {boolean}
     */
    replied_user
}