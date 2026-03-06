import { createPortal } from "react-dom";

export default function PortalModal({ children }) {
  const modalRoot = document.getElementById("modal-root");

  return createPortal(children, modalRoot);
}
