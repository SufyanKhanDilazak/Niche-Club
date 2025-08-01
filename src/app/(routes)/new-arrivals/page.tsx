import Image from "next/image";
import Link from "next/link";
import { IProduct } from "../../components/Interface";

// Fetch data from Sanity
async function fetchSanityData() {
  try {
    const res = await fetch("https://template1-neon-nu.vercel.app/api/products");
    const data = (await res.json()) as IProduct[];
    return data.slice(5, 10);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

const New = async () => {
  const topSelling = await fetchSanityData();

  return (
    <section className="text-center px-0 sm:px-6 lg:px-10 py-16 bg-white dark:bg-black transition-colors duration-300">
      {/* Banner with neon pink outline and shadow */}
      <div
        className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden mb-20 rounded-lg"
        style={{
          border: "2px solid #BE1860",
          boxShadow: "0 0 20px 6px rgba(190, 24, 93, 0.25)",
        }}
      >
        <Image
          src="/fash1.jpg"
          alt="New Arrivals Banner"
          fill
          className="object-cover rounded-lg"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-md px-6 py-4 rounded-xl select-none">
            New Arrivals
          </h2>
        </div>
      </div>

      <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-black dark:text-white tracking-tight drop-shadow-sm">
        On Sale
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {topSelling.map((product) => (
          <Link
            href={`/product/${product._id}`}
            key={product._id}
            className="group relative transform transition duration-300 hover:scale-[1.03] rounded-xl overflow-hidden bg-white dark:bg-neutral-900"
            style={{
              border: "2px solid #BE1860",
              boxShadow: "0 0 10px 3px rgba(190, 24, 93, 0.15)", // softer glow
              transition: "all 0.5s ease",
            }}
          >
            <div className="relative w-full aspect-[4/5] rounded-t-xl overflow-hidden">
              <Image
                src={product.imageUrl || "/placeholder.png"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-xl"
              />
            </div>
            <div className="px-3 py-3 text-left">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white whitespace-normal leading-snug line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm font-bold text-black dark:text-white mt-1">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <div className="absolute inset-0 z-0 pointer-events-none group-hover:ring-[1px] group-hover:ring-[#BE1860]/40 transition duration-300 rounded-xl" />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default New;
