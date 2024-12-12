'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Category } from '@/sanity.types';

interface CategorySelectorProps {
  categories: Category[];
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories }) => {
  const [open, setOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const router = useRouter();

  const handleCategorySelection = useCallback(
    (inputValue: string) => {
      const matchedCategory = categories.find((category) =>
        category.title?.toLowerCase().includes(inputValue.toLowerCase())
      );

      if (matchedCategory?.slug?.current) {
        setSelectedCategoryId(matchedCategory._id);
        router.push(`/categories/${matchedCategory.slug.current}`);
        setOpen(false);
      }
    },
    [categories, router]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a category"
          className={cn(
            'w-full max-w-full flex items-center justify-between py-2 px-4 rounded-md border',
            selectedCategoryId ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300',
            'hover:bg-blue-700 hover:text-white transition-all'
          )}
        >
          {selectedCategoryId
            ? categories.find((category) => category._id === selectedCategoryId)?.title
            : 'Filter by category'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0 rounded-md border shadow-lg bg-white">
        <Command>
          <CommandInput
            placeholder="Search category..."
            className="h-11 border-b border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCategorySelection(e.currentTarget.value);
              }
            }}
          />
          <CommandList>
            <CommandEmpty>No categories found</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category._id}
                  value={category.title}
                  onSelect={() => {
                    const newValue = selectedCategoryId === category._id ? '' : category._id;
                    setSelectedCategoryId(newValue);
                    if (category.slug?.current) {
                      router.push(`/categories/${category.slug.current}`);
                    }
                    setOpen(false);
                  }}
                  className={cn(
                    'flex justify-between items-center px-4 py-2 cursor-pointer',
                    selectedCategoryId === category._id
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  )}
                >
                  {category.title}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      selectedCategoryId === category._id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySelector;



// 'use client'

// import { Category } from '@/sanity.types';
// import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
// import React, { useState } from 'react'
// import { Button } from './button';
// import { Check, ChevronsUpDown } from 'lucide-react';

// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
//   } from "@/components/ui/command"
// import { cn } from '@/lib/utils';
// import { useRouter } from 'next/navigation';

// interface CategorySelectorProps {
//     categories: Category[];
// }

// function CategorySelectorComponent({
//     categories,
// }: CategorySelectorProps) {

//     const [open, setOpen] = useState(false);
//     const [value, setValue] = useState<string>("");
//     const router = useRouter();

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//             <Button
//             variant="outline"
//             role="combobox"
//             aria-expanded={open}
//             className='w-full max-w-full relative flex justify-center sm:justify-start 
//             sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 
//             hover:text-white text-white font-bold py-2 px-4 rounded'
//             >
//                 {value 
//                 ? categories.find((category) => category._id === value)?.title
//             : "Filter by category"}

//             <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0'/>
//             </Button>
//         </PopoverTrigger>

//         <PopoverContent className='w-full p-0' >
//             <Command>
//                 <CommandInput placeholder='Search category...'
//                 className='h-11'
//                 onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                         const selectedCategory = categories.find((c) => 
//                             c.title?.toLowerCase()
//                     .includes(e.currentTarget.value.toLowerCase()));
//                         if (selectedCategory?.slug?.current) {
//                             setValue(selectedCategory._id);
//                             router.push(`/categories/${selectedCategory.slug.current}`);
//                             setOpen(false);
//                         }
//                     }
//                 }}
//                 />
//                 <CommandList>
//                     <CommandEmpty>No categories found</CommandEmpty>
//                     <CommandGroup>
//                     {categories.map((category) => (
//                         <CommandItem
//                         key={category._id}
//                         value={category.title}
//                         onSelect={() => {
//                             setValue(value === category._id ? "" : category._id)
//                         }}
//                         >
//                             {category.title}

//                             <Check 
//                             className={cn(
//                                 "ml-auto h-4 w-4",
//                             value === category._id ? "opacity-100" : "opacity-0"
//                             )}/>
//                         </CommandItem>
//                     ))}
//                     </CommandGroup>
//                 </CommandList>
//             </Command>
//         </PopoverContent>
//     </Popover>
//   )
// }

// export default CategorySelectorComponent