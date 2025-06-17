'use client'

import { useState, useEffect } from 'react'
import {
    ArrowLeft,
    Printer,
    User,
    Phone,
    MapPin,
    CreditCard,
    Package,
    MailIcon as Email,
    RotateCcw,
    CheckCircle,
    XCircle,
    Loader2,
} from 'lucide-react'
import OrderProcessing from './components/order-processing'
import { Link, useParams } from 'react-router-dom'
import { mainRepository } from '../../../utils/Repository'
import type { OrderData, RefundRequest } from '../../../types/order'
import {
    getOrderById,
    updateOrderStatus,
    approveRefund,
    rejectRefund,
} from '@/services/apiOrder.service'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

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

// Add a new RefundRequestModal component
const RefundRequestModal = ({
    isOpen,
    onClose,
    onSubmit,
    orderId,
    isSubmitting,
}: {
    isOpen: boolean
    onClose: () => void
    onSubmit: (reason: string, notes: string) => void
    orderId: string
    isSubmitting: boolean
}) => {
    const [reason, setReason] = useState('')
    const [notes, setNotes] = useState('')

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Yêu cầu hoàn tiền</DialogTitle>
                    <DialogDescription>
                        Vui lòng cung cấp lý do hoàn tiền cho đơn hàng #
                        {orderId}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="refund-reason">
                            Lý do hoàn tiền{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger id="refund-reason">
                                <SelectValue placeholder="-- Chọn lý do --" />
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
                    <div className="grid gap-2">
                        <Label htmlFor="refund-notes">Ghi chú bổ sung</Label>
                        <Textarea
                            id="refund-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Nhập thêm thông tin chi tiết (không bắt buộc)..."
                            rows={3}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={() => {
                            if (reason.trim()) {
                                onSubmit(reason, notes)
                            }
                        }}
                        disabled={!reason.trim() || isSubmitting}
                    >
                        {isSubmitting ? (
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
    )
}

// Add a new RefundApprovalModal component
const RefundApprovalModal = ({
    isOpen,
    onClose,
    onSubmit,
    orderId,
    isSubmitting,
    refundReason,
}: {
    isOpen: boolean
    onClose: () => void
    onSubmit: (notes: string, createImportVoucher: boolean) => void
    orderId: string
    isSubmitting: boolean
    refundReason?: string
}) => {
    const [notes, setNotes] = useState('')
    const [createImportVoucher, setCreateImportVoucher] = useState(true)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Duyệt yêu cầu hoàn tiền</DialogTitle>
                    <DialogDescription>
                        Xác nhận duyệt yêu cầu hoàn tiền cho đơn hàng #{orderId}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {refundReason && (
                        <div className="rounded-md bg-amber-50 p-3 text-amber-800">
                            <p className="font-medium">
                                Lý do yêu cầu hoàn tiền:
                            </p>
                            <p>{getRefundReasonText(refundReason)}</p>
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="approval-notes">Ghi chú</Label>
                        <Textarea
                            id="approval-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Nhập ghi chú (không bắt buộc)..."
                            rows={3}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="create-import-voucher"
                            checked={createImportVoucher}
                            onCheckedChange={(checked) =>
                                setCreateImportVoucher(checked as boolean)
                            }
                        />
                        <Label htmlFor="create-import-voucher">
                            Tạo phiếu nhập kho
                        </Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={() => {
                            onSubmit(notes, createImportVoucher)
                        }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            'Xác nhận duyệt'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// Add a new RefundRejectionModal component
const RefundRejectionModal = ({
    isOpen,
    onClose,
    onSubmit,
    orderId,
    isSubmitting,
    refundReason,
}: {
    isOpen: boolean
    onClose: () => void
    onSubmit: (notes: string) => void
    orderId: string
    isSubmitting: boolean
    refundReason?: string
}) => {
    const [notes, setNotes] = useState('')

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-red-600">
                        Từ chối yêu cầu hoàn tiền
                    </DialogTitle>
                    <DialogDescription>
                        Xác nhận từ chối yêu cầu hoàn tiền cho đơn hàng #
                        {orderId}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {refundReason && (
                        <div className="rounded-md bg-amber-50 p-3 text-amber-800">
                            <p className="font-medium">
                                Lý do yêu cầu hoàn tiền:
                            </p>
                            <p>{getRefundReasonText(refundReason)}</p>
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="rejection-notes">
                            Lý do từ chối{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="rejection-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Nhập lý do từ chối yêu cầu hoàn tiền..."
                            rows={3}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            if (notes.trim()) {
                                onSubmit(notes)
                            }
                        }}
                        disabled={!notes.trim() || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            'Xác nhận từ chối'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function OrderDetail() {
    const [orderStatus, setOrderStatus] = useState<
        | 'pending'
        | 'processing'
        | 'completed'
        | 'cancelled'
        | 'refund_requested'
        | 'refunded'
    >('pending')
    const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>(
        'unpaid',
    )
    const [orderData, setOrderData] = useState<OrderData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { orderId } = useParams<{ orderId: string }>()

    // Add new state for refund modals and processing
    const [isRefundRequestModalOpen, setIsRefundRequestModalOpen] =
        useState(false)
    const [isRefundApprovalModalOpen, setIsRefundApprovalModalOpen] =
        useState(false)
    const [isRefundRejectionModalOpen, setIsRefundRejectionModalOpen] =
        useState(false)
    const [isSubmittingRefund, setIsSubmittingRefund] = useState(false)
    const [isAdmin, setIsAdmin] = useState(true) // This should be determined by your auth system

    useEffect(() => {
        // Sửa hàm fetchOrderDetails
        const fetchOrderDetails = async () => {
            if (!orderId) return

            try {
                setLoading(true)
                const response = await getOrderById(orderId)
                if (response) {
                    const order = response

                    // Transform the data to match our frontend structure
                    const mappedOrder: OrderData = {
                        _id: order._id,
                        date: order.createdAt,
                        customer: {
                            email: order.user.email,
                            phone: '', // chưa có dữ liệu phone
                            address: '', // chưa có dữ liệu address
                        },
                        items: order.orderItems.map((item: any) => ({
                            // map từng order item theo interface OrderItem
                            // bạn cần xác định OrderItem type cụ thể
                            ...item,
                        })),
                        subtotal: order.itemsPrice,
                        shippingAddress: {
                            address: order.shippingAddress.address,
                            city: order.shippingAddress.city, // chưa có dữ liệu thành phố
                        },
                        shipping: 0, // chưa có thông tin phí vận chuyển
                        tax: 0, // chưa có thông tin thuế
                        total: order.totalPrice,
                        paymentMethod: order.paymentMethod,
                        note: '', // chưa có thông tin ghi chú
                        refundInfo: order.refundInfo, // Add refund info
                    }

                    setOrderData(mappedOrder)
                    console.log(mappedOrder)

                    setOrderStatus(order.status)
                    setPaymentStatus(order.isPaid ? 'paid' : 'unpaid')
                }
            } catch (err) {
                console.error('Error fetching order details:', err)
                setError('Đã xảy ra lỗi khi tải thông tin đơn hàng')
            } finally {
                setLoading(false)
            }
        }

        fetchOrderDetails()
    }, [orderId])

    // Sửa hàm handleStatusChange
    const handleStatusChange = async (
        status:
            | 'pending'
            | 'processing'
            | 'completed'
            | 'cancelled'
            | 'refund_requested'
            | 'refunded',
    ) => {
        try {
            interface StatusResponse {
                success: boolean
                message?: string
            }

            if (!orderId) {
                alert('Không tìm thấy mã đơn hàng')
                return
            }
            const response = await updateOrderStatus(orderId, status)
            console.log('Update response:', response)

            if (response) {
                setOrderStatus(status)
                // If order is completed, update payment status to paid
                if (status === 'completed') {
                    setPaymentStatus('paid')
                }
            }
        } catch (error) {
            console.error('Error updating order status:', error)
            alert('Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng')
        }
    }

    // Add new function to handle refund request
    const handleRefundRequest = async (reason: string, notes: string) => {
        try {
            setIsSubmittingRefund(true)
            if (!orderId) {
                toast.error('Không tìm thấy mã đơn hàng')
                return
            }

            // Create the refund request data object
            const refundData: RefundRequest = {
                orderId,
                refundReason: reason,
                notes: notes || undefined,
            }

            // Call the requestRefund function from the API service
            const response = await mainRepository.post(
                `/api/orders/${orderId}/request-refund`,
                {
                    refundReason: reason,
                    notes: notes || undefined,
                },
            )

            if (response) {
                toast.success('Yêu cầu hoàn tiền đã được gửi thành công')
                setIsRefundRequestModalOpen(false)

                // Refresh order data to show updated status
                const updatedOrder = await getOrderById(orderId)
                if (updatedOrder) {
                    setOrderStatus('refund_requested')
                    setOrderData((prev) =>
                        prev
                            ? {
                                  ...prev,
                                  refundInfo: updatedOrder.refundInfo,
                              }
                            : null,
                    )
                }
            }
        } catch (error) {
            console.error('Error requesting refund:', error)
            toast.error('Đã xảy ra lỗi khi gửi yêu cầu hoàn tiền')
        } finally {
            setIsSubmittingRefund(false)
        }
    }

    // Update the refund approval function
    const handleRefundApproval = async (
        notes: string,
        createImportVoucher: boolean,
    ) => {
        try {
            setIsSubmittingRefund(true)
            if (!orderId) {
                toast.error('Không tìm thấy mã đơn hàng')
                return
            }

            // Call the approveRefund function from the API service
            const response = await approveRefund(
                orderId,
                'bank_transfer', // Default refund method
                orderData?.total || 0,
                notes || undefined,
                createImportVoucher,
            )

            if (response) {
                toast.success('Yêu cầu hoàn tiền đã được duyệt thành công')
                setIsRefundApprovalModalOpen(false)

                // Refresh order data to show updated status
                const updatedOrder = await getOrderById(orderId)
                if (updatedOrder) {
                    setOrderStatus('refunded')
                    setOrderData((prev) =>
                        prev
                            ? {
                                  ...prev,
                                  refundInfo: updatedOrder.refundInfo,
                              }
                            : null,
                    )
                }
            }
        } catch (error) {
            console.error('Error approving refund:', error)
            toast.error('Đã xảy ra lỗi khi duyệt yêu cầu hoàn tiền')
        } finally {
            setIsSubmittingRefund(false)
        }
    }

    // Add function to handle refund rejection
    const handleRefundRejection = async (notes: string) => {
        try {
            setIsSubmittingRefund(true)
            if (!orderId) {
                toast.error('Không tìm thấy mã đơn hàng')
                return
            }

            // Call the rejectRefund function from the API service
            const response = await rejectRefund(orderId, notes)

            if (response) {
                toast.success('Yêu cầu hoàn tiền đã được từ chối')
                setIsRefundRejectionModalOpen(false)

                // Refresh order data to show updated status
                const updatedOrder = await getOrderById(orderId)
                if (updatedOrder) {
                    // The status should be reverted to completed after rejection
                    setOrderStatus('completed')
                    setOrderData((prev) =>
                        prev
                            ? {
                                  ...prev,
                                  refundInfo: updatedOrder.refundInfo,
                              }
                            : null,
                    )
                }
            }
        } catch (error) {
            console.error('Error rejecting refund:', error)
            toast.error('Đã xảy ra lỗi khi từ chối yêu cầu hoàn tiền')
        } finally {
            setIsSubmittingRefund(false)
        }
    }

    // Helper function to get status badge color and text
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    color: 'bg-yellow-100 text-yellow-800',
                    text: 'Chờ xử lý',
                }
            case 'processing':
                return {
                    color: 'bg-blue-100 text-blue-800',
                    text: 'Đang xử lý',
                }
            case 'completed':
                return {
                    color: 'bg-green-100 text-green-800',
                    text: 'Hoàn thành',
                }
            case 'cancelled':
                return { color: 'bg-red-100 text-red-800', text: 'Đã hủy' }
            case 'refund_requested':
                return {
                    color: 'bg-purple-100 text-purple-800',
                    text: 'Yêu cầu hoàn tiền',
                }
            case 'refunded':
                return {
                    color: 'bg-teal-100 text-teal-800',
                    text: 'Đã hoàn tiền',
                }
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    text: 'Không xác định',
                }
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center p-6">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-teal-500"></div>
                    <p className="mt-4 text-gray-600">
                        Đang tải thông tin đơn hàng...
                    </p>
                </div>
            </div>
        )
    }

    if (error || !orderData) {
        return (
            <div className="p-6">
                <div className="rounded-md bg-red-50 p-4">
                    <h2 className="font-medium text-red-800">Lỗi</h2>
                    <p className="text-red-600">
                        {error || 'Không thể tải thông tin đơn hàng'}
                    </p>
                    <Link
                        to="/admin/orders"
                        className="mt-4 inline-flex items-center text-teal-500 hover:text-teal-600"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Quay lại danh
                        sách đơn hàng
                    </Link>
                </div>
            </div>
        )
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
                                to="/admin/orders"
                                className="flex items-center text-teal-500 hover:text-teal-600"
                            >
                                <ArrowLeft size={16} className="mr-1" /> Quay
                                lại danh sách đơn hàng
                            </Link>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {/* Add refund request button for customers */}
                        {!isAdmin &&
                            orderStatus === 'completed' &&
                            paymentStatus === 'paid' && (
                                <Button
                                    onClick={() =>
                                        setIsRefundRequestModalOpen(true)
                                    }
                                    className="flex items-center"
                                    variant="secondary"
                                >
                                    <RotateCcw size={16} className="mr-1" /> Yêu
                                    cầu hoàn tiền
                                </Button>
                            )}

                        {/* Add refund approval buttons for admins */}
                        {/* {isAdmin && orderStatus === 'refund_requested' && (
                            <div className="flex space-x-2">
                                <Button
                                    onClick={() =>
                                        setIsRefundApprovalModalOpen(true)
                                    }
                                    className="flex items-center"
                                >
                                    <CheckCircle size={16} className="mr-1" />{' '}
                                    Duyệt hoàn tiền
                                </Button>
                                <Button
                                    onClick={() =>
                                        setIsRefundRejectionModalOpen(true)
                                    }
                                    variant="destructive"
                                    className="flex items-center"
                                >
                                    <XCircle size={16} className="mr-1" /> Từ
                                    chối
                                </Button>
                            </div>
                        )} */}

                        <Button variant="outline" className="flex items-center">
                            <Printer size={16} className="mr-1" /> In đơn hàng
                        </Button>
                    </div>
                </div>
            </div>

            <OrderProcessing
                orderId={orderId ?? ''}
                currentStatus={orderStatus}
                onStatusChange={handleStatusChange}
            />

            {/* Add refund status section if applicable */}
            {(orderStatus === 'refund_requested' ||
                orderStatus === 'refunded') && (
                <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
                    <h2 className="mb-2 flex items-center text-lg font-medium text-amber-800">
                        <RotateCcw size={18} className="mr-2" />
                        {orderStatus === 'refund_requested'
                            ? 'Yêu cầu hoàn tiền'
                            : 'Đã hoàn tiền'}
                    </h2>

                    {orderData.refundInfo && (
                        <div className="space-y-2">
                            <p className="text-amber-700">
                                <strong>Lý do:</strong>{' '}
                                {getRefundReasonText(
                                    orderData.refundInfo.refundReason || '',
                                )}
                            </p>

                            {orderData.refundInfo.notes && (
                                <p className="text-amber-700">
                                    <strong>Ghi chú:</strong>{' '}
                                    {orderData.refundInfo.notes}
                                </p>
                            )}

                            {orderData.refundInfo.refundDate && (
                                <p className="text-amber-700">
                                    <strong>Ngày yêu cầu:</strong>{' '}
                                    {new Date(
                                        orderData.refundInfo.refundDate,
                                    ).toLocaleDateString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            )}

                            {orderData.refundInfo.refundTransactionId && (
                                <p className="text-amber-700">
                                    <strong>Mã giao dịch:</strong>{' '}
                                    {orderData.refundInfo.refundTransactionId}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center text-lg font-medium">
                        <User size={18} className="mr-2 text-teal-500" /> Thông
                        tin khách hàng
                    </h2>
                    <div className="space-y-2">
                        <p className="text-gray-600">
                            <Email size={16} className="mr-1 text-gray-400" />{' '}
                            {orderData.customer.email}
                        </p>
                        <p className="flex items-center text-gray-600">
                            <Phone size={16} className="mr-1 text-gray-400" />{' '}
                            {orderData.customer.phone ||
                                'Chưa có số điện thoại'}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center text-lg font-medium">
                        <MapPin size={18} className="mr-2 text-teal-500" /> Địa
                        chỉ giao hàng
                    </h2>
                    <div className="space-y-1 text-gray-600">
                        <p>{orderData.shippingAddress.address}</p>
                        <p>{orderData.shippingAddress.city}</p>
                    </div>
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
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Trạng thái đơn hàng:
                            </span>
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(orderStatus).color}`}
                            >
                                {getStatusBadge(orderStatus).text}
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
                                <tr key={item._id}>
                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-500">
                                        {item.price}đ
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-500">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                                        {item.total}đ
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between py-2">
                        <span className="text-gray-600">Phí vận chuyển:</span>
                        <span className="font-medium">
                            {orderData.shipping}đ
                        </span>
                    </div>

                    <div className="flex justify-between py-2 text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-teal-600">
                            {orderData.total}đ
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

            {/* Add refund action buttons at the bottom of the page */}
            {isAdmin && orderStatus === 'refund_requested' && (
                <div className="mt-8 flex justify-end space-x-4">
                    <Button
                        variant="destructive"
                        size="lg"
                        onClick={() => setIsRefundRejectionModalOpen(true)}
                        className="flex items-center bg-red-500 text-white hover:bg-red-600"
                    >
                        <XCircle size={18} className="mr-2" /> Từ chối yêu cầu
                        hoàn tiền
                    </Button>
                    <Button
                        size="lg"
                        onClick={() => setIsRefundApprovalModalOpen(true)}
                        className="flex items-center bg-[#44aec3] text-white hover:bg-[#3a9bb0]"
                    >
                        <CheckCircle size={18} className="mr-2" /> Duyệt yêu cầu
                        hoàn tiền
                    </Button>
                </div>
            )}

            {/* Add refund request modal */}
            <RefundRequestModal
                isOpen={isRefundRequestModalOpen}
                onClose={() => setIsRefundRequestModalOpen(false)}
                onSubmit={handleRefundRequest}
                orderId={orderId || ''}
                isSubmitting={isSubmittingRefund}
            />

            {/* Add refund approval modal */}
            <RefundApprovalModal
                isOpen={isRefundApprovalModalOpen}
                onClose={() => setIsRefundApprovalModalOpen(false)}
                onSubmit={handleRefundApproval}
                orderId={orderId || ''}
                isSubmitting={isSubmittingRefund}
                refundReason={orderData.refundInfo?.refundReason}
            />

            {/* Add refund rejection modal */}
            <RefundRejectionModal
                isOpen={isRefundRejectionModalOpen}
                onClose={() => setIsRefundRejectionModalOpen(false)}
                onSubmit={handleRefundRejection}
                orderId={orderId || ''}
                isSubmitting={isSubmittingRefund}
                refundReason={orderData.refundInfo?.refundReason}
            />
        </div>
    )
}
