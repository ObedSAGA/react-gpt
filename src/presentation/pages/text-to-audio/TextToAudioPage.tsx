import { useState } from "react";
import { GptMessage, GptMessageAudio, MyMessage, TextMessageBoxSelect, TypingLoader } from "../../components";
import { textToAudioUseCase } from "../../../core/use-cases";


interface TextMessage {
  text: string;
  isGpt: boolean;
  type: 'text';
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audio: string;
  type: 'audio';
}

type Message = TextMessage | AudioMessage

export const TextToAudioPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([])

  const disclaimer = `¡Hola!, escribe el texto que quieras convertir en audio 🎶 \n * Todos los audios están generados por IA
  `
  const voices = [
    { id: "nova", text: "Nova" },
    { id: "alloy", text: "Alloy" },
    { id: "echo", text: "Echo" },
    { id: "fable", text: "Fable" },
    { id: "onyx", text: "Onyx" },
    { id: "shimmer", text: "Shimmer" },
  ]

  const handlePost = async (text: string, selecetedVoice: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false, type: 'text' }]);

    const { message, audioUrl, ok } = await textToAudioUseCase(text, selecetedVoice);
    setIsLoading(false);
    if (!ok) return;

    setMessages((prev) => [...prev, { text: `${selecetedVoice} - ${message}`, isGpt: true, type: 'audio', audio: audioUrl! }]);

  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* {Bienvenida} */}
          <GptMessage text={disclaimer} />

          {
            messages.map((message, index) => (
              message.isGpt
                ? (

                  message.type === 'audio' ?
                    (
                      <GptMessageAudio
                        audioUrl={message.audio}
                        key={index}
                        text={message.text}
                      />
                    )
                  : (
                    <GptMessage 
                      text={message.text}
                      key={index}
                    />
                  )
              )
                : (
                  <MyMessage key={index} text={message.text} />
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

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        options={voices}
      />

    </div>
  )
}
