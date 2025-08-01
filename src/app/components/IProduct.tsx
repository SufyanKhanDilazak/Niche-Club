export interface IProduct {
  _id: string
  name: string
  price: number
  images: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }[]
  onSale: boolean
  newArrival: boolean
}
