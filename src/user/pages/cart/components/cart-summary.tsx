import type React from 'react'
import { Link } from 'react-router-dom'

interface CartSummaryProps {
    subtotal: number
    shipping: number
    total: number
    itemCount: number
}

const CartSummary: React.FC<CartSummaryProps> = ({
    subtotal,
    shipping,
    total,
    itemCount,
}) => {
    return (
        <div className="sticky top-4 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-gray-800">
                Tóm tắt đơn hàng
            </h2>

            <div className="mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                        Tạm tính ({itemCount} sản phẩm)
                    </span>
                    <span className="font-medium">
                        {subtotal.toLocaleString()}đ
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium">
                        {shipping.toLocaleString()}đ
                    </span>
                </div>
                <div className="mt-3 border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                        <span className="font-medium">Tổng cộng</span>
                        <span className="font-bold text-teal-600">
                            {total.toLocaleString()}đ
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Đã bao gồm VAT (nếu có)
                    </p>
                </div>
            </div>

            <Link to="/checkout">
                <button className="w-full rounded-md bg-teal-500 py-3 font-medium text-white transition-colors hover:bg-teal-600">
                    Tiến hành thanh toán
                </button>
            </Link>

            <Link to="/shop">
                <button className="mt-3 w-full rounded-md border border-teal-500 py-3 font-medium text-teal-500 transition-colors hover:bg-teal-50">
                    Tiếp tục mua sắm
                </button>
            </Link>
        </div>
    )
}

export default CartSummary
