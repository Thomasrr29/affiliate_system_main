import React, { useEffect, useState } from "react";

interface ModalComponentProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ModalComponent: React.FC<ModalComponentProps> = ({isOpen, onClose, children}) => {

    const [animation, setAnimation] = useState("")

    useEffect(() => {

        if(isOpen){

            setAnimation("modal-enter")

            window.document.body.style.overflow = "hidden"

        } else {

            setAnimation("modal-exit")

            window.document.body.style.overflow = "auto"

        }

    }, [isOpen])

    if (!isOpen && animation === "modal-exit") return null; 

    return (
        <div className={`bg-white rounded-lg flex flex-col
        ${animation ? "animate-modal-enter" : "animate-modal-exit"} 
        ${isOpen ? "fixed" : "hidden"} top-[30%] left-[30%] 
        w-auto bg-opacity-50 flex items-center justify-center z-50`}>
            
            <div className="w-full flex justify-end">
                <button 
                className="mr-10 my-4 text-lg font-semibold cursor-pointer"
                onClick={onClose}>x</button>
            </div>
            
            <div>
                {children}
            </div>
        </div>
    )
}


export default ModalComponent