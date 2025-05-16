import { CartItem } from '../../contexts/cart-context'

interface OrderSummaryProps {
    items: CartItem[]
    subtotal: number
    shipping: number
    total: number
}

export default function OrderSummary({
    items,
    subtotal,
    shipping,
    total,
}: OrderSummaryProps) {
    // Định dạng giá tiền
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(price)
    }

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Tóm tắt đơn hàng
            </h2>

            <div className="mb-4 border-b pb-4">
                <div className="max-h-80 overflow-y-auto pr-2">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex border-b py-3 last:border-0"
                        >
                            <div className="relative h-16 w-16 flex-shrink-0 rounded-md border bg-gray-50">
                                <img
                                    src={item.image || '/placeholder.svg'}
                                    alt={item.name}
                                    sizes="64px"
                                    className="object-contain p-1"
                                />
                            </div>
                            <div className="ml-4 flex flex-1 flex-col">
                                <div className="flex justify-between text-sm font-medium text-gray-800">
                                    <h3 className="line-clamp-2">
                                        {item.name}
                                    </h3>
                                    <p className="ml-4">
                                        {formatPrice(item.price)}
                                    </p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">
                                        SL: {item.quantity}
                                    </p>
                                    <p className="font-medium text-gray-800">
                                        {formatPrice(
                                            item.price * item.quantity,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <p className="text-gray-600">Tạm tính</p>
                    <p className="font-medium text-gray-800">
                        {formatPrice(subtotal)}
                    </p>
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-600">Phí vận chuyển</p>
                    <p className="font-medium text-gray-800">
                        {formatPrice(shipping)}
                    </p>
                </div>
                <div className="mt-2 border-t pt-2">
                    <div className="flex justify-between">
                        <p className="text-base font-semibold text-gray-800">
                            Tổng cộng
                        </p>
                        <p className="text-base font-semibold text-teal-600">
                            {formatPrice(total)}
                        </p>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Đã bao gồm VAT (nếu có)
                    </p>
                </div>
            </div>
        </div>
    )
}
