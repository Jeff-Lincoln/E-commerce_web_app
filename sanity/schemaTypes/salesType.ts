import { TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const salesType = defineType({
  name: 'sale', // Ensure the name is in lowercase to avoid conflicts with conventions
  title: 'Sale',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Sale Title',
      validation: (Rule) => Rule.required().min(3).max(100).warning('Title should be between 3 and 100 characters.'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Sale Description',
      validation: (Rule) => Rule.required().max(500).warning('Description should not exceed 500 characters.'),
    }),
    defineField({
      name: 'discountAmount',
      type: 'number',
      title: 'Discount Amount',
      description: 'Amount off in percentage or fixed value',
      validation: (Rule) => Rule.min(0).warning('Discount amount must be a positive number.'),
    }),
    defineField({
      name: 'couponCode',
      type: 'string',
      title: 'Coupon Code',
      validation: (Rule) => Rule.required().max(20).warning('Coupon code should not exceed 20 characters.'),
    }),
    defineField({
      name: 'validFrom',
      type: 'datetime',
      title: 'Valid From',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'validUntil', // Fixed casing inconsistency
      type: 'datetime',
      title: 'Valid Until',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      type: 'boolean',
      title: 'Is Active',
      description: 'Toggle to activate/deactivate the sale',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      discountAmount: 'discountAmount',
      couponCode: 'couponCode',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, discountAmount, couponCode, isActive } = selection;
      const status = isActive ? 'Active' : 'Inactive';
      const subtitle = `${discountAmount}% off - Code: ${couponCode} - ${status}`;

      return {
        title,
        subtitle,
      };
    },
  },
});


// import { TagIcon } from '@sanity/icons';
// import { defineField, defineType } from 'sanity';

// export const salesType = defineType({
//     name: 'Sale',
//     title: 'Sale',
//     type: 'document',
//     icon: TagIcon,
//     fields: [
//         defineField({
//             name: 'title',
//             type:'string',
//             title: 'Sale Title',
//         }),
//         defineField({
//             name: 'description',
//             type: 'text',
//             title: 'Sale Description',
//         }),
//         defineField({
//             name: 'discountAmount',
//             type: 'number',
//             title: 'Discount Amount',
//             description: 'Amount off in percentage or fixed value'
//         }),
//         defineField({
//             name: 'couponCode',
//             type: 'string',
//             title: 'Coupon Code'
//         }),
//         defineField({
//             name: 'validFrom',
//             type: 'datetime',
//             title: 'Valid From'
//         }),
//         defineField({
//             name: 'ValidUntil',
//             type: 'datetime',
//             title: 'Valid Until'
//         }),
//         defineField({
//             name: 'isActive',
//             type: 'boolean',
//             title: 'Is Active',
//             description: 'Toggle to activate/deactivate the sale',
//             initialValue: true,
//         }),
//     ],
//     preview: {
//         select: {
//             title: 'title',
//             discountAmount: 'discountAmount',
//             couponCode: 'couponCode',
//             isActive: 'isActive',
//         },
//         prepare(selection) {
//             const { title, discountAmount, couponCode, isActive } = selection;
//             const status = isActive ? 'Active' : 'Inactive';
//             const subtitle = `${discountAmount}% off - Code: ${couponCode} - ${status}`;

//             return {
//                 title,
//                 subtitle,
//                 description: status,
//             };
//         },
//     },
//     }
// })