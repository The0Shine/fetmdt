'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Tag,
    AlertCircle,
    Eye,
    FlameIcon as Fire,
    Star,
    Sparkles,
} from 'lucide-react'
import ProductModal from './components/product-modal'
import { Link, useNavigate } from 'react-router-dom'
import { getCategories } from '../../../services/apiCategory.service'
import {
    getProducts,
    updateProduct,
    createProduct,
    deleteProduct,
} from '../../../services/apiProduct.service'
import { Product } from '../../../types/product'

export default function ProductManagement() {
    const navigate = useNavigate()
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterCategory, setFilterCategory] = useState('all')
    const [filterType, setFilterType] = useState('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
    const [selectedRows, setSelectedRows] = useState<Product[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Tải danh sách sản phẩm
    const loadProducts = async () => {
        setLoading(true)
        setError(null)
        try {
            const params: any = {
                page: currentPage,
                limit: perPage,
                sort: 'createdAt,desc',
            }

            if (searchTerm) {
                params.search = searchTerm
            }

            if (filterStatus !== 'all') {
                params.status = filterStatus
            }

            if (filterCategory !== 'all') {
                params.category = filterCategory
            }

            // Thêm bộ lọc cho loại sản phẩm
            if (filterType !== 'all') {
                params[filterType] = true
            }

            const response = await getProducts(params)
            setProducts(response.data)
            setTotalRows(response.total)
        } catch (err) {
            setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.')
            console.error('Error loading products:', err)
        } finally {
            setLoading(false)
        }
    }

    // Tải danh sách danh mục
    const loadCategories = async () => {
        try {
            const response = await getCategories()
            const categoryNames = response.data.map((category) => category.name)
            setCategories(categoryNames)
        } catch (err) {
            console.error('Error loading categories:', err)
        }
    }

    // Tải dữ liệu khi component mount
    useEffect(() => {
        loadCategories()
    }, [])

    // Tải lại sản phẩm khi các tham số thay đổi
    useEffect(() => {
        loadProducts()
    }, [currentPage, perPage, filterStatus, filterCategory, filterType])

    // Mở modal thêm sản phẩm mới
    const handleAddProduct = () => {
        setEditingProduct(null)
        setIsModalOpen(true)
    }

    // Mở trang chỉnh sửa sản phẩm
    const handleEditProduct = (product: Product) => {
        navigate(`/admin/products/edit/${product._id}`)
    }

    // Xử lý lưu sản phẩm (thêm mới hoặc cập nhật)
    const handleSaveProduct = async (product: Product) => {
        try {
            if (product._id) {
                // Cập nhật sản phẩm hiện có
                await updateProduct(product._id, product)
            } else {
                // Thêm sản phẩm mới
                await createProduct(product)
            }
            setIsModalOpen(false)
            loadProducts() // Tải lại danh sách sản phẩm
        } catch (err) {
            console.error('Error saving product:', err)
        }
    }

    // Xử lý xóa sản phẩm
    const handleDeleteProduct = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            try {
                await deleteProduct(id)
                loadProducts() // Tải lại danh sách sản phẩm
            } catch (err) {
                console.error('Error deleting product:', err)
            }
        }
    }

    // Xử lý tìm kiếm
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        setCurrentPage(1)
        setResetPaginationToggle(!resetPaginationToggle)
    }

    // Xử lý khi người dùng nhấn Enter để tìm kiếm
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            loadProducts()
        }
    }

    // Xử lý khi người dùng thay đổi bộ lọc
    const handleFilterChange = () => {
        setCurrentPage(1)
        loadProducts()
    }

    // Xử lý thay đổi trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // Xử lý thay đổi số lượng hàng mỗi trang
    const handlePerRowsChange = (newPerPage: number) => {
        setPerPage(newPerPage)
        setCurrentPage(1)
    }

    // Cấu hình cột cho DataTable
    const columns = [
        {
            name: 'Tên sản phẩm',
            selector: (row: Product) => row.name,
            sortable: true,
            cell: (row: Product) => (
                <div>
                    <div className="font-medium">{row.name}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                        {row.featured && (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                                <Star size={12} className="mr-1" /> Nổi bật
                            </span>
                        )}
                        {row.recommended && (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                <Sparkles size={12} className="mr-1" /> Đề xuất
                            </span>
                        )}
                        {row.hot && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800">
                                <Fire size={12} className="mr-1" /> Hot
                            </span>
                        )}
                        {row.new && (
                            <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800">
                                <Plus size={12} className="mr-1" /> Mới
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            name: 'Hình ảnh',
            cell: (row: Product) => (
                <div className="h-12 w-12 overflow-hidden rounded-md border border-gray-200">
                    {row.image ? (
                        <img
                            src={row.image || '/placeholder.svg'}
                            alt={row.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                            <Eye size={16} />
                        </div>
                    )}
                    {row.images && row.images.length > 0 && (
                        <div className="absolute right-0 bottom-0 rounded-tl-md bg-gray-800 px-1 text-xs text-white">
                            +{row.images.length}
                        </div>
                    )}
                </div>
            ),
            width: '80px',
        },
        {
            name: 'Danh mục',
            selector: (row: Product) => row.category,
            sortable: true,
        },
        {
            name: 'Giá bán',
            selector: (row: Product) => row.price,
            sortable: true,
            cell: (row: Product) => row.price.toLocaleString() + 'đ',
        },
        {
            name: 'Tồn kho',
            selector: (row: Product) => row.stock,
            sortable: true,
            cell: (row: Product) =>
                row.status === 'in-stock' ? (
                    <span className="text-gray-700">{row.stock}</span>
                ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                        Hết Hàng
                    </span>
                ),
        },
        {
            name: '',
            cell: (row: Product) => (
                <div className="flex justify-center space-x-2">
                    <button
                        className="text-teal-500 hover:text-teal-700"
                        onClick={() => handleEditProduct(row)}
                        title="Chỉnh sửa"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => handleDeleteProduct(row._id as string)}
                        title="Xóa"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
            button: true,
            width: '100px',
        },
    ]

    // Tùy chỉnh style cho DataTable
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '0.75rem',
                color: '#6b7280',
                textTransform: 'uppercase' as const,
                fontWeight: '600',
                letterSpacing: '0.05em',
            },
        },
        rows: {
            style: {
                minHeight: '56px',
                fontSize: '0.875rem',
                color: '#111827',
                '&:hover': {
                    backgroundColor: '#f9fafb',
                },
            },
            stripedStyle: {
                backgroundColor: '#f9fafb',
            },
        },
        pagination: {
            style: {
                borderTop: '1px solid #e5e7eb',
                fontSize: '0.875rem',
            },
            pageButtonsStyle: {
                color: '#6b7280',
                fill: '#6b7280',
                '&:hover:not(:disabled)': {
                    backgroundColor: '#f3f4f6',
                },
                '&:focus': {
                    outline: 'none',
                },
            },
        },
    }

    // Tùy chỉnh component phân trang
    const paginationComponentOptions = {
        rowsPerPageText: 'Số hàng:',
        rangeSeparatorText: 'trên',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Tất cả',
    }

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Sản phẩm
                        </h1>
                        <div className="flex items-center text-sm text-gray-500">
                            <span>Trang chủ</span>
                            <span className="mx-2">•</span>
                            <span>Sản phẩm</span>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-medium">
                                Danh sách sản phẩm
                            </h2>
                            <div className="flex space-x-2">
                                <Link
                                    to="/admin/categories"
                                    className="flex items-center rounded-md border border-teal-500 bg-white px-4 py-2 text-teal-500 hover:bg-teal-50"
                                >
                                    <Tag size={16} className="mr-1" /> Quản lý
                                    danh mục
                                </Link>
                                <button
                                    className="flex items-center rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
                                    onClick={handleAddProduct}
                                >
                                    <Plus size={16} className="mr-1" /> Tạo sản
                                    phẩm
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 flex items-center rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
                                <AlertCircle size={18} className="mr-2" />
                                {error}
                            </div>
                        )}

                        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
                            <div className="relative w-full md:w-80">
                                <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
                                    <Search size={16} />
                                </div>
                                <input
                                    placeholder="Tìm sản phẩm"
                                    className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div className="flex items-center">
                                    <span className="mr-2 text-sm text-gray-500">
                                        Danh mục:
                                    </span>
                                    <select
                                        className="w-40 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        value={filterCategory}
                                        onChange={(e) => {
                                            setFilterCategory(e.target.value)
                                            handleFilterChange()
                                        }}
                                    >
                                        <option value="all">Tất cả</option>
                                        {categories.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-2 text-sm text-gray-500">
                                        Trạng thái:
                                    </span>
                                    <select
                                        className="w-32 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        value={filterStatus}
                                        onChange={(e) => {
                                            setFilterStatus(e.target.value)
                                            handleFilterChange()
                                        }}
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="in-stock">
                                            Còn hàng
                                        </option>
                                        <option value="out-of-stock">
                                            Hết hàng
                                        </option>
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-2 text-sm text-gray-500">
                                        Loại:
                                    </span>
                                    <select
                                        className="w-32 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        value={filterType}
                                        onChange={(e) => {
                                            setFilterType(e.target.value)
                                            handleFilterChange()
                                        }}
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="featured">
                                            Nổi bật
                                        </option>
                                        <option value="recommended">
                                            Đề xuất
                                        </option>
                                        <option value="hot">Hot</option>
                                        <option value="new">Mới</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg">
                            <DataTable
                                columns={columns}
                                data={products}
                                pagination
                                paginationResetDefaultPage={
                                    resetPaginationToggle
                                }
                                paginationComponentOptions={
                                    paginationComponentOptions
                                }
                                paginationServer
                                paginationTotalRows={totalRows}
                                onChangePage={handlePageChange}
                                onChangeRowsPerPage={handlePerRowsChange}
                                selectableRows
                                onSelectedRowsChange={(state) =>
                                    setSelectedRows(state.selectedRows)
                                }
                                customStyles={customStyles}
                                noDataComponent={
                                    <div className="p-4 text-center text-gray-500">
                                        Không có sản phẩm nào
                                    </div>
                                }
                                persistTableHead
                                progressPending={loading}
                                progressComponent={
                                    <div className="p-4 text-center">
                                        Đang tải...
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal thêm sản phẩm mới */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={editingProduct}
                onSave={handleSaveProduct}
                categories={categories}
            />
        </div>
    )
}
