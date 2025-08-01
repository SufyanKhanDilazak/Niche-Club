import { CheckCircle, Package, ArrowRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful! 🎉
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
              Thank you for your purchase. Your order has been confirmed and is being processed.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Order Status */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-300">Order Confirmed</h3>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Your order is now being processed and you&apos;ll receive a confirmation email shortly.
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Order Confirmation</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You&apos;ll receive an email confirmation with your order details and tracking information.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Processing</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We&apos;ll prepare your order for shipment within 1-2 business days.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Shipping</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your order will be shipped and you&apos;ll receive tracking details via email.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Link href="/" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
                  <Home className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/categories/all_product" className="flex-1">
                <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Products
                </Button>
              </Link>
            </div>

            {/* Support */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Need help with your order?</p>
              <p className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Contact us at </span>
                <a
                  href="mailto:support@nicheclub.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  support@nicheclub.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}