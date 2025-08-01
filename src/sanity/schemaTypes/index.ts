import { type SchemaTypeDefinition } from 'sanity'
import { product } from './products'
import { categorySchema } from './category'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, categorySchema]
}