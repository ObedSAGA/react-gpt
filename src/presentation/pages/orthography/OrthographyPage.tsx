import { useState } from "react";
import { GptMessage, GptOrthographyMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components";
import { orthographyUseCase } from "../../../core/use-cases";


interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  }
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async(text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const data = await orthographyUseCase(text);

    if (!data.ok) {
      setMessages((prev) => [...prev, { text: 'Lo siento, no pude realizar la correción.', isGpt: true}]);
    } else {
      setMessages((prev) => [...prev, { 
        text: data.message, 
        isGpt: true, 
        info: {
          errors: data.errors,
          userScore: data.userScore,
          message: data.message,
        },
      }]);
    }
    
    setIsLoading(false);

    //TODO: Añadir el mensaje en isGPT en true
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* {Bienvenida} */}
          <GptMessage text="¡Hola!, escribe el texto que quieres corregir" />

          {
            messages.map((message, index) => (
              message.isGpt
              ? (
                <GptOrthographyMessage 
                  key={index}
                  {...message.info!}
                />
              )
              : (
                <MyMessage key={index} text={message.text}/>
              )
            ))

          }
          {
            isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader />
              </div>
            )
          }

        </div>
      </div>
      
      <TextMessageBox 
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        disableCorrection
      />

    </div>
  )
}
