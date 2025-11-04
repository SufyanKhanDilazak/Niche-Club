export const fbq = (...args: any[]) => {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq(...args);
    }
  };
  