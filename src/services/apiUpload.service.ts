import { mainRepository } from '@/utils/Repository'

const resource = '/api/upload'

export default {
    uploadSingle(file: File) {
        const formData = new FormData()
        formData.append('file', file)
        return mainRepository.post(`${resource}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },

    uploadMultiple(files: File[]) {
        const formData = new FormData()
        files.forEach((file) => {
            formData.append('files', file)
        })
        return mainRepository.post(`${resource}/multiple`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },

    uploadBase64(image: string, folder = 'avatars') {
        return mainRepository.post(`${resource}/base64`, { image, folder })
    },

    deleteImage(publicId: string) {
        return mainRepository.delete(`${resource}`, {
            data: { public_id: publicId },
        })
    },

    getImageInfo(publicId: string) {
        return mainRepository.get(`${resource}/${publicId}`)
    },

    listImages(
        params: { folder?: string; limit?: number; next_cursor?: string } = {},
    ) {
        const queryParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, String(value))
            }
        })
        const queryString = queryParams.toString()
        const url = queryString ? `${resource}?${queryString}` : `${resource}`
        return mainRepository.get(url)
    },
}
