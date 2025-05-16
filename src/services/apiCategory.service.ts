import {
    CategoriesResponse,
    Category,
    CategoryResponse,
} from '../types/category'
import { mainRepository } from '../utils/Repository'

// Lấy danh sách danh mục
export const getCategories = async (): Promise<CategoriesResponse> => {
    const response =
        await mainRepository.get<CategoriesResponse>('/api/categories')
    if (!response) {
        throw new Error('Failed to fetch categories')
    }
    return response
}

// Lấy danh mục theo ID
export const getCategoryById = async (
    id: string,
): Promise<CategoryResponse> => {
    const response = await mainRepository.get<CategoryResponse>(
        `/api/categories/${id}`,
    )
    if (!response) {
        throw new Error(`Category with ID ${id} not found`)
    }
    return response
}

// Tạo danh mục mới
export const createCategory = async (
    category: Partial<Category>,
): Promise<CategoryResponse> => {
    const response = await mainRepository.post<CategoryResponse>(
        '/api/categories',
        category,
    )
    if (!response) {
        throw new Error('Failed to create category')
    }
    return response
}

// Cập nhật danh mục
export const updateCategory = async (
    id: string,
    category: Partial<Category>,
): Promise<CategoryResponse> => {
    const response = await mainRepository.put<CategoryResponse>(
        `/api/categories/${id}`,
        category,
    )
    if (!response) {
        throw new Error(`Failed to update category with ID ${id}`)
    }
    return response
}

// Xóa danh mục
export const deleteCategory = async (
    id: string,
): Promise<{ success: boolean }> => {
    const response = await mainRepository.delete<{ success: boolean }>(
        `/api/categories/${id}`,
    )
    if (!response) {
        throw new Error(`Failed to delete category with ID ${id}`)
    }
    return response
}
