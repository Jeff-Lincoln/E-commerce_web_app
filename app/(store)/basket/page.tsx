'use client'

import useBasketStore from '@/store/store'
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import React from 'react'

function BasketPage() {
    const groupedItems = useBasketStore((state) => state.getGroupedItems());
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
 
  return (
    <div>BasketPage</div>
  )
}

export default BasketPage