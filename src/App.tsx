import { Routes, Route, Navigate } from 'react-router-dom'

import adminRoutes from './admin/constants/routes'

import { MainLayout } from './admin/layouts'

import { Login, SignUp } from './admin/pages' // hoặc bạn tách auth riêng

import PrivateRoute from './components/PrivateRoute'
import ShopLayout from './user/layouts/ShopLayout'
import CategoryPage from './user/pages/category/category-page'
import CheckoutSuccess from './user/pages/checkout/checkout-success'
import CartPage from './user/pages/cart/cart-page'
import CheckoutPage from './user/pages/checkout/checkout-page'
import UserOrders from './user/pages/account/user-order'
import ProductDetail from './user/pages/productdetail/ProductDetail'
import AboutPage from './user/pages/about/page'
import ShopPage from './user/pages/shop'
import ShopHomePage from './user/pages/home/page'
import OrderDetail from './admin/pages/orders/order-detail'
import ProductEdit from './admin/pages/products/components/product-edit'
import AccountPage from './user/pages/account/account-page'
import VNPayReturn from './user/pages/payment/vnpay-return'
import CheckoutFailed from './user/pages/checkout/checkout-failed'
import WishlistPage from './user/pages/wishlist/wishlist-page'
const App = () => (
    <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin routes (Private) */}
        <Route path="/admin" element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
                {adminRoutes.map(({ href, component: Component }, index) => (
                    <Route key={index} path={href} element={<Component />} />
                ))}
                <Route path="orders/:orderId" element={<OrderDetail />} />
                <Route path="products/edit/:id" element={<ProductEdit />} />
            </Route>
        </Route>

        {/* User routes */}
        <Route path="/" element={<ShopLayout />}>
            <Route index element={<ShopHomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="shop/category/:category" element={<CategoryPage />} />
            <Route path="shop/product/:id" element={<ProductDetail />} />
            <Route path="about" element={<AboutPage />} />

            {/* User protected routes */}
            <Route element={<PrivateRoute />}>
                <Route path="account" element={<AccountPage />} />
                <Route path="account/orders" element={<UserOrders />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="checkout/success" element={<CheckoutSuccess />} />
                <Route path="checkout/failed" element={<CheckoutFailed />} />
            </Route>
        </Route>

        {/* Payment routes */}
        <Route path="/payment/vnpay-return" element={<VNPayReturn />} />
    </Routes>
)

export default App
