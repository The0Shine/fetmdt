'use client'

import { useState, useRef, useEffect, useContext } from 'react'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const Account = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleLogout = () => {
        // Xóa token khỏi localStorage
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')

        // Chuyển hướng về trang đăng nhập
        navigate('/login')

        // Đóng dropdown
        setIsDropdownOpen(false)
    }

    const handleProfile = () => {
        // Chuyển hướng đến trang profile (nếu có)
        console.log('Navigate to profile')
        setIsDropdownOpen(false)
    }

    const handleSettings = () => {
        // Chuyển hướng đến trang cài đặt (nếu có)
        console.log('Navigate to settings')
        setIsDropdownOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-white">
                    <User size={16} />
                </div>
                <div className="hidden text-left md:block"></div>
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                    {/* <div className="border-b border-gray-100 px-4 py-2">
                        <p className="text-sm font-medium text-gray-900">
                            Admin
                        </p>
                        <p className="text-xs text-gray-500">
                            admin@example.com
                        </p>
                    </div>

                    <button
                        onClick={handleProfile}
                        className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <User size={16} className="mr-3 text-gray-400" />
                        Thông tin cá nhân
                    </button>

                    <button
                        onClick={handleSettings}
                        className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <Settings size={16} className="mr-3 text-gray-400" />
                        Cài đặt
                    </button> */}

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                        <LogOut size={16} className="mr-3 text-red-500" />
                        Đăng xuất
                    </button>
                </div>
            )}
        </div>
    )
}
