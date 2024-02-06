
interface Props {
    imageUrl: string;
    alt: string;
}


export const GptMessageImage = ({imageUrl, alt}:Props) => {
  return (
    <div className="col-start-1 col-end-8 p-3 rounded-lg fade-in">
        <div className="flex flex-row items-start">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 flex-shrink-0">
                G
            </div>
            <div className="relative ml-3 text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl">
                <span>Estupendo! Aquí tienes una idea original 💚 </span>
               <img src={imageUrl} alt={alt} className="mt-2 rounded-xl w-96 h-96 object-cover"/>
            </div>
        </div>
    </div>
  )
}
