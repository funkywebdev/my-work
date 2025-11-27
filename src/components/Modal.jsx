import React from "react";

const Modal = ({modalRef , children,} ) => {
  return (

      
      <dialog ref={modalRef} id="my_modal_8" className="modal">
        <div className="modal-box">

        <div className="py-4">
          {children}
        </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>

             
          </div>
        </div>
      </dialog>
    
  );
};

export default Modal;
