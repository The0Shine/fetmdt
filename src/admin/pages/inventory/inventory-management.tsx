'use client'

import type React from 'react'
import { useState, useEffect, useMemo } from 'react'
import DataTable from 'react-data-table-component'
import { Search, Filter, Edit, RefreshCw, AlertCircle } from 'lucide-react'
import StockAdjustmentModal from './components/stock-adjustment-modal'
import { getProducts } from '../../../services/apiProduct.service'
import {
    convertToBackendModel,
    createStockAdjustment,
} from '../../../services/apiStock.service'
import type { IProduct } from '../../interfaces/product.interface'

export default function InventoryManagement() {
    const [products, setProducts] = useState<IProduct[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterCategory, setFilterCategory] = useState('all')
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
    const [selectedRows, setSelectedRows] = useState<IProduct[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentAdjustment, setCurrentAdjustment] = useState<any | null>(null)

    // Pagination state
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalRows, setTotalRows] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    // Loading and error states
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Fetch products on component mount and when filters change
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true)
                setError(null)

                const params: any = {
                    page,
                    limit,
                    search: searchTerm || undefined,
                }

                if (filterStatus !== 'all') {
                    params.status = filterStatus
                }
                if (filterCategory !== 'all') {
                    params.category = filterCategory
                }

                const response = await getProducts(params)

                setProducts(response.data)
                setTotalRows(response.total)
                setTotalPages(response.pagination.totalPages)
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Có lỗi xảy ra khi tải dữ liệu',
                )
                console.error('Error loading products:', err)
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [page, limit, searchTerm, filterStatus, filterCategory])

    // Xử lý tìm kiếm
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        setPage(1) // Reset về trang đầu tiên khi tìm kiếm
        setResetPaginationToggle(!resetPaginationToggle)
    }

    // Lấy danh sách danh mục duy nhất
    const categories = useMemo(() => {
        const uniqueCategories = new Set(
            products.map((product) => product.category),
        )
        return Array.from(uniqueCategories)
    }, [products])

    // Mở modal nhập kho
    const handleOpenImportModal = () => {
        setCurrentAdjustment({
            type: 'import',
            reason: '',
            products: [],
        })
        setIsModalOpen(true)
    }

    // Mở modal xuất kho
    const handleOpenExportModal = () => {
        setCurrentAdjustment({
            type: 'export',
            reason: '',
            products: [],
        })
        setIsModalOpen(true)
    }

    // Xử lý lưu điều chỉnh kho
    const handleSaveAdjustment = async (adjustment: any) => {
        try {
            setLoading(true)

            // Chuyển đổi dữ liệu từ frontend model sang backend model
            const backendAdjustment = convertToBackendModel(adjustment)

            // Gọi API để tạo điều chỉnh kho
            await createStockAdjustment(backendAdjustment)

            // Tải lại danh sách sản phẩm sau khi cập nhật
            const params: any = {
                page,
                limit,
                search: searchTerm || undefined,
            }

            if (filterStatus !== 'all') {
                params.status = filterStatus
            }
            if (filterCategory !== 'all') {
                params.category = filterCategory
            }

            const response = await getProducts(params)

            setProducts(response.data)
            setTotalRows(response.total)
            setTotalPages(response.pagination.totalPages)

            setIsModalOpen(false)

            // Hiển thị thông báo thành công
            alert('Điều chỉnh kho thành công!')
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Có lỗi xảy ra khi cập nhật tồn kho',
            )
            console.error('Error updating stock:', err)
        } finally {
            setLoading(false)
        }
    }

    // Xử lý thay đổi trang
    const handlePageChange = (page: number) => {
        setPage(page)
    }

    // Xử lý thay đổi số lượng hiển thị
    const handlePerRowsChange = (newLimit: number) => {
        setLimit(newLimit)
        setPage(1)
    }

    // Cấu hình cột cho DataTable
    const columns = [
        {
            name: 'Tên sản phẩm',
            selector: (row: IProduct) => row.name,
            sortable: true,
        },
        {
            name: 'Danh mục',
            selector: (row: IProduct) => row.category,
            sortable: true,
        },
        {
            name: 'Đơn vị tính',
            selector: (row: IProduct) => row.unit,
            sortable: true,
        },
        {
            name: 'Giá bán',
            selector: (row: IProduct) => row.price,
            sortable: true,
            cell: (row: IProduct) => `${row.price.toLocaleString()}đ`,
        },
        {
            name: 'Tồn kho',
            selector: (row: IProduct) => row.stock,
            sortable: true,
            cell: (row: IProduct) =>
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
            cell: (row: IProduct) => (
                <div className="flex space-x-2">
                    <button
                        className="text-blue-500 hover:text-blue-700"
                        title="Chỉnh sửa"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        className="text-green-500 hover:text-green-700"
                        title="Cập nhật tồn kho"
                        onClick={() => {
                            setCurrentAdjustment({
                                type: 'adjustment',
                                reason: `Điều chỉnh tồn kho cho ${row.name}`,
                                products: [
                                    {
                                        id: Date.now(),
                                        productId: row._id || '',
                                        productName: row.name,
                                        quantity: 0,
                                        unit: row.unit,
                                    },
                                ],
                            })
                            setIsModalOpen(true)
                        }}
                    >
                        <RefreshCw size={16} />
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
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Quản lý kho
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                    <span>Trang chủ</span>
                    <span className="mx-2">•</span>
                    <span>Quản lý kho</span>
                </div>
            </div>

            {error && (
                <div className="mb-4 flex items-center rounded-md bg-red-50 p-4 text-red-800">
                    <AlertCircle className="mr-2" size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-medium">
                        Danh sách sản phẩm trong kho
                    </h2>
                    <div className="flex space-x-2">
                        <button
                            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                            onClick={handleOpenImportModal}
                            disabled={loading}
                        >
                            Nhập kho
                        </button>
                        <button
                            className="rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
                            onClick={handleOpenExportModal}
                            disabled={loading}
                        >
                            Xuất kho
                        </button>
                    </div>
                </div>

                <div className="mb-6 flex flex-col justify-between space-y-4 md:flex-row md:space-y-0">
                    <div className="relative w-full md:w-80">
                        <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
                            <Search size={16} />
                        </div>
                        <input
                            placeholder="Tìm theo tên/mã vạch"
                            className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                        <div className="flex items-center">
                            <span className="mr-2 text-sm text-gray-500">
                                Trạng thái:
                            </span>
                            <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none md:w-40"
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value)
                                }
                            >
                                <option value="all">Tất cả</option>
                                <option value="in-stock">Còn hàng</option>
                                <option value="out-of-stock">Hết hàng</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2 text-sm text-gray-500">
                                Danh mục:
                            </span>
                            <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none md:w-40"
                                value={filterCategory}
                                onChange={(e) =>
                                    setFilterCategory(e.target.value)
                                }
                            >
                                <option value="all">Tất cả</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50">
                            <Filter size={16} className="mr-2" />
                            <span>Lọc khác</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg">
                    <DataTable
                        columns={columns}
                        data={products}
                        progressPending={loading}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                        paginationResetDefaultPage={resetPaginationToggle}
                        paginationComponentOptions={paginationComponentOptions}
                        selectableRows
                        onSelectedRowsChange={(state) =>
                            setSelectedRows(state.selectedRows)
                        }
                        customStyles={customStyles}
                        noDataComponent={
                            <div className="p-4 text-center text-gray-500">
                                {loading
                                    ? 'Đang tải dữ liệu...'
                                    : 'Không có sản phẩm nào'}
                            </div>
                        }
                        persistTableHead
                    />
                </div>
            </div>

            {isModalOpen && (
                <StockAdjustmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    adjustment={currentAdjustment}
                    onSave={handleSaveAdjustment}
                    products={products}
                />
            )}
        </div>
    )
}
