import { Heart } from "lucide-react";

export default function WishlistPage() {
    return (
        <div className="bg-primary min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-gold text-3xl font-bold tracking-wider uppercase mb-10">
                    Wishlist
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card-surface group cursor-pointer relative">
                            <div className="aspect-[3/4] bg-surface" />
                            <button className="absolute top-3 right-3 text-gold">
                                <Heart className="w-5 h-5 fill-current" />
                            </button>
                            <div className="p-4">
                                <p className="text-text-primary text-sm font-medium">Product Name</p>
                                <p className="text-text-muted text-sm mt-1">₹1,299</p>
                                <button className="btn-primary w-full mt-3 text-xs py-2">Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
