const TextWithHighlight = ({
    text,
    split = false,
    split_coma = false,
    split_dos_puntos = false,
    link = null,
    linkClassName = "text-azul underline font-medium hover:underline",
    target = "_blank",
}) => {
    // Función para procesar el texto con resaltados
    const renderHighlightedText = (textToRender) => {
        if (!textToRender || typeof textToRender !== "string") return null;
        const parts = textToRender.split(/(\*[^*]+\*)/g);  // separa todo lo entre *...* o **...**

        return parts.map((part, index) => {
            if (part.startsWith("*") && part.endsWith("*")) {
                const cleanText = part.replace(/^\*+|\*+$/g, "");
                if (link) {
                    return (
                        <a
                            key={index}
                            href={link}
                            target={target}
                            rel={target === "_blank" ? "noopener noreferrer" : undefined}
                            className={linkClassName}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {cleanText}
                        </a>
                    );
                }
                return (
                    <span key={index} className="text-[#224483] font-bold">
                        {cleanText}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
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
