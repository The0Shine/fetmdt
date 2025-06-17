'use client'
import { useState, useEffect, useMemo } from 'react'
import {
    Search,
    Filter,
    Calendar,
    Download,
    MoreVertical,
    Eye,
    CheckCircle,
    XCircle,
    Loader2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
    getOrders,
    approveRefund,
    rejectRefund,
} from '@/services/apiOrder.service'

// Hàm chuyển đổi mã lý do hoàn tiền sang văn bản hiển thị
const getRefundReasonText = (reason: string): string => {
    const reasonMap: Record<string, string> = {
        damaged: 'Sản phẩm bị hư hỏng',
        wrong_item: 'Sản phẩm không đúng mô tả',
        size_issue: 'Vấn đề về kích thước',
        quality_issue: 'Chất lượng không đạt yêu cầu',
        other: 'Lý do khác',
    }

    return reasonMap[reason] || reason
}

// Định nghĩa kiểu dữ liệu cho đơn hàng
interface Order {
    id: string
    orderNumber: string
    date: string
    customer: string
    total: number
    status:
        | 'pending'
        | 'processing'
        | 'completed'
        | 'cancelled'
        | 'refund_requested'
        | 'refunded'
    paymentStatus: 'paid' | 'unpaid'
    refundInfo?: {
        refundReason?: string
        refundDate?: string
        refundTransactionId?: string
        notes?: string
    }
}

