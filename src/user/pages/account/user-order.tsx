'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, Link, ShoppingBag } from 'lucide-react'
import { useAuth } from '../../contexts/auth-context'

// Giả lập dữ liệu đơn hàng
const mockOrders = [
    {
        id: 'ORD123456',
        date: '2023-06-15T08:30:00Z',
        status: 'delivered',
        total: 1289000,
        items: [
            {
                id: 1,
                name: 'Smartphone XYZ',
                price: 12990000,
                quantity: 1,
                image: '/placeholder.svg?height=80&width=80',
            },
        ],
        paymentMethod: 'COD',
        shippingAddress: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
    },
    {
        id: 'ORD123457',
        date: '2023-05-20T10:15:00Z',
        status: 'delivered',
        total: 599000,
        items: [
            {
                id: 4,
                name: 'Áo thun nam',
                price: 299000,
                quantity: 1,
                image: '/placeholder.svg?height=80&width=80',
            },
            {
                id: 5,
                name: 'Quần jean nữ',
                price: 599000,
                quantity: 1,
                image: '/placeholder.svg?height=80&width=80',
            },
        ],
        paymentMethod: 'Bank Transfer',
        shippingAddress: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
    },
    {
        id: 'ORD123458',
        date: '2023-04-05T14:45:00Z',
        status: 'cancelled',
        total: 2990000,
        items: [
            {
                id: 3,
                name: 'Tai nghe không dây',
                price: 2990000,
                quantity: 1,
                image: '/placeholder.svg?height=80&width=80',
            },
        ],
        paymentMethod: 'MoMo',
        shippingAddress: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
    },
]

// Ánh xạ trạng thái đơn hàng
const orderStatusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
    shipped: { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-800' },
    delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
}

export default function UserOrders() {
    const { user } = useAuth()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<any>(null)

    useEffect(() => {
        // Giả lập API call
        setTimeout(() => {
            setOrders(mockOrders)
            setLoading(false)
        }, 1000)
    }, [])

    // Định dạng giá tiền
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(price)
    }

    // Định dạng ngày tháng
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date)
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                    Bạn chưa đăng nhập
                </h2>
                <p className="mb-8 text-gray-600">
                    Vui lòng đăng nhập để xem đơn hàng của bạn.
                </p>
                <Link
                    href="/login"
                    className="inline-flex items-center rounded-md bg-teal-600 px-6 py-3 text-white hover:bg-teal-700"
                >
                    Đăng nhập
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    href="/account"
                    className="flex items-center text-gray-600 hover:text-teal-600"
                >
                    <ChevronLeft size={16} />
                    <span className="ml-1">Quay lại tài khoản</span>
                </Link>
            </div>

            <h1 className="mb-8 text-2xl font-bold text-gray-800">
                Đơn hàng của tôi
            </h1>

            {loading ? (
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="rounded-md border p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                                    <div className="h-4 w-1/6 rounded bg-gray-200"></div>
                                </div>
                                <div className="mb-2 h-4 w-1/3 rounded bg-gray-200"></div>
                                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : orders.length > 0 ? (
                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Mã đơn hàng
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Ngày đặt
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Trạng thái
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Tổng tiền
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                                    >
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                            {formatDate(order.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                                    orderStatusMap[order.status]
                                                        ?.color ||
                                                    'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {orderStatusMap[order.status]
                                                    ?.label || order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                            {formatPrice(order.total)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                            <button
                                                onClick={() =>
                                                    setSelectedOrder(order)
                                                }
                                                className="text-teal-600 hover:text-teal-900"
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                    <ShoppingBag
                        size={48}
                        className="mx-auto mb-4 text-gray-300"
                    />
                    <h2 className="mb-2 text-xl font-medium text-gray-800">
                        Bạn chưa có đơn hàng nào
                    </h2>
                    <p className="mb-6 text-gray-500">
                        Hãy mua sắm và đặt hàng để xem lịch sử đơn hàng tại đây.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center rounded-md bg-teal-600 px-6 py-3 text-white hover:bg-teal-700"
                    >
                        <ShoppingBag size={16} className="mr-2" />
                        Mua sắm ngay
                    </Link>
                </div>
            )}

            {/* Modal chi tiết đơn hàng */}
            {selectedOrder && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Chi tiết đơn hàng
                                </h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="mb-2 flex justify-between">
                                    <span className="text-gray-600">
                                        Mã đơn hàng:
                                    </span>
                                    <span className="font-medium">
                                        {selectedOrder.id}
                                    </span>
                                </div>
                                <div className="mb-2 flex justify-between">
                                    <span className="text-gray-600">
                                        Ngày đặt hàng:
                                    </span>
                                    <span>
                                        {formatDate(selectedOrder.date)}
                                    </span>
                                </div>
                                <div className="mb-2 flex justify-between">
                                    <span className="text-gray-600">
                                        Trạng thái:
                                    </span>
                                    <span
                                        className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                            orderStatusMap[selectedOrder.status]
                                                ?.color ||
                                            'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {orderStatusMap[selectedOrder.status]
                                            ?.label || selectedOrder.status}
                                    </span>
                                </div>
                                <div className="mb-2 flex justify-between">
                                    <span className="text-gray-600">
                                        Phương thức thanh toán:
                                    </span>
                                    <span>{selectedOrder.paymentMethod}</span>
                                </div>
                                <div className="mb-2 flex justify-between">
                                    <span className="text-gray-600">
                                        Địa chỉ giao hàng:
                                    </span>
                                    <span className="text-right">
                                        {selectedOrder.shippingAddress}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6 border-t pt-4">
                                <h3 className="mb-4 font-medium text-gray-800">
                                    Sản phẩm
                                </h3>
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item: any) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start"
                                        >
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <img
                                                    src={
                                                        item.image ||
                                                        '/placeholder.svg'
                                                    }
                                                    alt={item.name}
                                                    className="h-full w-full object-contain object-center"
                                                />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex justify-between">
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatPrice(
                                                            item.price *
                                                                item.quantity,
                                                        )}
                                                    </p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {formatPrice(item.price)} x{' '}
                                                    {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="mb-2 flex justify-between">
                                    <span className="text-gray-600">
                                        Tổng tiền sản phẩm:
                                    </span>
                                    <span>
                                        {formatPrice(
                                            selectedOrder.total - 30000,
                                        )}
                                    </span>
                                </div>
                                <div className="mb-2 flex justify-between">
                                    <span className="text-gray-600">
                                        Phí vận chuyển:
                                    </span>
                                    <span>{formatPrice(30000)}</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span>Tổng cộng:</span>
                                    <span className="text-teal-600">
                                        {formatPrice(selectedOrder.total)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
