'use client'

import { useState } from 'react'
import { ChevronLeft, Link } from 'lucide-react'
import { useCart } from '../../contexts/cart-context'
import CheckoutForm from './checkout-form'
import OrderSummary from './order-summary'
import { useNavigate } from 'react-router-dom'
export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    // Phí vận chuyển cố định
    const shippingFee = items.length > 0 ? 30000 : 0

    // Tổng tiền đơn hàng
    const orderTotal = totalPrice + shippingFee

    // Xử lý đặt hàng
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const handlePlaceOrder = async (formData: any) => {
        setLoading(true)

        try {
            // Giả lập API call
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Xóa giỏ hàng
            clearCart()

            // Chuyển hướng đến trang thành công
            navigate('/checkout/success')
        } catch (error) {
            console.error('Lỗi khi đặt hàng:', error)
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                    Giỏ hàng của bạn đang trống
                </h2>
                <p className="mb-8 text-gray-600">
                    Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.
                </p>
                <Link
                    href="/shop"
                    className="inline-flex items-center rounded-md bg-teal-600 px-6 py-3 text-white hover:bg-teal-700"
                >
                    <ChevronLeft size={16} className="mr-2" />
                    Tiếp tục mua sắm
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-8 py-8">
            <div className="mb-6">
                <Link
                    href="/cart"
                    className="flex items-center text-gray-600 hover:text-teal-600"
                >
                    <ChevronLeft size={16} />
                    <span className="ml-1">Quay lại giỏ hàng</span>
                </Link>
            </div>

            <h1 className="mb-8 text-2xl font-bold text-gray-800">
                Thanh toán
            </h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <CheckoutForm
                        onSubmit={handlePlaceOrder}
                        loading={loading}
                    />
                </div>

                <div className="lg:col-span-1">
                    <OrderSummary
                        items={items}
                        subtotal={totalPrice}
                        shipping={shippingFee}
                        total={orderTotal}
                    />
                </div>
            </div>
        </div>
    )
}
