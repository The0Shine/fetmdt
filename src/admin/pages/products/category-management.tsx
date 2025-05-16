'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, X, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
    getCategories,
    deleteCategory,
    updateCategory,
    createCategory,
} from '../../../services/apiCategory.service'
import { Category } from '../../../types/category'

interface CategoryModalProps {
    isOpen: boolean
    onClose: () => void
    category: Category | null
    onSave: (category: Category) => void
    allCategories: Category[]
}

export default function CategoryManagement() {
    const [categories, setCategories] = useState<Category[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Tải danh sách danh mục
    const loadCategories = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await getCategories()
            // Thêm trường color và productCount cho UI nếu không có
            const categoriesWithUI = response.data.map((category) => ({
                ...category,
                color: category.color || getRandomColor(),
                productCount: category.productCount || 0,
            }))
            setCategories(categoriesWithUI)
        } catch (err) {
            setError('Không thể tải danh sách danh mục. Vui lòng thử lại sau.')
            console.error('Error loading categories:', err)
        } finally {
            setLoading(false)
        }
    }

    // Tải dữ liệu khi component mount
    useEffect(() => {
        loadCategories()
    }, [])

    // Xử lý tìm kiếm
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    // Lọc danh mục theo từ khóa tìm kiếm
    const filteredCategories = categories.filter(
        (category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()),
    )

    // Mở modal thêm danh mục mới
    const handleAddCategory = () => {
        setEditingCategory(null)
        setIsModalOpen(true)
    }

    // Mở modal chỉnh sửa danh mục
    const handleEditCategory = (category: Category) => {
        setEditingCategory(category)
        setIsModalOpen(true)
    }

    // Xử lý xóa danh mục
    const handleDeleteCategory = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
            try {
                await deleteCategory(id)
                loadCategories() // Tải lại danh sách danh mục
            } catch (err) {
                console.error('Error deleting category:', err)
            }
        }
    }

    // Xử lý lưu danh mục (thêm mới hoặc cập nhật)
    const handleSaveCategory = async (category: Category) => {
        try {
            if (category._id) {
                // Cập nhật danh mục hiện có
                await updateCategory(category._id, category)
            } else {
                // Thêm danh mục mới
                await createCategory(category)
            }
            setIsModalOpen(false)
            loadCategories() // Tải lại danh sách danh mục
        } catch (err) {
            console.error('Error saving category:', err)
        }
    }

    // Tạo màu ngẫu nhiên cho danh mục
    const getRandomColor = () => {
        const colors = [
            'bg-blue-100',
            'bg-green-100',
            'bg-red-100',
            'bg-yellow-100',
            'bg-purple-100',
            'bg-pink-100',
            'bg-indigo-100',
            'bg-teal-100',
            'bg-orange-100',
            'bg-amber-100',
            'bg-lime-100',
            'bg-emerald-100',
            'bg-cyan-100',
            'bg-gray-100',
        ]
        return colors[Math.floor(Math.random() * colors.length)]
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Danh mục sản phẩm
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                    <Link to="/dashboard" className="hover:text-teal-500">
                        Trang chủ
                    </Link>
                    <span className="mx-2">•</span>
                    <Link to="/products" className="hover:text-teal-500">
                        Sản phẩm
                    </Link>
                    <span className="mx-2">•</span>
                    <span>Danh mục sản phẩm</span>
                </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div className="relative w-80">
                        <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
                            <Search size={16} />
                        </div>
                        <input
                            placeholder="Tìm kiếm danh mục"
                            className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <button
                        className="flex items-center rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
                        onClick={handleAddCategory}
                    >
                        <Plus size={16} className="mr-1" /> Thêm danh mục
                    </button>
                </div>

                {error && (
                    <div className="mb-6 flex items-center rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
                        <AlertCircle size={18} className="mr-2" />
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="py-8 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
                        <p className="mt-2 text-gray-500">
                            Đang tải danh mục...
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCategories.length === 0 ? (
                            <div className="col-span-full py-8 text-center text-gray-500">
                                Không tìm thấy danh mục nào
                            </div>
                        ) : (
                            filteredCategories.map((category) => (
                                <div
                                    key={category._id}
                                    className={`${category.color} relative overflow-hidden rounded-lg border border-gray-200 p-4`}
                                >
                                    <div className="mb-2 flex items-start justify-between">
                                        <div className="flex items-center">
                                            <span className="mr-2 text-2xl">
                                                {category.icon || '📁'}
                                            </span>
                                            <div>
                                                <h3 className="text-lg font-medium">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {category.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
                                            <button
                                                className="rounded-full p-1 hover:bg-white"
                                                onClick={() =>
                                                    handleEditCategory(category)
                                                }
                                                title="Chỉnh sửa"
                                            >
                                                <Edit
                                                    size={16}
                                                    className="text-gray-600"
                                                />
                                            </button>
                                            <button
                                                className="rounded-full p-1 hover:bg-white"
                                                onClick={() =>
                                                    handleDeleteCategory(
                                                        category._id as string,
                                                    )
                                                }
                                                title="Xóa"
                                            >
                                                <Trash2
                                                    size={16}
                                                    className="text-gray-600"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <span className="font-medium">
                                            {category.productCount}
                                        </span>{' '}
                                        sản phẩm
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <CategoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    category={editingCategory}
                    onSave={handleSaveCategory}
                    allCategories={categories}
                />
            )}
        </div>
    )
}

function CategoryModal({
    isOpen,
    onClose,
    category,
    onSave,
}: CategoryModalProps) {
    const [formData, setFormData] = useState<Partial<Category>>(
        category || {
            name: '',
            slug: '',
            description: '',
            color: 'bg-blue-100',
            icon: '📁',
        },
    )

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Tạo slug từ tên nếu không có
        const slug =
            formData.slug ||
            formData.name?.toLowerCase().replace(/\s+/g, '-') ||
            ''
        onSave({ ...(formData as Category), slug })
    }

    const colorOptions = [
        { value: 'bg-blue-100', label: 'Xanh dương' },
        { value: 'bg-green-100', label: 'Xanh lá' },
        { value: 'bg-red-100', label: 'Đỏ' },
        { value: 'bg-yellow-100', label: 'Vàng' },
        { value: 'bg-purple-100', label: 'Tím' },
        { value: 'bg-pink-100', label: 'Hồng' },
        { value: 'bg-indigo-100', label: 'Chàm' },
        { value: 'bg-teal-100', label: 'Xanh ngọc' },
        { value: 'bg-orange-100', label: 'Cam' },
        { value: 'bg-amber-100', label: 'Hổ phách' },
        { value: 'bg-lime-100', label: 'Chanh' },
        { value: 'bg-emerald-100', label: 'Ngọc lục bảo' },
        { value: 'bg-cyan-100', label: 'Xanh lơ' },
        { value: 'bg-gray-100', label: 'Xám' },
    ]

    if (!isOpen) return null

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-xl font-semibold">
                        {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 p-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Tên danh mục{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                placeholder="Nhập tên danh mục"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="slug"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Slug
                            </label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                value={formData.slug || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                placeholder="Tự động tạo từ tên nếu để trống"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Mô tả
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                rows={2}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                placeholder="Nhập mô tả danh mục"
                            ></textarea>
                        </div>

                        <div>
                            <label
                                htmlFor="color"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Màu sắc
                            </label>
                            <select
                                id="color"
                                name="color"
                                value={formData.color || 'bg-blue-100'}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            >
                                {colorOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t p-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
                        >
                            {category ? 'Cập nhật' : 'Thêm danh mục'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
