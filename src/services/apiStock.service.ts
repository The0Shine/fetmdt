import type {
    IStockAdjustment,
    IStockAdjustmentProduct,
    StockAdjustmentQueryParams,
    StockAdjustmentResponse,
    StockAdjustmentsResponse,
} from '../admin/interfaces/stock.interface'
import { mainRepository } from '../utils/Repository'

// Lấy danh sách điều chỉnh kho
export const getStockAdjustments = async (
    params: StockAdjustmentQueryParams = {},
): Promise<StockAdjustmentsResponse> => {
    // Chuyển đổi params thành query string
    const queryParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            queryParams.append(key, String(value))
        }
    })

    const queryString = queryParams.toString()
    const url = queryString
        ? `/api/stock-adjustments?${queryString}`
        : '/api/stock-adjustments'

    return await mainRepository.get<StockAdjustmentsResponse>(url)
}

// Lấy điều chỉnh kho theo ID
export const getStockAdjustmentById = async (
    id: string,
): Promise<StockAdjustmentResponse> => {
    return await mainRepository.get<StockAdjustmentResponse>(
        `/api/stock-adjustments/${id}`,
    )
}

// Tạo điều chỉnh kho mới
export const createStockAdjustment = async (
    adjustment: Partial<IStockAdjustment>,
): Promise<StockAdjustmentResponse> => {
    return await mainRepository.post<StockAdjustmentResponse>(
        '/api/stock-adjustments',
        adjustment,
    )
}

// Cập nhật điều chỉnh kho
export const updateStockAdjustment = async (
    id: string,
    adjustment: Partial<IStockAdjustment>,
): Promise<StockAdjustmentResponse> => {
    return await mainRepository.put<StockAdjustmentResponse>(
        `/api/stock-adjustments/${id}`,
        adjustment,
    )
}

// Xóa điều chỉnh kho
export const deleteStockAdjustment = async (
    id: string,
): Promise<{ success: boolean }> => {
    return await mainRepository.delete<{ success: boolean }>(
        `/api/stock-adjustments/${id}`,
    )
}

// Removed updateStockAdjustmentStatus function since status is always completed

// Chuyển đổi từ frontend model sang backend model
export const convertToBackendModel = (
    adjustment: any,
): Partial<IStockAdjustment> => {
    const { id, ...rest } = adjustment

    // Chuyển đổi products
    const products: IStockAdjustmentProduct[] = adjustment.products.map(
        (p: any) => {
            const { id, productName, ...productRest } = p
            return productRest
        },
    )

    return {
        ...rest,
        products,
    }
}

// Chuyển đổi từ backend model sang frontend model
export const convertToFrontendModel = (adjustment: IStockAdjustment): any => {
    const { _id, ...rest } = adjustment

    // Chuyển đổi products
    const products = adjustment.products.map(
        (p: IStockAdjustmentProduct, index: number) => {
            return {
                id: index + 1,
                productId: p.productId,
                productName: p.productName || '',
                quantity: p.quantity,
                unit: p.unit,
                note: p.note,
                costPrice: p.costPrice || 0, // Added cost price with default value
            }
        },
    )

    return {
        id: _id,
        ...rest,
        products,
    }
}
