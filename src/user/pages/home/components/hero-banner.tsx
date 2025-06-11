import type React from 'react'
import { ChevronRight } from 'lucide-react'
import { Banner } from '../../../../types/product'
import { Link } from 'react-router-dom'

interface HeroBannerProps {
    banner: Banner
}

const HeroBanner: React.FC<HeroBannerProps> = ({ banner }) => {
    return (
        <div className="relative h-[400px] overflow-hidden rounded-lg md:h-[500px]">
            <img
                src={banner.image || '/placeholder.svg'}
                alt={banner.title}
                className="object-cover"
            />
        </div>
    )
}

export default HeroBanner
