import type { Product } from '../types/product'
import { mainRepository } from '../utils/Repository'

interface ProductResponse {
    success: boolean
    data: Product
}

interface ProductsResponse {
    success: boolean
    count: number
    total: number
    pagination: {
        page: number
        limit: number
        totalPages: number
    }
    data: Product[]
}

interface ProductQueryParams {
    page?: number
    limit?: number
    search?: string
    sort?: string
    category?: string
    subcategory?: string
    status?: string
    featured?: boolean
    recommended?: boolean
    hot?: boolean
    new?: boolean
    minPrice?: number
    maxPrice?: number
    published?: boolean
}

// Lấy danh sách sản phẩm với các tùy chọn lọc và phân trang
export const getProducts = async (params: ProductQueryParams = {}) => {
    // Mặc định chỉ lấy sản phẩm đã được xuất bản
    const defaultParams = {
        ...params,
    }

    // Chuyển đổi params thành query string
    const queryParams = new URLSearchParams()

    Object.entries(defaultParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            queryParams.append(key, String(value))
        }
    })

    const queryString = queryParams.toString()
    const url = queryString ? `/api/products?${queryString}` : '/api/products'

    return await mainRepository.get<ProductsResponse>(url)
}

// Lấy tất cả sản phẩm (bao gồm cả chưa xuất bản) - chỉ dành cho admin
export const getProductsAdmin = async (params: ProductQueryParams = {}) => {
    // Chuyển đổi params thành query string
    const queryParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            queryParams.append(key, String(value))
        }
    })

    const queryString = queryParams.toString()
    const url = queryString
        ? `/api/products/admin?${queryString}`
        : '/api/products/admin'

    return await mainRepository.get<ProductsResponse>(url)
}

// Lấy sản phẩm theo ID (chỉ sản phẩm đã xuất bản)
export const getProductById = async (id: string) => {
    return await mainRepository.get<ProductResponse>(`/api/products/${id}`)
}

// Lấy sản phẩm theo ID (bao gồm cả chưa xuất bản) - chỉ dành cho admin
export const getProductByIdAdmin = async (id: string) => {
    return await mainRepository.get<ProductResponse>(`/api/products/${id}`)
}

// Tạo sản phẩm mới
export const createProduct = async (product: Partial<Product>) => {
    return await mainRepository.post<ProductResponse>('/api/products', product)
}

// Cập nhật sản phẩm
export const updateProduct = async (id: string, product: Partial<Product>) => {
    return await mainRepository.put<ProductResponse>(
        `/api/products/${id}`,
        product,
    )
}

// Xóa sản phẩm
export const deleteProduct = async (id: string) => {
    return await mainRepository.delete<{ success: boolean }>(
        `/api/products/${id}`,
    )
}
