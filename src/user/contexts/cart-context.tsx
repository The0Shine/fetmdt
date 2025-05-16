'use client'

import type React from 'react'
import { createContext, useState, useEffect, useContext } from 'react'
import type { Product } from '../../types/product'
import { useNavigate } from 'react-router-dom'
import { mainRepository } from '../../utils/Repository'
import { useAuth } from './auth-context'

export interface CartItem extends Product {
    quantity: number
    _id?: string // ID của CartItem từ server
}

interface CartContextType {
    items: CartItem[]
    addItem: (product: Product, quantity?: number) => Promise<void>
    removeItem: (productId: number) => Promise<void>
    updateQuantity: (productId: number, quantity: number) => Promise<void>
    clearCart: () => Promise<void>
    totalItems: number
    totalPrice: number
    loading: boolean
    error: string | null
    redirectToLogin: () => void
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [items, setItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    // Tính toán tổng số lượng và tổng giá trị
    const totalItems = items.reduce((total, item) => total + item.quantity, 0)
    const totalPrice = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    )

    // Chuyển hướng đến trang đăng nhập
    const redirectToLogin = () => {
        navigate('/login?redirect=cart')
    }

    // Lấy giỏ hàng từ API khi đã đăng nhập
    useEffect(() => {
        if (!isAuthenticated) {
            setItems([])
            return
        }

        const fetchCart = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await mainRepository.get<{
                    data: {
                        items: Array<{
                            _id: string
                            product: Product
                            quantity: number
                        }>
                        totalPrice: number
                    }
                }>('api/cart')

                if (response) {
                    // Chuyển đổi dữ liệu từ API sang định dạng CartItem
                    const cartItems = response.data.items.map((item) => ({
                        ...item.product,
                        quantity: item.quantity,
                        _id: item._id,
                    }))
                    setItems(cartItems)
                }
            } catch (error) {
                console.error('Lỗi khi lấy giỏ hàng:', error)
                setError('Không thể tải giỏ hàng')
            } finally {
                setLoading(false)
            }
        }

        fetchCart()
    }, [isAuthenticated, user])

    // Thêm sản phẩm vào giỏ hàng
    const addItem = async (product: Product, quantity = 1) => {
        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
        if (!isAuthenticated) {
            redirectToLogin()
            return
        }

        setError(null)
        setLoading(true)

        try {
            const response = await mainRepository.post<{
                data: {
                    items: Array<{
                        _id: string
                        product: Product
                        quantity: number
                    }>
                }
            }>('api/cart', {
                productId: product.id,
                quantity,
            })

            if (response) {
                // Cập nhật state từ dữ liệu API
                const cartItems = response.data.items.map((item) => ({
                    ...item.product,
                    quantity: item.quantity,
                    _id: item._id,
                }))
                setItems(cartItems)
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error)
            setError('Không thể thêm sản phẩm vào giỏ hàng')
        } finally {
            setLoading(false)
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    const removeItem = async (productId: number) => {
        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
        if (!isAuthenticated) {
            redirectToLogin()
            return
        }

        setError(null)

        // Tìm cartItemId từ productId
        const cartItem = items.find((item) => item.id === productId)
        if (!cartItem || !cartItem._id) return

        // Xử lý qua API
        setLoading(true)
        try {
            const response = await mainRepository.delete<{
                data: {
                    items: Array<{
                        _id: string
                        product: Product
                        quantity: number
                    }>
                }
            }>(`api/cart/${cartItem._id}`)

            if (response) {
                // Cập nhật state từ dữ liệu API
                const cartItems = response.data.items.map((item) => ({
                    ...item.product,
                    quantity: item.quantity,
                    _id: item._id,
                }))
                setItems(cartItems)
            }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error)
            setError('Không thể xóa sản phẩm khỏi giỏ hàng')
        } finally {
            setLoading(false)
        }
    }

    // Cập nhật số lượng sản phẩm
    const updateQuantity = async (productId: number, quantity: number) => {
        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
        if (!isAuthenticated) {
            redirectToLogin()
            return
        }

        setError(null)

        if (quantity <= 0) {
            return removeItem(productId)
        }

        // Tìm cartItemId từ productId
        const cartItem = items.find((item) => item.id === productId)
        if (!cartItem || !cartItem._id) return

        // Xử lý qua API
        setLoading(true)
        try {
            const response = await mainRepository.put<{
                data: {
                    items: Array<{
                        _id: string
                        product: Product
                        quantity: number
                    }>
                }
            }>(`api/cart/${cartItem._id}`, {
                quantity,
            })

            if (response) {
                // Cập nhật state từ dữ liệu API
                const cartItems = response.data.items.map((item) => ({
                    ...item.product,
                    quantity: item.quantity,
                    _id: item._id,
                }))
                setItems(cartItems)
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật số lượng sản phẩm:', error)
            setError('Không thể cập nhật số lượng sản phẩm')
        } finally {
            setLoading(false)
        }
    }

    // Xóa toàn bộ giỏ hàng
    const clearCart = async () => {
        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
        if (!isAuthenticated) {
            redirectToLogin()
            return
        }

        setError(null)
        setLoading(true)

        try {
            await mainRepository.delete('api/cart')
            setItems([])
        } catch (error) {
            console.error('Lỗi khi xóa giỏ hàng:', error)
            setError('Không thể xóa giỏ hàng')
        } finally {
            setLoading(false)
        }
    }

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                loading,
                error,
                redirectToLogin,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = (): CartContextType => {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart phải được sử dụng trong CartProvider')
    }
    return context
}
