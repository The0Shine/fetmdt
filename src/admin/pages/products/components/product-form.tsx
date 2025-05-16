'use client'

import type React from 'react'
import { useState, useCallback } from 'react'
import { Upload, Plus, Trash2, ImageIcon } from 'lucide-react'
import { ProductFormData } from '../../../../types/product'
import { uploadImage } from '../../../../utils/Upload'

interface ProductFormProps {
    formData: ProductFormData
    onChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => void
    onImagesChange: (mainImage: string, additionalImages: string[]) => void
    onSubmit: (e: React.FormEvent) => void
    categories: string[]
    isEditing: boolean
}

const ProductForm: React.FC<ProductFormProps> = ({
    formData,
    onChange,
    onImagesChange,
    onSubmit,
    categories,
    isEditing,
}) => {
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleCheckboxChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, checked } = e.target
            const event = {
                target: {
                    name,
                    value: checked,
                },
            } as unknown as React.ChangeEvent<HTMLInputElement>
            onChange(event)
        },
        [onChange],
    )

    const handleMainImageUpload = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (!file) return

            try {
                setIsUploading(true)
                setError(null)
                const imageUrl = await uploadImage(file)
                console.log('Image URL received:', imageUrl)
                onImagesChange(imageUrl, formData.images || [])
            } catch (err) {
                setError('Không thể tải lên hình ảnh. Vui lòng thử lại.')
                console.error('Error al cargar imagen:', err)
            } finally {
                setIsUploading(false)
            }
        },
        [formData.images, onImagesChange],
    )

    const handleAdditionalImageUpload = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files
            if (!files || files.length === 0) return

            try {
                setIsUploading(true)
                setError(null)

                const newImages = [...(formData.images || [])]

                // Procesar cada archivo
                for (let i = 0; i < files.length; i++) {
                    const imageUrl = await uploadImage(files[i])
                    newImages.push(imageUrl)
                }

                onImagesChange(formData.image || '', newImages)
            } catch (err) {
                setError('Không thể tải lên một số hình ảnh. Vui lòng thử lại.')
                console.error('Error al cargar imágenes:', err)
            } finally {
                setIsUploading(false)
            }
        },
        [formData.image, formData.images, onImagesChange],
    )

    const removeMainImage = useCallback(() => {
        onImagesChange('', formData.images || [])
    }, [formData.images, onImagesChange])

    const removeAdditionalImage = useCallback(
        (index: number) => {
            const newImages = [...(formData.images || [])]
            newImages.splice(index, 1)
            onImagesChange(formData.image || '', newImages)
        },
        [formData.image, formData.images, onImagesChange],
    )

    const setAsMainImage = useCallback(
        (url: string, index: number) => {
            const newImages = [...(formData.images || [])]

            // Si hay una imagen principal actual, añadirla a las imágenes adicionales
            if (formData.image) {
                newImages.push(formData.image)
            }

            // Eliminar la imagen seleccionada de las adicionales
            newImages.splice(index, 1)

            // Establecer la nueva imagen principal
            onImagesChange(url, newImages)
        },
        [formData.image, formData.images, onImagesChange],
    )

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Tên sản phẩm <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ''}
                            onChange={onChange}
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            placeholder="Nhập tên sản phẩm"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Danh mục <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category || ''}
                            onChange={onChange}
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="subcategory"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Danh mục phụ
                        </label>
                        <input
                            type="text"
                            id="subcategory"
                            name="subcategory"
                            value={formData.subcategory || ''}
                            onChange={onChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            placeholder="Nhập danh mục phụ (nếu có)"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="unit"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Đơn vị tính <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="unit"
                            name="unit"
                            value={formData.unit || ''}
                            onChange={onChange}
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                            <option value="">Chọn đơn vị tính</option>
                            <option value="Chiếc">Chiếc</option>
                            <option value="Bộ">Bộ</option>
                            <option value="Hộp">Hộp</option>
                            <option value="Cái">Cái</option>
                            <option value="Đôi">Đôi</option>
                            <option value="Thùng">Thùng</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="barcode"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Mã vạch
                        </label>
                        <input
                            type="text"
                            id="barcode"
                            name="barcode"
                            value={formData.barcode || ''}
                            onChange={onChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            placeholder="Nhập mã vạch sản phẩm"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Mô tả sản phẩm{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description || ''}
                            onChange={onChange}
                            required
                            rows={4}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            placeholder="Nhập mô tả sản phẩm"
                        ></textarea>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="price"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Giá bán <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price || 0}
                                onChange={onChange}
                                required
                                min="0"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                placeholder="Nhập giá bán"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="status"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Trạng thái
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status || 'in-stock'}
                            onChange={onChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                            <option value="in-stock">Còn hàng</option>
                            <option value="out-of-stock">Hết hàng</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Đánh dấu sản phẩm
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured || false}
                                    onChange={handleCheckboxChange}
                                    className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                                />
                                <span className="text-sm text-gray-700">
                                    Nổi bật
                                </span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="recommended"
                                    checked={formData.recommended || false}
                                    onChange={handleCheckboxChange}
                                    className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                                />
                                <span className="text-sm text-gray-700">
                                    Đề xuất
                                </span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="hot"
                                    checked={formData.hot || false}
                                    onChange={handleCheckboxChange}
                                    className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                                />
                                <span className="text-sm text-gray-700">
                                    Hot
                                </span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="new"
                                    checked={formData.new || false}
                                    onChange={handleCheckboxChange}
                                    className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                                />
                                <span className="text-sm text-gray-700">
                                    Mới
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                    Quản lý hình ảnh sản phẩm
                </h3>

                {error && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Hình ảnh chính */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-700">
                                Hình ảnh chính
                            </h4>
                            <label className="flex cursor-pointer items-center rounded-md bg-teal-500 px-3 py-1.5 text-sm text-white hover:bg-teal-600">
                                <Plus size={16} className="mr-1" /> Tải lên
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMainImageUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                            </label>
                        </div>

                        {formData.image ? (
                            <div className="relative overflow-hidden rounded-md border border-gray-300">
                                <div className="relative aspect-video">
                                    <img
                                        src={
                                            formData.image || '/placeholder.svg'
                                        }
                                        alt="Hình ảnh chính"
                                        className="h-full w-full object-contain"
                                    />
                                    {isUploading && (
                                        <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
                                            <div className="text-white">
                                                Đang tải lên...
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-gray-200 bg-gray-50 p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <ImageIcon
                                                size={16}
                                                className="mr-2 text-gray-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                Hình ảnh chính
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeMainImage}
                                            className="text-red-500 hover:text-red-700"
                                            disabled={isUploading}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-teal-500 hover:bg-teal-50"
                                onClick={() =>
                                    document
                                        .getElementById('main-image-upload')
                                        ?.click()
                                }
                            >
                                <Upload
                                    size={32}
                                    className="mb-2 text-gray-400"
                                />
                                <p className="text-center text-sm text-gray-500">
                                    <span className="font-medium text-teal-500">
                                        Nhấp để tải lên
                                    </span>{' '}
                                    hoặc kéo và thả
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                    PNG, JPG, GIF tối đa 5MB
                                </p>
                                <input
                                    type="file"
                                    id="main-image-upload"
                                    accept="image/*"
                                    onChange={handleMainImageUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                            </div>
                        )}
                    </div>

                    {/* Hình ảnh bổ sung */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-700">
                                Thư viện hình ảnh
                            </h4>
                            <label className="flex cursor-pointer items-center rounded-md bg-teal-500 px-3 py-1.5 text-sm text-white hover:bg-teal-600">
                                <Plus size={16} className="mr-1" /> Thêm hình
                                ảnh
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAdditionalImageUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                    multiple
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {(formData.images || []).map((url, index) => (
                                <div
                                    key={index}
                                    className="relative overflow-hidden rounded-md border border-gray-300"
                                >
                                    <div className="relative aspect-square">
                                        <img
                                            src={url || '/placeholder.svg'}
                                            alt={`Hình ảnh ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="border-t border-gray-200 bg-gray-50 p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <ImageIcon
                                                    size={16}
                                                    className="mr-2 flex-shrink-0 text-gray-500"
                                                />
                                                <span className="truncate text-sm font-medium text-gray-700">{`Hình ảnh ${index + 1}`}</span>
                                            </div>
                                            <div className="ml-2 flex items-center space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setAsMainImage(
                                                            url,
                                                            index,
                                                        )
                                                    }
                                                    className="text-blue-500 hover:text-blue-700"
                                                    title="Đặt làm ảnh chính"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeAdditionalImage(
                                                            index,
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Xóa ảnh"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 transition-colors hover:border-teal-500 hover:bg-teal-50">
                                <Plus
                                    size={32}
                                    className="mb-2 text-gray-400"
                                />
                                <p className="text-sm text-gray-500">
                                    Thêm hình ảnh
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAdditionalImageUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                    multiple
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default ProductForm
