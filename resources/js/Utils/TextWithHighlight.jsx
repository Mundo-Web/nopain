const TextWithHighlight = ({ text, split = false, split_coma = false, split_dos_puntos = false }) => {
    // Función para procesar el texto con resaltados
    const renderHighlightedText = (textToRender) => {
        if (!textToRender || typeof textToRender !== "string") return null;
        const parts = textToRender.split(/(\*[^*]+\*)/g); // separa todo lo entre *...*

        return parts.map((part, index) =>
            part.startsWith("*") && part.endsWith("*") ? (
                <span key={index} className="text-[#224483] font-bold">
                    {part.slice(1, -1)}
                </span>
            ) : (
                <span key={index}>{part}</span>
            )
        );
    };

    if (!text || typeof text !== "string") {
        return null;
    }

    if (split) {
        const words = text.split(" ");
        const firstWord = words[0];
        const remainingText = words.slice(1).join(" ");

        return (
            <div className="flex flex-col">
                <span className="block">{firstWord}</span>
                <span className="block">
                    {renderHighlightedText(remainingText)}
                </span>
            </div>
        );
    }

    if (split_coma) {
        const words = text.split(",");
        const firstWord = words[0];
        const remainingText = words.slice(1).join(" ");

        return (
            <div className="flex flex-col">
                <span className="block">{firstWord}</span>
                <span className="block">
                    {renderHighlightedText(remainingText)}
                </span>
            </div>
        );
    }
    if (split_dos_puntos) {
        const words = text.split(":");
        const firstWord = words[0];
        const remainingText = words.slice(1).join(" ");

        return (
            <div className="flex flex-col">
                <span className="block">{firstWord}</span>
                <span className="block">
                    {renderHighlightedText(remainingText)}
                </span>
            </div>
        );
    }

    return <span>{renderHighlightedText(text)}</span>;
};

export default TextWithHighlight;
