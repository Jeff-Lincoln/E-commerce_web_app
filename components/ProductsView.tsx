import { Category, Product } from "@/sanity.types"
import ProductGrid from "./ProductGrid";
import CategorySelectorComponent from "./ui/category-selector";

interface ProductsViewProps {
    products: Product[],
    categories: Category[],
}

const ProductsView = ({ products, categories }: ProductsViewProps) => {
    return (
        <div className="relative flex flex-col space-y-4">
            {/* Ensure category selector is above products with z-index */}
            <div className="w-full sm:w-[200px] z-50 relative">
                <CategorySelectorComponent categories={categories} /> 
            </div>
            
            {/* Products section */}
            <div className="flex-1">
                <ProductGrid products={products} />
                <hr className="w-1/2 sm:w-3/4 mt-4"/>
            </div>
        </div>
    )
}

export default ProductsView;


// import { Category, Product } from "@/sanity.types"
// import ProductGrid from "./ProductGrid";
// import CategorySelectorComponent from "./ui/category-selector";

// interface ProductsViewProps {
//     products: Product[],
//     categories: Category[],
// }

// const ProductsView = ({ products, categories }: ProductsViewProps) => {
//     return (
//         <div className="flex flex-col">
//         {/**categories */}
//         <div className="w-full sm:w-[200px]">
//             <CategorySelectorComponent categories={categories} /> 
//         </div>
//         {/** products */}
//         <div className="flex-1">
//             <div>
//                 <ProductGrid products={products} />

//                 <hr className="w-1/2 sm:w-3/4"/>
//             </div>
//         </div>
//     </div>
//     )
// }

// export default ProductsView;