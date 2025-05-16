import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { Product } from '../../../types/product'
import ProductFilters from '../home/product/product-filters'
import ProductGrid from '../home/product/product-grid'
import CategorySidebar from './category-sidebar'
import { products as MockProducts } from '../../data/products'

// Giả lập dữ liệu sản phẩm

// Ánh xạ tên danh mục tiếng Anh sang tiếng Việt
const categoryNames: Record<string, string> = {
    electronics: 'Điện tử',
    fashion: 'Thời trang',
    home: 'Nhà cửa',
    beauty: 'Làm đẹp',
    food: 'Thực phẩm',
}

export default function CategoryPage() {
    const { category = 'electronics' } = useParams<{ category: string }>() // lấy category từ URL
    const [products, setProducts] = useState<Product[]>([])
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [sortOption, setSortOption] = useState('popular')
    const [priceRange, setPriceRange] = useState<[number, number]>([
        0, 50000000,
    ])
    const [selectedBrands, setSelectedBrands] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            const filteredProducts = MockProducts.filter(
                (product) => product.category === category,
            )
            setProducts(filteredProducts)
            setLoading(false)
        }, 500)
    }, [category])

    const handleSortChange = (option: string) => {
        setSortOption(option)
        const sortedProducts = [...products]

        switch (option) {
            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price)
                break
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price)
                break
            case 'newest':
                sortedProducts.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                )
                break
            case 'popular':
                sortedProducts.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
                break
        }

        setProducts(sortedProducts)
    }

    const handlePriceRangeChange = (range: [number, number]) => {
        setPriceRange(range)
        // Thực hiện lọc theo giá ở đây
    }

    const handleBrandChange = (brands: string[]) => {
        setSelectedBrands(brands)
        // Thực hiện lọc theo thương hiệu ở đây
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-8 md:flex-row">
                {/* Sidebar */}
                <div className="hidden w-64 flex-shrink-0 md:block">
                    <CategorySidebar currentCategory={category} />
                    <div className="mt-8">
                        <ProductFilters
                            priceRange={priceRange}
                            onPriceRangeChange={handlePriceRangeChange}
                            selectedBrands={selectedBrands}
                            onBrandChange={handleBrandChange}
                        />
                    </div>
                </div>

                {/* Nội dung chính */}
                <div className="flex-1">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {categoryNames[category] ||
                                category.charAt(0).toUpperCase() +
                                    category.slice(1)}
                        </h1>
                        <p className="mt-1 text-gray-600">
                            {products.length} sản phẩm trong danh mục này
                        </p>
                    </div>

                    {/* Bộ lọc mobile */}
                    <div className="mb-4 flex items-center justify-between md:hidden">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2"
                        >
                            <SlidersHorizontal size={18} />
                            <span>Lọc</span>
                        </button>
                        <div className="relative">
                            <select
                                value={sortOption}
                                onChange={(e) =>
                                    handleSortChange(e.target.value)
                                }
                                className="appearance-none rounded-md bg-gray-100 px-4 py-2 pr-8"
                            >
                                <option value="popular">Phổ biến</option>
                                <option value="newest">Mới nhất</option>
                                <option value="price-asc">
                                    Giá: Thấp đến cao
                                </option>
                                <option value="price-desc">
                                    Giá: Cao đến thấp
                                </option>
                            </select>
                            <ChevronDown
                                size={16}
                                className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 transform"
                            />
                        </div>
                    </div>

                    {/* Bộ lọc mobile dropdown */}
                    {isFilterOpen && (
                        <div className="mb-6 rounded-lg bg-white p-4 shadow-md md:hidden">
                            <ProductFilters
                                priceRange={priceRange}
                                onPriceRangeChange={handlePriceRangeChange}
                                selectedBrands={selectedBrands}
                                onBrandChange={handleBrandChange}
                            />
                        </div>
                    )}

                    {/* Bộ lọc desktop */}
                    <div className="mb-6 hidden justify-end md:flex">
                        <div className="relative">
                            <select
                                value={sortOption}
                                onChange={(e) =>
                                    handleSortChange(e.target.value)
                                }
                                className="appearance-none rounded-md bg-gray-100 px-4 py-2 pr-8"
                            >
                                <option value="popular">Phổ biến</option>
                                <option value="newest">Mới nhất</option>
                                <option value="price-asc">
                                    Giá: Thấp đến cao
                                </option>
                                <option value="price-desc">
                                    Giá: Cao đến thấp
                                </option>
                            </select>
                            <ChevronDown
                                size={16}
                                className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 transform"
                            />
                        </div>
                    </div>

                    {/* Hiển thị sản phẩm */}
                    {loading ? (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {[...Array(8)].map((_, index) => (
                                <div
                                    key={index}
                                    className="animate-pulse rounded-lg bg-gray-100 p-4"
                                >
                                    <div className="mb-4 h-48 w-full rounded-md bg-gray-200"></div>
                                    <div className="mb-2 h-4 rounded bg-gray-200"></div>
                                    <div className="mb-4 h-4 w-2/3 rounded bg-gray-200"></div>
                                    <div className="h-6 w-1/3 rounded bg-gray-200"></div>
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <ProductGrid products={products} />
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-lg text-gray-500">
                                Không tìm thấy sản phẩm nào trong danh mục này.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