// Thêm modal xác nhận duyệt hoàn tiền
const RefundApprovalModal = ({
    isOpen,
    onClose,
    onApprove,
    order,
    isSubmitting,
}: {
    isOpen: boolean
    onClose: () => void
    onApprove: (
        orderId: string,
        notes: string,
        createImportVoucher: boolean,
    ) => void
    order: Order | null
    isSubmitting: boolean
}) => {
    const [notes, setNotes] = useState('')
    const [createImportVoucher, setCreateImportVoucher] = useState(true)

    if (!isOpen || !order) return null

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-xl font-semibold">
                    Duyệt yêu cầu hoàn tiền
                </h2>
                <p className="mb-4 text-gray-600">
                    Xác nhận duyệt yêu cầu hoàn tiền cho đơn hàng #
                    {order.orderNumber}
                </p>

                {order.refundInfo?.refundReason && (
                    <div className="mb-4 rounded-md bg-amber-50 p-3 text-amber-800">
                        <p className="font-medium">Lý do yêu cầu hoàn tiền:</p>
                        <p>
                            {getRefundReasonText(order.refundInfo.refundReason)}
                        </p>
                    </div>
                )}

                <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Ghi chú
                    </label>
                    <textarea
                        className="w-full rounded-md border border-gray-300 p-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Nhập ghi chú (không bắt buộc)..."
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="createImportVoucher"
                        checked={createImportVoucher}
                        onChange={(e) =>
                            setCreateImportVoucher(e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <label
                        htmlFor="createImportVoucher"
                        className="ml-2 block text-sm text-gray-700"
                    >
                        Tạo phiếu nhập kho
                    </label>
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() =>
                            onApprove(order.id, notes, createImportVoucher)
                        }
                        disabled={isSubmitting}
                        className="rounded-md bg-[oklch(0.7_0.1_213.13)] px-4 py-2 text-white hover:bg-[oklch(0.65_0.1_213.13)] disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            'Xác nhận duyệt'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

// Thêm modal xác nhận từ chối hoàn tiền
const RefundRejectionModal = ({
    isOpen,
    onClose,
    onReject,
    order,
    isSubmitting,
}: {
    isOpen: boolean
    onClose: () => void
    onReject: (orderId: string, notes: string) => void
    order: Order | null
    isSubmitting: boolean
}) => {
    const [notes, setNotes] = useState('')

    if (!isOpen || !order) return null

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-xl font-semibold text-red-600">
                    Từ chối yêu cầu hoàn tiền
                </h2>
                <p className="mb-4 text-gray-600">
                    Xác nhận từ chối yêu cầu hoàn tiền cho đơn hàng #
                    {order.orderNumber}
                </p>

                {order.refundInfo?.refundReason && (
                    <div className="mb-4 rounded-md bg-amber-50 p-3 text-amber-800">
                        <p className="font-medium">Lý do yêu cầu hoàn tiền:</p>
                        <p>
                            {getRefundReasonText(order.refundInfo.refundReason)}
                        </p>
                    </div>
                )}

                <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Lý do từ chối <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className="w-full rounded-md border border-gray-300 p-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Nhập lý do từ chối yêu cầu hoàn tiền..."
                        required
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => {
                            if (notes.trim()) {
                                onReject(order.id, notes)
                            }
                        }}
                        disabled={!notes.trim() || isSubmitting}
                        className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            'Xác nhận từ chối'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function OrderManagement() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterPayment, setFilterPayment] = useState('all')
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    // Thêm state cho modal xử lý hoàn tiền
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isRefundApprovalModalOpen, setIsRefundApprovalModalOpen] =
        useState(false)
    const [isRefundRejectionModalOpen, setIsRefundRejectionModalOpen] =
        useState(false)
    const [isProcessingRefund, setIsProcessingRefund] = useState(false)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)
                const response = await getOrders()

                if (response) {
                    console.log('Fetched orders:', response)

                    const formattedOrders = response.map((order: any) => {
                        return {
                            id: order._id,
                            orderNumber:
                                order.orderNumber ||
                                `ORD-${order._id.slice(-6)}`,
                            date: order.createdAt
                                ? new Date(order.createdAt).toLocaleString(
                                      'vi-VN',
                                  )
                                : 'N/A',
                            customer: order.user?.name || 'Khách hàng',
                            total: order.totalPrice,
                            status: order.status,
                            paymentStatus: order.isPaid ? 'paid' : 'unpaid',
                            refundInfo: order.refundInfo,
                        }
                    })

                    setOrders(formattedOrders)
                } else {
                    setError('Không thể tải danh sách đơn hàng')
                    toast.error('Không thể tải danh sách đơn hàng')
                }
            } catch (err) {
                console.error('Error fetching orders:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    // Thêm hàm xử lý duyệt hoàn tiền
    const handleApproveRefund = async (
        orderId: string,
        notes: string,
        createImportVoucher: boolean,
    ) => {
        try {
            setIsProcessingRefund(true)

            // Tìm đơn hàng để lấy số tiền hoàn
            const order = orders.find((o) => o.id === orderId)
            if (!order) {
                toast.error('Không tìm thấy thông tin đơn hàng')
                return
            }

            const response = await approveRefund(
                orderId,
                'bank_transfer', // Phương thức hoàn tiền mặc định
                order.total,
                notes,
                createImportVoucher,
            )

            if (response) {
                // Cập nhật trạng thái đơn hàng trong state
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId
                            ? {
                                  ...order,
                                  status: 'refunded',
                                  refundInfo: {
                                      ...order.refundInfo,
                                      notes: notes || order.refundInfo?.notes,
                                      refundDate: new Date().toISOString(),
                                  },
                              }
                            : order,
                    ),
                )

                toast.success('Đã duyệt yêu cầu hoàn tiền thành công')
                setIsRefundApprovalModalOpen(false)
            }
        } catch (error) {
            console.error('Error approving refund:', error)
            toast.error('Đã xảy ra lỗi khi duyệt yêu cầu hoàn tiền')
        } finally {
            setIsProcessingRefund(false)
        }
    }

    // Thêm hàm xử lý từ chối hoàn tiền
    const handleRejectRefund = async (orderId: string, notes: string) => {
        try {
            setIsProcessingRefund(true)

            const response = await rejectRefund(orderId, notes)

            if (response) {
                // Cập nhật trạng thái đơn hàng trong state
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId
                            ? {
                                  ...order,
                                  status: 'completed', // Trả về trạng thái hoàn thành
                                  refundInfo: {
                                      ...order.refundInfo,
                                      notes: `Yêu cầu hoàn tiền bị từ chối: ${notes}`,
                                  },
                              }
                            : order,
                    ),
                )

                toast.success('Đã từ chối yêu cầu hoàn tiền')
                setIsRefundRejectionModalOpen(false)
            }
        } catch (error) {
            console.error('Error rejecting refund:', error)
            toast.error('Đã xảy ra lỗi khi từ chối yêu cầu hoàn tiền')
        } finally {
            setIsProcessingRefund(false)
        }
    }

    // Lọc dữ liệu dựa trên trạng thái và tìm kiếm
    const filteredData = useMemo(() => {
        let filtered = [...orders]

        if (filterStatus !== 'all') {
            filtered = filtered.filter((order) => order.status === filterStatus)
        }

        if (filterPayment !== 'all') {
            filtered = filtered.filter(
                (order) => order.paymentStatus === filterPayment,
            )
        }

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            filtered = filtered.filter(
                (order) =>
                    order.orderNumber.toLowerCase().includes(searchLower) ||
                    order.customer.toLowerCase().includes(searchLower) ||
                    order.date.toLowerCase().includes(searchLower),
            )
        }

        return filtered
    }, [orders, filterStatus, filterPayment, searchTerm])

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = filteredData.slice(startIndex, endIndex)

    // Handle row selection
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(currentData.map((order) => order.id))
        } else {
            setSelectedRows([])
        }
    }

    const handleSelectRow = (orderId: string, checked: boolean) => {
        if (checked) {
            setSelectedRows((prev) => [...prev, orderId])
        } else {
            setSelectedRows((prev) => prev.filter((id) => id !== orderId))
        }
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: {
                variant: 'secondary' as const,
                text: 'Chờ xử lý',
                className: 'bg-yellow-100 text-yellow-700',
            },
            processing: {
                variant: 'default' as const,
                text: 'Đang xử lý',
                className: 'bg-blue-100 text-blue-700',
            },
            completed: {
                variant: 'default' as const,
                text: 'Hoàn thành',
                className: 'bg-green-100 text-green-700',
            },
            cancelled: {
                variant: 'destructive' as const,
                text: 'Đã hủy',
                className: 'bg-red-100 text-red-700',
            },
            refund_requested: {
                variant: 'default' as const,
                text: 'Yêu cầu hoàn tiền',
                className: 'bg-purple-100 text-purple-700',
            },
            refunded: {
                variant: 'default' as const,
                text: 'Đã hoàn tiền',
                className: 'bg-teal-100 text-teal-700',
            },
        }

        const config =
            statusConfig[status as keyof typeof statusConfig] ||
            statusConfig.pending
        return <Badge className={config.className}>{config.text}</Badge>
    }

    const getPaymentBadge = (paymentStatus: string) => {
        return paymentStatus === 'paid' ? (
            <Badge className="bg-green-100 text-green-700">Đã thanh toán</Badge>
        ) : (
            <Badge className="bg-red-100 text-red-700">Chưa thanh toán</Badge>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Đơn hàng
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                    <span>Trang chủ</span>
                    <span className="mx-2">•</span>
                    <span>Đơn hàng</span>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Danh sách đơn hàng</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="mb-6 flex flex-col justify-between space-y-4 md:flex-row md:space-y-0">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Tìm theo mã đơn/tên khách hàng"
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">
                                    Trạng thái:
                                </span>
                                <Select
                                    value={filterStatus}
                                    onValueChange={setFilterStatus}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Tất cả
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            Chờ xử lý
                                        </SelectItem>
                                        <SelectItem value="processing">
                                            Đang xử lý
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            Hoàn thành
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                            Đã hủy
                                        </SelectItem>
                                        <SelectItem value="refund_requested">
                                            Yêu cầu hoàn tiền
                                        </SelectItem>
                                        <SelectItem value="refunded">
                                            Đã hoàn tiền
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">
                                    Thanh toán:
                                </span>
                                <Select
                                    value={filterPayment}
                                    onValueChange={setFilterPayment}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Tất cả
                                        </SelectItem>
                                        <SelectItem value="paid">
                                            Đã thanh toán
                                        </SelectItem>
                                        <SelectItem value="unpaid">
                                            Chưa thanh toán
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button variant="outline">
                                <Filter className="mr-2 h-4 w-4" />
                                Lọc khác
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            Đang tải dữ liệu...
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">
                            {error}
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={
                                                        selectedRows.length ===
                                                            currentData.length &&
                                                        currentData.length > 0
                                                    }
                                                    onCheckedChange={
                                                        handleSelectAll
                                                    }
                                                />
                                            </TableHead>
                                            <TableHead>Mã đơn hàng</TableHead>
                                            <TableHead>Ngày đặt</TableHead>
                                            <TableHead>Khách hàng</TableHead>
                                            <TableHead>Tổng tiền</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead>Thanh toán</TableHead>
                                            <TableHead className="w-32">
                                                Thao tác
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentData.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={8}
                                                    className="py-8 text-center text-gray-500"
                                                >
                                                    Không có đơn hàng nào
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            currentData.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedRows.includes(
                                                                order.id,
                                                            )}
                                                            onCheckedChange={(
                                                                checked,
                                                            ) =>
                                                                handleSelectRow(
                                                                    order.id,
                                                                    checked as boolean,
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {order.orderNumber}
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.date}
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.customer}
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.total.toLocaleString()}
                                                        đ
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(
                                                            order.status,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getPaymentBadge(
                                                            order.paymentStatus,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-1">
                                                            <Link
                                                                to={`/admin/orders/${order.id}`}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                    >
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem>
                                                                        <Link
                                                                            to={`/admin/orders/${order.id}`}
                                                                            className="flex w-full items-center"
                                                                        >
                                                                            Xem
                                                                            chi
                                                                            tiết
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    {order.status ===
                                                                        'refund_requested' && (
                                                                        <>
                                                                            <DropdownMenuItem
                                                                                onClick={() => {
                                                                                    setSelectedOrder(
                                                                                        order,
                                                                                    )
                                                                                    setIsRefundApprovalModalOpen(
                                                                                        true,
                                                                                    )
                                                                                }}
                                                                                className="text-green-600"
                                                                            >
                                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                                Duyệt
                                                                                hoàn
                                                                                tiền
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                onClick={() => {
                                                                                    setSelectedOrder(
                                                                                        order,
                                                                                    )
                                                                                    setIsRefundRejectionModalOpen(
                                                                                        true,
                                                                                    )
                                                                                }}
                                                                                className="text-red-600"
                                                                            >
                                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                                Từ
                                                                                chối
                                                                                hoàn
                                                                                tiền
                                                                            </DropdownMenuItem>
                                                                        </>
                                                                    )}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        Hiển thị {startIndex + 1}-
                                        {Math.min(
                                            endIndex,
                                            filteredData.length,
                                        )}{' '}
                                        của {filteredData.length} đơn hàng
                                    </div>
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.max(prev - 1, 1),
                                                )
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            Trước
                                        </Button>
                                        {Array.from(
                                            { length: totalPages },
                                            (_, i) => i + 1,
                                        ).map((page) => (
                                            <Button
                                                key={page}
                                                variant={
                                                    currentPage === page
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    setCurrentPage(page)
                                                }
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        prev + 1,
                                                        totalPages,
                                                    ),
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            Sau
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Refund Approval Modal */}
            {isRefundApprovalModalOpen && (
                <RefundApprovalModal
                    isOpen={isRefundApprovalModalOpen}
                    onClose={() => setIsRefundApprovalModalOpen(false)}
                    onApprove={handleApproveRefund}
                    order={selectedOrder}
                    isSubmitting={isProcessingRefund}
                />
            )}

            {/* Refund Rejection Modal */}
            {isRefundRejectionModalOpen && (
                <RefundRejectionModal
                    isOpen={isRefundRejectionModalOpen}
                    onClose={() => setIsRefundRejectionModalOpen(false)}
                    onReject={handleRejectRefund}
                    order={selectedOrder}
                    isSubmitting={isProcessingRefund}
                />
            )}
        </div>
    )
}
