'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import {
    ChevronLeft,
    ShoppingBag,
    Package,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Search,
    Filter,
    Calendar,
    AlertTriangle,
    Loader2,
    RefreshCw,
} from 'lucide-react'
import { useAuth } from '../../contexts/auth-context'
import { mainRepository } from '../../../utils/Repository'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card, CardContent } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from '../../../components/ui/dialog'
import { Skeleton } from '../../../components/ui/skeleton'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { Textarea } from '../../../components/ui/textarea'
import { toast } from 'sonner'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '../../../components/ui/tabs'
import { requestRefund } from '@/services/apiOrder.service'

// Define order interfaces based on your backend structure
interface OrderItem {
    _id: string
    product: {
        _id: string
        name: string
        price: number
        image: string
    }
    quantity: number
    price: number
}

interface RefundInfo {
    refundReason?: string
    refundDate?: string
    refundTransactionId?: string
    notes?: string
    images?: string[]
}

interface Order {
    _id: string
    orderNumber?: string
    createdAt: string
    updatedAt: string
    user: {
        _id: string
        email: string
        name?: string
    }
    orderItems: OrderItem[]
    shippingAddress: {
        address: string
        city: string
        district?: string
        ward?: string
        phone?: string
    }
    paymentMethod: string
    itemsPrice: number
    shippingPrice?: number
    totalPrice: number
    isPaid: boolean
    paidAt?: string
    status:
        | 'pending'
        | 'processing'
        | 'completed'
        | 'cancelled'
        | 'refund_requested'
        | 'refunded'
    note?: string
    refundInfo?: RefundInfo
}

// Cập nhật trạng thái đơn hàng theo yêu cầu
const orderStatusConfig = {
    pending: {
        label: 'Chờ xử lý',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        description: 'Đơn hàng đang chờ được xử lý',
        canCancel: true,
        canRefund: false,
    },
    processing: {
        label: 'Đang xử lý',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Package,
        description: 'Đơn hàng đang được xử lý và chuẩn bị giao',
        canCancel: false,
        canRefund: false,
    },
    completed: {
        label: 'Hoàn thành',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        description: 'Đơn hàng đã được hoàn thành',
        canCancel: false,
        canRefund: true,
    },
    cancelled: {
        label: 'Đã hủy',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        description: 'Đơn hàng đã bị hủy',
        canCancel: false,
        canRefund: false,
    },
    refund_requested: {
        label: 'Yêu cầu hoàn tiền',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: RefreshCw,
        description: 'Yêu cầu hoàn tiền đang được xử lý',
        canCancel: false,
        canRefund: false,
    },
    refunded: {
        label: 'Đã hoàn tiền',
        color: 'bg-teal-100 text-teal-800 border-teal-200',
        icon: CheckCircle,
        description: 'Đơn hàng đã được hoàn tiền',
        canCancel: false,
        canRefund: false,
    },
}

