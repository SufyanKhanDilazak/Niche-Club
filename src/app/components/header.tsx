'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useMemo, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import {
  ChevronDown,
  ShoppingCart,
  Menu,
  Trash2,
  ShoppingBag,
  Plus,
  Minus,
  X,
} from 'lucide-react';

import { useCart } from './CartContext';
import { CartItem } from './Interface';
import BB8ThemeToggle from './BB8ThemeToggle';

/* ---------------- constants ---------------- */
const NAV_LINKS = [
  { name: 'ABOUT', href: '/about' },
  { name: 'CONTACT', href: '/contact' },
] as const;

const MENS_LINKS = [
  { name: 'ESSENTIALS', href: '/categories/men_essentials' },
  { name: 'TEES', href: '/categories/men_tees' },
  { name: 'DENIM', href: '/categories/men_denim' },
] as const;

const WOMEN_LINKS = [
  { name: 'ESSENTIALS', href: '/categories/women_essentials' },
  { name: 'TEES', href: '/categories/women_tees' },
] as const;

const ICON_BTN =
  'inline-flex items-center justify-center h-9 w-9 rounded-full border border-gray-200 bg-white/90 transition-all duration-300 hover:bg-white ' +
  'dark:bg-black dark:border-neutral-800 dark:hover:bg-neutral-900';

const ACCENT_TEXT = 'text-blue-500 dark:text-[#a90068]';
const ACCENT_BG = 'bg-blue-500 dark:bg-[#a90068]';
const ACCENT_GRAD = 'from-transparent via-blue-500 to-transparent dark:via-[#a90068]';

