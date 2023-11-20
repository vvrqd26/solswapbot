const baseURL = `https://price.jup.ag/v4/`
interface IPriceInfo {
    id: string,
    mintSymbol: string,
    vsToken: string,
    vsTokenSymbol: string,
    price: number
}
export const getPrice = async (token: string, vsToken?: string) => {
    const res = await fetch(`${baseURL}price?ids=${token}`)
    const {data} = await res.json()
    const priceInfo = data[token] ?? {}
    return priceInfo as IPriceInfo
}