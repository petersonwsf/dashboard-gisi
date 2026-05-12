import event from "./event";

export function handleAlertMessage(message: string, type: 'success' | 'error' = 'success') {
    event.emit('alert', { message, type });
}