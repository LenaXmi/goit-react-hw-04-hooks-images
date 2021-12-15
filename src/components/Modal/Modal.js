import { useEffect } from "react";
import { createPortal } from "react-dom";
import s from "./Modal.module.css";
const modalRoot = document.querySelector("#modal-root");

function Modal({ modalClose, children }) {
  useEffect(() => {
    const close = (e) => {
      if (e.code === "Escape") {
        modalClose();
        console.log("escape");
      }
    };

    window.addEventListener("keydown", close);

    return () => window.removeEventListener("keydown", close);
  }, [modalClose]);

  const handleBackdropClick = (e) => {
    if (e.currentTarget === e.target) {
      modalClose();
    }
  };

  return createPortal(
    <div className={s.Overlay} onClick={handleBackdropClick}>
      <div className={s.Modal}>{children}</div>
    </div>,
    modalRoot
  );
}

//Class component without hooks

// class Modal extends Component {
//   componentDidMount() {
//     window.addEventListener("keydown", this.handleKeyDown);
//   }

//   componentWillUnmount() {
//     window.removeEventListener("keydown", this.handleKeyDown);
//   }
//   handleKeyDown = (e) => {
//     if (e.code === "Escape") {
//       this.props.modalClose();
//     }
//   };
//   handleBackdropClick = (e) => {
//     if (e.currentTarget === e.target) {
//       this.props.modalClose();
//     }
//   };
//   render() {
//     return createPortal(
//       <div className={s.Overlay} onClick={this.handleBackdropClick}>
//         <div className={s.Modal}>{this.props.children}</div>
//       </div>,
//       modalRoot
//     );
//   }
// }

export default Modal;
