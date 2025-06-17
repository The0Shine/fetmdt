'use client'

import { useAuth } from '@/user/contexts/auth-context'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const PrivateRoute = () => {
    const { isAuthenticated, loading, user } = useAuth()
    const location = useLocation()

    // Kiểm tra xem đường dẫn hiện tại có phải là admin route không
    const isAdminRoute = location.pathname.startsWith('/admin')

    if (loading)
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
            </div>
        )

    // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Nếu là admin route nhưng user có role là "user", chuyển hướng về trang chủ user
    if (isAdminRoute && user?.role?.name === 'user') {
        return <Navigate to="/" replace />
    }

    // Nếu là user route nhưng user có role là admin hoặc super_admin, vẫn cho phép truy cập
    // (Vì admin cũng có thể xem các trang user để kiểm tra)

    return <Outlet />
}

export default PrivateRoute
