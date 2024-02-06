import { FormEvent, useRef, useState } from "react";

interface Props{
    onSendMessage: (message: string, file: File) => void;
    placeholder?: string;
    disableCorrection?: boolean;
    accept?: string;
}

export const TextMessageBoxFile = ({onSendMessage, placeholder, disableCorrection = false, accept}: Props) => {
    
    const inpuFileRef = useRef<HTMLInputElement>(null);
    
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>();

    
    const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // if (message.trim().length === 0) return;
        if (!selectedFile) return;
        onSendMessage(message, selectedFile);
        setMessage('');
        setSelectedFile(null);
    }
    
    return (
    <form 
        onSubmit={handleSendMessage}
        className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
    >   
        <div>
            <button
                type="button"
                className="flex items-center justify-center text-gray-400 hover:text-gray-700"
                onClick={() => inpuFileRef.current?.click()}
               
            >
                <i className="fa-solid fa-paperclip text-xl"></i>
            </button>
            <input 
                type="file" 
                ref={inpuFileRef}
                accept={accept}
                onChange={ (e) => setSelectedFile(e.target.files?.item(0))}
                hidden
            />
        </div>

        
        <div className="flex-grow">
            <div className="relative w-full">
                <input 
                    type="text" 
                    autoFocus
                    name="message"
                    className="flex w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
                    placeholder={placeholder}
                    autoComplete={ disableCorrection ? 'off' : 'on'}          
                    autoCorrect={ disableCorrection ? 'off' : 'on'}      
                    spellCheck={disableCorrection ? 'false' : 'true'}     
                    value={message}
                    onChange={ (e) => setMessage(e.target.value)}
               />
            </div>
        </div>
        <div className="ml-4">
            <button 
                className="btn-primary "
                disabled={!selectedFile}
            >
                {
                    (!selectedFile)
                    ? <span className="mr-2">Enviar</span>
                    : <span className="mr-2">{selectedFile.name.substring(0,10) + '...'}</span>

                }
                <i className="fa-regular fa-paper-plane"></i>
            </button>
        </div>
    </form>
  )
}
