'use client'

import type React from 'react'

import { useState, useMemo } from 'react'
import { Plus, X, Trash2 } from 'lucide-react'
import type { IProduct } from '../../../interfaces/product.interface'

interface StockAdjustmentProduct {
    id: number
    productId: string
    productName: string
    quantity: number
    unit: string
    note?: string
    costPrice?: number // Add cost price field
}

interface StockAdjustment {
    id?: string
    type: 'import' | 'export' | 'adjustment'
    reason: string
    products: StockAdjustmentProduct[]
    createdBy?: string
    date?: string
}

interface StockAdjustmentModalProps {
    isOpen: boolean
    onClose: () => void
    adjustment: StockAdjustment | null
    onSave: (adjustment: StockAdjustment) => void
    products: IProduct[]
}

export default function StockAdjustmentModal({
    isOpen,
    onClose,
    adjustment,
    onSave,
    products,
}: StockAdjustmentModalProps) {
    const [formData, setFormData] = useState<Partial<StockAdjustment>>(
        adjustment || {
            type: 'import',
            reason: '',
            products: [],
        },
    )

    const [selectedProducts, setSelectedProducts] = useState<
        StockAdjustmentProduct[]
    >(adjustment?.products || [])

    const [searchProduct, setSearchProduct] = useState('')
    const [showProductSearch, setShowProductSearch] = useState(false)

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleAddProduct = (product: IProduct) => {
        const existingProduct = selectedProducts.find(
            (p) => p.productId === product._id,
        )
        if (existingProduct) {
            return
        }

        const newProduct: StockAdjustmentProduct = {
            id: Date.now(),
            productId: product._id || '',
            productName: product.name,
            quantity: 1,
            unit: product.unit,
            note: '',
        }

        setSelectedProducts([...selectedProducts, newProduct])
        setShowProductSearch(false)
        setSearchProduct('')
    }

    const handleRemoveProduct = (id: number) => {
        setSelectedProducts(selectedProducts.filter((p) => p.id !== id))
    }

    const handleProductQuantityChange = (id: number, quantity: number) => {
        setSelectedProducts(
            selectedProducts.map((p) => (p.id === id ? { ...p, quantity } : p)),
        )
    }

    const handleProductNoteChange = (id: number, note: string) => {
        setSelectedProducts(
            selectedProducts.map((p) => (p.id === id ? { ...p, note } : p)),
        )
    }

    const handleSubmit = () => {
        onSave({
            ...(formData as StockAdjustment),
            products: selectedProducts,
            date: new Date().toLocaleDateString('vi-VN'),
        })
    }

    const filteredProducts = useMemo(() => {
        if (!searchProduct) return products
        const searchLower = searchProduct.toLowerCase()
        return products.filter(
            (product) =>
                product.name.toLowerCase().includes(searchLower) ||
                (product.barcode && product.barcode.includes(searchProduct)),
        )
    }, [products, searchProduct])

    if (!isOpen) return null

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-xl font-semibold">
                        {adjustment?.id
                            ? 'Chỉnh sửa điều chỉnh kho'
                            : 'Tạo điều chỉnh kho mới'}
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
                    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="type"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Loại điều chỉnh{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type || 'import'}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            >
                                <option value="import">Nhập kho</option>
                                <option value="export">Xuất kho</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="reason"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Lý do <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="reason"
                            name="reason"
                            value={formData.reason || ''}
                            onChange={handleChange}
                            rows={2}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            placeholder="Nhập lý do điều chỉnh kho"
                        ></textarea>
                    </div>

                    <div className="mb-6">
                        <div className="mb-2 flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                                Sản phẩm
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowProductSearch(true)}
                                className="flex items-center text-sm text-teal-500 hover:text-teal-600"
                            >
                                <Plus size={16} className="mr-1" /> Thêm sản
                                phẩm
                            </button>
                        </div>

                        {showProductSearch && (
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    value={searchProduct}
                                    onChange={(e) =>
                                        setSearchProduct(e.target.value)
                                    }
                                    placeholder="Tìm kiếm sản phẩm theo tên hoặc mã vạch"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                                {searchProduct && (
                                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                                        {filteredProducts.length > 0 ? (
                                            filteredProducts.map((product) => (
                                                <div
                                                    key={product._id}
                                                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                                    onClick={() =>
                                                        handleAddProduct(
                                                            product,
                                                        )
                                                    }
                                                >
                                                    <div className="font-medium">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {product.barcode &&
                                                            `Mã vạch: ${product.barcode} | `}
                                                        Tồn kho: {product.stock}{' '}
                                                        {product.unit}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-gray-500">
                                                Không tìm thấy sản phẩm
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedProducts.length > 0 ? (
                            <div className="overflow-hidden rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Sản phẩm
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Số lượng
                                            </th>
                                            {formData.type === 'import' && (
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Giá vốn
                                                </th>
                                            )}
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Ghi chú
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {selectedProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                                    {product.productName}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="number"
                                                            value={
                                                                product.quantity
                                                            }
                                                            onChange={(e) =>
                                                                handleProductQuantityChange(
                                                                    product.id,
                                                                    Number.parseInt(
                                                                        e.target
                                                                            .value,
                                                                    ) || 0,
                                                                )
                                                            }
                                                            className="w-20 rounded-md border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                                            min={
                                                                formData.type ===
                                                                'adjustment'
                                                                    ? undefined
                                                                    : 1
                                                            }
                                                        />
                                                        <span className="ml-2">
                                                            {product.unit}
                                                        </span>
                                                    </div>
                                                </td>
                                                {formData.type === 'import' && (
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="number"
                                                                value={
                                                                    product.costPrice ||
                                                                    0
                                                                }
                                                                onChange={(e) =>
                                                                    setSelectedProducts(
                                                                        selectedProducts.map(
                                                                            (
                                                                                p,
                                                                            ) =>
                                                                                p.id ===
                                                                                product.id
                                                                                    ? {
                                                                                          ...p,
                                                                                          costPrice:
                                                                                              Number(
                                                                                                  e
                                                                                                      .target
                                                                                                      .value,
                                                                                              ) ||
                                                                                              0,
                                                                                      }
                                                                                    : p,
                                                                        ),
                                                                    )
                                                                }
                                                                className="w-28 rounded-md border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                                                min={0}
                                                                step={1000}
                                                            />
                                                            <span className="ml-2">
                                                                VND
                                                            </span>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                    <input
                                                        type="text"
                                                        value={
                                                            product.note || ''
                                                        }
                                                        onChange={(e) =>
                                                            handleProductNoteChange(
                                                                product.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-md border border-gray-300 px-2 py-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                                        placeholder="Ghi chú"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveProduct(
                                                                product.id,
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="rounded-lg border p-6 text-center text-gray-500">
                                Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để
                                bắt đầu.
                            </div>
                        )}
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
                        type="button"
                        onClick={handleSubmit}
                        disabled={
                            !formData.reason || selectedProducts.length === 0
                        }
                        className={`rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600 ${
                            !formData.reason || selectedProducts.length === 0
                                ? 'cursor-not-allowed opacity-50'
                                : ''
                        }`}
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    )
}
