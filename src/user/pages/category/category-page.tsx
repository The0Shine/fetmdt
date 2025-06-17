'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProducts } from '../../../services/apiProduct.service'
import { getAllCategories } from '../../../services/apiCategory.service'
import CategorySidebar from './category-sidebar'
import ProductFilters from '../home/product/product-filters'
import { Loader2, Grid3X3 } from 'lucide-react'
import type { Product } from '../../../types/product'
import type { ICategory } from '../../../types/category'
import ProductGrid from '../home/product/product-grid'
import { useCart } from '../../contexts/cart-context'
import { Button } from '../../../components/ui/button'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from '../../../components/ui/breadcrumb'
import { Home } from 'lucide-react'

interface CategoryPageProps {
    category?: string
}

export default function CategoryPage({
    category: propCategory,
}: CategoryPageProps) {
    const params = useParams()
    const navigate = useNavigate()
    const categorySlug = propCategory || params.category
    const { addItem } = useCart()

    // States
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<ICategory[]>([])
    const [loading, setLoading] = useState(true)
    const [categoriesLoading, setCategoriesLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [categoryInfo, setCategoryInfo] = useState<{
        name: string
        id: string
        description?: string
        parent?: ICategory | null
    }>({
        name: '',
        id: '',
    })

    // Filter states
    const [filters, setFilters] = useState({
        searchTerm: '',
        priceRange: [0, 1000000] as [number, number],
        onlyInStock: false,
        sortBy: 'newest',
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)
    const [limit] = useState(12)

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true)
                const response = await getAllCategories()

                if (response?.success && response.data) {
                    setCategories(response.data)
                } else {
                    setCategories([])
                }
            } catch (err) {
                console.error('Error fetching categories:', err)
                setCategories([])
            } finally {
                setCategoriesLoading(false)
            }
        }

        fetchCategories()
    }, [])

    // Find category info from slug
    useEffect(() => {
        const findCategoryInfo = async () => {
            if (!categorySlug) {
                setCategoryInfo({
                    id: '',
                    name: 'Tất cả sản phẩm',
                    description: 'Xem tất cả sản phẩm có sẵn',
                })
                return
            }

            // First try to find in already loaded categories
            if (categories.length > 0) {
                // Look in main categories
                const mainCategory = categories.find(
                    (cat) => cat.slug === categorySlug,
                )
                console.log(mainCategory)

                if (mainCategory) {
                    setCategoryInfo({
                        id: mainCategory._id,
                        name: mainCategory.name,
                        description: mainCategory.description,
                        parent: mainCategory.parent,
                    })
                    return
                }

                // Look in subcategories
                // for (const cat of categories) {
                //     if (cat.pare && cat.subcategories.length > 0) {
                //         const subcat = cat.subcategories.find(
                //             (sub: any) => sub.slug === categorySlug,
                //         )
                //         if (subcat) {
                //             setCategoryInfo({
                //                 id: subcat._id,
                //                 name: subcat.name,
                //                 description: subcat.description,
                //                 parent: cat,
                //             })
                //             return
                //         }
                //     }
                // }
            }

            // If not found in loaded categories, try to fetch by slug
            try {
                // This is a simplified approach - in a real app, you might want to have an API endpoint to get category by slug
                const allCategoriesResponse = await getAllCategories()
                if (
                    allCategoriesResponse?.success &&
                    allCategoriesResponse.data
                ) {
                    const allCats = allCategoriesResponse.data

                    // Look in all categories
                    const foundCat = allCats.find(
                        (cat) => cat.slug === categorySlug,
                    )
                    if (foundCat) {
                        setCategoryInfo({
                            id: foundCat._id,
                            name: foundCat.name,
                            description: foundCat.description,
                            parent: foundCat.parent,
                        })
                        return
                    }

                    // Look in all subcategories
                    // for (const cat of allCats) {
                    //     if (cat.subcategories && cat.subcategories.length > 0) {
                    //         const subcat = cat.subcategories.find(
                    //             (sub: any) => sub.slug === categorySlug,
                    //         )
                    //         if (subcat) {
                    //             setCategoryInfo({
                    //                 id: subcat._id,
                    //                 name: subcat.name,
                    //                 description: subcat.description,
                    //                 parent: cat,
                    //             })
                    //             return
                    //         }
                    //     }
                    // }
                }

                // If still not found, set default
                setCategoryInfo({
                    id: '',
                    name: 'Danh mục không tồn tại',
                    description: 'Không tìm thấy danh mục này',
                })
            } catch (err) {
                console.error('Error finding category:', err)
                setCategoryInfo({
                    id: '',
                    name: 'Lỗi tải danh mục',
                    description: 'Có lỗi xảy ra khi tải thông tin danh mục',
                })
            }
        }

        findCategoryInfo()
    }, [categorySlug, categories])

    // Fetch products
    const fetchProducts = useCallback(async () => {
        if (categoriesLoading) return

        setLoading(true)
        setError(null)

        try {
            const params: any = {
                page: currentPage,
                limit: limit,
                published: true, // Only fetch published products
            }

            // Add price filter if different from default
            if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) {
                params.minPrice = filters.priceRange[0]
                params.maxPrice = filters.priceRange[1]
            }
            console.log(categoryInfo)

            // Add category filter if available
            if (categoryInfo.id && categoryInfo.parent) {
                params.subcategory = categoryInfo.id
            }
            if (!categoryInfo.parent) {
                params.category = categoryInfo.id
            }
            // Add search term if available
            if (filters.searchTerm) {
                params.search = filters.searchTerm
            }

            // Add in-stock filter if enabled
            if (filters.onlyInStock) {
                params.inStock = true
            }

            // Add sort option
            if (filters.sortBy !== 'newest') {
                const sortMap: Record<string, string> = {
                    'price-asc': 'price,asc',
                    'price-desc': 'price,desc',
                    'name-asc': 'name,asc',
                    'name-desc': 'name,desc',
                    featured: 'featured,desc',
                }
                params.sort = sortMap[filters.sortBy] || 'createdAt,desc'
            }

            const response = await getProducts(params)

            if (response?.success) {
                setProducts(response.data || [])
                setTotalPages(response.pagination?.totalPages || 1)
                setTotalProducts(response.total || 0)
            } else {
                setError('Không thể tải sản phẩm. Vui lòng thử lại sau.')
                setProducts([])
            }
        } catch (err) {
            console.error('Error fetching products:', err)
            setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.')
            setProducts([])
        } finally {
            setLoading(false)
        }
    }, [categoryInfo.id, currentPage, filters, categoriesLoading, limit])

    // Fetch products when dependencies change
    useEffect(() => {
        if (!categoriesLoading && categoryInfo.name) {
            fetchProducts()
        }
    }, [fetchProducts, categoriesLoading, categoryInfo])

    // Handle add to cart
    const handleAddToCart = useCallback(
        (product: Product) => {
            addItem(product, 1)
        },
        [addItem],
    )

    // Handle category selection
    const handleCategorySelect = useCallback(
        (categoryId: string, categorySlug?: string) => {
            setCurrentPage(1)

            if (categorySlug) {
                navigate(`/shop/category/${categorySlug}`)
            } else {
                navigate('/shop')
            }
        },
        [navigate],
    )

    // Handle search change
    const handleSearchChange = useCallback((value: string) => {
        setFilters((prev) => ({ ...prev, searchTerm: value }))
        setCurrentPage(1)
    }, [])

    // Handle price range change
    const handlePriceRangeChange = useCallback((range: [number, number]) => {
        setFilters((prev) => ({ ...prev, priceRange: range }))
        setCurrentPage(1)
    }, [])

    // Handle in-stock filter change
    const handleInStockChange = useCallback((value: boolean) => {
        setFilters((prev) => ({ ...prev, onlyInStock: value }))
        setCurrentPage(1)
    }, [])

    // Handle sort change
    const handleSortChange = useCallback((value: string) => {
        setFilters((prev) => ({ ...prev, sortBy: value }))
        setCurrentPage(1)
    }, [])

    // Handle page change
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    // Reset all filters
    const handleResetAllFilters = useCallback(() => {
        setFilters({
            searchTerm: '',
            priceRange: [0, 1000000],
            onlyInStock: false,
            sortBy: 'newest',
        })
        setCurrentPage(1)
        // Navigate to shop page if on category page
        if (categorySlug) {
            navigate('/shop')
        }
    }, [navigate, categorySlug])

    // Reset only price and sort filters (keep category)
    const handleResetFilters = useCallback(() => {
        setFilters({
            searchTerm: '',
            priceRange: [0, 1000000],
            onlyInStock: false,
            sortBy: 'newest',
        })
        setCurrentPage(1)
    }, [])

    // Memoize the filter component to prevent unnecessary re-renders
    const filterComponent = useMemo(
        () => (
            <ProductFilters
                searchTerm={filters.searchTerm}
                onSearchChange={handleSearchChange}
                priceRange={filters.priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                onlyInStock={filters.onlyInStock}
                onInStockChange={handleInStockChange}
                sortBy={filters.sortBy}
                onSortChange={handleSortChange}
                onFilterApply={() => {}}
                onFilterReset={handleResetFilters}
            />
        ),
        [
            filters.searchTerm,
            filters.priceRange,
            filters.onlyInStock,
            filters.sortBy,
            handleSearchChange,
            handlePriceRangeChange,
            handleInStockChange,
            handleSortChange,
            handleResetFilters,
        ],
    )

    // Memoize the category sidebar to prevent unnecessary re-renders
    const categorySidebarComponent = useMemo(
        () => (
            <CategorySidebar
                categories={categories}
                activeCategory={categorySlug}
                loading={categoriesLoading}
                onCategorySelect={handleCategorySelect}
            />
        ),
        [categories, categorySlug, categoriesLoading, handleCategorySelect],
    )

    // Generate breadcrumbs
    const breadcrumbs = useMemo(() => {
        const crumbs = [
            { name: 'Trang chủ', path: '/' },
            { name: 'Cửa hàng', path: '/shop' },
        ]

        if (categoryInfo.parent) {
            crumbs.push({
                name: categoryInfo.parent.name,
                path: `/shop/category/${categoryInfo.parent.slug}`,
            })
        }

        if (categoryInfo.name && categoryInfo.name !== 'Tất cả sản phẩm') {
            crumbs.push({
                name: categoryInfo.name,
                path: `/shop/category/${categorySlug}`,
            })
        }

        return crumbs
    }, [categoryInfo, categorySlug])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumbs */}
                <Breadcrumb className="mb-4">
                    {breadcrumbs.map((crumb, index) => (
                        <BreadcrumbItem key={index}>
                            <BreadcrumbLink
                                href={crumb.path}
                                className="flex items-center"
                            >
                                {index === 0 && (
                                    <Home className="mr-1 h-3 w-3" />
                                )}
                                {crumb.name}
                            </BreadcrumbLink>
                            {index < breadcrumbs.length - 1 && (
                                <BreadcrumbSeparator />
                            )}
                        </BreadcrumbItem>
                    ))}
                </Breadcrumb>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {categoryInfo.name || 'Đang tải...'}
                    </h1>
                    {categoryInfo.description && (
                        <p className="mt-2 text-gray-600">
                            {categoryInfo.description}
                        </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                        {loading
                            ? 'Đang tải...'
                            : `${totalProducts} sản phẩm có sẵn`}
                    </p>
                </div>

                {/* Filters */}
                {filterComponent}

                {error && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {categorySidebarComponent}
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {loading && products.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white">
                                <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-500" />
                                <p className="text-gray-600">
                                    Đang tải sản phẩm...
                                </p>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="rounded-xl bg-white p-6">
                                <ProductGrid
                                    products={products}
                                    onAddToCart={handleAddToCart}
                                />

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handlePageChange(
                                                        Math.max(
                                                            1,
                                                            currentPage - 1,
                                                        ),
                                                    )
                                                }
                                                disabled={currentPage === 1}
                                            >
                                                Trước
                                            </Button>

                                            <span className="px-4 py-2 text-sm text-gray-600">
                                                Trang {currentPage} /{' '}
                                                {totalPages}
                                            </span>

                                            <Button
                                                variant="outline"
                                                size="sm"
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
                                            >
                                                Sau
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-xl bg-white p-12 text-center">
                                <div className="mb-4 text-gray-400">
                                    <Grid3X3 className="mx-auto h-16 w-16" />
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-gray-900">
                                    Không tìm thấy sản phẩm
                                </h3>
                                <p className="mb-4 text-gray-500">
                                    {categoryInfo.id
                                        ? 'Không có sản phẩm nào trong danh mục này hoặc phù hợp với bộ lọc của bạn.'
                                        : 'Không có sản phẩm nào phù hợp với bộ lọc của bạn.'}
                                </p>
                                <div className="flex justify-center gap-3">
                                    <Button
                                        onClick={handleResetFilters}
                                        variant="outline"
                                    >
                                        Xóa bộ lọc
                                    </Button>
                                    <Button onClick={handleResetAllFilters}>
                                        Xem tất cả sản phẩm
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
