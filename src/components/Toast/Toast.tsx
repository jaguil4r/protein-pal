import { Toast as ToastType } from '../../hooks/useToast';
import './Toast.css';

interface Props {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite" data-testid="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}`}
          data-testid="toast"
          role="status"
        >
          <span className="toast__text">{toast.text}</span>
          {toast.action && (
            <button
              className="toast__action"
              onClick={() => {
                toast.action!.onClick();
                onDismiss(toast.id);
              }}
              data-testid="toast-action"
            >
              {toast.action.label}
            </button>
          )}
          <button
            className="toast__dismiss"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
