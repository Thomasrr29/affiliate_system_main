interface AlertComponentProps {
    icon: React.ReactNode
    text: string 
}


const AlertComponent: React.FC<AlertComponentProps> = ({icon, text}) => {

    return (

        <div className="flex flex-col justify-center 
        items-center bg-blue-400 gap-y-4 h-[200px] rounded-xl">
            {icon}
            <p className="text-white text-md">{text}</p>
        </div>

    )
}

export default AlertComponent