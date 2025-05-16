import { useState } from 'react'
import { User, Package, CreditCard } from 'lucide-react'
import { useAuth } from '../../contexts/auth-context'
import AccountSidebar from './account-sidebar'
import PasswordForm from './password-form'
import ProfileForm from './profile-form'
import { Link } from 'react-router-dom'

export default function AccountPage() {
    const { user, logout } = useAuth()
    const [activeTab, setActiveTab] = useState('profile')

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                    Bạn chưa đăng nhập
                </h2>
                <p className="mb-8 text-gray-600">
                    Vui lòng đăng nhập để truy cập trang tài khoản.
                </p>
                <Link
                    to="/login"
                    className="inline-flex items-center rounded-md bg-teal-600 px-6 py-3 text-white hover:bg-teal-700"
                >
                    Đăng nhập
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-2xl font-bold text-gray-800">
                Tài khoản của tôi
            </h1>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                {/* Sidebar - Desktop */}
                <div className="hidden md:block">
                    <AccountSidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>

                {/* Sidebar - Mobile */}
                <div className="mb-6 md:hidden">
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="flex overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center px-4 py-3 whitespace-nowrap ${
                                    activeTab === 'profile'
                                        ? 'border-b-2 border-teal-600 text-teal-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <User size={18} className="mr-2" />
                                Hồ sơ
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex items-center px-4 py-3 whitespace-nowrap ${
                                    activeTab === 'orders'
                                        ? 'border-b-2 border-teal-600 text-teal-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <Package size={18} className="mr-2" />
                                Đơn hàng
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`flex items-center px-4 py-3 whitespace-nowrap ${
                                    activeTab === 'password'
                                        ? 'border-b-2 border-teal-600 text-teal-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <CreditCard size={18} className="mr-2" />
                                Mật khẩu
                            </button>
                        </div>
                    </div>
                </div>

                {/* Nội dung chính */}
                <div className="md:col-span-3">
                    {activeTab === 'profile' && <ProfileForm user={user} />}
                    {activeTab === 'password' && <PasswordForm />}
                    {activeTab === 'orders' && (
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Đơn hàng của tôi
                                </h2>
                                <Link
                                    to="/account/orders"
                                    className="text-sm font-medium text-teal-600 hover:text-teal-700"
                                >
                                    Xem tất cả
                                </Link>
                            </div>
                            <div className="py-8 text-center">
                                <Package
                                    size={48}
                                    className="mx-auto mb-4 text-gray-300"
                                />
                                <p className="text-gray-500">
                                    Bạn chưa có đơn hàng nào.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
