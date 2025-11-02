'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Moon, Sun, User, ChevronDown, ShoppingCart, Menu, Trash2, ShoppingBag, Plus, Minus, X } from 'lucide-react';
import { useTheme } from './theme-context';
import { useCart } from './CartContext';
import { CartItem } from './Interface';

// Constants for better performance
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

const BUTTON_BASE_CLASSES = 'h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out hover:scale-110 hover:-rotate-12' as const;

export function Header() {
  const { isDarkMode, toggleTheme, isThemeLoaded } = useTheme();
  const { cartItems, cartQuantity, shouldGlow, addToCart, removeFromCart, clearCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  
  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Memoized logo source - prevents recalculation
  const logoSrc = useMemo(() => {
    if (!isMounted || !isThemeLoaded) return '/logo1.png';
    return isDarkMode ? '/logo.png' : '/logo1.png';
  }, [isMounted, isThemeLoaded, isDarkMode]);

  // Memoized subtotal calculation
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  // Memoized active check
  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  // User button styles - only recalculate when mounted state changes
  const userButtonStyles = useMemo(() => {
    if (!isMounted) return {};
    return {
      '--user-button-size': '32px',
      '--user-button-border-light': '#3b82f6',
      '--user-button-border-dark': '#a90068',
      '--user-button-bg-dark': 'rgb(17, 24, 39)',
      '--user-button-bg-dark-hover': 'rgb(31, 41, 55)',
      '--user-button-shadow-light': '0 0 8px rgba(59, 130, 246, 0.4)',
      '--user-button-shadow-dark': '0 0 8px rgba(169, 0, 104, 0.4)',
    } as React.CSSProperties;
  }, [isMounted]);

  // Mount effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setIsMenuSheetOpen(false);
  }, [pathname]);

  // Cart handlers
  const handleRemoveFromCart = useCallback(
    (item: CartItem) => {
      removeFromCart(item._id, item.selectedSize, item.selectedColor);
    },
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

  // Render dropdown links
  const renderDropdownLinks = useCallback((links: readonly { name: string; href: string }[]) => (
    <>
      {links.map((link) => (
        <DropdownMenuItem
          key={link.href}
          className="focus:bg-gray-100 dark:focus:bg-gray-900 cursor-pointer uppercase rounded-md transition-all duration-200 ease-in-out"
        >
          <Link
            href={link.href}
            className="w-full text-sm text-black dark:text-white hover:text-[var(--theme-primary)] py-3 px-4 block hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-md hover:scale-105 hover:translate-x-1 transition-all duration-200 ease-in-out"
          >
            {link.name}
          </Link>
        </DropdownMenuItem>
      ))}
    </>
  ), []);

  // Render mobile accordion
  const renderMobileAccordion = useCallback((title: string, links: readonly { name: string; href: string }[]) => (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={title.toLowerCase()} className="border-none">
        <AccordionTrigger className="py-2 uppercase text-black dark:text-white hover:text-[var(--theme-primary)] transition-all duration-300 ease-in-out no-underline hover:no-underline hover:translate-x-1">
          {title}
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-4 transition-all duration-500 ease-in-out">
          <div className="flex flex-col space-y-2 bg-gray-50 dark:bg-gray-900/50 rounded-md p-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 px-3 text-sm text-gray-700 dark:text-gray-300 hover:text-[var(--theme-primary)] transition-all duration-200 ease-in-out rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:scale-105 hover:translate-x-1"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ), []);

  return (
    <>
      {isMounted && (
        <style jsx global>{`
          .nav-user-button .cl-userButtonTrigger {
            width: var(--user-button-size);
            height: var(--user-button-size);
          }
          .cl-userButtonBox {
            border: 1px solid transparent;
            border-radius: 9999px;
            transition: all 0.3s ease-in-out;
            width: var(--user-button-size);
            height: var(--user-button-size);
          }
          .cl-userButtonBox:hover {
            border: 1px solid var(--user-button-border-light);
            transform: scale(1.1) rotate(-12deg);
            box-shadow: var(--user-button-shadow-light);
          }
          .dark .cl-userButtonBox {
            background-color: var(--user-button-bg-dark);
          }
          .dark .cl-userButtonBox:hover {
            background-color: var(--user-button-bg-dark-hover);
            border: 1px solid var(--user-button-border-dark);
            box-shadow: var(--user-button-shadow-dark);
          }
        `}</style>
      )}

      <header className="fixed top-0 left-0 w-full z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black transition-colors duration-300 ease-in-out h-20 font-montserrat font-bold">
        <div className="container mx-auto max-w-7xl px-4 h-full flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <Sheet open={isMenuSheetOpen} onOpenChange={setIsMenuSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={BUTTON_BASE_CLASSES}
                  aria-label="Open menu"
                >
                  <Menu className="h-[1.4rem] w-[1.4rem]" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[400px] bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 p-0"
              >
                <div className="h-full flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent shadow-[0_0_10px_2px_var(--theme-primary)] opacity-70" />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent shadow-[0_0_10px_2px_var(--theme-primary)] opacity-70" />
                  
                  <div className="flex items-center justify-between p-6">
                    <SheetTitle className="text-xl uppercase dark:text-white">MENU</SheetTitle>
                    <SheetClose asChild>
                      <button
                        className="absolute right-4 top-4 rounded-sm opacity-70 transition-all duration-300 ease-in-out hover:opacity-100 hover:rotate-90 focus:outline-none"
                        aria-label="Close menu"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </SheetClose>
                  </div>

                  <nav className="flex flex-col space-y-6 px-6 pb-6 flex-1 overflow-auto">
                    <Link
                      href="/"
                      className={`relative py-2 transition-all duration-300 ease-in-out ${
                        isActive('/') ? 'text-[var(--theme-primary)]' : 'text-black dark:text-white'
                      } hover:text-[var(--theme-primary)] hover:translate-x-1`}
                    >
                      HOME
                      {isActive('/') && (
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent shadow-[0_0_10px_2px_var(--theme-primary)]" />
                      )}
                    </Link>

                    {renderMobileAccordion('MENS', MENS_LINKS)}
                    {renderMobileAccordion('WOMEN', WOMEN_LINKS)}

                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`relative py-2 uppercase transition-all duration-300 ease-in-out ${
                          isActive(link.href) ? 'text-[var(--theme-primary)]' : 'text-black dark:text-white'
                        } hover:text-[var(--theme-primary)] hover:translate-x-1`}
                      >
                        {link.name}
                        {isActive(link.href) && (
                          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent shadow-[0_0_10px_2px_var(--theme-primary)]" />
                        )}
                      </Link>
                    ))}

                    <div className="pt-4">
                      <SignedIn>
                        <div className="flex items-center gap-2 py-2 text-black dark:text-white">
                          <User className="h-5 w-5" />
                          <UserButton afterSignOutUrl="/" />
                        </div>
                      </SignedIn>
                      <SignedOut>
                        <SignInButton mode="modal">
                          <Button
                            variant="ghost"
                            className="w-full justify-start pl-0 uppercase text-black dark:text-white hover:text-[var(--theme-primary)] transition-all duration-300 ease-in-out hover:scale-105"
                          >
                            <User className="h-5 w-5 mr-2" />
                            ACCOUNT
                          </Button>
                        </SignInButton>
                      </SignedOut>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 flex-shrink-0">
            <Link
              href="/"
              className={`relative group uppercase transition-all duration-300 ease-in-out ${
                isActive('/') ? 'text-[var(--theme-primary)]' : 'text-black dark:text-white'
              } hover:text-[var(--theme-primary)] hover:-translate-y-0.5 hover:scale-105`}
            >
              HOME
              <span
                className={`absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent shadow-[0_0_10px_2px_var(--theme-primary)] transition-all duration-300 ease-in-out ${
                  isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>

            {/* MENS Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center group uppercase text-black dark:text-white hover:text-[var(--theme-primary)] transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-0.5 focus:bg-transparent"
                >
                  MENS
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-72 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl p-4"
                align="start"
                sideOffset={8}
                alignOffset={-4}
              >
                {renderDropdownLinks(MENS_LINKS)}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* WOMEN Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center group uppercase text-black dark:text-white hover:text-[var(--theme-primary)] transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-0.5 focus:bg-transparent"
                >
                  WOMEN
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-72 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl p-4"
                align="start"
                sideOffset={8}
                alignOffset={-4}
              >
                {renderDropdownLinks(WOMEN_LINKS)}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Centered Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <Link href="/" className="block transition-transform duration-300 ease-in-out hover:scale-105">
              <div className="relative h-24 w-48 mt-1 sm:h-24 sm:w-48 md:h-28 md:w-56 lg:w-72 transition-all duration-500 ease-in-out hover:-rotate-1">
                <Image
                  src={logoSrc}
                  alt="Niche Club"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 288px"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links (Right Side) */}
          <div className="hidden lg:flex items-center space-x-8 ml-auto mr-4 flex-shrink-0">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative group uppercase transition-all duration-300 ease-in-out ${
                  isActive(link.href) ? 'text-[var(--theme-primary)]' : 'text-black dark:text-white'
                } hover:text-[var(--theme-primary)] hover:-translate-y-0.5 hover:scale-105`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent shadow-[0_0_10px_2px_var(--theme-primary)] transition-all duration-300 ease-in-out ${
                    isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Action Buttons - Perfectly Aligned */}
          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
            {/* Theme Toggle Button */}
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className={BUTTON_BASE_CLASSES}
              aria-label={
                isMounted && isThemeLoaded
                  ? isDarkMode
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                  : 'Toggle theme'
              }
            >
              {isMounted && isThemeLoaded ? (
                isDarkMode ? (
                  <Sun className="h-[1.3rem] w-[1.3rem] text-yellow-400 transition-all duration-300 ease-in-out" />
                ) : (
                  <Moon className="h-[1.3rem] w-[1.3rem] transition-all duration-300 ease-in-out" />
                )
              ) : (
                <span className="h-[1.3rem] w-[1.3rem]" />
              )}
            </Button>

            {/* Cart Button */}
            <Sheet open={isCartSheetOpen} onOpenChange={setIsCartSheetOpen}>
              <SheetTrigger asChild>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`${BUTTON_BASE_CLASSES} ${shouldGlow ? 'animate-pulse' : ''}`}
                    aria-label="Open cart"
                  >
                    <ShoppingCart className="h-[1.3rem] w-[1.3rem]" />
                    {cartQuantity > 0 && (
                      <span
                        className={`absolute -top-1 -right-1 ${
                          isDarkMode ? 'bg-[#a90068]' : 'bg-blue-500'
                        } text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-all duration-300 ease-in-out ${
                          shouldGlow ? 'animate-pulse' : ''
                        }`}
                      >
                        {cartQuantity}
                      </span>
                    )}
                  </Button>
                </div>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[380px] bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 p-0"
              >
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
                        <p className="text-gray-500 dark:text-gray-400 text-center mb-4 text-sm sm:text-base uppercase">
                          Your cart is empty
                        </p>
                        <SheetClose asChild>
                          <Button className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white uppercase transition-all duration-300 ease-in-out hover:scale-105 text-sm">
                            CONTINUE SHOPPING
                          </Button>
                        </SheetClose>
                      </div>
                    ) : (
                      <>
                        <div className="flex-grow overflow-y-auto space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                          {cartItems.map((item) => (
                            <div
                              key={`${item._id}-${item.selectedSize || 'default'}-${item.selectedColor || 'default'}`}
                              className="bg-white dark:bg-gray-900 p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-2 sm:gap-3 transition-transform duration-300 ease-in-out hover:scale-105"
                            >
                              {item.imageUrl && (
                                <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-md transition-transform duration-300 ease-in-out hover:scale-105">
                                  <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 48px, 64px"
                                  />
                                </div>
                              )}
                              <div className="flex-grow min-w-0">
                                <h3 className="text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                                  {item.name}
                                </h3>
                                {item.selectedSize && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Size: {item.selectedSize}
                                  </p>
                                )}
                                {item.selectedColor && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Color: {item.selectedColor}
                                  </p>
                                )}
                                <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-md">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:scale-90 transition-transform duration-200 ease-in-out"
                                    onClick={() => handleRemoveFromCart(item)}
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  </Button>
                                  <span className="w-5 sm:w-6 text-center text-xs sm:text-sm">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:scale-90 transition-transform duration-200 ease-in-out"
                                    onClick={() => addToCart({ ...item, quantity: 1 })}
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  </Button>
                                </div>
                                <p className="text-xs dark:text-white">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
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
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                              Shipping and taxes calculated at checkout
                            </p>
                          </div>
                          <div className="space-y-2 sm:space-y-3">
                            <Button
                              onClick={handleViewCart}
                              variant="outline"
                              className="w-full border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white uppercase transition-all duration-300 ease-in-out hover:scale-105 text-xs sm:text-sm"
                            >
                              VIEW CART
                            </Button>
                            <Button
                              onClick={handleCheckout}
                              className="w-full bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white uppercase transition-all duration-300 ease-in-out hover:scale-105 text-xs sm:text-sm"
                            >
                              CHECKOUT
                            </Button>
                            <Button
                              onClick={handleClearCart}
                              variant="ghost"
                              className="w-full flex items-center justify-center text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 uppercase transition-all duration-300 ease-in-out hover:scale-105 text-xs sm:text-sm"
                            >
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

            {/* User Button - Desktop Only */}
            <div className="hidden lg:block flex-shrink-0">
              <SignedIn>
                <div className="nav-user-button" style={userButtonStyles}>
                  <div className="transition-all duration-300 ease-in-out hover:scale-110 hover:-rotate-12">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    size="icon"
                    className={BUTTON_BASE_CLASSES}
                    aria-label="Sign in"
                  >
                    <User className="h-[1.3rem] w-[1.3rem]" />
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
        
        {/* Bottom Border Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-primary)] to-transparent shadow-[0_0_10px_2px_var(--theme-primary)] opacity-70" />
      </header>
    </>
  );
}