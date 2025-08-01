"use client";
import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  
  // Get redirectUrl from query params
  const redirectUrl = searchParams?.get("redirectUrl");
  
  // Use the redirectUrl if provided, otherwise default to "/checkout"
  const afterSignUpUrl = redirectUrl ? decodeURIComponent(redirectUrl) : "/checkout";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <SignUp
          routing="hash"
          afterSignUpUrl={afterSignUpUrl}
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 dark:bg-[#a90068] dark:hover:bg-[#8a0055] text-sm normal-case",
              card: "shadow-lg border border-gray-200 dark:border-gray-700",
              headerTitle: "text-gray-900 dark:text-white",
              headerSubtitle: "text-gray-600 dark:text-gray-400",
              socialButtonsBlockButton: "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800",
              formFieldLabel: "text-gray-700 dark:text-gray-300",
              formFieldInput: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
              footerActionLink: "text-blue-600 dark:text-[#a90068] hover:text-blue-700 dark:hover:text-[#8a0055]",
            },
          }}
        />
      </div>
    </div>
  );
}