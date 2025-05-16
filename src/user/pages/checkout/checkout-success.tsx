'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, ShoppingBag, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CheckoutSuccess() {
    const [orderNumber, setOrderNumber] = useState('')

    useEffect(() => {
        // Tạo mã đơn hàng ngẫu nhiên
        const randomOrderNumber = Math.floor(
            100000 + Math.random() * 900000,
        ).toString()
        setOrderNumber(randomOrderNumber)
    }, [])

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-2xl text-center">
                <div className="mb-6 flex justify-center">
                    <CheckCircle size={64} className="text-green-500" />
                </div>
                <h1 className="mb-4 text-3xl font-bold text-gray-800">
                    Đặt hàng thành công!
                </h1>
                <p className="mb-2 text-lg text-gray-600">
                    Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được tiếp nhận
                    và đang được xử lý.
                </p>
                <p className="mb-8 text-gray-600">
                    Mã đơn hàng của bạn là:{' '}
                    <span className="font-semibold">{orderNumber}</span>
                </p>

                <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        Thông tin đơn hàng
                    </h2>
                    <div className="space-y-2 text-left">
                        <div className="flex justify-between border-b py-2">
                            <span className="text-gray-600">Trạng thái:</span>
                            <span className="font-medium text-green-600">
                                Đã tiếp nhận
                            </span>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <span className="text-gray-600">
                                Thời gian đặt hàng:
                            </span>
                            <span className="font-medium">
                                {new Date().toLocaleString('vi-VN')}
                            </span>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <span className="text-gray-600">
                                Phương thức thanh toán:
                            </span>
                            <span className="font-medium">
                                Thanh toán khi nhận hàng (COD)
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">
                                Dự kiến giao hàng:
                            </span>
                            <span className="font-medium">
                                3-5 ngày làm việc
                            </span>
                        </div>
                    </div>
                </div>

                <p className="mb-8 text-gray-600">
                    Chúng tôi sẽ gửi email xác nhận đơn hàng và thông tin chi
                    tiết đến địa chỉ email của bạn. Bạn cũng có thể theo dõi
                    trạng thái đơn hàng trong tài khoản của mình.
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Link
                        to="/shop"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-6 py-3 text-white transition-colors hover:bg-teal-700"
                    >
                        <Home size={20} />
                        Tiếp tục mua sắm
                    </Link>
                    <Link
                        to="/account/orders"
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50"
                    >
                        <ShoppingBag size={20} />
                        Xem đơn hàng của tôi
                    </Link>
                </div>
            </div>
        </div>
    )
}
