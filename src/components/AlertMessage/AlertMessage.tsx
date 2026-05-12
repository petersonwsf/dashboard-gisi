import { Toast } from "bootstrap";
import { useEffect, useState } from "react";
import event from "../../utils/event";

export default function AlertMessage() {

    const [message, setMessage] = useState<string>('');
    const [type, setType] = useState<'success' | 'error'>('success');

    useEffect(() => {

        event.on('alert', ({ message, type } : { message: string; type: 'success' | 'error' }) => {
            setMessage(message);
            setType(type);

            const toastElement = document.getElementById('liveToast');
            if (toastElement) {
                const toast = new Toast(toastElement);
                toast.show();
            }
        })

    }, [])

    return (
        <div className="toast align-items-center position-fixed" id="liveToast" style={{top: '70px', right: '10px', zIndex: 9999, borderRadius: '10px'}}>
            <div className={`d-flex bg-${type === 'success' ? 'success' : 'danger'} text-white`} style={{borderRadius: '10px'}}>
                <div className="toast-body">
                    {message}
                </div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    )
}