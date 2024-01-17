import { useRef, useState } from "react";
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";
import { ProsConsStreamGeneratorUseCase } from "../../../core/use-cases";



interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {

  const abortController = useRef(new AbortController());
  const isRunneng = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async(text: string) => {
    //Aborta el stream al enviar una nueva consulta.
    if (isRunneng.current = true) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    setIsLoading(true);
    isRunneng.current = true;
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    // ?? Código con función generadora

    const stream = ProsConsStreamGeneratorUseCase(text, abortController.current.signal);
    setIsLoading(false);
    
    setMessages((prev) => [...prev, { text: '', isGpt: true }]);
    
    for await (const text of stream) {
      setMessages((prev) => {
        const lastMessages = [...prev];
        lastMessages[lastMessages.length - 1].text = text;
        return lastMessages;
      });
    }
    isRunneng.current = true;

  // ??Código sin el uso de función generadores.
    // const reader = await ProsConsStreamUseCase(text);

    // setIsLoading(false);

    // if (!reader) return alert('No se pudo genera el reader');
  
    // const decoder = new TextDecoder();
    // let message = '';
    // setMessages((prev) => [...prev, { text: message, isGpt: true }]);

    // while (true){
    //   const {value, done} = await reader.read();
    //   if (done) break;

    //   const decodedChunk = decoder.decode(value, {stream: true});
    //   message += decodedChunk;

      // setMessages((prev) => {
      //   const lastMessages = [...prev];
      //   lastMessages[lastMessages.length - 1].text = message;
      //   return lastMessages;
      // })
    // }
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* {Bienvenida} */}
          <GptMessage text="¡Hola!, Puedo analizar los pros y contras de aquello que te interese. Sólo tienes que pedirlo 😋. Verás que respondo en directo" />

          {
            messages.map((message, index) => (
              message.isGpt
              ? (
                <GptMessage key={index} text={message.text} />
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
