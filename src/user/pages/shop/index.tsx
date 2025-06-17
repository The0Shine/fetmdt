'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useCart } from '../../contexts/cart-context'
import { getProducts } from '../../../services/apiProduct.service'
import { getAllCategories } from '../../../services/apiCategory.service'
import ProductFilters from '../home/product/product-filters'
import CategorySidebar from '../category/category-sidebar'
import ProductGrid from '../home/product/product-grid'
import type { Product } from '../../../types/product'
import type { ICategory } from '../../../types/category'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { Button } from '../../../components/ui/button'
import { Loader2, Grid3X3 } from 'lucide-react'

export default function ShopPage() {
    const { addItem } = useCart()
    const [isLoading, setIsLoading] = useState(true)
    const [categoriesLoading, setCategoriesLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<ICategory[]>([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // State cho query parameters từ URL
    const [urlParams, setUrlParams] = useState({
        subcategory: null as string | null,
        category: null as string | null,
        featured: null as boolean | null,
        hot: null as boolean | null,
        new: null as boolean | null,
        recommended: null as boolean | null,
        search: null as string | null,
    })

    // State cho bộ lọc
    const [filters, setFilters] = useState({
        searchTerm: '',
        priceRange: [0, 100000000] as [number, number],
        onlyInStock: false,
        sortBy: 'featured',
        limit: 12,
    })

    // Lấy tham số URL khi component mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        setUrlParams({
            subcategory: params.get('subcategory'),
            category: params.get('category'),
            featured: params.get('featured') === 'true' ? true : null,
            hot: params.get('hot') === 'true' ? true : null,
            new: params.get('new') === 'true' ? true : null,
            recommended: params.get('recommended') === 'true' ? true : null,
            search: params.get('search'),
        })

        // Lấy trang hiện tại từ URL nếu có
        const page = params.get('page')
        if (page) {
            setCurrentPage(Number.parseInt(page))
        }

        // Lấy search term từ URL
        const searchTerm = params.get('search')
        if (searchTerm) {
            setFilters((prev) => ({ ...prev, searchTerm }))
        }
    }, [])

    // Fetch tất cả danh mục từ API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true)
                const response = await getAllCategories()
                if (response?.success && response.data) {
                    setCategories(response.data)
                }
            } catch (err) {
                console.error('Error fetching categories:', err)
            } finally {
                setCategoriesLoading(false)
            }
        }

        fetchCategories()
    }, [])

    // Chuyển đổi sortBy thành tham số sort cho API
    const getSortParam = useCallback((sortValue: string): string => {
        switch (sortValue) {
            case 'price-asc':
                return 'price'
            case 'price-desc':
                return '-price'
            case 'name-asc':
                return 'name'
            case 'name-desc':
                return '-name'
            case 'newest':
                return '-createdAt'
            case 'featured':
            default:
                return '-featured'
        }
    }, [])

    // Fetch sản phẩm từ API khi các tham số thay đổi - sử dụng useCallback để tránh re-render không cần thiết
    const fetchProducts = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            // Xây dựng tham số truy vấn cho API
            const queryParams: any = {
                page: currentPage,
                limit: filters.limit,
                published: true, // Chỉ lấy sản phẩm đã xuất bản
            }

            // Thêm sort parameter
            if (filters.sortBy) {
                queryParams.sort = getSortParam(filters.sortBy)
            }

            // Thêm các tham số từ URL
            if (urlParams.category) queryParams.category = urlParams.category
            if (urlParams.featured) queryParams.featured = urlParams.featured
            if (urlParams.hot) queryParams.hot = urlParams.hot
            if (urlParams.new) queryParams.new = urlParams.new
            if (urlParams.recommended)
                queryParams.recommended = urlParams.recommended
            if (urlParams.subcategory)
                queryParams.subcategory = urlParams.subcategory
            // Thêm các tham số lọc
            if (filters.searchTerm || urlParams.search) {
                queryParams.search = filters.searchTerm || urlParams.search
            }
            if (filters.onlyInStock) queryParams.inStock = true
            if (filters.priceRange[0] > 0)
                queryParams.minPrice = filters.priceRange[0]
            if (filters.priceRange[1] < 100000000)
                queryParams.maxPrice = filters.priceRange[1]

            console.log('Fetching products with params:', queryParams)

            const response = await getProducts(queryParams)

            if (response?.success) {
                setProducts(response.data || [])
                setTotalProducts(response.total || 0)
                setTotalPages(response.pagination?.totalPages || 1)
            } else {
                setError(
                    response?.message ||
                        'Không thể tải sản phẩm. Vui lòng thử lại sau.',
                )
            }
        } catch (err: any) {
            console.error('Error fetching products:', err)
            setError(
                err.message ||
                    'Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.',
            )
        } finally {
            setIsLoading(false)
        }
    }, [currentPage, filters, urlParams, getSortParam])

    // Chạy fetchProducts khi các dependencies thay đổi
    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const handleAddToCart = useCallback(
        (product: Product) => {
            addItem(product, 1)
        },
        [addItem],
    )

    // Xử lý thay đổi tìm kiếm - chỉ khi nhấn Enter
    const handleSearchChange = useCallback((value: string) => {
        setFilters((prev) => ({ ...prev, searchTerm: value }))
        // Reset về trang 1 khi tìm kiếm
        setCurrentPage(1)

        // Cập nhật URL với search term
        const url = new URL(window.location.href)
        if (value) {
            url.searchParams.set('search', value)
        } else {
            url.searchParams.delete('search')
        }
        url.searchParams.delete('page')
        window.history.pushState({}, '', url.toString())
    }, [])

    const handleFilterApply = useCallback(() => {
        // Reset về trang 1 khi áp dụng bộ lọc mới
        setCurrentPage(1)
    }, [])

    const handleFilterReset = useCallback(() => {
        setFilters({
            searchTerm: '',
            priceRange: [0, 100000000],
            onlyInStock: false,
            sortBy: 'featured',
            limit: 12,
        })
        setCurrentPage(1)

        // Reset URL
        const url = new URL(window.location.href)
        url.searchParams.delete('search')
        url.searchParams.delete('page')
        window.history.pushState({}, '', url.toString())
    }, [])

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
        // Cập nhật URL với tham số page mới
        const url = new URL(window.location.href)
        url.searchParams.set('page', page.toString())
        window.history.pushState({}, '', url.toString())
        // Cuộn lên đầu trang
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    const handleCategorySelect = useCallback(
        (categoryId: string, categorySlug?: string) => {
            // Reset filters khi chọn category mới
            setCurrentPage(1)

            // Cập nhật URL params
            const url = new URL(window.location.href)

            if (categoryId) {
                url.searchParams.set('category', categoryId)
                setUrlParams((prev) => ({ ...prev, category: categoryId }))
            } else {
                url.searchParams.delete('category')
                setUrlParams((prev) => ({ ...prev, category: null }))
            }

            url.searchParams.delete('page')
            window.history.pushState({}, '', url.toString())
        },
        [],
    )

    // Memoize the filter component to prevent unnecessary re-renders
    const filterComponent = useMemo(
        () => (
            <ProductFilters
                searchTerm={filters.searchTerm}
                onSearchChange={handleSearchChange}
                priceRange={filters.priceRange}
                onPriceRangeChange={(value) =>
                    setFilters((prev) => ({ ...prev, priceRange: value }))
                }
                onlyInStock={filters.onlyInStock}
                onInStockChange={(value) =>
                    setFilters((prev) => ({ ...prev, onlyInStock: value }))
                }
                sortBy={filters.sortBy}
                onSortChange={(value) =>
                    setFilters((prev) => ({ ...prev, sortBy: value }))
                }
                onFilterApply={handleFilterApply}
                onFilterReset={handleFilterReset}
            />
        ),
        [
            filters.searchTerm,
            filters.priceRange,
            filters.onlyInStock,
            filters.sortBy,
            handleSearchChange,
            handleFilterApply,
            handleFilterReset,
        ],
    )

    // Memoize the category sidebar to prevent unnecessary re-renders
    const categorySidebar = useMemo(
        () => (
            <CategorySidebar
                categories={categories}
                selectedCategory={urlParams.category || undefined}
                loading={categoriesLoading}
                onCategorySelect={handleCategorySelect}
            />
        ),
        [
            categories,
            urlParams.category,
            categoriesLoading,
            handleCategorySelect,
        ],
    )

    // Hiển thị trạng thái loading ban đầu
    if (isLoading && products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 lg:px-8">
                <div className="flex h-96 items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
                        <p className="text-lg text-gray-600">
                            Đang tải sản phẩm...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 lg:px-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                    Cửa hàng
                </h1>
                <p className="mt-2 text-gray-600">
                    Khám phá bộ sưu tập sản phẩm đa dạng của chúng tôi
                </p>
            </div>

            {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Filters - Always at the top */}
            {filterComponent}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">{categorySidebar}</div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {products.length > 0 ? (
                        <>
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-gray-600">
                                    Hiển thị{' '}
                                    <span className="font-medium">
                                        {(currentPage - 1) * filters.limit + 1}-
                                        {Math.min(
                                            currentPage * filters.limit,
                                            totalProducts,
                                        )}
                                    </span>{' '}
                                    trên{' '}
                                    <span className="font-medium">
                                        {totalProducts}
                                    </span>{' '}
                                    sản phẩm
                                </p>
                                {isLoading && (
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-sm">
                                            Đang tải...
                                        </span>
                                    </div>
                                )}
                            </div>

                            <ProductGrid
                                products={products}
                                onAddToCart={handleAddToCart}
                            />

                            {/* Phân trang */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <div className="flex flex-wrap gap-1">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                handlePageChange(
                                                    Math.max(
                                                        1,
                                                        currentPage - 1,
                                                    ),
                                                )
                                            }
                                            disabled={currentPage === 1}
                                            className="min-w-[80px]"
                                        >
                                            &laquo; Trước
                                        </Button>

                                        {Array.from(
                                            { length: totalPages },
                                            (_, i) => i + 1,
                                        )
                                            .filter(
                                                (page) =>
                                                    page === 1 ||
                                                    page === totalPages ||
                                                    (page >= currentPage - 1 &&
                                                        page <=
                                                            currentPage + 1),
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
                                                        onClick={() =>
                                                            handlePageChange(
                                                                page,
                                                            )
                                                        }
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
                                                handlePageChange(
                                                    Math.min(
                                                        totalPages,
                                                        currentPage + 1,
                                                    ),
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="min-w-[80px]"
                                        >
                                            Tiếp &raquo;
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : !isLoading ? (
                        <div className="rounded-lg bg-white py-12 text-center shadow-sm">
                            <div className="mb-4 text-gray-400">
                                <Grid3X3 className="mx-auto h-16 w-16" />
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                                Không tìm thấy sản phẩm
                            </h3>
                            <p className="mb-4 text-gray-500">
                                Không có sản phẩm nào phù hợp với bộ lọc hiện
                                tại.
                            </p>
                            <Button onClick={handleFilterReset}>
                                Đặt lại bộ lọc
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
