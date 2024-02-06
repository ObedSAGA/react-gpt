type GeneratedImage = Image | null

interface Image {
    url: string;
    alt: string;
}

export const imageGenerationUseCase = async (
    prompt: string,
    originalImage?: string,
    maskImage?: string,
): Promise<GeneratedImage> => {

    try {

        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/image-generation`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                prompt, originalImage, maskImage
            })
        });

        const { revised_prompt: alt, url } = await resp.json();
        

        return {
            alt,
            url
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}