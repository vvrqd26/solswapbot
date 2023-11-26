const baseURL = `https://price.jup.ag/v4/`
interface IPriceInfo {
    id: string,
    mintSymbol: string,
    vsToken: string,
    vsTokenSymbol: string,
    price: number
}
// 获取价格
export const getPrice = async (token: string, vsToken: string = 'So11111111111111111111111111111111111111112') => {
    const res = await fetch(`${baseURL}price?ids=${token}&vsToken=${vsToken}`)
    const {data} = await res.json()
    const priceInfo = data[token] ?? {}
    return priceInfo as IPriceInfo
}