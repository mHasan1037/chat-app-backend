import groqProvider from "./grokProvider";
import ollamaProvider from "./ollamaProvider";

const getProvider = () =>{
    const provider = process.env.AI_PROVIDER;

    if (provider === "groq") return groqProvider;

    return ollamaProvider;
};

export default getProvider;