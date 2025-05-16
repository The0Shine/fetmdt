"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { ChevronLeft, Plus, Minus, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Check } from "lucide-react"
import { getProductById, getRecommendedProducts } from "@/data/products"
import ProductSection from "@/components/home/product-section"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")

  // Lấy thông tin sản phẩm dựa trên ID
  const productId = Number(params.id)
  const product = getProductById(productId)

  // Lấy sản phẩm đề xuất
  const recommendedProducts = getRecommendedProducts()
    .filter((p) => p.id !== productId)
    .slice(0, 4)

  // Nếu không tìm thấy sản phẩm, chuyển hướng về trang cửa hàng
  if (!product) {
    router.push("/shop")
    return null
  }

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product.stock || 10)) {
      setQuantity(value)
    }
  }

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  // Xử lý mua ngay
  const handleBuyNow = () => {
    addItem(product, quantity)
    router.push("/cart")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/shop" className="flex items-center text-gray-600 hover:text-blue-600">
          <ChevronLeft size={16} />
          <span className="ml-1">Quay lại cửa hàng</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="relative h-80 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
            {product.image ? (
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain p-4" />
            ) : (
              <Image src="/placeholder.svg?height=384&width=384" alt={product.name} fill className="object-contain" />
            )}

            {product.status === "out-of-stock" && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-medium px-3 py-1 bg-red-500 rounded-full text-sm">Hết hàng</span>
              </div>
            )}

            {product.hot && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                HOT
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>

            <div className="flex items-center mb-4">
              {product.rating && (
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    {product.rating} ({product.reviews || 0} đánh giá)
                  </span>
                </div>
              )}

              <span className="mx-3 text-gray-300">|</span>

              <span className={`text-sm ${product.status === "in-stock" ? "text-green-600" : "text-red-600"}`}>
                {product.status === "in-stock" ? "Còn hàng" : "Hết hàng"}
              </span>

              <span className="mx-3 text-gray-300">|</span>

              <span className="text-sm text-gray-500">Mã SP: {product.barcode}</span>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-blue-600">{product.price.toLocaleString()}đ</span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="ml-2 text-lg text-gray-500 line-through">{product.oldPrice.toLocaleString()}đ</span>
              )}

              {product.oldPrice && product.oldPrice > product.price && (
                <span className="ml-2 text-sm text-white bg-red-500 px-2 py-1 rounded">
                  Tiết kiệm {(product.oldPrice - product.price).toLocaleString()}đ
                </span>
              )}
            </div>

            <div className="mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>

            {product.status === "in-stock" && (
              <div className="mb-6">
                <div className="flex items-center">
                  <span className="text-gray-700 mr-4">Số lượng:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className={`px-3 py-1 ${quantity <= 1 ? "text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                      className="w-12 text-center border-x border-gray-300 py-1"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className={`px-3 py-1 ${
                        quantity >= product.stock ? "text-gray-300" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="ml-4 text-sm text-gray-500">
                    Còn {product.stock} {product.unit}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.status === "out-of-stock"}
                className={`flex-1 py-3 px-6 rounded-md font-medium flex items-center justify-center gap-2 ${
                  product.status === "in-stock"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ShoppingCart size={18} />
                <span>Thêm vào giỏ</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.status === "out-of-stock"}
                className={`flex-1 py-3 px-6 rounded-md font-medium ${
                  product.status === "in-stock"
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Mua ngay
              </button>

              <button className="p-3 border border-gray-300 rounded-md text-gray-500 hover:text-red-500 hover:border-red-500">
                <Heart size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start">
                <Truck size={18} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Giao hàng miễn phí</p>
                  <p className="text-xs text-gray-500">Cho đơn hàng từ 500.000đ</p>
                </div>
              </div>

              <div className="flex items-start">
                <Shield size={18} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Bảo hành chính hãng</p>
                  <p className="text-xs text-gray-500">12 tháng tại trung tâm bảo hành</p>
                </div>
              </div>

              <div className="flex items-start">
                <RotateCcw size={18} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Đổi trả dễ dàng</p>
                  <p className="text-xs text-gray-500">7 ngày đổi trả miễn phí</p>
                </div>
              </div>

              <div className="flex items-start">
                <Check size={18} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Sản phẩm chính hãng</p>
                  <p className="text-xs text-gray-500">100% hàng chính hãng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "description" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Mô tả sản phẩm
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "specifications" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("specifications")}
            >
              Thông số kỹ thuật
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "reviews" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh giá ({product.reviews || 0})
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "description" && (
            <div className="prose max-w-none">
              <p>{product.description}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                laborum.
              </p>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200">
                  {product.specifications &&
                    Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td className="py-3 px-4 text-sm font-medium text-gray-700 bg-gray-50 w-1/3">{key}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {product.reviews && product.reviews > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">KH</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800">Khách hàng</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-500">2 ngày trước</span>
                      </div>
                      <div className="flex mt-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">
                        Sản phẩm rất tốt, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ shop lần sau.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">NT</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800">Nguyễn Thành</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-500">1 tuần trước</span>
                      </div>
                      <div className="flex mt-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">
                        Chất lượng sản phẩm tốt, giá cả hợp lý. Tuy nhiên thời gian giao hàng hơi lâu.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sản phẩm đề xuất */}
      <ProductSection title="Sản phẩm tương tự" products={recommendedProducts} onAddToCart={handleAddToCart} />
    </div>
  )
}