/* ---------------- component ---------------- */
export function Header() {
  const { cartItems, cartQuantity, shouldGlow, addToCart, removeFromCart, clearCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const handleRemoveFromCart = useCallback(
    (item: CartItem) => removeFromCart(item._id, item.selectedSize, item.selectedColor),
    [removeFromCart]
  );
  const handleViewCart = useCallback(() => {
    setIsCartSheetOpen(false);
    router.push('/cart');
  }, [router]);
  const handleCheckout = useCallback(() => {
    setIsCartSheetOpen(false);
    router.push('/cart');
  }, [router]);
  const handleClearCart = useCallback(() => clearCart(), [clearCart]);

  const renderDropdownLinks = (links: readonly { name: string; href: string }[]) => (
    <>
      {links.map((link) => (
        <DropdownMenuItem
          key={link.href}
          className="focus:bg-gray-100 dark:focus:bg-neutral-900 cursor-pointer uppercase rounded-md transition-colors"
        >
          <Link
            href={link.href}
            className="w-full text-sm text-black dark:text-white py-2.5 px-3.5 block rounded-md hover:bg-gray-100/70 dark:hover:bg-neutral-900"
          >
            {link.name}
          </Link>
        </DropdownMenuItem>
      ))}
    </>
  );

  const renderMobileAccordion = (title: string, links: readonly { name: string; href: string }[]) => (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={title.toLowerCase()} className="border-none">
        <AccordionTrigger className="py-2.5 uppercase text-black dark:text-white hover:text-blue-500 dark:hover:text-[#a90068] transition-colors no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent className="pt-1.5 pb-3">
          <div className="flex flex-col space-y-1.5 bg-gray-50/80 dark:bg-neutral-950 rounded-lg p-3">
            {links.map((link) => (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2.5 px-3.5 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  {link.name}
                </Link>
              </SheetClose>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Top accent line */}
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${ACCENT_GRAD} opacity-90 z-[1]`} />
      
      {/* Main glass bar - fixed height across all breakpoints */}
      <div className="relative z-[2] backdrop-blur-md bg-white/65 dark:bg-black/65 border-b border-white/20 dark:border-neutral-900/70 shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Single fixed height for all screens */}
          <div className="h-16 flex items-center justify-between">
            
            {/* LEFT: Mobile menu + Desktop nav */}
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <div className="lg:hidden">
                <Sheet open={isMenuSheetOpen} onOpenChange={setIsMenuSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className={ICON_BTN} aria-label="Open menu">
                      <Menu className="h-[1.1rem] w-[1.1rem]" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[300px] sm:w-[350px] bg-white dark:bg-black border-r border-gray-200 dark:border-neutral-900 p-0"
                  >
                    <div className="relative h-full flex flex-col">
                      {/* Top accent */}
                      <div className={`h-px w-full bg-gradient-to-r ${ACCENT_GRAD} opacity-90`} />
                      
                      {/* Header with close button */}
                      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-neutral-900">
                        <SheetTitle className="text-lg uppercase tracking-wide dark:text-white">MENU</SheetTitle>
                        <SheetClose asChild>
                          <button
                            className="rounded-sm opacity-70 hover:opacity-100 transition-all hover:rotate-90 duration-200"
                            aria-label="Close menu"
                          >
                            <X className="h-4 w-4 dark:text-white" />
                          </button>
                        </SheetClose>
                      </div>

                      {/* Navigation */}
                      <nav className="flex flex-col px-6 py-4 flex-1 overflow-auto space-y-1">
                        <SheetClose asChild>
                          <Link
                            href="/"
                            className={`py-2.5 uppercase text-sm tracking-wide transition-colors ${
                              isActive('/') ? ACCENT_TEXT : 'text-black dark:text-white'
                            } hover:text-blue-500 dark:hover:text-[#a90068]`}
                          >
                            HOME
                          </Link>
                        </SheetClose>

                        <Separator className="my-2 dark:bg-neutral-900" />
                        
                        {renderMobileAccordion('MENS', MENS_LINKS)}
                        {renderMobileAccordion('WOMEN', WOMEN_LINKS)}

                        <Separator className="my-2 dark:bg-neutral-900" />

                        {NAV_LINKS.map((link) => (
                          <SheetClose asChild key={link.href}>
                            <Link
                              href={link.href}
                              className={`py-2.5 uppercase text-sm tracking-wide transition-colors ${
                                isActive(link.href) ? ACCENT_TEXT : 'text-black dark:text-white'
                              } hover:text-blue-500 dark:hover:text-[#a90068]`}
                            >
                              {link.name}
                            </Link>
                          </SheetClose>
                        ))}
                      </nav>

                      {/* Bottom accent */}
                      <div className={`h-px w-full bg-gradient-to-r ${ACCENT_GRAD} opacity-80`} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop navigation */}
              <nav className="hidden lg:flex items-center gap-1.5">
                <Link
                  href="/"
                  className={`px-3.5 py-1.5 rounded-full text-[13px] tracking-wide uppercase transition-all ${
                    isActive('/') 
                      ? `${ACCENT_TEXT} bg-gray-100/70 dark:bg-neutral-900` 
                      : 'text-black dark:text-white hover:bg-gray-100/70 dark:hover:bg-neutral-900'
                  }`}
                >
                  HOME
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-3.5 py-1.5 rounded-full text-[13px] uppercase text-black dark:text-white hover:bg-gray-100/70 dark:hover:bg-neutral-900 transition-all flex items-center gap-1">
                      MENS <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-white dark:bg-black border border-gray-200 dark:border-neutral-900 shadow-lg rounded-xl p-3"
                    align="start"
                    sideOffset={8}
                  >
                    {renderDropdownLinks(MENS_LINKS)}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-3.5 py-1.5 rounded-full text-[13px] uppercase text-black dark:text-white hover:bg-gray-100/70 dark:hover:bg-neutral-900 transition-all flex items-center gap-1">
                      WOMEN <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-white dark:bg-black border border-gray-200 dark:border-neutral-900 shadow-lg rounded-xl p-3"
                    align="start"
                    sideOffset={8}
                  >
                    {renderDropdownLinks(WOMEN_LINKS)}
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>

            {/* CENTER: Logo - properly sized and centered */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link href="/" className="block">
                <div className="relative h-24 w-32 sm:h-24 sm:w-40 lg:h-26 lg:w-48 transition-transform duration-300 hover:scale-105">
                  <Image
                    src="/logo1.png"
                    alt="Niche Club"
                    fill
                    className="object-contain block dark:hidden"
                    priority
                    sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
                  />
                  <Image
                    src="/logo.png"
                    alt="Niche Club"
                    fill
                    className="object-contain hidden dark:block"
                    priority
                    sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
                  />
                </div>
              </Link>
            </div>

            {/* RIGHT: Desktop nav + Theme toggle + Cart */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Desktop right nav */}
              <nav className="hidden lg:flex items-center gap-1.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full text-[13px] uppercase transition-all ${
                      isActive(link.href)
                        ? `${ACCENT_TEXT} bg-gray-100/70 dark:bg-neutral-900`
                        : 'text-black dark:text-white hover:bg-gray-100/70 dark:hover:bg-neutral-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

             <div className="flex items-center gap-2">
  <div className="scale-[0.65] lg:scale-75">
    <BB8ThemeToggle size={9} />
  </div>

  <Sheet open={isCartSheetOpen} onOpenChange={setIsCartSheetOpen}>
    <SheetTrigger asChild>
      <div className="relative -mt-1"> {/* Add -mt-1 or -mt-0.5 for less shift */}
        <Button
                        variant="outline"
                        size="icon"
                        className={`${ICON_BTN} ${shouldGlow ? 'animate-pulse' : ''}`}
                        aria-label="Open cart"
                      >
                        <ShoppingCart className="h-[1.05rem] w-[1.05rem]" />
                        {cartQuantity > 0 && (
                          <span className={`absolute -top-1 -right-1 ${ACCENT_BG} text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-medium`}>
                            {cartQuantity}
                          </span>
                        )}
                      </Button>
                    </div>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-[300px] sm:w-[380px] bg-white dark:bg-black border-l border-gray-200 dark:border-neutral-900 p-0"
                  >
                    <div className="h-full flex flex-col">
                      {/* Top accent */}
                      <div className={`h-px w-full bg-gradient-to-r ${ACCENT_GRAD} opacity-90`} />
                      
                      {/* Header */}
                      <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-900">
                        <SheetHeader>
                          <SheetTitle className="flex items-center gap-2 text-lg uppercase tracking-wide dark:text-white">
                            <ShoppingCart className="h-5 w-5" />
                            YOUR CART ({cartQuantity})
                          </SheetTitle>
                        </SheetHeader>
                      </div>

                      {/* Cart content */}
                      <div className="flex-1 overflow-hidden flex flex-col">
                        {cartItems.length === 0 ? (
                          <div className="flex flex-col items-center justify-center flex-1 p-6">
                            <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-center mb-6 text-sm uppercase tracking-wide">
                              Your cart is empty
                            </p>
                            <SheetClose asChild>
                              <Button className={`${ACCENT_BG} hover:opacity-90 text-white uppercase transition hover:scale-105 text-sm px-6`}>
                                CONTINUE SHOPPING
                              </Button>
                            </SheetClose>
                          </div>
                        ) : (
                          <>
                            <div className="flex-grow overflow-y-auto space-y-3 p-6">
                              {cartItems.map((item) => (
                                <div
                                  key={`${item._id}-${item.selectedSize || 'default'}-${item.selectedColor || 'default'}`}
                                  className="bg-gray-50 dark:bg-neutral-950 p-3 rounded-lg border border-gray-200 dark:border-neutral-900 flex items-center gap-3"
                                >
                                  {item.imageUrl && (
                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                      <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-grow min-w-0">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                      {item.name}
                                    </h3>
                                    {item.selectedSize && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Size: {item.selectedSize}</p>
                                    )}
                                    {item.selectedColor && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Color: {item.selectedColor}</p>
                                    )}
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                      ${item.price.toFixed(2)}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 rounded-md border border-gray-200 dark:border-neutral-800">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-neutral-800"
                                        onClick={() => handleRemoveFromCart(item)}
                                        aria-label="Decrease quantity"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-neutral-800"
                                        onClick={() => addToCart({ ...item, quantity: 1 })}
                                        aria-label="Increase quantity"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <p className="text-sm font-medium dark:text-white">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="p-6 border-t border-gray-200 dark:border-neutral-900">
                              <div className="mb-4">
                                <div className="flex justify-between mb-2 text-sm uppercase font-medium">
                                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                  <span className="dark:text-white">${subtotal.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                  Shipping and taxes calculated at checkout
                                </p>
                              </div>
                              <div className="space-y-2.5">
                                <Button
                                  onClick={handleViewCart}
                                  variant="outline"
                                  className="w-full border-gray-300 dark:border-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-900 dark:text-white uppercase transition hover:scale-[1.02] text-sm"
                                >
                                  VIEW CART
                                </Button>
                                <Button
                                  onClick={handleCheckout}
                                  className={`w-full ${ACCENT_BG} hover:opacity-90 text-white uppercase transition hover:scale-[1.02] text-sm`}
                                >
                                  CHECKOUT
                                </Button>
                                <Button
                                  onClick={handleClearCart}
                                  variant="ghost"
                                  className="w-full flex items-center justify-center text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 uppercase transition hover:scale-[1.02] text-sm"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  CLEAR CART
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Bottom accent */}
                      <div className={`h-px w-full bg-gradient-to-r ${ACCENT_GRAD} opacity-80`} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r ${ACCENT_GRAD} opacity-80 z-[1]`} />
    </header>
  );
}