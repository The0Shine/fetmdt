import { useState } from 'react'
import {
    ChevronLeft,
    Minus,
    Plus,
    ShoppingCart,
    Heart,
    Share2,
    Star,
} from 'lucide-react'
import { useCart } from '../../../contexts/cart-context'
import { products } from '../../../data/products'
import { Link } from 'react-router-dom'
import { Product } from '../../../../types/product'

// Giả lập dữ liệu sản phẩm

interface ProductDetailProps {
    productId: number
}

export default function ProductDetail({ productId }: ProductDetailProps) {
    const { addItem } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState('description')
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    // Tìm sản phẩm theo ID
    const product = products.find((p) => p.id === productId)

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                    Không tìm thấy sản phẩm
                </h2>
                <p className="mb-8 text-gray-600">
                    Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                </p>
                <Link
                    to="/shop"
                    className="inline-flex items-center rounded-md bg-teal-600 px-6 py-3 text-white hover:bg-teal-700"
                >
                    <ChevronLeft size={16} className="mr-2" />
                    Quay lại cửa hàng
                </Link>
            </div>
        )
    }

    // Định dạng giá tiền
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(price)
    }

    // Xử lý thay đổi số lượng
    const handleQuantityChange = (value: number) => {
        if (value >= 1 && value <= product.stock) {
            setQuantity(value)
        }
    }

    // Xử lý thêm vào giỏ hàng
    const handleAddToCart = () => {
        addItem({
            ...product,
            quantity,
        } as Product & { quantity: number })
    }

    return (
        <div className="container mx-auto px-8 py-8">
            {/* Đường dẫn */}
            <div className="mb-6">
                <Link
                    to="/shop"
                    className="flex items-center text-gray-600 hover:text-teal-600"
                >
                    <ChevronLeft size={16} />
                    <span className="ml-1">Quay lại cửa hàng</span>
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
                    {/* Hình ảnh sản phẩm */}
                    <div>
                        <div className="relative mb-4 h-80 rounded-lg bg-gray-100 md:h-96">
                            <img
                                src={'/placeholder.svg'}
                                alt={product.name}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain p-4"
                            />
                        </div>
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImageIndex(index)}
                                    className={`relative h-20 w-20 overflow-hidden rounded-md border-2 ${
                                        activeImageIndex === index
                                            ? 'border-teal-500'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <img
                                        src={image || '/placeholder.svg'}
                                        alt={`${product.name} - Ảnh ${index + 1}`}
                                        sizes="80px"
                                        className="object-contain p-1"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div>
                        <h1 className="mb-2 text-2xl font-bold text-gray-800">
                            {product.name}
                        </h1>
                        <div className="mb-4 flex items-center">
                            <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                        key={index}
                                        size={18}
                                        className={`${
                                            index < Math.floor(product.rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-500">
                                {product.rating} ({product.reviews} đánh giá)
                            </span>
                        </div>

                        <div className="mb-4 text-2xl font-bold text-teal-600">
                            {formatPrice(product.price)}
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600">
                                {product.description}
                            </p>
                        </div>

                        <div className="mb-6">
                            <div className="mb-2 flex items-center">
                                <div className="w-24 text-gray-600">
                                    Tình trạng:
                                </div>
                                <div
                                    className={
                                        product.stock > 0
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }
                                >
                                    {product.stock > 0
                                        ? 'Còn hàng'
                                        : 'Hết hàng'}
                                </div>
                            </div>
                            {product.stock > 0 && (
                                <div className="flex items-center">
                                    <div className="w-24 text-gray-600">
                                        Số lượng:
                                    </div>
                                    <div className="flex items-center rounded-md border">
                                        <button
                                            onClick={() =>
                                                handleQuantityChange(
                                                    quantity - 1,
                                                )
                                            }
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={product.stock}
                                            value={quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    Number.parseInt(
                                                        e.target.value,
                                                    ) || 1,
                                                )
                                            }
                                            className="w-12 border-x py-1 text-center"
                                        />
                                        <button
                                            onClick={() =>
                                                handleQuantityChange(
                                                    quantity + 1,
                                                )
                                            }
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                            disabled={quantity >= product.stock}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                            <button
                                onClick={handleAddToCart}
                                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-teal-600 px-6 py-3 text-white transition-colors hover:bg-teal-700"
                                disabled={product.stock <= 0}
                            >
                                <ShoppingCart size={20} />
                                Thêm vào giỏ hàng
                            </button>
                            <button className="flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-3 transition-colors hover:bg-gray-50">
                                <Heart size={20} />
                                <span className="hidden sm:inline">
                                    Yêu thích
                                </span>
                            </button>
                            <button className="flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-3 transition-colors hover:bg-gray-50">
                                <Share2 size={20} />
                                <span className="hidden sm:inline">
                                    Chia sẻ
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs thông tin chi tiết */}
                <div className="border-t">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`px-6 py-3 font-medium ${
                                activeTab === 'description'
                                    ? 'border-b-2 border-teal-600 text-teal-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Mô tả
                        </button>
                        <button
                            onClick={() => setActiveTab('specifications')}
                            className={`px-6 py-3 font-medium ${
                                activeTab === 'specifications'
                                    ? 'border-b-2 border-teal-600 text-teal-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Thông số kỹ thuật
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-6 py-3 font-medium ${
                                activeTab === 'reviews'
                                    ? 'border-b-2 border-teal-600 text-teal-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Đánh giá
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'description' && (
                            <div className="prose max-w-none">
                                <p>{product.description}</p>
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <tbody className="divide-y divide-gray-200">
                                        {(product.specifications ?? []).map(
                                            (
                                                spec: {
                                                    name: string
                                                    value: string
                                                },
                                                index: number,
                                            ) => (
                                                <tr key={index}>
                                                    <td className="w-1/3 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                                                        {spec.name}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        {spec.value}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div>
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">
                                        Đánh giá từ khách hàng
                                    </h3>
                                    <button className="rounded-md bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700">
                                        Viết đánh giá
                                    </button>
                                </div>
                                <div className="py-8 text-center text-gray-500">
                                    <p>
                                        Chưa có đánh giá nào cho sản phẩm này.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
