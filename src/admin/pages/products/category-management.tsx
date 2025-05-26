'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import {
    Search,
    Plus,
    Edit,
    Trash2,
    X,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    PlusCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
    getCategories,
    deleteCategory,
    updateCategory,
    createCategory,
} from '../../../services/apiCategory.service'
import type { Category, Subcategory } from '../../../types/category'

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
    const [expandedCategories, setExpandedCategories] = useState<
        Record<string, boolean>
    >({})

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
                subcategories: category.subcategories || [],
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
                .includes(searchTerm.toLowerCase()) ||
            category.subcategories?.some((sub) =>
                sub.name.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
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

    // Xử lý mở rộng/thu gọn danh mục
    const toggleCategoryExpand = (categoryId: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }))
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
                                            {category.subcategories &&
                                                category.subcategories.length >
                                                    0 && (
                                                    <button
                                                        className="rounded-full p-1 hover:bg-white"
                                                        onClick={() =>
                                                            toggleCategoryExpand(
                                                                category._id as string,
                                                            )
                                                        }
                                                        title={
                                                            expandedCategories[
                                                                category._id as string
                                                            ]
                                                                ? 'Thu gọn'
                                                                : 'Mở rộng'
                                                        }
                                                    >
                                                        {expandedCategories[
                                                            category._id as string
                                                        ] ? (
                                                            <ChevronUp
                                                                size={16}
                                                                className="text-gray-600"
                                                            />
                                                        ) : (
                                                            <ChevronDown
                                                                size={16}
                                                                className="text-gray-600"
                                                            />
                                                        )}
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <span className="font-medium">
                                            {category.productCount}
                                        </span>{' '}
                                        sản phẩm
                                        {category.subcategories && (
                                            <span className="ml-2">
                                                •{' '}
                                                {category.subcategories.length}{' '}
                                                danh mục con
                                            </span>
                                        )}
                                    </div>

                                    {/* Danh sách danh mục con */}
                                    {expandedCategories[
                                        category._id as string
                                    ] &&
                                        category.subcategories &&
                                        category.subcategories.length > 0 && (
                                            <div className="mt-3 border-t border-gray-200 pt-3">
                                                <h4 className="mb-2 text-sm font-medium text-gray-700">
                                                    Danh mục con:
                                                </h4>
                                                <div className="space-y-2">
                                                    {category.subcategories.map(
                                                        (subcategory) => (
                                                            <div
                                                                key={
                                                                    subcategory.id
                                                                }
                                                                className="flex items-center justify-between rounded-md bg-white/50 p-2"
                                                            >
                                                                <div>
                                                                    <span className="text-sm font-medium">
                                                                        {
                                                                            subcategory.name
                                                                        }
                                                                    </span>
                                                                    <span className="ml-2 text-xs text-gray-500">
                                                                        (
                                                                        {
                                                                            subcategory.slug
                                                                        }
                                                                        )
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
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
    allCategories,
}: CategoryModalProps) {
    const [formData, setFormData] = useState<Partial<Category>>(
        category || {
            name: '',
            slug: '',
            description: '',
            color: 'bg-blue-100',
            icon: '📁',
            subcategories: [],
        },
    )

    const [subcategories, setSubcategories] = useState<Subcategory[]>(
        category?.subcategories || [],
    )

    const [newSubcategory, setNewSubcategory] = useState<Partial<Subcategory>>({
        id: '',
        name: '',
        slug: '',
    })

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubcategoryChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => {
        const { name, value } = e.target
        const updatedSubcategories = [...subcategories]
        updatedSubcategories[index] = {
            ...updatedSubcategories[index],
            [name]: value,
        }
        setSubcategories(updatedSubcategories)
    }

    const handleNewSubcategoryChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = e.target
        setNewSubcategory({
            ...newSubcategory,
            [name]: value,
        })
    }

    const addSubcategory = () => {
        if (!newSubcategory.name) return

        // Tạo slug từ tên nếu không có
        const slug =
            newSubcategory.slug ||
            newSubcategory.name?.toLowerCase().replace(/\s+/g, '-') ||
            ''
        const id = newSubcategory.id || slug

        const newSub: Subcategory = {
            id,
            name: newSubcategory.name,
            slug,
        }

        setSubcategories([...subcategories, newSub])
        setNewSubcategory({ id: '', name: '', slug: '' })
    }

    const removeSubcategory = (index: number) => {
        const updatedSubcategories = [...subcategories]
        updatedSubcategories.splice(index, 1)
        setSubcategories(updatedSubcategories)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Tạo slug từ tên nếu không có
        const slug =
            formData.slug ||
            formData.name?.toLowerCase().replace(/\s+/g, '-') ||
            ''
        onSave({ ...(formData as Category), slug, subcategories })
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
            <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
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
                                htmlFor="icon"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Icon
                            </label>
                            <input
                                type="text"
                                id="icon"
                                name="icon"
                                value={formData.icon || '📁'}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                placeholder="Emoji hoặc tên icon"
                            />
                        </div>

                        {/* Phần danh mục con */}
                        <div className="mt-6">
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-md font-medium text-gray-700">
                                    Danh mục con
                                </h3>
                            </div>

                            {/* Danh sách danh mục con hiện tại */}
                            {subcategories.length > 0 && (
                                <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 p-3">
                                    <div className="space-y-3">
                                        {subcategories.map(
                                            (subcategory, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm"
                                                >
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                value={
                                                                    subcategory.name
                                                                }
                                                                onChange={(e) =>
                                                                    handleSubcategoryChange(
                                                                        e,
                                                                        index,
                                                                    )
                                                                }
                                                                className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                                                placeholder="Tên danh mục con"
                                                            />
                                                            <input
                                                                type="text"
                                                                name="slug"
                                                                value={
                                                                    subcategory.slug
                                                                }
                                                                onChange={(e) =>
                                                                    handleSubcategoryChange(
                                                                        e,
                                                                        index,
                                                                    )
                                                                }
                                                                className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                                                placeholder="Slug"
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeSubcategory(
                                                                index,
                                                            )
                                                        }
                                                        className="rounded-full p-1 text-red-500 hover:bg-red-50"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Form thêm danh mục con mới */}
                            <div className="rounded-md border border-dashed border-gray-300 p-3">
                                <h4 className="mb-2 text-sm font-medium text-gray-600">
                                    Thêm danh mục con mới
                                </h4>
                                <div className="flex items-end space-x-2">
                                    <div className="flex-1 space-y-1">
                                        <input
                                            type="text"
                                            name="name"
                                            value={newSubcategory.name || ''}
                                            onChange={
                                                handleNewSubcategoryChange
                                            }
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                            placeholder="Tên danh mục con"
                                        />
                                        <input
                                            type="text"
                                            name="slug"
                                            value={newSubcategory.slug || ''}
                                            onChange={
                                                handleNewSubcategoryChange
                                            }
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                            placeholder="Slug (tự động tạo nếu để trống)"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addSubcategory}
                                        className="rounded-md bg-teal-100 px-3 py-2 text-sm text-teal-700 hover:bg-teal-200"
                                    >
                                        <PlusCircle
                                            size={16}
                                            className="mr-1 inline"
                                        />{' '}
                                        Thêm
                                    </button>
                                </div>
                            </div>
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
