/**
 * Recebimento de evento
 */
export const DISPATCH = 0;
/**
 * Envio e Recebimento de heartbeat
 */
export const HEARTBEAT = 1;

/**
 * Envio para solicitar autenticação
 */
export const IDENTIFY = 2;

/**
 * Envio para dar update na presence(status doq o usuario ta fazendo)
 */
export const PRESENCE_UPDATE = 3;

/**
 * Envio para atualizar status do canal de voz
 */
export const VOICE_STATE_UPDATE = 4;

/**
 * Envio para tentar resumir uma sessão recente
 */
export const RESUME = 6;

/**
 * Recebimento com aviso indicando para reconectar o websocket
 */
export const RECONNECT = 7;

/**
 * Envio para solicitar usuarios offline de um grupo grande
 */
export const REQUEST_GUILD_MEMBERS = 8;

/**
 * Recebimento indicando que a sessão foi invalidada
 */
export const INVALID_SESSION = 9;

/**
 * Recebimento confirmando que a conexão foi conectada e esta pronto para autenticar
 */
export const HELLO = 10;

/**
 * Recebimento que confirma que o gateway do Discord recebeu o ultimo heartbeat enviado
 */
export const HEARTBEAT_ACK = 11;