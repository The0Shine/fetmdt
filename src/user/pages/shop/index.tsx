import { useState, useMemo, useEffect } from 'react'
import { useCart } from '../../contexts/cart-context'
import { products } from '../../data/products'
import ProductFilters from '../home/product/product-filters'
import CategorySidebar from '../category/category-sidebar'
import ProductGrid from '../home/product/product-grid'

export default function ShopPage() {
    const { addItem } = useCart()

    // State cho query parameters
    const [categoryParam, setCategoryParam] = useState<string | null>(null)
    const [featuredParam, setFeaturedParam] = useState<string | null>(null)
    const [hotParam, setHotParam] = useState<string | null>(null)
    const [newParam, setNewParam] = useState<string | null>(null)
    const [recommendedParam, setRecommendedParam] = useState<string | null>(
        null,
    )

    // State cho bộ lọc
    const [searchTerm, setSearchTerm] = useState('')
    const [priceRange, setPriceRange] = useState<[number, number]>([
        0, 100000000,
    ])
    const [onlyInStock, setOnlyInStock] = useState(false)
    const [sortBy, setSortBy] = useState('featured')

    // Lấy tham số URL khi component mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        setCategoryParam(params.get('category'))
        setFeaturedParam(params.get('featured'))
        setHotParam(params.get('hot'))
        setNewParam(params.get('new'))
        setRecommendedParam(params.get('recommended'))
    }, [])

    // Lọc sản phẩm dựa trên các bộ lọc
    const filteredProducts = useMemo(() => {
        let filtered = [...products]

        if (categoryParam) {
            filtered = filtered.filter(
                (product) =>
                    product.category.toLowerCase() ===
                    categoryParam.toLowerCase(),
            )
        }

        if (featuredParam === 'true') {
            filtered = filtered.filter((product) => product.featured)
        }

        if (hotParam === 'true') {
            filtered = filtered.filter((product) => product.hot)
        }

        if (newParam === 'true') {
            filtered = filtered.filter((product) => product.new)
        }

        if (recommendedParam === 'true') {
            filtered = filtered.filter((product) => product.recommended)
        }

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            filtered = filtered.filter(
                (product) =>
                    product.name.toLowerCase().includes(searchLower) ||
                    product.category.toLowerCase().includes(searchLower) ||
                    product.description.toLowerCase().includes(searchLower),
            )
        }

        filtered = filtered.filter(
            (product) =>
                product.price >= priceRange[0] &&
                product.price <= priceRange[1],
        )

        if (onlyInStock) {
            filtered = filtered.filter(
                (product) => product.status === 'in-stock',
            )
        }

        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price)
                break
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price)
                break
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name))
                break
            case 'newest':
                filtered = filtered
                    .filter((product) => product.new)
                    .concat(filtered.filter((product) => !product.new))
                break
            case 'featured':
            default:
                filtered = filtered
                    .filter((product) => product.featured)
                    .concat(filtered.filter((product) => !product.featured))
                break
        }

        return filtered
    }, [
        categoryParam,
        featuredParam,
        hotParam,
        newParam,
        recommendedParam,
        searchTerm,
        priceRange,
        onlyInStock,
        sortBy,
    ])

    const handleAddToCart = (product) => {
        addItem(product, 1)
    }

    const handleFilterApply = () => {
        // Đã được xử lý thông qua state và useMemo
    }

    const handleFilterReset = () => {
        setSearchTerm('')
        setPriceRange([0, 100000000])
        setOnlyInStock(false)
        setSortBy('featured')
    }

    return (
        <div className="container mx-auto px-8 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-800">Cửa hàng</h1>

            <ProductFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                onlyInStock={onlyInStock}
                onInStockChange={setOnlyInStock}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onFilterApply={handleFilterApply}
                onFilterReset={handleFilterReset}
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                <div className="lg:col-span-1">
                    <CategorySidebar
                        selectedCategory={categoryParam || undefined}
                    />
                </div>

                <div className="lg:col-span-3">
                    {filteredProducts.length > 0 ? (
                        <>
                            <p className="mb-4 text-gray-600">
                                Hiển thị {filteredProducts.length} sản phẩm
                            </p>
                            <ProductGrid
                                products={filteredProducts}
                                onAddToCart={handleAddToCart}
                            />
                        </>
                    ) : (
                        <div className="rounded-lg bg-white py-12 text-center shadow-sm">
                            <p className="mb-4 text-gray-500">
                                Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                            </p>
                            <button
                                onClick={handleFilterReset}
                                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                Đặt lại bộ lọc
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
