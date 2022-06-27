const ERROS = {
    TOKEN_INVALIDO: "O token fornecido não é valido",
    INTENT_FORMATO_INCORRETO: "O parametro de Intent não está correto, utilize por padrão a implementação existente em bot/bot.intents.js",
    EVENTO_NAO_ENCONTRADO: "O evento recebido (@evento@) não foi encontrado na lista de eventos validos",
    ERRO_CONECTAR_VERIFIQUE_TOKEN_BOT: "O BOT não foi autenticado, verifique se o token informado está correto!",
    ERRO_CONECTAR_VERIFIQUE_CONEXAO: "Ocorreu um erro ao conectar ao gateway Discord: @erro@"
}

Object.freeze(ERROS)
export default ERROS
