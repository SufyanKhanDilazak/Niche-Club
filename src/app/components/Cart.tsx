'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import { useTheme } from './theme-context';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { ShoppingCart, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from './Interface';

export function Cart() {
  const { cartItems, cartQuantity, shouldGlow, addToCart, removeFromCart, clearCart } = useCart();
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Close cart when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Memoized calculations for performance
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Optimized handlers with useCallback
  const handleRemoveFromCart = useCallback((item: CartItem) => {
    removeFromCart(item._id, item.selectedSize, item.selectedColor);
  }, [removeFromCart]);

  const handleViewCart = useCallback(() => {
    setIsOpen(false);
    router.push('/cart');
  }, [router]);

  const handleCheckout = useCallback(() => {
    setIsOpen(false);
    router.push('/checkout');
  }, [router]);

  const handleClearCart = useCallback(() => {
    clearCart();
  }, [clearCart]);

  const handleAddToCart = useCallback((item: CartItem) => {
    addToCart({ ...item, quantity: 1 });
  }, [addToCart]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className={`h-8 w-8 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-full hover:scale-110 hover:-rotate-12 ${shouldGlow ? 'animate-pulse' : ''}`}
          >
            <ShoppingCart className="h-[1.3rem] w-[1.3rem]" />
            {cartQuantity > 0 && (
              <span className={`absolute -top-1 -right-1 ${isDarkMode ? 'bg-[#a90068]' : 'bg-blue-500'} text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-all duration-300 ease-in-out ${shouldGlow ? 'animate-pulse' : ''}`}>
                {cartQuantity}
              </span>
            )}
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[380px] bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 p-0 transition-all duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent shadow-[0_0_10px_2px_var(--theme-primary)] opacity-70" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent shadow-[0_0_10px_2px_var(--theme-primary)] opacity-70" />
          <div className="p-4 sm:p-6">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-lg sm:text-xl uppercase dark:text-white">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                YOUR CART ({cartQuantity})
              </SheetTitle>
            </SheetHeader>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 p-4 sm:p-6">
                <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-center mb-4 text-sm sm:text-base uppercase">Your cart is empty</p>
                <Button onClick={() => setIsOpen(false)} className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white uppercase transition-all duration-300 ease-in-out hover:scale-105 text-sm">CONTINUE SHOPPING</Button>
              </div>
            ) : (
              <>
                <div className="flex-grow overflow-y-auto space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                  {cartItems.map((item) => (
                    <div key={`${item._id}-${item.selectedSize || 'default'}-${item.selectedColor || 'default'}`} className="bg-white dark:bg-gray-900 p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-2 sm:gap-3 transition-transform duration-300 ease-in-out hover:scale-105">
                      {item.imageUrl && (
                        <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-md transition-transform duration-300 ease-in-out hover:scale-105">
                          <Image 
                            src={item.imageUrl} 
                            alt={item.name} 
                            fill 
                            className="object-cover" 
                            sizes="(max-width: 640px) 48px, 64px"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <h3 className="text-xs sm:text-sm text-gray-900 dark:text-white truncate">{item.name}</h3>
                        {item.selectedSize && <p className="text-xs text-gray-500 dark:text-gray-400">Size: {item.selectedSize}</p>}
                        {item.selectedColor && <p className="text-xs text-gray-500 dark:text-gray-400">Color: {item.selectedColor}</p>}
                        <p className="text-xs sm:text-sm text-gray-900 dark:text-white">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:scale-90 transition-transform duration-200 ease-in-out" onClick={() => handleRemoveFromCart(item)}>
                            <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </Button>
                          <span className="w-5 sm:w-6 text-center text-xs sm:text-sm">{item.quantity}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:scale-90 transition-transform duration-200 ease-in-out" onClick={() => handleAddToCart(item)}>
                            <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </Button>
                        </div>
                        <p className="text-xs dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 sm:p-6 pt-0">
                  <Separator className="my-3 sm:my-4" />
                  <div className="mb-3 sm:mb-4">
                    <div className="flex justify-between mb-2 text-xs sm:text-sm uppercase">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="dark:text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Shipping and taxes calculated at checkout</p>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <Button onClick={handleViewCart} variant="outline" className="w-full border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white uppercase transition-all duration-300 ease-in-out hover:scale-105 text-xs sm:text-sm">VIEW CART</Button>
                    <Button onClick={handleCheckout} className="w-full bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white uppercase transition-all duration-300 ease-in-out hover:scale-105 text-xs sm:text-sm">CHECKOUT</Button>
                    <Button onClick={handleClearCart} variant="ghost" className="w-full flex items-center justify-center text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 uppercase transition-all duration-300 ease-in-out hover:scale-105 text-xs sm:text-sm">
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      CLEAR CART
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}