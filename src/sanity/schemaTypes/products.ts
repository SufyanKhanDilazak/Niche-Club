import { defineField, defineType } from 'sanity';

// Enhanced slugify function to handle all edge cases
const productSlugify = (input: string): string => {
  if (!input) return '';
  
  return input
    .toString()
    .toLowerCase()
    .trim()
    // Replace em dashes, en dashes, and other dash variants with regular hyphen
    .replace(/[—–−]/g, '-')
    // Replace spaces, underscores, and other whitespace with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens and alphanumeric
    .replace(/[^\w\-]+/g, '')
    // Replace multiple consecutive hyphens with single hyphen
    .replace(/\-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Ensure it doesn't exceed 96 characters
    .slice(0, 96)
    // Remove trailing hyphen if slicing created one
    .replace(/-+$/, '');
};

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(100)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: productSlugify,
        isUnique: (value, context) => context.defaultIsUnique(value, context)
      },
      validation: (Rule) => Rule.required().custom((slug) => {
        if (!slug?.current) {
          return 'Slug is required';
        }
        
        // Validate slug format - only lowercase letters, numbers, and single hyphens
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!slugRegex.test(slug.current)) {
          return 'Slug must contain only lowercase letters, numbers, and hyphens (no consecutive hyphens, no leading/trailing hyphens)';
        }
        
        // Check length
        if (slug.current.length > 96) {
          return 'Slug cannot exceed 96 characters';
        }
        
        return true;
      })
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).precision(2)
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for SEO and accessibility.',
              validation: (Rule) => Rule.required()
            }
          ]
        }
      ],
      validation: (Rule) => Rule.required().min(1).max(10).warning('At least 1 image required, maximum 10 recommended')
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(1000)
    }),
    defineField({
      name: 'onSale',
      title: 'On Sale',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'newArrival',
      title: 'New Arrival',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'inStock',
      title: 'Stock Status',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to set In Stock (true) or Out of Stock (false)'
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Extra Small', value: 'XS' },
          { title: 'Small', value: 'S' },
          { title: 'Medium', value: 'M' },
          { title: 'Large', value: 'L' },
          { title: 'Extra Large', value: 'XL' },
          { title: 'XXL', value: 'XXL' }
        ]
      },
      validation: (Rule) => Rule.unique()
    }),
    defineField({
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Black', value: 'black' },
          { title: 'White', value: 'white' },
          { title: 'Gray', value: 'gray' },
          { title: 'Blue', value: 'blue' },
          { title: 'Red', value: 'red' },
          { title: 'Green', value: 'green' },
          { title: 'Brown', value: 'brown' },
          { title: 'Navy', value: 'navy' },
          { title: 'Beige', value: 'beige' },
          { title: 'Khaki', value: 'khaki' }
        ]
      },
      validation: (Rule) => Rule.unique()
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ 
        type: 'reference', 
        to: [{ type: 'category' }],
        options: {
          disableNew: true
        }
      }],
      validation: (Rule) => Rule.max(2).unique().warning('Maximum 2 categories recommended')
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
      description: 'Mark this product as featured to highlight it on homepage'
    }),
    defineField({
      name: 'weight',
      title: 'Weight (grams)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      description: 'Product weight in grams for shipping calculations'
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Stock Keeping Unit - unique identifier for inventory',
      validation: (Rule) => Rule.custom((sku) => {
        if (!sku) return true; // SKU is optional
        
        // SKU format validation (alphanumeric with hyphens/underscores)
        const skuRegex = /^[A-Za-z0-9\-_]+$/;
        if (!skuRegex.test(sku)) {
          return 'SKU must contain only letters, numbers, hyphens, and underscores';
        }
        
        return true;
      })
    })
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      subtitle: 'price',
      inStock: 'inStock'
    },
    prepare({ title, media, subtitle, inStock }) {
      return {
        title,
        media,
        subtitle: `$${subtitle}${!inStock ? ' (Out of Stock)' : ''}`
      };
    }
  },
  orderings: [
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }]
    },
    {
      title: 'Name Z-A', 
      name: 'nameDesc',
      by: [{ field: 'name', direction: 'desc' }]
    },
    {
      title: 'Price Low-High',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }]
    },
    {
      title: 'Price High-Low',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }]
    },
    {
      title: 'Created Date',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }]
    }
  ]
});