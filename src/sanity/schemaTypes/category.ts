import { defineField, defineType } from "sanity";

const normalize = (v: string) => (v || "").toString().toLowerCase().trim().replace(/_/g, "-");

const customSlugify = (input: string): string => {
  const normalized = normalize(input);

  // Known canonical slugs (you can expand this safely later)
  const allowed = new Set([
    "men-essentials",
    "leather",
    "leather-showcase",
    "men-denim",
    "men-tees",
    "women-essentials",
    "women-tees",
    "men-showcase",
    "women-showcase",
    "trending-products",
    "new-arrivals",
    "preview",
  ]);

  if (allowed.has(normalized)) return normalized;

  // Generic safe slugify fallback
  return normalized
    .replace(/[—–−]/g, "-")
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const categorySchema = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Category Name",
      type: "string",
      options: {
        list: [
          { title: "Men_essentials", value: "men-essentials" },
          { title: "Men_denim", value: "men-denim" },
          { title: "Leather", value: "leather" },
          { title: "Leather_Showcase", value: "leather-showcase" },
          { title: "Men_tees", value: "men-tees" },
          { title: "Women_essentials", value: "women-essentials" },
          { title: "Women_tees", value: "women-tees" },
          { title: "Men_Showcase", value: "men-showcase" },
          { title: "Women_Showcase", value: "women-showcase" },
          { title: "Trending_Products", value: "trending-products" },
          { title: "New_Arrivals", value: "new-arrivals" },
          { title: "Preview", value: "preview" },
        ],
        layout: "dropdown",
      },
      // ✅ must match dropdown values (hyphen)
      initialValue: "men-essentials",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        slugify: customSlugify,
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (!slug?.current) return "Slug is required";
          const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
          if (!slugRegex.test(slug.current)) {
            return "Slug must contain only lowercase letters, numbers, and hyphens (no consecutive hyphens)";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug" },
    prepare({ title, slug }) {
      return { title, subtitle: slug?.current ? `/${slug.current}` : "No slug" };
    },
  },
});
