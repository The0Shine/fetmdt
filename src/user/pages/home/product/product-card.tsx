import type React from 'react'
import { ShoppingCart, Heart, Star, Link } from 'lucide-react'
import { Product } from '../../../../types/product'

interface ProductCardProps {
    product: Product
    onAddToCart: (product: Product) => void
    onAddToWishlist?: (product: Product) => void
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToCart,
    onAddToWishlist,
}) => {
    return (
        <div className="group overflow-hidden rounded-lg bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className="relative">
                <Link href={`/shop/${product.id}`}>
                    <div className="relative h-48 bg-gray-100">
                        {product.image ? (
                            <img
                                src={product.image || '/placeholder.svg'}
                                alt={product.name}
                                className="object-contain p-4"
                            />
                        ) : (
                            <img
                                src="/placeholder.svg?height=192&width=192"
                                alt={product.name}
                                className="object-contain"
                            />
                        )}
                    </div>
                </Link>

                {product.status === 'out-of-stock' && (
                    <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
                        <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
                            Hết hàng
                        </span>
                    </div>
                )}

                {product.oldPrice && product.oldPrice > product.price && (
                    <div className="absolute top-2 left-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                        -
                        {Math.round(
                            ((product.oldPrice - product.price) /
                                product.oldPrice) *
                                100,
                        )}
                        %
                    </div>
                )}

                {product.hot && (
                    <div className="absolute top-2 right-2 rounded bg-orange-500 px-2 py-1 text-xs font-bold text-white">
                        HOT
                    </div>
                )}

                {product.new && !product.hot && (
                    <div className="absolute top-2 right-2 rounded bg-green-500 px-2 py-1 text-xs font-bold text-white">
                        NEW
                    </div>
                )}

                <div className="absolute right-2 bottom-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {onAddToWishlist && (
                        <button
                            onClick={() => onAddToWishlist(product)}
                            className="rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
                            title="Thêm vào danh sách yêu thích"
                        >
                            <Heart size={16} className="text-gray-600" />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4">
                <Link
                    href={`/shop/${product.id}`}
                    className="hover:text-blue-600"
                >
                    <h3 className="line-clamp-2 h-12 font-medium text-gray-800">
                        {product.name}
                    </h3>
                </Link>

                {product.rating && (
                    <div className="mt-1 flex items-center">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    className={
                                        i < Math.floor(product.rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                    }
                                />
                            ))}
                        </div>
                        <span className="ml-1 text-xs text-gray-500">
                            ({product.reviews || 0})
                        </span>
                    </div>
                )}

                <div className="mt-2 flex items-end">
                    <span className="text-lg font-bold text-blue-600">
                        {product.price.toLocaleString()}đ
                    </span>
                    {product.oldPrice && product.oldPrice > product.price && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                            {product.oldPrice.toLocaleString()}đ
                        </span>
                    )}
                </div>

                <div className="mt-3">
                    <button
                        onClick={() => onAddToCart(product)}
                        disabled={product.status === 'out-of-stock'}
                        className={`flex w-full items-center justify-center gap-1 rounded-md px-3 py-2 text-sm font-medium ${
                            product.status === 'in-stock'
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'cursor-not-allowed bg-gray-200 text-gray-400'
                        }`}
                    >
                        <ShoppingCart size={16} />
                        <span>Thêm vào giỏ</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