export default function UserOrders() {
    const { user } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
        null,
    )
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [orderToCancel, setOrderToCancel] = useState<Order | null>(null)

    // Refund related states
    const [showRefundDialog, setShowRefundDialog] = useState(false)
    const [orderToRefund, setOrderToRefund] = useState<Order | null>(null)
    const [refundReason, setRefundReason] = useState('')
    const [refundNotes, setRefundNotes] = useState('')
    const [isSubmittingRefund, setIsSubmittingRefund] = useState(false)

    // Filter states
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [dateFilter, setDateFilter] = useState<string>('all')

    useEffect(() => {
        fetchOrders()
    }, [user])

    useEffect(() => {
        filterOrders()
    }, [orders, searchTerm, statusFilter, dateFilter])

    const fetchOrders = async () => {
        if (!user) {
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            // Sử dụng endpoint đúng theo backend
            const response = await mainRepository.get('/api/orders/myorders')

            if (response && response.data) {
                // Xử lý dữ liệu response từ backend
                const ordersData = Array.isArray(response.data)
                    ? response.data
                    : response.data.orders || []
                setOrders(ordersData)
                setError(null)
            } else {
                setError('Không thể tải đơn hàng')
            }
        } catch (err: any) {
            console.error('Error fetching orders:', err)
            if (err.response?.status === 401) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
            } else {
                setError('Đã xảy ra lỗi khi tải đơn hàng')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCancelOrder = async (order: Order) => {
        setOrderToCancel(order)
        setShowCancelDialog(true)
    }

    const confirmCancelOrder = async () => {
        if (!orderToCancel) return

        try {
            setCancellingOrderId(orderToCancel._id)

            // Call API to update order status to cancelled
            const response = await mainRepository.put(
                `/api/orders/${orderToCancel._id}/status`,
                {
                    status: 'cancelled',
                },
            )

            if (response) {
                // Update local state
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderToCancel._id
                            ? { ...order, status: 'cancelled' as const }
                            : order,
                    ),
                )

                toast.success('Đơn hàng đã được hủy thành công')
            } else {
                throw new Error('Không thể hủy đơn hàng')
            }
        } catch (err: any) {
            console.error('Error cancelling order:', err)
            toast.error('Không thể hủy đơn hàng. Vui lòng thử lại sau.')
        } finally {
            setCancellingOrderId(null)
            setShowCancelDialog(false)
            setOrderToCancel(null)
        }
    }

    // Handle refund request
    const handleRefundRequest = (order: Order) => {
        setOrderToRefund(order)
        setRefundReason('')
        setRefundNotes('')
        setShowRefundDialog(true)
    }

    // Update the submitRefundRequest function to use the new endpoint and structure

    const submitRefundRequest = async () => {
        if (!orderToRefund) return

        if (!refundReason.trim()) {
            toast.error('Vui lòng nhập lý do hoàn tiền')
            return
        }

        try {
            setIsSubmittingRefund(true)

            // Chuẩn bị dữ liệu hoàn tiền
            const refundData = {
                orderId: orderToRefund._id,
                refundReason,
                notes: refundNotes,
                // Có thể thêm bankInfo nếu cần
            }

            // Gọi hàm requestRefund từ apiOrder.service.ts
            // const response = await mainRepository.post(
            //     '/api/orders/refund-request',
            //     refundData,
            // )
            const response = await requestRefund(refundData)

            if (response) {
                // Cập nhật state local
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderToRefund._id
                            ? {
                                  ...order,
                                  status: 'refund_requested' as const,
                                  refundInfo: {
                                      refundReason,
                                      notes: refundNotes,
                                      refundDate: new Date().toISOString(),
                                  },
                              }
                            : order,
                    ),
                )

                toast.success('Yêu cầu hoàn tiền đã được gửi thành công')
                setShowRefundDialog(false)
            } else {
                throw new Error('Không thể gửi yêu cầu hoàn tiền')
            }
        } catch (err: any) {
            console.error('Error submitting refund request:', err)
            toast.error(
                err.response?.data?.message ||
                    'Không thể gửi yêu cầu hoàn tiền. Vui lòng thử lại sau.',
            )
        } finally {
            setIsSubmittingRefund(false)
        }
    }

    const filterOrders = () => {
        let filtered = [...orders]

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (order) =>
                    (order.orderNumber &&
                        order.orderNumber
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())) ||
                    order._id
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    order.orderItems.some((item) =>
                        item.product.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()),
                    ),
            )
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter((order) => order.status === statusFilter)
        }

        // Filter by date
        if (dateFilter !== 'all') {
            const now = new Date()
            const filterDate = new Date()

            switch (dateFilter) {
                case 'week':
                    filterDate.setDate(now.getDate() - 7)
                    break
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1)
                    break
                case 'quarter':
                    filterDate.setMonth(now.getMonth() - 3)
                    break
            }

            if (dateFilter !== 'all') {
                filtered = filtered.filter(
                    (order) => new Date(order.createdAt) >= filterDate,
                )
            }
        }

        setFilteredOrders(filtered)
    }

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

    const getStatusBadge = (status: string) => {
        const config =
            orderStatusConfig[status as keyof typeof orderStatusConfig]
        if (!config) return null

        const Icon = config.icon

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {config.label}
            </Badge>
        )
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                    Bạn chưa đăng nhập
                </h2>
                <p className="mb-8 text-gray-600">
                    Vui lòng đăng nhập để xem đơn hàng của bạn.
                </p>
                <Button asChild>
                    <a href="/login">Đăng nhập</a>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4">
                    <a
                        href="/account"
                        className="flex items-center text-gray-600 hover:text-teal-600"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Quay lại tài khoản
                    </a>
                </Button>

                <h1 className="mb-2 text-3xl font-bold text-gray-800">
                    Đơn hàng của tôi
                </h1>
                <p className="text-gray-600">
                    Theo dõi và quản lý các đơn hàng của bạn
                </p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <Input
                                placeholder="Tìm kiếm đơn hàng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger>
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Tất cả trạng thái
                                </SelectItem>
                                {Object.entries(orderStatusConfig).map(
                                    ([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                            {config.label}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>

                        <Select
                            value={dateFilter}
                            onValueChange={setDateFilter}
                        >
                            <SelectTrigger>
                                <Calendar className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Thời gian" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Tất cả thời gian
                                </SelectItem>
                                <SelectItem value="week">7 ngày qua</SelectItem>
                                <SelectItem value="month">
                                    30 ngày qua
                                </SelectItem>
                                <SelectItem value="quarter">
                                    3 tháng qua
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm('')
                                setStatusFilter('all')
                                setDateFilter('all')
                            }}
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Error State */}
            {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-700">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <Card key={index}>
                            <CardContent className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-4 w-36" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredOrders.length > 0 ? (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <Card
                            key={order._id}
                            className="transition-shadow hover:shadow-md"
                        >
                            <CardContent className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            Đơn hàng #
                                            {order.orderNumber ||
                                                order._id.slice(-8)}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Đặt ngày:{' '}
                                            {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        {getStatusBadge(order.status)}
                                        <p className="mt-1 text-lg font-semibold text-teal-600">
                                            {formatPrice(order.totalPrice)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex -space-x-2">
                                            {order.orderItems
                                                .slice(0, 3)
                                                .map((item, index) => (
                                                    <div
                                                        key={item._id}
                                                        className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-gray-100"
                                                    >
                                                        <img
                                                            src={
                                                                item.product
                                                                    .image ||
                                                                '/placeholder.svg?height=40&width=40' ||
                                                                '/placeholder.svg' ||
                                                                '/placeholder.svg' ||
                                                                '/placeholder.svg' ||
                                                                '/placeholder.svg'
                                                            }
                                                            alt={
                                                                item.product
                                                                    .name
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            {order.orderItems.length > 3 && (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium">
                                                    +
                                                    {order.orderItems.length -
                                                        3}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                {order.orderItems.length} sản
                                                phẩm
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {order.paymentMethod}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Cancel Button - Only show for pending orders */}
                                        {orderStatusConfig[order.status]
                                            ?.canCancel && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleCancelOrder(order)
                                                }
                                                disabled={
                                                    cancellingOrderId ===
                                                    order._id
                                                }
                                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                            >
                                                {cancellingOrderId ===
                                                order._id ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                )}
                                                Hủy đơn
                                            </Button>
                                        )}

                                        {/* Refund Button - Only show for completed orders */}
                                        {orderStatusConfig[order.status]
                                            ?.canRefund && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleRefundRequest(order)
                                                }
                                                className="text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                                            >
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                Yêu cầu hoàn tiền
                                            </Button>
                                        )}

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setSelectedOrder(order)
                                                    }
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Chi tiết
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Chi tiết đơn hàng #
                                                        {order.orderNumber ||
                                                            order._id.slice(-8)}
                                                    </DialogTitle>
                                                </DialogHeader>

                                                {selectedOrder && (
                                                    <OrderDetailModal
                                                        order={selectedOrder}
                                                        onCancelOrder={
                                                            handleCancelOrder
                                                        }
                                                        onRefundRequest={
                                                            handleRefundRequest
                                                        }
                                                    />
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                        <h2 className="mb-2 text-xl font-medium text-gray-800">
                            {searchTerm ||
                            statusFilter !== 'all' ||
                            dateFilter !== 'all'
                                ? 'Không tìm thấy đơn hàng nào'
                                : 'Bạn chưa có đơn hàng nào'}
                        </h2>
                        <p className="mb-6 text-gray-500">
                            {searchTerm ||
                            statusFilter !== 'all' ||
                            dateFilter !== 'all'
                                ? 'Thử thay đổi bộ lọc để xem thêm đơn hàng'
                                : 'Hãy mua sắm và đặt hàng để xem lịch sử đơn hàng tại đây.'}
                        </p>
                        <Button asChild>
                            <a href="/shop">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Mua sắm ngay
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Cancel Order Confirmation Dialog */}
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Xác nhận hủy đơn hàng
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-600">
                            Bạn có chắc chắn muốn hủy đơn hàng{' '}
                            <span className="font-semibold">
                                #
                                {orderToCancel?.orderNumber ||
                                    orderToCancel?._id.slice(-8)}
                            </span>{' '}
                            không?
                        </p>
                        <p className="mt-2 text-sm text-red-600">
                            Hành động này không thể hoàn tác.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                            disabled={cancellingOrderId !== null}
                        >
                            Không
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmCancelOrder}
                            disabled={cancellingOrderId !== null}
                        >
                            {cancellingOrderId ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang hủy...
                                </>
                            ) : (
                                'Xác nhận hủy'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Refund Request Dialog */}
            <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Yêu cầu hoàn tiền</DialogTitle>
                        <DialogDescription>
                            Vui lòng cung cấp thông tin chi tiết về yêu cầu hoàn
                            tiền của bạn
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="form" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="form">
                                Thông tin hoàn tiền
                            </TabsTrigger>
                            <TabsTrigger value="policy">
                                Chính sách hoàn tiền
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="form" className="space-y-4 py-4">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="mb-2 text-sm font-medium">
                                        Đơn hàng
                                    </h3>
                                    <div className="rounded-md border p-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">
                                                #
                                                {orderToRefund?.orderNumber ||
                                                    orderToRefund?._id.slice(
                                                        -8,
                                                    )}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {orderToRefund &&
                                                    formatDate(
                                                        orderToRefund.createdAt,
                                                    )}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex justify-between">
                                            <span className="text-sm text-gray-600">
                                                {
                                                    orderToRefund?.orderItems
                                                        .length
                                                }{' '}
                                                sản phẩm
                                            </span>
                                            <span className="font-medium text-teal-600">
                                                {orderToRefund &&
                                                    formatPrice(
                                                        orderToRefund.totalPrice,
                                                    )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="refundReason"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Lý do hoàn tiền{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        value={refundReason}
                                        onValueChange={setRefundReason}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn lý do hoàn tiền" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="damaged">
                                                Sản phẩm bị hư hỏng
                                            </SelectItem>
                                            <SelectItem value="wrong_item">
                                                Sản phẩm không đúng mô tả
                                            </SelectItem>
                                            <SelectItem value="size_issue">
                                                Vấn đề về kích thước
                                            </SelectItem>
                                            <SelectItem value="quality_issue">
                                                Chất lượng không đạt yêu cầu
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Lý do khác
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="refundNotes"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Mô tả chi tiết
                                    </label>
                                    <Textarea
                                        id="refundNotes"
                                        placeholder="Vui lòng mô tả chi tiết vấn đề của bạn..."
                                        value={refundNotes}
                                        onChange={(e) =>
                                            setRefundNotes(e.target.value)
                                        }
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="policy" className="space-y-4 py-4">
                            <div className="rounded-md bg-gray-50 p-4">
                                <h3 className="mb-3 text-base font-medium">
                                    Chính sách hoàn tiền
                                </h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <p>
                                        <strong>1. Điều kiện hoàn tiền:</strong>{' '}
                                        Chúng tôi chấp nhận yêu cầu hoàn tiền
                                        trong vòng 7 ngày kể từ ngày nhận hàng.
                                    </p>
                                    <p>
                                        <strong>
                                            2. Các trường hợp được hoàn tiền:
                                        </strong>
                                    </p>
                                    <ul className="list-inside list-disc space-y-1 pl-4">
                                        <li>
                                            Sản phẩm bị hư hỏng khi nhận hàng
                                        </li>
                                        <li>Sản phẩm không đúng với mô tả</li>
                                        <li>
                                            Sản phẩm không đúng kích thước đã
                                            đặt
                                        </li>
                                        <li>
                                            Chất lượng sản phẩm không đạt yêu
                                            cầu
                                        </li>
                                    </ul>
                                    <p>
                                        <strong>3. Quy trình hoàn tiền:</strong>{' '}
                                        Sau khi nhận được yêu cầu hoàn tiền,
                                        chúng tôi sẽ xem xét và phản hồi trong
                                        vòng 48 giờ làm việc. Nếu yêu cầu được
                                        chấp nhận, tiền sẽ được hoàn lại trong
                                        vòng 7-14 ngày làm việc.
                                    </p>
                                    <p>
                                        <strong>4. Lưu ý:</strong> Sản phẩm hoàn
                                        trả phải còn nguyên vẹn, chưa qua sử
                                        dụng và còn đầy đủ bao bì, nhãn mác.
                                    </p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowRefundDialog(false)}
                            disabled={isSubmittingRefund}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={submitRefundRequest}
                            disabled={
                                !refundReason.trim() || isSubmittingRefund
                            }
                        >
                            {isSubmittingRefund ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang gửi...
                                </>
                            ) : (
                                'Gửi yêu cầu'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Component hiển thị chi tiết đơn hàng
const OrderDetailModal: React.FC<{
    order: Order
    onCancelOrder: (order: Order) => void
    onRefundRequest: (order: Order) => void
}> = ({ order, onCancelOrder, onRefundRequest }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(price)
    }

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

    const statusConfig =
        orderStatusConfig[order.status as keyof typeof orderStatusConfig]

    return (
        <div className="space-y-6">
            {/* Order Status */}
            <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">Trạng thái đơn hàng</h3>
                </div>
                <Badge
                    className={`${statusConfig?.color} flex items-center gap-1`}
                >
                    <statusConfig.icon className="h-3 w-3" />
                    {statusConfig?.label}
                </Badge>
                <p className="text-sm text-gray-500">
                    {statusConfig?.description}
                </p>
            </div>

            {/* Order Items */}
            <div>
                <h3 className="mb-2 text-sm font-medium">Sản phẩm</h3>
                <div className="space-y-3">
                    {order.orderItems.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center gap-4 rounded-md border p-3"
                        >
                            <div className="h-16 w-16 overflow-hidden rounded-md">
                                <img
                                    src={
                                        item.product.image ||
                                        '/placeholder.svg?height=64&width=64'
                                    }
                                    alt={item.product.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="font-medium">
                                    {item.product.name}
                                </h4>
                                <div className="text-sm text-gray-500">
                                    Số lượng: {item.quantity}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Giá: {formatPrice(item.price)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping Address */}
            <div>
                <h3 className="mb-2 text-sm font-medium">Địa chỉ giao hàng</h3>
                <div className="rounded-md border p-3">
                    <p className="text-sm font-medium">
                        {order.shippingAddress.address}
                    </p>
                    <p className="text-sm text-gray-500">
                        {order.shippingAddress.ward},{' '}
                        {order.shippingAddress.district},{' '}
                        {order.shippingAddress.city}
                    </p>
                    {order.shippingAddress.phone && (
                        <p className="text-sm text-gray-500">
                            Điện thoại: {order.shippingAddress.phone}
                        </p>
                    )}
                </div>
            </div>

            {/* Payment Information */}
            <div>
                <h3 className="mb-2 text-sm font-medium">Thanh toán</h3>
                <div className="rounded-md border p-3">
                    <div className="mb-2 flex justify-between">
                        <span className="text-sm text-gray-600">
                            Phương thức thanh toán:
                        </span>
                        <span className="text-sm font-medium">
                            {order.paymentMethod}
                        </span>
                    </div>

                    {order.shippingPrice && (
                        <div className="mb-2 flex justify-between">
                            <span className="text-sm text-gray-600">
                                Phí vận chuyển:
                            </span>
                            <span className="text-sm font-medium">
                                {formatPrice(order.shippingPrice)}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                            Tổng cộng:
                        </span>
                        <span className="text-sm font-semibold">
                            {formatPrice(order.totalPrice)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Order Notes */}
            {order.note && (
                <div>
                    <h3 className="mb-2 text-sm font-medium">
                        Ghi chú đơn hàng
                    </h3>
                    <div className="rounded-md border p-3">
                        <p className="text-sm text-gray-700">{order.note}</p>
                    </div>
                </div>
            )}

            {/* Refund Information */}
            {order.refundInfo && (
                <div>
                    <h3 className="mb-2 text-sm font-medium">
                        Thông tin hoàn tiền
                    </h3>
                    <div className="rounded-md border p-3">
                        <div className="mb-2 flex justify-between">
                            <span className="text-sm text-gray-600">
                                Lý do hoàn tiền:
                            </span>
                            <span className="text-sm font-medium">
                                {order.refundInfo.refundReason}
                            </span>
                        </div>
                        {order.refundInfo.notes && (
                            <div className="mb-2 flex justify-between">
                                <span className="text-sm text-gray-600">
                                    Ghi chú:
                                </span>
                                <span className="text-sm font-medium">
                                    {order.refundInfo.notes}
                                </span>
                            </div>
                        )}
                        {order.refundInfo.refundDate && (
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                    Ngày yêu cầu:
                                </span>
                                <span className="text-sm font-medium">
                                    {formatDate(order.refundInfo.refundDate)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex justify-end gap-2">
                {orderStatusConfig[order.status]?.canCancel && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCancelOrder(order)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <XCircle className="mr-2 h-4 w-4" />
                        Hủy đơn
                    </Button>
                )}

                {orderStatusConfig[order.status]?.canRefund && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRefundRequest(order)}
                        className="text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Yêu cầu hoàn tiền
                    </Button>
                )}
            </div>
        </div>
    )
}
