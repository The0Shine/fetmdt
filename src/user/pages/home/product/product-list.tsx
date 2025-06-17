'use client'

import { memo } from 'react'
import ProductGrid from './product-grid'
import { Button } from '../../../../components/ui/button'
import { Loader2, Grid3X3 } from 'lucide-react'
import type { Product } from '../../../../types/product'

interface ProductListProps {
    products: Product[]
    isLoading: boolean
    totalProducts: number
    currentPage: number
    totalPages: number
    limit: number
    onAddToCart: (product: Product) => void
    onPageChange: (page: number) => void
    onFilterReset: () => void
}

// Memoized component to prevent unnecessary re-renders
const ProductList = memo(
    ({
        products,
        isLoading,
        totalProducts,
        currentPage,
        totalPages,
        limit,
        onAddToCart,
        onPageChange,
        onFilterReset,
    }: ProductListProps) => {
        if (products.length === 0 && !isLoading) {
            return (
                <div className="rounded-lg bg-white py-12 text-center shadow-sm">
                    <div className="mb-4 text-gray-400">
                        <Grid3X3 className="mx-auto h-16 w-16" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                        Không tìm thấy sản phẩm
                    </h3>
                    <p className="mb-4 text-gray-500">
                        Không có sản phẩm nào phù hợp với bộ lọc hiện tại.
                    </p>
                    <Button onClick={onFilterReset}>Đặt lại bộ lọc</Button>
                </div>
            )
        }

        return (
            <>
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-gray-600">
                        Hiển thị{' '}
                        <span className="font-medium">
                            {(currentPage - 1) * limit + 1}-
                            {Math.min(currentPage * limit, totalProducts)}
                        </span>{' '}
                        trên{' '}
                        <span className="font-medium">{totalProducts}</span> sản
                        phẩm
                    </p>
                    {isLoading && (
                        <div className="flex items-center gap-2 text-blue-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Đang tải...</span>
                        </div>
                    )}
                </div>

                <ProductGrid products={products} onAddToCart={onAddToCart} />

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <div className="flex flex-wrap gap-1">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    onPageChange(Math.max(1, currentPage - 1))
                                }
                                disabled={currentPage === 1}
                                className="min-w-[80px]"
                            >
                                &laquo; Trước
                            </Button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(
                                    (page) =>
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 &&
                                            page <= currentPage + 1),
                                )
                                .map((page, index, array) => {
                                    // Thêm dấu ... nếu có khoảng cách giữa các số trang
                                    const elements = []

                                    if (
                                        index > 0 &&
                                        page - array[index - 1] > 1
                                    ) {
                                        elements.push(
                                            <span
                                                key={`ellipsis-${page}`}
                                                className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700"
                                            >
                                                ...
                                            </span>,
                                        )
                                    }

                                    elements.push(
                                        <Button
                                            key={page}
                                            variant={
                                                currentPage === page
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            onClick={() => onPageChange(page)}
                                            className="min-w-[40px]"
                                        >
                                            {page}
                                        </Button>,
                                    )

                                    return elements
                                })}

                            <Button
                                variant="outline"
                                onClick={() =>
                                    onPageChange(
                                        Math.min(totalPages, currentPage + 1),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="min-w-[80px]"
                            >
                                Tiếp &raquo;
                            </Button>
                        </div>
                    </div>
                )}
            </>
        )
    },
)

ProductList.displayName = 'ProductList'

export default ProductList
