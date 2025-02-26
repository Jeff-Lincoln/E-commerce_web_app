'use client';

import { useEffect, useState } from 'react';
import { imageUrl } from '@/lib/ImageUrl';
import useBasketStore from '@/store/store';
import { SignInButton, useAuth, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import AddToBasketButton from '@/components/AddToBasketButton';
import Loader from '@/components/Loader';
import { ShoppingBag, ArrowLeft, Heart, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createCheckOutSession, Metadata } from '@/actions/createCheckOutSession';
import { Button } from '@/components/ui/button';



function BasketPage() {
  const [isClient, setIsClient] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  // const [isHovered, setIsHovered] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  // const removeFromBasket = useBasketStore((state) => state.removeFromBasket);
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  if (showAuthModal && isLoading) {
    console.log("Auth Modal is visible");
}


  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckout =  async () => {
    if (!isSignedIn) {
      setIsLoading(true);
      setShowAuthModal(true);
      return;
    }

    try {
      const metadata: Metadata =  {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0].emailAddress ?? "Unknown",
        clerkUserId: user!.id,
      };

      const checkoutUrl = await createCheckOutSession(groupedItems, metadata);

      if (checkoutUrl){
        window.location.href = checkoutUrl;
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    // Add checkout logic here for authenticated users
    router.push('/checkout');
  };

  // Show loading state while auth is being checked
  if (!isLoaded || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if (!groupedItems || groupedItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[70vh] space-y-8"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-gray-300 bg-gray-50 p-8 rounded-full"
        >
          <ShoppingBag size={80} />
        </motion.div>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Your Basket is Empty</h1>
          <p className="text-xl text-gray-600 max-w-md">
            Looks like you have not added anything yet. Start shopping to fill your basket with amazing products!
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="flex items-center space-x-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 
            px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ArrowLeft size={24} />
          <span>Explore Products</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Basket</h1>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-2 font-medium"
          >
            <ArrowLeft size={20} />
            <span>Continue Shopping</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Basket Items Section */}
          <div className="flex-grow lg:w-2/3 space-y-6">
            <AnimatePresence>
              {groupedItems.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  key={item.product._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                  // onMouseEnter={() => setIsHovered(item.product._id)}
                  // onMouseLeave={() => setIsHovered(null)}
                >
                  <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div 
                      className="relative group w-full sm:w-40 h-40 rounded-xl overflow-hidden cursor-pointer"
                      onClick={() => router.push(`/product/${item.product.slug?.current}`)}
                    >
                      {item.product.image && (
                        <Image
                          src={imageUrl(item.product.image).url()}
                          alt={item.product.name || 'Product image'}
                          layout="fill"
                          objectFit="cover"
                          className="group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      {/* {isHovered === item.product._id && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300" />
                      )} */}
                    </div>

                    <div className="flex-grow min-w-0 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 
                            className="text-2xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                            onClick={() => router.push(`/product/${item.product.slug?.current}`)}
                          >
                            {item.product.name}
                          </h2>
                          <p className="text-gray-500 mt-1">Unit Price: Shs {item.product.price?.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // setShowConfirmDelete(item.product._id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                          >
                            <Trash2 size={20} />
                          </Button>
                          <Button className="text-gray-400 hover:text-pink-500 transition-colors duration-200">
                            <Heart size={20} />
                          </Button>
                        </div>
                      </div>

                      <div 
                        className="flex items-center justify-between"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center space-x-6">
                          <AddToBasketButton product={item.product} />
                          <p className="text-lg font-semibold text-blue-600">
                            Total: Shs {((item.product.price ?? 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {showConfirmDelete === item.product._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-red-50 rounded-lg p-4 mt-4"
                        >
                          <div className="flex items-center space-x-3 text-red-800">
                            <AlertCircle size={20} />
                            <p>Remove this item from your basket?</p>
                          </div>
                          <div className="flex space-x-4 mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // removeFromBasket(item.product);
                                setShowConfirmDelete(null);
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                            >
                              Yes, Remove
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowConfirmDelete(null);
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="sticky top-4 bg-white rounded-2xl shadow-md p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({groupedItems.length} items)</span>
                  <span>Shs {groupedItems.reduce((total, item) => 
                    total + (item.product.price ?? 0) * item.quantity, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">Shs {groupedItems.reduce((total, item) => 
                      total + (item.product.price ?? 0) * item.quantity, 0).toFixed(2)}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">Tax included where applicable</p>
                </div>

                {isSignedIn ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full py-4 px-6 text-white bg-gradient-to-r from-blue-600 to-blue-700 
                      rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Proceed to Checkout
                  </motion.button>
                ) : (
                  <SignInButton mode="modal">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 px-6 text-white bg-gradient-to-r from-blue-600 to-blue-700 
                        rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Sign in to Checkout
                    </motion.button>
                  </SignInButton>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/')}
                  className="w-full py-4 px-6 text-blue-600 bg-blue-50 rounded-xl font-semibold
                    hover:bg-blue-100 transition-all duration-300"
                >
                  Continue Shopping
                </motion.button>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <span>Secure Payment</span>
                  <span>•</span>
                  <span>Fast Delivery</span>
                  <span>•</span>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasketPage;


// 'use client';

// import { useEffect, useState } from 'react';
// import { imageUrl } from '@/lib/ImageUrl';
// import useBasketStore from '@/store/store';
// import { SignInButton, useAuth, useUser } from '@clerk/nextjs';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import React from 'react';
// import AddToBasketButton from '@/components/AddToBasketButton';
// import Loader from '@/components/Loader';
// import { ShoppingBag, ArrowLeft, Heart, Trash2, AlertCircle } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// function BasketPage() {
//   const [isClient, setIsClient] = useState(false);
//   const [showConfirmDelete, setShowConfirmDelete] = useState(null);
//   const [isHovered, setIsHovered] = useState(null);
//   const groupedItems = useBasketStore((state) => state.getGroupedItems());
//   const removeFromBasket = useBasketStore((state) => state.removeFromBasket);
//   const { isSignedIn } = useAuth();
//   const { user } = useUser();
//   const router = useRouter();

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader className="w-8 h-8 text-blue-600" />
//       </div>
//     );
//   }

//   if (!groupedItems || groupedItems.length === 0) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[70vh] space-y-8"
//       >
//         <motion.div
//           initial={{ scale: 0.5, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.5, type: "spring" }}
//           className="text-gray-300 bg-gray-50 p-8 rounded-full"
//         >
//           <ShoppingBag size={80} />
//         </motion.div>
//         <div className="text-center space-y-4">
//           <h1 className="text-4xl font-bold text-gray-900">Your Basket is Empty</h1>
//           <p className="text-xl text-gray-600 max-w-md">
//             Looks like you haven't added anything yet. Start shopping to fill your basket with amazing products!
//           </p>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => router.push('/')}
//           className="flex items-center space-x-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 
//             px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <ArrowLeft size={24} />
//           <span>Explore Products</span>
//         </motion.button>
//       </motion.div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-8">
//       <div className="container mx-auto px-4 max-w-6xl">
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-4xl font-bold text-gray-900">Shopping Basket</h1>
//           <button
//             onClick={() => router.push('/')}
//             className="text-blue-600 hover:text-blue-700 flex items-center space-x-2 font-medium"
//           >
//             <ArrowLeft size={20} />
//             <span>Continue Shopping</span>
//           </button>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="flex-grow lg:w-2/3 space-y-6">
//             <AnimatePresence>
//               {groupedItems.map((item, index) => (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, x: -100 }}
//                   transition={{ duration: 0.4, delay: index * 0.1 }}
//                   key={item.product._id}
//                   className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
//                   onMouseEnter={() => setIsHovered(item.product._id)}
//                   onMouseLeave={() => setIsHovered(null)}
//                 >
//                   <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
//                     <div 
//                       className="relative group w-full sm:w-40 h-40 rounded-xl overflow-hidden cursor-pointer"
//                       onClick={() => router.push(`/product/${item.product.slug?.current}`)}
//                     >
//                       {item.product.image && (
//                         <Image
//                           src={imageUrl(item.product.image).url()}
//                           alt={item.product.name || 'Product image'}
//                           layout="fill"
//                           objectFit="cover"
//                           className="group-hover:scale-110 transition-transform duration-500"
//                         />
//                       )}
//                       {isHovered === item.product._id && (
//                         <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300" />
//                       )}
//                     </div>

//                     <div className="flex-grow min-w-0 space-y-4">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h2 
//                             className="text-2xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors duration-200"
//                             onClick={() => router.push(`/product/${item.product.slug?.current}`)}
//                           >
//                             {item.product.name}
//                           </h2>
//                           <p className="text-gray-500 mt-1">Unit Price: Shs {item.product.price?.toFixed(2)}</p>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                           <button 
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setShowConfirmDelete(item.product._id);
//                             }}
//                             className="text-gray-400 hover:text-red-500 transition-colors duration-200"
//                           >
//                             <Trash2 size={20} />
//                           </button>
//                           <button className="text-gray-400 hover:text-pink-500 transition-colors duration-200">
//                             <Heart size={20} />
//                           </button>
//                         </div>
//                       </div>

//                       <div 
//                         className="flex items-center justify-between"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <div className="flex items-center space-x-6">
//                           <AddToBasketButton product={item.product} />
//                           <p className="text-lg font-semibold text-blue-600">
//                             Total: Shs {((item.product.price ?? 0) * item.quantity).toFixed(2)}
//                           </p>
//                         </div>
//                       </div>

//                       {showConfirmDelete === item.product._id && (
//                         <motion.div
//                           initial={{ opacity: 0, height: 0 }}
//                           animate={{ opacity: 1, height: 'auto' }}
//                           exit={{ opacity: 0, height: 0 }}
//                           className="bg-red-50 rounded-lg p-4 mt-4"
//                         >
//                           <div className="flex items-center space-x-3 text-red-800">
//                             <AlertCircle size={20} />
//                             <p>Remove this item from your basket?</p>
//                           </div>
//                           <div className="flex space-x-4 mt-4">
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 removeFromBasket(item.product);
//                                 setShowConfirmDelete(null);
//                               }}
//                               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
//                             >
//                               Yes, Remove
//                             </button>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setShowConfirmDelete(null);
//                               }}
//                               className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </motion.div>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>

//           <div className="lg:w-1/3">
//             <div className="sticky top-4 bg-white rounded-2xl shadow-md p-6 space-y-6">
//               <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
//               <div className="space-y-4">
//                 <div className="flex justify-between text-gray-600">
//                   <span>Subtotal ({groupedItems.length} items)</span>
//                   <span>Shs {groupedItems.reduce((total, item) => 
//                     total + (item.product.price ?? 0) * item.quantity, 0).toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Shipping</span>
//                   <span className="text-green-600 font-medium">Free</span>
//                 </div>
//                 <div className="border-t border-gray-100 pt-4">
//                   <div className="flex justify-between text-xl font-bold">
//                     <span>Total</span>
//                     <span className="text-blue-600">Shs {groupedItems.reduce((total, item) => 
//                       total + (item.product.price ?? 0) * item.quantity, 0).toFixed(2)}</span>
//                   </div>
//                   <p className="text-gray-500 text-sm mt-2">Tax included where applicable</p>
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => {
//                     if (!isSignedIn) {
//                       // router.push('/sign-in');
//                       <SignInButton mode='modal' />
//                       return;
//                     }
//                     // Add checkout logic here
//                   }}
//                   className="w-full py-4 px-6 text-white bg-gradient-to-r from-blue-600 to-blue-700 
//                     rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
//                 >
//                   {isSignedIn ? 'Proceed to Checkout' : 'Sign in to Checkout'}
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => router.push('/')}
//                   className="w-full py-4 px-6 text-blue-600 bg-blue-50 rounded-xl font-semibold
//                     hover:bg-blue-100 transition-all duration-300"
//                 >
//                   Continue Shopping
//                 </motion.button>
//               </div>

//               <div className="border-t border-gray-100 pt-6">
//                 <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
//                   <span>Secure Payment</span>
//                   <span>•</span>
//                   <span>Fast Delivery</span>
//                   <span>•</span>
//                   <span>24/7 Support</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BasketPage;


// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { imageUrl } from '@/lib/ImageUrl';
// // import useBasketStore from '@/store/store';
// // import { useAuth, useUser } from '@clerk/nextjs';
// // import Image from 'next/image';
// // import { useRouter } from 'next/navigation';
// // import React from 'react';
// // import AddToBasketButton from '@/components/AddToBasketButton';
// // import Loader from '@/components/Loader';
// // import { ShoppingBag, ArrowLeft } from 'lucide-react';
// // import { motion } from 'framer-motion';

// // function BasketPage() {
// //   const [isClient, setIsClient] = useState(false);
// //   const groupedItems = useBasketStore((state) => state.getGroupedItems());
// //   const { isSignedIn } = useAuth();
// //   const { user } = useUser();
// //   const router = useRouter();

// //   useEffect(() => {
// //     setIsClient(true);
// //   }, []);

// //   if (!isClient) {
// //     return <Loader />;
// //   }

// //   if (!groupedItems || groupedItems.length === 0) {
// //     return (
// //       <motion.div
// //         initial={{ opacity: 0 }}
// //         animate={{ opacity: 1 }}
// //         className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh] space-y-6"
// //       >
// //         <motion.div
// //           initial={{ scale: 0.5, opacity: 0 }}
// //           animate={{ scale: 1, opacity: 1 }}
// //           transition={{ duration: 0.5 }}
// //           className="text-gray-400"
// //         >
// //           <ShoppingBag size={64} />
// //         </motion.div>
// //         <h1 className="text-3xl font-bold text-gray-800">Your Basket is Empty</h1>
// //         <p className="text-gray-600 text-lg">Start adding some items to your basket!</p>
// //         <button
// //           onClick={() => router.push('/')}
// //           className="flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all duration-200"
// //         >
// //           <ArrowLeft size={20} />
// //           <span>Continue Shopping</span>
// //         </button>
// //       </motion.div>
// //     );
// //   }

// //   return (
// //     <div className="container mx-auto p-4 max-w-6xl">
// //       <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Basket</h1>
// //       <div className="flex flex-col lg:flex-row gap-8">
// //         <div className="flex-grow lg:w-2/3">
// //           {groupedItems.map((item) => (
// //             <motion.div
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               key={item.product._id}
// //               className="mb-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
// //             >
// //               <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
// //                 <div 
// //                   className="w-full sm:w-32 h-32 relative rounded-lg overflow-hidden cursor-pointer"
// //                   onClick={() => router.push(`/product/${item.product.slug?.current}`)}
// //                 >
// //                   {item.product.image && (
// //                     <Image
// //                       src={imageUrl(item.product.image).url()}
// //                       alt={item.product.name || 'Product image'}
// //                       layout="fill"
// //                       objectFit="cover"
// //                       className="hover:scale-105 transition-transform duration-200"
// //                     />
// //                   )}
// //                 </div>
// //                 <div className="flex-grow min-w-0">
// //                   <h2 
// //                     className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer transition-colors duration-200"
// //                     onClick={() => router.push(`/product/${item.product.slug?.current}`)}
// //                   >
// //                     {item.product.name}
// //                   </h2>
// //                   <p className="text-gray-600 mb-4">
// //                     Price: Shs {((item.product.price ?? 0) * item.quantity).toFixed(2)}
// //                   </p>
// //                   <div 
// //                     className="flex items-center justify-between"
// //                     onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking controls
// //                   >
// //                     <div className="flex items-center space-x-4">
// //                       <AddToBasketButton product={item.product} />
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </motion.div>
// //           ))}
// //         </div>

// //         <div className="lg:w-1/3">
// //           <div className="sticky top-4 bg-white rounded-lg shadow-md p-6">
// //             <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
// //             <div className="space-y-4">
// //               <div className="flex justify-between text-gray-600">
// //                 <span>Items ({groupedItems.length})</span>
// //                 <span>Shs {groupedItems.reduce((total, item) => 
// //                   total + (item.product.price ?? 0) * item.quantity, 0).toFixed(2)}</span>
// //               </div>
// //               <div className="flex justify-between text-gray-600">
// //                 <span>Shipping</span>
// //                 <span className="text-green-600">Free</span>
// //               </div>
// //               <div className="border-t pt-4">
// //                 <div className="flex justify-between text-lg font-semibold">
// //                   <span>Total</span>
// //                   <span className="text-blue-600">Shs {groupedItems.reduce((total, item) => 
// //                     total + (item.product.price ?? 0) * item.quantity, 0).toFixed(2)}</span>
// //                 </div>
// //               </div>
// //               <button
// //                 onClick={() => {
// //                   if (!isSignedIn) {
// //                     router.push('/sign-in');
// //                     return;
// //                   }
// //                   // Add checkout logic here
// //                 }}
// //                 className="w-full py-3 px-6 text-white bg-blue-600 rounded-lg font-semibold
// //                 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
// //               >
// //                 Proceed to Checkout
// //               </button>
// //               <button
// //                 onClick={() => router.push('/')}
// //                 className="w-full py-3 px-6 text-blue-600 bg-blue-50 rounded-lg font-semibold
// //                 hover:bg-blue-100 transition-all duration-200"
// //               >
// //                 Continue Shopping
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default BasketPage;

// // // 'use client';

// // // import { useEffect, useState } from 'react';
// // // import { imageUrl } from '@/lib/ImageUrl';
// // // import useBasketStore from '@/store/store';
// // // import { useAuth, useUser } from '@clerk/nextjs';
// // // import Image from 'next/image';
// // // import { useRouter } from 'next/navigation';
// // // import React from 'react';
// // // import AddToBasketButton from '@/components/AddToBasketButton';
// // // import Loader from '@/components/Loader';
// // // import { motion } from 'framer-motion';
// // // import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

// // // function BasketPage() {
// // //   const [isClient, setIsClient] = useState(false);
// // //   const groupedItems = useBasketStore((state) => state.getGroupedItems());
// // //   const removeFromBasket = useBasketStore((state) => state.removeFromBasket);
// // //   const { isSignedIn } = useAuth();
// // //   const { user } = useUser();
// // //   const router = useRouter();

// // //   const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

// // //   useEffect(() => {
// // //     setIsClient(true);
// // //   }, []);

// // //   if (!isClient) {
// // //     return <Loader />;
// // //   }

// // //   const calculateTotal = () => {
// // //     return groupedItems.reduce((total, item) => {
// // //       return total + (item.product.price ?? 0) * item.quantity;
// // //     }, 0);
// // //   };

// // //   const handleCheckout = async () => {
// // //     if (!isSignedIn) {
// // //       router.push('/sign-in');
// // //       return;
// // //     }
// // //     setIsCheckoutLoading(true);
// // //     // Add your checkout logic here
// // //     setTimeout(() => setIsCheckoutLoading(false), 2000);
// // //   };

// // //   if (!groupedItems || groupedItems.length === 0) {
// // //     return (
// // //       <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh] space-y-6">
// // //         <motion.div
// // //           initial={{ scale: 0.5, opacity: 0 }}
// // //           animate={{ scale: 1, opacity: 1 }}
// // //           transition={{ duration: 0.5 }}
// // //           className="text-gray-400"
// // //         >
// // //           <ShoppingBag size={64} />
// // //         </motion.div>
// // //         <h1 className="text-3xl font-bold text-gray-800">Your Basket is Empty</h1>
// // //         <p className="text-gray-600 text-lg">Start adding some items to your basket!</p>
// // //         <button
// // //           onClick={() => router.push('/')}
// // //           className="flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
// // //         >
// // //           <ArrowLeft size={20} />
// // //           <span>Continue Shopping</span>
// // //         </button>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="container mx-auto p-4 max-w-7xl">
// // //       <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Shopping Basket</h1>
// // //       <div className="flex flex-col lg:flex-row gap-8">
// // //         <div className="flex-grow lg:w-2/3">
// // //           {groupedItems.map((item, index) => (
// // //             <motion.div
// // //               initial={{ opacity: 0, y: 20 }}
// // //               animate={{ opacity: 1, y: 0 }}
// // //               transition={{ duration: 0.4, delay: index * 0.1 }}
// // //               key={item.product._id}
// // //               className="mb-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
// // //             >
// // //               <div 
// // //                 className="flex items-center cursor-pointer flex-1 min-w-0"
// // //                 onClick={() => router.push(`/product/${item.product.slug?.current}`)}
// // //               >
// // //                 <div className="w-32 h-32 relative rounded-lg overflow-hidden mr-6">
// // //                   {item.product.image && (
// // //                     <Image
// // //                       src={imageUrl(item.product.image).url()}
// // //                       alt={item.product.name || 'Product image'}
// // //                       layout="fill"
// // //                       objectFit="cover"
// // //                       className="hover:scale-105 transition-transform duration-200"
// // //                     />
// // //                   )}
// // //                 </div>
// // //                 <div className="flex-grow min-w-0">
// // //                   <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
// // //                     {item.product.name}
// // //                   </h2>
// // //                   <p className="text-gray-600 mb-4">
// // //                     Quantity: {item.quantity} × Shs {item.product.price?.toFixed(2)}
// // //                   </p>
// // //                   <div className="flex items-center justify-between">
// // //                     <p className="text-lg font-semibold text-blue-600">
// // //                       Shs {((item.product.price ?? 0) * item.quantity).toFixed(2)}
// // //                     </p>
// // //                     <div className="flex items-center space-x-4">
// // //                       <AddToBasketButton product={item.product} />
// // //                       <button
// // //                         onClick={(e) => {
// // //                           e.stopPropagation();  // Prevent triggering the parent click
// // //                           removeFromBasket(item.product);
// // //                         }}
// // //                         className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
// // //                       >
// // //                         <Trash2 size={20} />
// // //                       </button>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </motion.div>
// // //           ))}
// // //         </div>

// // //         <div className="lg:w-1/3">
// // //           <div className="sticky top-4 bg-white rounded-lg shadow-md p-6">
// // //             <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
// // //             <div className="space-y-4">
// // //               <div className="flex justify-between text-gray-600">
// // //                 <span>Subtotal ({groupedItems.length} items)</span>
// // //                 <span>Shs {calculateTotal().toFixed(2)}</span>
// // //               </div>
// // //               <div className="flex justify-between text-gray-600">
// // //                 <span>Shipping</span>
// // //                 <span>Free</span>
// // //               </div>
// // //               <div className="border-t pt-4">
// // //                 <div className="flex justify-between text-lg font-semibold">
// // //                   <span>Total</span>
// // //                   <span className="text-blue-600">Shs {calculateTotal().toFixed(2)}</span>
// // //                 </div>
// // //               </div>
// // //               <button
// // //                 onClick={handleCheckout}
// // //                 disabled={isCheckoutLoading}
// // //                 className={`w-full py-4 px-6 text-white bg-blue-600 rounded-lg font-semibold
// // //                 ${isCheckoutLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'}
// // //                 transition-all duration-200 shadow-md hover:shadow-lg`}
// // //               >
// // //                 {isCheckoutLoading ? (
// // //                   <span className="flex items-center justify-center">
// // //                     <Loader className="w-5 h-5 mr-2" /> Processing...
// // //                   </span>
// // //                 ) : (
// // //                   'Proceed to Checkout'
// // //                 )}
// // //               </button>
// // //               <button
// // //                 onClick={() => router.push('/')}
// // //                 className="w-full py-4 px-6 text-blue-600 bg-blue-50 rounded-lg font-semibold
// // //                 hover:bg-blue-100 transition-all duration-200"
// // //               >
// // //                 Continue Shopping
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default BasketPage;



// // // // 'use client';

// // // // import { useEffect, useState } from 'react';
// // // // import { imageUrl } from '@/lib/ImageUrl';
// // // // import useBasketStore from '@/store/store';
// // // // import { useAuth, useUser } from '@clerk/nextjs';
// // // // import Image from 'next/image';
// // // // import { useRouter } from 'next/navigation';
// // // // import React from 'react';
// // // // import AddToBasketButton from '@/components/AddToBasketButton';
// // // // import Loader from '@/components/Loader';

// // // // function BasketPage() {
// // // //   const [isClient, setIsClient] = useState(false);
// // // //   const groupedItems = useBasketStore((state) => state.getGroupedItems());
// // // //   const { isSignedIn } = useAuth();
// // // //   const { user } = useUser();
// // // //   const router = useRouter();

// // // //   // Handle client-side hydration
// // // //   useEffect(() => {
// // // //     setIsClient(true);
// // // //   }, []);

// // // //   // Show nothing during SSR
// // // //   if (!isClient) {
// // // //     return <Loader />;
// // // //   }

// // // //   if (!groupedItems || groupedItems.length === 0) {
// // // //     return (
// // // //       <div
// // // //         className="container mx-auto p-4 flex flex-col items-center justify-center
// // // //         min-h-[50vh]"
// // // //       >
// // // //         <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Basket</h1>
// // // //         <p className="text-gray-600 text-lg">Your Basket is Empty!</p>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="container mx-auto p-4 max-w-6xl">
// // // //       <h1 className="text-2xl font-bold mb-4">Your Basket</h1>
// // // //       <div className="flex flex-col lg:flex-row gap-8">
// // // //         <div className="flex-grow">
// // // //           {groupedItems.map((item) => (
// // // //             <div
// // // //               key={item.product._id}
// // // //               className="mb-4 p-4 border rounded flex items-center justify-between"
// // // //             >
// // // //               <div className='flex items-center cursor-pointer flex-1 min-w-0'
// // // //               onClick={() => 
// // // //                 router.push(`/product/${item.product.slug?.current}`)
// // // //               }>
// // // //               <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4">
// // // //                 {item.product.image && (
// // // //                   <Image
// // // //                     src={imageUrl(item.product.image).url()}
// // // //                     alt={item.product.name || 'Product image'}
// // // //                     className="w-full h-full object-cover rounded"
// // // //                     width={96}
// // // //                     height={96}
// // // //                   />
// // // //                 )}
// // // //               </div>
// // // //               <div className="min-w-0">
// // // //                 <h2 className="text-lg sm:text-xl font-semibold truncate">
// // // //                   {item.product.name}
// // // //                 </h2>
// // // //                 <p className="text-sm sm:text-base">
// // // //                   Price: Shs{' '}
// // // //                   {((item.product.price ?? 0) * item.quantity).toFixed(2)}
// // // //                 </p>
// // // //               </div>
// // // //               <div className='flex items-center ml-4 flex-shrink-0'>
// // // //                 <AddToBasketButton product={item.product} />
// // // //               </div>
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default BasketPage;

// // // // // 'use client';

// // // // // import { useState } from 'react';
// // // // // import { imageUrl } from '@/lib/ImageUrl';
// // // // // import useBasketStore from '@/store/store';
// // // // // import { useAuth, useUser } from '@clerk/nextjs';
// // // // // import Image from 'next/image';
// // // // // import { useRouter } from 'next/router';
// // // // // import React from 'react';

// // // // // function BasketPage() {
// // // // //   const groupedItems = useBasketStore((state) => state.getGroupedItems());
// // // // //   const { isSignedIn } = useAuth();
// // // // //   const { user } = useUser();
// // // // //   const router = useRouter();

// // // // //   const [isClient, setIsClient] = useState(false);
// // // // //   const [isLoading, setIsLoading] = useState(false);

// // // // //   if (groupedItems.length === 0) {
// // // // //     return (
// // // // //       <div
// // // // //         className="container mx-auto p-4 flex flex-col items-center justify-center
// // // // //         min-h-[50vh]"
// // // // //       >
// // // // //         <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Basket</h1>
// // // // //         <p className="text-gray-600 text-lg">Your Basket is Empty!</p>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   console.log('basketContent=>', groupedItems);

// // // // //   return (
// // // // //     <div className="container mx-auto p-4 max-w-6xl">
// // // // //       <h1 className="text-2xl font-bold mb-4">Your Basket...</h1>
// // // // //       <div className="flex flex-col lg:flex-row gap-8">
// // // // //         <div className="flex-grow">
// // // // //           {groupedItems?.map((item) => (
// // // // //             <div
// // // // //               key={item.product._id}
// // // // //               className="mb-4 p-4 border rounded flex items-center justify-between"
// // // // //             >
// // // // //               <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4">
// // // // //                 {item.product.image && (
// // // // //                   <Image
// // // // //                     src={imageUrl(item.product.image).url()}
// // // // //                     alt={item.product.name || 'Product image'}
// // // // //                     className="w-full h-full object-cover rounded"
// // // // //                     width={96}
// // // // //                     height={96}
// // // // //                   />
// // // // //                 )}
// // // // //               </div>
// // // // //               <div className="min-w-0">
// // // // //                 <h2 className="text-lg sm:text-xl font-semibold truncate">
// // // // //                   {item.product.name}
// // // // //                 </h2>
// // // // //                 <p className="text-sm sm:text-base">
// // // // //                   Price: Shs{' '}
// // // // //                   {((item.product.price ?? 0) * item.quantity).toFixed(2)}
// // // // //                 </p>
// // // // //               </div>
// // // // //             </div>
// // // // //           ))}
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default BasketPage;



// // // // // // 'use client'

// // // // // // import { imageUrl } from '@/lib/ImageUrl';
// // // // // // import useBasketStore from '@/store/store'
// // // // // // import { useAuth, useUser } from '@clerk/nextjs';
// // // // // // import Image from 'next/image';
// // // // // // import { useRouter } from 'next/router';
// // // // // // import React from 'react'

// // // // // // function BasketPage() {
// // // // // //     const groupedItems = useBasketStore((state) => state.getGroupedItems());
// // // // // //     const { isSignedIn } = useAuth();
// // // // // //     const { user } = useUser();
// // // // // //     const router = useRouter();

// // // // // //     const [isClient, setIsClient] = useState(false);
// // // // // //     const [isLoading, setIsLoading] = useState(false);

// // // // // //     if (groupedItems.length === 0) {
// // // // // //       return {
// // // // // //         <div className='container mx-auto p-4 flex flex-col items-center jsutify-center
// // // // // //         min-h-[50vh]'>
// // // // // //         <h1 className="text-2xl font-bold mb-6 text-gray-800">
// // // // // //         Your Basket
// // // // // //         </h1>
// // // // // //         <p className="text-gray-600 text-lg">
// // // // // //         Your Basket is Empty!</p>
// // // // // //         </div>
// // // // // //       }
// // // // // //     }


// // // // // //     console.log("basketContent=>", groupedItems)
 
// // // // // //   return (
// // // // // //     <div className='container mx-auto p-4 max-w-6xl'>
// // // // // //     <h1 className='text-2xl font-bold mb-4'>
// // // // // //     Your Basket...</h1>
// // // // // //     <div className='flex flex-col lg:flex-row gap-8'>
// // // // // //     <div className='flex-grow'>
// // // // // //       {groupedItems?.map((item) => (
// // // // // //         <div 
// // // // // //         key={item.product._id}
// // // // // //         className='mb-4 p-4 border rounded flex items-center justify-between'>
// // // // // //           <div className='w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4'>
// // // // // //             {item.product.image && (
// // // // // //               <Image 
// // // // // //               src={imageUrl(item.product.image).url()
// // // // // //                 alt={item.product.name} ?? "Product image"}
// // // // // //                 className="w-full h-full object-cover rounded"
// // // // // //                 width={96}
// // // // // //                 height={96}/>
// // // // // //             )}
// // // // // //           </div>
// // // // // //           <div className='min-w-0'>
// // // // // //             <h2 className='text-lg sm:text-xl font-semibold truncate'>
// // // // // //               {item.product.name}
// // // // // //             </h2>
// // // // // //             <p className='text-sm sm:text-base'>
// // // // // //               Price: Shs
// // // // // //               {((item.product.price ?? 0) * item.quantity).toFixed(2)}
// // // // // //             </p>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       ))}
// // // // // //     </div>
// // // // // //     </div>
// // // // // //     </div>
// // // // // //   )
// // // // // // }

// // // // // // export default BasketPage