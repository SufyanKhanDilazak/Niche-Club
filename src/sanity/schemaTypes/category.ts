import { defineField, defineType } from 'sanity'

const customSlugify = (input: string): string => {
  const slugMap: { [key: string]: string } = {
    'men_collection': 'men-collection',
    'women_collection': 'women-collection',
    'men_showcase': 'men-showcase',
    'women_showcase': 'women-showcase'
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
          { title: 'Men_collection', value: 'men-collection' },
          { title: 'Women_collection', value: 'women-collection' },
          { title: 'Men_Showcase', value: 'men-showcase' },
          { title: 'Women_Showcase', value: 'women-showcase' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'niche_essentials',
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