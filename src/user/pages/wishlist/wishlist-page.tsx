'use client'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { formatCurrency } from '../../../utils/Format'
import axios from 'axios'
import ShopLayout from '@/user/layouts/ShopLayout'
import { Product } from '@/types/product'
import { useCart } from '@/user/contexts/cart-context'
import { mainRepository } from '@/utils/Repository'

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { addItem } = useCart()
    const token = localStorage.getItem('token') // hoặc từ cookie
    const handleAddToCart = (product: Product) => {
        addItem(product, 1)
    }
    const fetchWishlist = async () => {
        try {
            const res = await mainRepository.get('/api/users/wishlist')
            console.log(res)

            setWishlist(res.data)
        } catch (error) {
            console.error('Lỗi khi lấy wishlist:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = async (productId: string) => {
        try {
            await mainRepository.delete(`/api/users/wishlist/${productId}`)
            setWishlist((prev) => prev.filter((p) => p._id !== productId))
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error)
        }
    }

    useEffect(() => {
        fetchWishlist()
    }, [])

    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                <Heart className="h-6 w-6" />
                Danh sách yêu thích
            </h1>

            {loading ? (
                <p>Đang tải...</p>
            ) : wishlist.length === 0 ? (
                <div className="py-12 text-center">
                    <Heart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                    <h2 className="mb-2 text-xl font-semibold">
                        Danh sách yêu thích của bạn đang trống
                    </h2>
                    <p className="mb-6 text-gray-500">
                        Hãy thêm sản phẩm yêu thích của bạn vào đây để xem sau
                    </p>
                    <Button asChild>
                        <Link to={'/'}>Tiếp tục mua sắm</Link>
                    </Button>
                </div>
            ) : (
                <>
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-gray-500">
                            {wishlist.length} sản phẩm trong danh sách yêu thích
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {wishlist.map((product) => (
                            <div
                                key={product._id}
                                className="flex h-[350px] flex-col justify-between overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md"
                            >
                                <Link to={`/shop/product/${product._id}`}>
                                    <div className="relative h-48 bg-gray-100">
                                        <img
                                            src={
                                                product.image ||
                                                '/placeholder.svg'
                                            }
                                            alt={product.name}
                                            className="h-full w-full object-contain p-4"
                                            onError={(e) => {
                                                const target =
                                                    e.target as HTMLImageElement
                                                // Kiểm tra để tránh vòng lặp vô hạn
                                                if (
                                                    !target.src.includes(
                                                        'placeholder.svg',
                                                    )
                                                ) {
                                                    target.src =
                                                        '/placeholder.svg?height=192&width=192'
                                                }
                                                // Ngăn chặn sự kiện onError kích hoạt lại
                                                target.onerror = null
                                            }}
                                        />
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <Link to={``}>
                                        <h3 className="hover:text-primary mb-2 line-clamp-1 text-lg font-semibold transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-primary mb-4 font-bold">
                                        {formatCurrency(product.price)}
                                    </p>
                                    <div className="flex space-x-2">
                                        <Button
                                            onClick={() =>
                                                handleAddToCart(product)
                                            }
                                            className="flex flex-1 items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                            Thêm vào giỏ
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                handleRemove(product._id)
                                            }
                                            className="p-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
