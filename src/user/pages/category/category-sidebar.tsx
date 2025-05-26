import { Link } from 'react-router-dom'
import type { Category } from '../../../types/category'

interface CategorySidebarProps {
    categories: Category[]
    selectedCategory?: string
}

export default function CategorySidebar({
    categories,
    selectedCategory,
}: CategorySidebarProps) {
    return (
        <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Danh mục sản phẩm
            </h2>

            <ul className="space-y-2">
                {categories.length > 0
                    ? categories.map((category) => (
                          <li key={category.id}>
                              <Link
                                  to={`/shop?category=${category.slug}`}
                                  className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                                      selectedCategory === category.slug
                                          ? 'bg-blue-50 font-medium text-blue-600'
                                          : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                              >
                                  {category.name}
                                  {category.subcategories &&
                                      category.subcategories.length > 0 && (
                                          <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                              {category.subcategories.length}
                                          </span>
                                      )}
                              </Link>

                              {/* Hiển thị danh mục con nếu danh mục hiện tại được chọn */}
                              {selectedCategory === category.slug &&
                                  category.subcategories &&
                                  category.subcategories.length > 0 && (
                                      <ul className="mt-1 ml-4 space-y-1">
                                          {category.subcategories.map(
                                              (subcategory) => (
                                                  <li key={subcategory.id}>
                                                      <Link
                                                          to={`/shop?category=${category.slug}&subcategory=${subcategory.slug}`}
                                                          className="block rounded-md px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                                                      >
                                                          {subcategory.name}
                                                      </Link>
                                                  </li>
                                              ),
                                          )}
                                      </ul>
                                  )}
                          </li>
                      ))
                    : // Skeleton loading khi chưa có dữ liệu
                      Array.from({ length: 6 }).map((_, index) => (
                          <li key={index} className="animate-pulse">
                              <div className="h-8 rounded-md bg-gray-200"></div>
                          </li>
                      ))}
            </ul>
        </div>
    )
}
