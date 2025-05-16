'use client'

import type React from 'react'
import { Trash2, Plus, Minus } from 'lucide-react'
import type { CartItem as CartItemType } from '../../../contexts/cart-context'

interface CartItemProps {
    item: CartItemType
    onUpdateQuantity: (id: number, quantity: number) => void
    onRemove: (id: number) => void
}

const CartItem: React.FC<CartItemProps> = ({
    item,
    onUpdateQuantity,
    onRemove,
}) => {
    return (
        <div className="flex items-center border-b border-gray-200 py-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                {item.image ? (
                    <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className="object-cover"
                    />
                ) : (
                    <img
                        src="/placeholder.svg?height=80&width=80"
                        alt={item.name}
                        className="object-cover"
                    />
                )}
            </div>

            <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-800">
                    {item.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                    {item.category} • {item.unit}
                </p>
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-md border border-gray-300">
                        <button
                            onClick={() =>
                                onUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-1 text-gray-500 hover:text-gray-700"
                            aria-label="Giảm số lượng"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button
                            onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 text-gray-500 hover:text-gray-700"
                            aria-label="Tăng số lượng"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Xóa sản phẩm"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="ml-4 text-right">
                <p className="text-sm font-medium text-gray-800">
                    {item.price.toLocaleString()}đ
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    Tổng: {(item.price * item.quantity).toLocaleString()}đ
                </p>
            </div>
        </div>
    )
}

export default CartItem
