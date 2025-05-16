import type React from 'react'
import {
    Laptop,
    Smartphone,
    Tablet,
    Monitor,
    Headphones,
    Mouse,
    Keyboard,
    Speaker,
    Camera,
    Watch,
} from 'lucide-react'
import { categories } from '../../../data/categories'
import { Link } from 'react-router-dom'

const CategoryGrid: React.FC = () => {
    const getCategoryIcon = (icon?: string) => {
        switch (icon) {
            case 'laptop':
                return <Laptop size={24} className="mb-3" />
            case 'smartphone':
                return <Smartphone size={24} className="mb-3" />
            case 'tablet':
                return <Tablet size={24} className="mb-3" />
            case 'monitor':
                return <Monitor size={24} className="mb-3" />
            case 'headphones':
                return <Headphones size={24} className="mb-3" />
            case 'mouse':
                return <Mouse size={24} className="mb-3" />
            case 'keyboard':
                return <Keyboard size={24} className="mb-3" />
            case 'speaker':
                return <Speaker size={24} className="mb-3" />
            case 'camera':
                return <Camera size={24} className="mb-3" />
            case 'watch':
                return <Watch size={24} className="mb-3" />
            default:
                return null
        }
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((category) => (
                <Link key={category.id} to={`/shop/category/${category.slug}`}>
                    <div className="rounded-lg bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex flex-col items-center text-blue-600">
                            {getCategoryIcon(category.icon)}
                            <span className="font-medium">{category.name}</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default CategoryGrid
