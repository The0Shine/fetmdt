'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Product, ProductFormData } from '../../../types/product'
import ProductForm from './components/product-form'

interface ProductModalProps {
    isOpen: boolean
    onClose: () => void
    product: Product | null
    onSave: (product: Product) => void
    categories: string[]
}

const ProductModal: React.FC<ProductModalProps> = ({
    isOpen,
    onClose,
    product,
    onSave,
    categories,
}) => {
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        category: categories[0] || '',
        unit: 'Chiếc',
        price: 0,
        stock: 0, // Siempre será 0
        status: 'in-stock',
        image: '',
        images: [],
        barcode: '',
        costPrice: 0,
        featured: false,
        recommended: false,
        hot: false,
        new: false,
    })

    // Cập nhật form khi product thay đổi
    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                // Đảm bảo ID được chuyển đúng từ _id của MongoDB
                id: product._id || product.id,
                // Đảm bảo các trường boolean được xử lý đúng
                featured: product.featured || false,
                recommended: product.recommended || false,
                hot: product.hot || false,
                new: product.new || false,
                // Đảm bảo mảng hình ảnh
                images: product.images || [],
                // Đảm bảo stock luôn là 0
                stock: 0,
            })
        } else {
            setFormData({
                name: '',
                description: '',
                category: categories[0] || '',
                unit: 'Chiếc',
                price: 0,
                stock: 0,
                status: 'in-stock',
                image: '',
                images: [],
                barcode: '',
                costPrice: 0,
                featured: false,
                recommended: false,
                hot: false,
                new: false,
            })
        }
    }, [product, categories])

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value, type } = e.target as HTMLInputElement

        // Không cho phép thay đổi stock
        if (name === 'stock') return

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === 'checkbox'
                    ? (e.target as HTMLInputElement).checked
                    : name === 'price' ||
                        name === 'costPrice' ||
                        name === 'oldPrice'
                      ? Number(value)
                      : value,
        }))
    }

    const handleImagesChange = (
        mainImage: string,
        additionalImages: string[],
    ) => {
        setFormData((prev) => ({
            ...prev,
            image: mainImage,
            images: additionalImages,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Đảm bảo stock luôn là 0 khi lưu
        onSave({ ...formData, stock: 0 } as Product)
    }

    if (!isOpen) return null

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-xl font-semibold">
                        {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div
                    className="overflow-y-auto p-6"
                    style={{ maxHeight: 'calc(90vh - 130px)' }}
                >
                    <ProductForm
                        formData={formData}
                        onChange={handleChange}
                        onImagesChange={handleImagesChange}
                        onSubmit={handleSubmit}
                        categories={categories}
                        isEditing={!!product}
                    />
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
                        type="button"
                        onClick={handleSubmit}
                        className="rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
                    >
                        {product ? 'Cập nhật' : 'Thêm sản phẩm'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductModal
