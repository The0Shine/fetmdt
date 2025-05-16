'use client'

import type React from 'react'
import { useState } from 'react'
import { Camera } from 'lucide-react'
import { useAuth } from '../../contexts/auth-context'
import { User } from '../../../types/user'

const ProfileForm: React.FC = () => {
    const { user, updateProfile } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{
        type: 'success' | 'error'
        text: string
    } | null>(null)

    const [formData, setFormData] = useState<Partial<User>>({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        district: user?.district || '',
        ward: user?.ward || '',
        avatar: user?.avatar || '',
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                setFormData((prev) => ({ ...prev, avatar: result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        try {
            const success = await updateProfile(formData)
            if (success) {
                setMessage({
                    type: 'success',
                    text: 'Thông tin cá nhân đã được cập nhật thành công!',
                })
            } else {
                setMessage({
                    type: 'error',
                    text: 'Có lỗi xảy ra khi cập nhật thông tin.',
                })
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Có lỗi xảy ra khi cập nhật thông tin.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
                <div
                    className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                >
                    {message.text}
                </div>
            )}

            <div className="flex flex-col items-center">
                <div className="relative mb-2 h-24 w-24 overflow-hidden rounded-full bg-gray-200">
                    <img
                        src={
                            formData.avatar ||
                            '/placeholder.svg?height=96&width=96'
                        }
                        alt="Avatar"
                        className="object-cover"
                    />
                    <label
                        htmlFor="avatar-upload"
                        className="bg-opacity-50 absolute inset-0 flex cursor-pointer items-center justify-center bg-black opacity-0 transition-opacity hover:opacity-100"
                    >
                        <Camera size={24} className="text-white" />
                    </label>
                    <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>
                <label
                    htmlFor="avatar-upload"
                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                >
                    Thay đổi ảnh đại diện
                </label>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="name"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Họ tên
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Email không thể thay đổi
                    </p>
                </div>

                <div>
                    <label
                        htmlFor="phone"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Số điện thoại
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label
                        htmlFor="address"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Địa chỉ
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label
                        htmlFor="city"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Tỉnh/Thành phố
                    </label>
                    <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">Chọn tỉnh/thành phố</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="district"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Quận/Huyện
                    </label>
                    <select
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">Chọn quận/huyện</option>
                        <option value="Cầu Giấy">Cầu Giấy</option>
                        <option value="Hai Bà Trưng">Hai Bà Trưng</option>
                        <option value="Hoàn Kiếm">Hoàn Kiếm</option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="ward"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Phường/Xã
                    </label>
                    <select
                        id="ward"
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">Chọn phường/xã</option>
                        <option value="Dịch Vọng">Dịch Vọng</option>
                        <option value="Dịch Vọng Hậu">Dịch Vọng Hậu</option>
                        <option value="Quan Hoa">Quan Hoa</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                >
                    {isLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                </button>
            </div>
        </form>
    )
}

export default ProfileForm
