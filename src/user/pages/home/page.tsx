import { useCart } from '../../contexts/cart-context'
import { banners } from '../../data/banners'
import {
    getFeaturedProducts,
    getHotProducts,
    getNewProducts,
    getRecommendedProducts,
} from '../../data/products'
import CategoryGrid from './components/category-grid'
import HeroBanner from './components/hero-banner'
import ProductSection from './components/product-section'
import SecondaryBanner from './components/secondary-banner'

export default function ShopHomePage() {
    const { addItem } = useCart()

    // Lấy banner chính
    const mainBanner = banners.find((banner) => banner.position === 'main')

    // Lấy các banner phụ
    const secondaryBanners = banners.filter(
        (banner) => banner.position === 'secondary',
    )

    // Lấy các sản phẩm nổi bật, hot, mới và đề xuất
    const featuredProducts = getFeaturedProducts()
    const hotProducts = getHotProducts()
    const newProducts = getNewProducts()
    const recommendedProducts = getRecommendedProducts()

    // Xử lý thêm sản phẩm vào giỏ hàng
    const handleAddToCart = (product) => {
        addItem(product, 1)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Banner */}
            {mainBanner && (
                <div className="mb-8">
                    <HeroBanner banner={mainBanner} />
                </div>
            )}

            {/* Danh mục sản phẩm */}
            <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">
                    Danh mục sản phẩm
                </h2>
                <CategoryGrid />
            </section>

            {/* Sản phẩm nổi bật */}
            <ProductSection
                title="Sản phẩm nổi bật"
                subtitle="Những sản phẩm được khách hàng yêu thích nhất"
                products={featuredProducts}
                viewAllLink="/shop?featured=true"
                onAddToCart={handleAddToCart}
            />

            {/* Banner phụ */}
            {secondaryBanners.length > 0 && (
                <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {secondaryBanners.map((banner) => (
                        <SecondaryBanner key={banner.id} banner={banner} />
                    ))}
                </div>
            )}

            {/* Sản phẩm hot */}
            <ProductSection
                title="Sản phẩm hot"
                subtitle="Đang được tìm kiếm nhiều nhất"
                products={hotProducts}
                viewAllLink="/shop?hot=true"
                onAddToCart={handleAddToCart}
            />

            {/* Sản phẩm mới */}
            <ProductSection
                title="Sản phẩm mới"
                subtitle="Vừa ra mắt tại TechZone"
                products={newProducts}
                viewAllLink="/shop?new=true"
                onAddToCart={handleAddToCart}
            />

            {/* Sản phẩm đề xuất */}
            <ProductSection
                title="Có thể bạn sẽ thích"
                products={recommendedProducts}
                viewAllLink="/shop?recommended=true"
                onAddToCart={handleAddToCart}
            />
        </div>
    )
}
