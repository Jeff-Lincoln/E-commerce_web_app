import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent", // Ensure "blockContent" is defined in your schema if used.
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
      subtitle: "price",
    },
    prepare(selection) {
      const { title, media, subtitle } = selection;
      return {
        title,
        media,
        subtitle: `${subtitle} $`,
      };
    },
  },
});



// import { TrolleyIcon } from "@sanity/icons";
// import { defineField, defineType } from "sanity";

// export default defineType({
//     name: 'product',
//     title: "Products",
//     type: 'document',
//     icon: TrolleyIcon,
//     fields: [
//         defineField({
//             name: 'name',
//             title: 'Product Name',
//             type: 'string',
//             validation: (Rule) => Rule.required(),
//         }),
//         defineField({
//             name: 'slug',
//             title: 'Slug',
//             type: 'slug',
//             options: {
//                 source: 'name',
//                 maxLength: 96,
//             },
//             validation: (Rule) => Rule.required(),
//             }
//         },),
//         defineField({
//             name: 'image',
//             title: 'Product Image',
//             type: 'image',
//         }),
//         defineField({
//             name: 'description',
//             title: 'Description',
//             type: 'blockContent', // Ensure "blockContent" is defined in your schema if used.
//         }),
//         defineField({
//             name: 'price',
//             title: 'Price',
//             type: 'number',
//             validation: (Rule) => Rule.required().min(0),
//         }),
//         defineField({
//             name: 'categories',
//             title: 'Categories',
//             type: 'array',
//             of: [{ type: 'reference', to: { type: 'category' } }],
//         }),
//         defineField({
//             name: 'stock',
//             title: 'Stock',
//             type: 'number',
//             validation: (Rule) => Rule.required().min(0),
//         }),
//     ],
//     preview: {
//         select: {
//             title: 'name',
//             media: 'image',
//             subtitle: 'price',
//         },
//         prepare(selection) {
//             const { title, media, subtitle } = selection;
//             return {
//                 title,
//                 media,
//                 subtitle: `${subtitle} $`,
//             };
//         },
//     },
// });
