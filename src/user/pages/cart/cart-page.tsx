'use client'

import { useEffect } from 'react'
import { ShoppingCart, ChevronLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/cart-context'
import { useAuth } from '../../contexts/auth-context'
import CartItem from './components/cart-item'
import CartSummary from './components/cart-summary'

export default function CartPage() {
    const {
        items,
        updateQuantity,
        removeItem,
        totalItems,
        totalPrice,
        loading,
    } = useCart()
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    // Kiểm tra xem người dùng đã đăng nhập chưa
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=cart')
        }
    }, [isAuthenticated, navigate])

    // Nếu đang tải hoặc chưa đăng nhập, hiển thị trạng thái tải
    if (loading || !isAuthenticated) {
        return (
            <div className="container mx-auto flex items-center justify-center px-4 py-16">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-500 border-r-transparent"></div>
                    <p className="text-gray-600">Đang tải giỏ hàng...</p>
                </div>
            </div>
        )
    }

    // Phí vận chuyển cố định
    const shippingFee = items.length > 0 ? 30000 : 0

    // Tổng tiền đơn hàng
    const orderTotal = totalPrice + shippingFee

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    to="/shop"
                    className="flex items-center text-gray-600 hover:text-teal-500"
                >
                    <ChevronLeft size={16} />
                    <span className="ml-1">Tiếp tục mua sắm</span>
                </Link>
            </div>

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                    Giỏ hàng của bạn
                </h1>
                <div className="flex items-center gap-2 text-teal-500">
                    <ShoppingCart size={20} />
                    <span className="font-medium">{totalItems} sản phẩm</span>
                </div>
            </div>

            {items.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            {items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={updateQuantity}
                                    onRemove={removeItem}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <CartSummary
                            subtotal={totalPrice}
                            shipping={shippingFee}
                            total={orderTotal}
                            itemCount={totalItems}
                        />
                    </div>
                </div>
            ) : (
                <div className="rounded-lg bg-white py-16 text-center shadow-sm">
                    <div className="mb-4 flex justify-center">
                        <ShoppingCart size={64} className="text-gray-300" />
                    </div>
                    <h2 className="mb-2 text-xl font-medium text-gray-800">
                        Giỏ hàng của bạn đang trống
                    </h2>
                    <p className="mb-6 text-gray-500">
                        Hãy thêm sản phẩm vào giỏ hàng để tiến hành đặt hàng
                    </p>
                    <Link to="/shop">
                        <button className="rounded-md bg-teal-600 px-6 py-3 font-medium text-white hover:bg-teal-700">
                            Tiếp tục mua sắm
                        </button>
                    </Link>
                </div>
            )}
        </div>
    )
}
