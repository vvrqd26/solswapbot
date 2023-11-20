const baseURL = "https://quote-api.jup.ag/v6/"

export const getQuote = async (inputMint:string,outputMint:string,amount:number,slippageBps:number) => {
    const res = await fetch(`${baseURL}quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`)
    const data = await res.json()
    return data
}