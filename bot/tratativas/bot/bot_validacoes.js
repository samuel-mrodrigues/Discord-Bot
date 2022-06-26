
import { Intent } from "../../intents/bot_intents.js"

export function validarTokenSecreto(token) {
    if (token == null || token.length <= 10) {
        return false;
    }

    return true;
}

export function validarIntent(intent) {

    if (intent != null) {
        if (!(intent instanceof Intent)) {
            return false;
        }
    }

    return true;
}