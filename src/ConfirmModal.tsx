import styles from './ConfirmModal.module.css'

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Confirmar acción</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          <button
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={styles.confirmButton}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
