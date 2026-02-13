import Modal from "./Modal.jsx";

export default function ConfirmDialog({
  open,
  title = "Confirm",
  description = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  danger = true
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={
              "rounded-md px-3 py-2 text-sm text-white " +
              (danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700")
            }
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="text-sm text-slate-700">{description}</p>
    </Modal>
  );
}
