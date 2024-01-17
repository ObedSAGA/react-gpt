

export const ProsConsStreamUseCase =async (prompt:string) => {
    try {
        
        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({prompt})
            // TODO: abortsignal
        });

        if (!resp.ok) throw new Error("No se pudo realizar la correción");
        
        const reader = resp.body?.getReader();
        if(!reader) {
            console.log('No se pudo general el reader');

            return null;
        }

        return reader;

    } catch (error) {
        console.log(error);
        
        return null;
    }
}