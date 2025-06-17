import type { AxiosResponse } from 'axios'
import { mainRepository } from '@/utils/Repository'

// Định nghĩa các interface
interface Order {
    _id: string
    orderNumber: string
    customerId: string
    customerName: string
    status:
        | 'pending'
        | 'processing'
        | 'completed'
        | 'cancelled'
        | 'refund_requested'
        | 'refunded'
    totalAmount: number
    shippingAddress: string
    paymentMethod: string
    paymentStatus: 'pending' | 'paid' | 'refunded'
    createdAt: string
    updatedAt: string
    items: OrderItem[]
    refundInfo?: {
        refundReason: string
        refundDate?: string
        refundTransactionId?: string
        notes?: string
    }
}

interface OrderItem {
    productId: string
    productName: string
    quantity: number
    price: number
    totalPrice: number
}

interface RefundRequestData {
    orderId: string
    refundReason: string
    notes?: string
    bankInfo?: any
}

interface ProcessRefundData {
    refundReason: string
    refundAmount: number
    notes?: string
    createImportVoucher?: boolean
}

// API functions
export const getOrders = async () => {
    try {
        const response = await mainRepository.get('/api/orders')
        return response.data
    } catch (error) {
        console.error('Error fetching orders:', error)
        throw error
    }
}

export const getOrderById = async (id: string) => {
    try {
        const response = await mainRepository.get(`/api/orders/${id}`)
        return response.data
    } catch (error) {
        console.error(`Error fetching order with id ${id}:`, error)
        throw error
    }
}

export const updateOrderStatus = async (
    id: string,
    status:
        | 'pending'
        | 'processing'
        | 'completed'
        | 'cancelled'
        | 'refund_requested'
        | 'refunded',
) => {
    const response = await mainRepository.put(`/api/orders/${id}/status`, {
        status,
    })
    console.log(response)

    // Nếu trạng thái đơn hàng được cập nhật thành "completed", tự động tạo phiếu xuất kho

    return response.data
}

export const updatePaymentStatus = async (
    id: string,
    paymentStatus: 'pending' | 'paid' | 'refunded',
): Promise<Order> => {
    try {
        const response = await mainRepository.put(`/api/orders/${id}/pay`, {
            paymentStatus,
        })
        if (!response) {
            throw new Error(
                'No response received from server when updating payment status',
            )
        }
        return response.data
    } catch (error) {
        console.error(`Error updating payment status for order ${id}:`, error)
        throw error
    }
}

export const createOrder = async (orderData: any): Promise<Order> => {
    try {
        const response = await mainRepository.post('/api/orders', orderData)
        console.log('Order created successfully:', response)

        return response.data
    } catch (error) {
        console.error('Error creating order:', error)
        throw error
    }
}

export const cancelOrder = async (
    id: string,
    reason?: string,
): Promise<Order> => {
    try {
        const response: AxiosResponse<Order> = await mainRepository.put(
            `/api/orders/${id}/cancel`,
            { reason },
        )
        return response.data
    } catch (error) {
        console.error(`Error cancelling order ${id}:`, error)
        throw error
    }
}

export const getUserOrders = async (): Promise<Order[]> => {
    try {
        const response = await mainRepository.get('/api/orders/user')
        return response.data
    } catch (error) {
        console.error('Error fetching user orders:', error)
        throw error
    }
}

export const updateOrderToPaid = async (id: string): Promise<Order> => {
    try {
        const response = await mainRepository.put(`/api/orders/${id}/pay`)

        return response.data
    } catch (error) {
        console.error(`Error updating order ${id} to paid:`, error)
        throw error
    }
}

export const requestRefund = async (
    refundData: RefundRequestData,
): Promise<any> => {
    try {
        const response = await mainRepository.post(
            `/api/orders/${refundData.orderId}/request-refund`,
            {
                refundReason: refundData.refundReason,
                notes: refundData.notes,
                bankInfo: refundData.bankInfo,
            },
        )
        return response.data
    } catch (error) {
        console.error('Error requesting refund:', error)
        throw error
    }
}

export const approveRefund = async (
    id: string,
    refundMethod: string,
    refundAmount: number,
    adminNote?: string,
    createImportVoucher = true,
): Promise<any> => {
    try {
        const response = await mainRepository.put(
            `/api/orders/${id}/approve-refund`,
            {
                refundMethod,
                refundAmount,
                notes: adminNote,
                createImportVoucher,
            },
        )
        return response.data
    } catch (error) {
        console.error('Error approving refund:', error)
        throw error
    }
}

export const rejectRefund = async (
    id: string,
    adminNote?: string,
): Promise<any> => {
    try {
        const response = await mainRepository.put(
            `/api/orders/${id}/reject-refund`,
            {
                notes: adminNote,
            },
        )
        return response.data
    } catch (error) {
        console.error('Error rejecting refund:', error)
        throw error
    }
}
