'use client'

import { useState } from 'react'
import {
    ArrowLeft,
    Printer,
    Download,
    User,
    Phone,
    MapPin,
    CreditCard,
    Package,
} from 'lucide-react'
import OrderProcessing from './components/order-processing'
import { Link, useParams } from 'react-router-dom'

export default function OrderDetail() {
    const [orderStatus, setOrderStatus] = useState<
        'pending' | 'processing' | 'completed' | 'cancelled'
    >('pending')
    const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>(
        'unpaid',
    )
    const { orderId } = useParams<{ orderId: string }>()
    // Dữ liệu mẫu cho đơn hàng
    const orderData = {
        id: orderId,
        date: '17/04/2023 14:30',
        customer: {
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            phone: '0987654321',
            address: '123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh',
        },
        items: [
            {
                id: 1,
                name: 'iPhone 14 Pro Max 256GB',
                price: 28990000,
                quantity: 1,
                total: 28990000,
            },
            {
                id: 2,
                name: 'Apple Watch Series 8',
                price: 10990000,
                quantity: 1,
                total: 10990000,
            },
        ],
        subtotal: 39980000,
        shipping: 50000,
        tax: 3998000,
        total: 44028000,
        paymentMethod: 'COD',
        note: 'Giao hàng trong giờ hành chính',
    }

    const handleStatusChange = (
        status: 'pending' | 'processing' | 'completed' | 'cancelled',
    ) => {
        setOrderStatus(status)
        // Nếu đơn hàng hoàn thành, cập nhật trạng thái thanh toán thành đã thanh toán
        if (status === 'completed') {
            setPaymentStatus('paid')
        }
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Chi tiết đơn hàng #{orderId}
                        </h1>
                        <div className="flex items-center text-sm text-gray-500">
                            <Link
                                to="/orders"
                                className="flex items-center text-teal-500 hover:text-teal-600"
                            >
                                <ArrowLeft size={16} className="mr-1" /> Quay
                                lại danh sách đơn hàng
                            </Link>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
                            <Printer size={16} className="mr-1" /> In đơn hàng
                        </button>
                        <button className="flex items-center rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600">
                            <Download size={16} className="mr-1" /> Xuất PDF
                        </button>
                    </div>
                </div>
            </div>

            <OrderProcessing
                orderId={orderId}
                currentStatus={orderStatus}
                onStatusChange={handleStatusChange}
            />

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center text-lg font-medium">
                        <User size={18} className="mr-2 text-teal-500" /> Thông
                        tin khách hàng
                    </h2>
                    <div className="space-y-2">
                        <p className="font-medium">{orderData.customer.name}</p>
                        <p className="text-gray-600">
                            {orderData.customer.email}
                        </p>
                        <p className="flex items-center text-gray-600">
                            <Phone size={16} className="mr-1 text-gray-400" />{' '}
                            {orderData.customer.phone}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center text-lg font-medium">
                        <MapPin size={18} className="mr-2 text-teal-500" /> Địa
                        chỉ giao hàng
                    </h2>
                    <p className="text-gray-600">
                        {orderData.customer.address}
                    </p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center text-lg font-medium">
                        <CreditCard size={18} className="mr-2 text-teal-500" />{' '}
                        Thông tin thanh toán
                    </h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Phương thức:</span>
                            <span className="font-medium">
                                {orderData.paymentMethod}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Trạng thái:</span>
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                    paymentStatus === 'paid'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-red-100 text-red-600'
                                }`}
                            >
                                {paymentStatus === 'paid'
                                    ? 'Đã thanh toán'
                                    : 'Chưa thanh toán'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center text-lg font-medium">
                    <Package size={18} className="mr-2 text-teal-500" /> Sản
                    phẩm đặt hàng
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Sản phẩm
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Đơn giá
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Số lượng
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Thành tiền
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {orderData.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-500">
                                        {item.price.toLocaleString()}đ
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-500">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                                        {item.total.toLocaleString()}đ
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between py-2">
                        <span className="text-gray-600">Tạm tính:</span>
                        <span className="font-medium">
                            {orderData.subtotal.toLocaleString()}đ
                        </span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-600">Phí vận chuyển:</span>
                        <span className="font-medium">
                            {orderData.shipping.toLocaleString()}đ
                        </span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-600">Thuế (10%):</span>
                        <span className="font-medium">
                            {orderData.tax.toLocaleString()}đ
                        </span>
                    </div>
                    <div className="flex justify-between py-2 text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-teal-600">
                            {orderData.total.toLocaleString()}đ
                        </span>
                    </div>
                </div>

                {orderData.note && (
                    <div className="mt-6 border-t pt-4">
                        <h3 className="mb-2 font-medium">Ghi chú đơn hàng:</h3>
                        <p className="text-gray-600">{orderData.note}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
