import ollamaProvider from "./ollamaProvider";

const getProvider = () =>{
    const provider = process.env.AI_PROVIDER;

    //if (provider === "openai") return openaiProvider;

    return ollamaProvider;
};

export default getProvider;