import type React from 'react'
import { Link } from 'react-router-dom'
import { Banner } from '../../../../types/product'

interface SecondaryBannerProps {
    banner: Banner
}

const SecondaryBanner: React.FC<SecondaryBannerProps> = ({ banner }) => {
    return (
        <div className="relative h-[200px] overflow-hidden rounded-lg">
            <img
                src={banner.image || '/placeholder.svg'}
                alt={banner.title}
                className="object-cover"
            />
        </div>
    )
}

export default SecondaryBanner
