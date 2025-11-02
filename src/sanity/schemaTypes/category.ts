import { defineField, defineType } from 'sanity'

const customSlugify = (input: string): string => {
  const slugMap: { [key: string]: string } = {
    'men_essentials': 'men-essentials',
    'men_denim': 'men-denim',
    'men_tees': 'men-tees',
    'women_essentials': 'women-essentials',
    'women_tees': 'women-tees',
    'men_showcase': 'men-showcase',
    'women_showcase': 'women-showcase',
    'trending_products': 'trending-products',
    'new_arrivals': 'new-arrivals',
    'preview': 'preview',
  };
  
  // If input exists in slugMap, return mapped value
  if (slugMap[input]) {
    return slugMap[input];
  }
  
  // Enhanced slugify function to handle all edge cases
  return input
    .toString()
    .toLowerCase()
    .trim()
    // Replace em dashes, en dashes, and multiple hyphens with single hyphen
    .replace(/[—–−]/g, '-')
    // Replace spaces, underscores, and other whitespace with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens and alphanumeric
    .replace(/[^\w\-]+/g, '')
    // Replace multiple consecutive hyphens with single hyphen
    .replace(/\-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
};

export const categorySchema = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      options: {
        list: [
          { title: 'Men_essentials', value: 'men-essentials' },
          { title: 'Men_denim', value: 'men-denim' },
          { title: 'Men_tees', value: 'men-tees' },
          { title: 'Women_essentials', value: 'women-essentials' },
          { title: 'Women_tees', value: 'women-tees' },
          { title: 'Men_Showcase', value: 'men-showcase' },
          { title: 'Women_Showcase', value: 'women-showcase' },
          { title: 'Trending_Products', value: 'trending-products' },
          { title: 'New_Arrivals', value: 'new-arrivals' },
          { title: 'Preview', value: 'preview' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'men_essentials',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        slugify: customSlugify,
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context)
      },
      validation: (Rule) => Rule.required().custom((slug) => {
        if (!slug?.current) {
          return 'Slug is required';
        }
        
        // Validate slug format
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!slugRegex.test(slug.current)) {
          return 'Slug must contain only lowercase letters, numbers, and hyphens (no consecutive hyphens)';
        }
        
        return true;
      })
    })
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug'
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: slug?.current ? `/${slug.current}` : 'No slug'
      };
    }
  }
})