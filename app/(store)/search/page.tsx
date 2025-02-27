import ProductGrid from '@/components/ProductGrid';
import { searchProductsByName } from '@/sanity/lib/products/searchProductsByName';
import { type Metadata } from 'next';

export const dynamic = 'force-dynamic';

// Using a simple interface without any inheritance
interface SearchQueryParams {
  query?: string | string[];
  [key: string]: string | string[] | undefined;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchQueryParams;
}): Promise<Metadata> {
  const query = typeof searchParams.query === 'string' 
    ? searchParams.query 
    : Array.isArray(searchParams.query) 
      ? searchParams.query[0] 
      : '';
      
  return {
    title: `Search results for "${query}" | Your Store Name`,
  };
}

// In Next.js 15, page components use this pattern
export default function Page({
  searchParams,
}: {
  searchParams: SearchQueryParams;
}) {
  // Function to get the query string
  const getQuery = () => {
    return typeof searchParams.query === 'string' 
      ? searchParams.query 
      : Array.isArray(searchParams.query) 
        ? searchParams.query[0] 
        : '';
  };

  // Use the function to extract the query
  const query = getQuery();
  
  // Using a promise in the component body instead of async/await
  return (
    <SearchResults query={query} />
  );
}

// Separate component that handles async operations
function SearchResults({ query }: { query: string }) {
  // Use this client component pattern for data fetching
  const productsPromise = searchProductsByName(query);

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Search Results for: {query}
        </h1>
        {/* Consume the promise with this pattern */}
        {productsPromise.then(products => {
          if (!products.length) {
            return (
              <div>
                <h1 className="text-3xl font-bold mb-6 text-center">
                  No Products found for: {query}
                </h1>
                <p className="text-gray-600 text-center">
                  Try searching with different keywords.
                </p>
              </div>
            );
          }
          return <ProductGrid products={products} />;
        })}
      </div>
    </div>
  );
}

// import ProductGrid from '@/components/ProductGrid';
// import { searchProductsByName } from '@/sanity/lib/products/searchProductsByName';
// import { type Metadata } from 'next';

// export const dynamic = 'force-dynamic';

// // Use a more explicit type for params
// type SearchParams = { [key: string]: string | string[] | undefined };

// export async function generateMetadata({
//   searchParams,
// }: {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   params: Record<string, never>;
//   searchParams: SearchParams;
// }): Promise<Metadata> {
//   const query = typeof searchParams.query === 'string' ? searchParams.query : '';
//   return {
//     title: `Search results for "${query}" | Your Store Name`,
//   };
// }

// export default async function SearchPage({
//   searchParams,
// }: {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   params: Record<string, never>;
//   searchParams: SearchParams;
// }) {
//   const query = typeof searchParams.query === 'string' ? searchParams.query : '';
//   const products = await searchProductsByName(query);

//   if (!products.length) {
//     return (
//       <div className="flex flex-col items-center justify-top min-h-screen p-4">
//         <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
//           <h1 className="text-3xl font-bold mb-6 text-center">
//             No Products found for: {query}
//           </h1>
//           <p className="text-gray-600 text-center">
//             Try searching with different keywords.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
//         <h1 className="text-3xl font-bold mb-6 text-center">
//           Search Results for: {query}
//         </h1>
//         <ProductGrid products={products} />
//       </div>
//     </div>
//   );
// }
// // import ProductGrid from '@/components/ProductGrid';
// // import { searchProductsByName } from '@/sanity/lib/products/searchProductsByName';
// // import React from 'react';

// // export default async function SearchPage({
// //   searchParams,
// // }: {
// //   searchParams?: Record<string, string | undefined>;
// // }) {
// //   const query = searchParams?.query || '';
// //   const products = await searchProductsByName(query);

// //   if (!products.length) {
// //     return (
// //       <div className='flex flex-col items-center justify-top min-h-screen p-4'>
// //         <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-4xl'>
// //           <h1 className='text-3xl font-bold mb-6 text-center'>
// //             No Products found for: {query}
// //           </h1>
// //           <p className='text-gray-600 text-center'>
// //             Try searching with different keywords.
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className='flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4'>
// //       <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-4xl'>
// //         <h1 className='text-3xl font-bold mb-6 text-center'>
// //           Search Results for: {query}
// //         </h1>
// //         <ProductGrid products={products} />
// //       </div>
// //     </div>
// //   );
// // }



// // // import ProductGrid from '@/components/ProductGrid';
// // // import { searchProductsByName } from '@/sanity/lib/products/searchProductsByName';
// // // import React from 'react'

// // // async function SearchPage({
// // //     searchParams }: {
// // //         searchParams: {
// // //             query: string,
// // //         };
// // // }) {

// // //     const { query}= await searchParams;
// // //     const products = await searchProductsByName(query);

// // //     if (!products.length) {
// // //       return (
// // //         <div className='flex flex-col items-center justify-top min-h-screen
// // //         p-4 '>
// // //           <div className='bg-white p-8 rounded-lg shadow-md w-full
// // //           max-w-4xl'>
// // //             <h1 className='text-3xl font-bold mb-6 text-center'>
// // //               No Products found for: {query}
// // //             </h1>
// // //             <p className='text-gray-600 text-center'>
// // //               Try Searching different keywords
// // //             </p>
// // //           </div>
// // //         </div>
// // //       )
// // //     }
// // //   return (
// // //     <div className='flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4
// // //     '>
// // //       <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-4xl'>
// // //         <h1 className='text-3xl font-bold mb-6 text-center'>
// // //           Search Results for: {query}
// // //         </h1>

// // //         <ProductGrid products={products}/>
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default SearchPage

