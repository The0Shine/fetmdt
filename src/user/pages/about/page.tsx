import { Users, Award, Clock, Truck, Shield, ThumbsUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-gray-800">
                    Giới thiệu về S Shop
                </h1>
                <p className="text-gray-600">
                    Cửa hàng điện tử chính hãng hàng đầu Việt Nam
                </p>
            </div>

            <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                    <h2 className="mb-4 text-2xl font-bold text-gray-800">
                        Câu chuyện của chúng tôi
                    </h2>
                    <div className="space-y-4 text-gray-700">
                        <p>
                            S Shop được thành lập vào năm 2015 với sứ mệnh mang
                            đến cho người tiêu dùng Việt Nam những sản phẩm công
                            nghệ chính hãng, chất lượng cao với giá cả hợp lý và
                            dịch vụ chăm sóc khách hàng tận tâm.
                        </p>
                        <p>
                            Từ một cửa hàng nhỏ tại Hà Nội, đến nay TechZone đã
                            phát triển thành một trong những chuỗi cửa hàng điện
                            tử lớn nhất cả nước với hơn 50 chi nhánh trên toàn
                            quốc, phục vụ hàng triệu khách hàng mỗi năm.
                        </p>
                        <p>
                            Chúng tôi tự hào là đối tác ủy quyền chính thức của
                            nhiều thương hiệu công nghệ hàng đầu thế giới như
                            Apple, Samsung, Sony, Dell, HP, Asus và nhiều thương
                            hiệu khác.
                        </p>
                    </div>
                </div>

                <div className="relative h-80 overflow-hidden rounded-lg">
                    <img
                        src="https://picsum.photos/640/320"
                        alt="TechZone Store"
                        className="object-cover"
                    />
                </div>
            </div>

            <div className="mb-12 rounded-lg bg-blue-600 p-8 text-white">
                <div className="mb-8 text-center">
                    <h2 className="mb-2 text-2xl font-bold">
                        Tầm nhìn & Sứ mệnh
                    </h2>
                    <p>Định hướng phát triển và cam kết của chúng tôi</p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="rounded-lg bg-blue-700 p-6">
                        <h3 className="mb-3 text-xl font-bold">Tầm nhìn</h3>
                        <p>
                            Trở thành nhà bán lẻ sản phẩm công nghệ hàng đầu
                            Việt Nam, mang đến trải nghiệm mua sắm tuyệt vời và
                            sản phẩm chất lượng cho mọi khách hàng.
                        </p>
                    </div>

                    <div className="rounded-lg bg-blue-700 p-6">
                        <h3 className="mb-3 text-xl font-bold">Sứ mệnh</h3>
                        <p>
                            Cung cấp các sản phẩm công nghệ chính hãng với giá
                            cả hợp lý, dịch vụ chuyên nghiệp và hỗ trợ khách
                            hàng tận tâm, góp phần nâng cao chất lượng cuộc sống
                            thông qua công nghệ.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-12">
                <div className="mb-8 text-center">
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">
                        Giá trị cốt lõi
                    </h2>
                    <p className="text-gray-600">
                        Những giá trị định hướng mọi hoạt động của chúng tôi
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                        <div className="mb-4 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                <Award size={32} className="text-blue-600" />
                            </div>
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-gray-800">
                            Chất lượng
                        </h3>
                        <p className="text-gray-600">
                            Cam kết cung cấp sản phẩm chính hãng, chất lượng cao
                            và dịch vụ xuất sắc.
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                        <div className="mb-4 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                <Users size={32} className="text-blue-600" />
                            </div>
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-gray-800">
                            Khách hàng
                        </h3>
                        <p className="text-gray-600">
                            Đặt khách hàng làm trung tâm, lắng nghe và đáp ứng
                            mọi nhu cầu của khách hàng.
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                        <div className="mb-4 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                <ThumbsUp size={32} className="text-blue-600" />
                            </div>
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-gray-800">
                            Trung thực
                        </h3>
                        <p className="text-gray-600">
                            Kinh doanh minh bạch, trung thực và có trách nhiệm
                            với khách hàng và xã hội.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-12">
                <div className="mb-8 text-center">
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">
                        Tại sao chọn TechZone?
                    </h2>
                    <p className="text-gray-600">
                        Những lý do khiến chúng tôi trở thành lựa chọn hàng đầu
                        của khách hàng
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center">
                            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                <Shield size={24} className="text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">
                                Hàng chính hãng
                            </h3>
                        </div>
                        <p className="text-gray-600">
                            100% sản phẩm được nhập khẩu chính hãng với đầy đủ
                            giấy tờ, hóa đơn.
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center">
                            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                <Truck size={24} className="text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">
                                Giao hàng nhanh
                            </h3>
                        </div>
                        <p className="text-gray-600">
                            Giao hàng toàn quốc trong vòng 24-48 giờ với đội ngũ
                            vận chuyển chuyên nghiệp.
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center">
                            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                <Clock size={24} className="text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">
                                Hỗ trợ 24/7
                            </h3>
                        </div>
                        <p className="text-gray-600">
                            Đội ngũ tư vấn và hỗ trợ kỹ thuật sẵn sàng phục vụ
                            24/7, kể cả ngày lễ.
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center">
                            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                <Award size={24} className="text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">
                                Bảo hành tận tâm
                            </h3>
                        </div>
                        <p className="text-gray-600">
                            Chính sách bảo hành dài hạn và dịch vụ sửa chữa
                            chuyên nghiệp, nhanh chóng.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-12 rounded-lg bg-white p-8 shadow-sm">
                <div className="mb-8 text-center">
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">
                        Đội ngũ của chúng tôi
                    </h2>
                    <p className="text-gray-600">
                        Những con người tài năng và đam mê đằng sau thành công
                        của TechZone
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center">
                        <div className="relative mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
                            <img
                                src="https://ui-avatars.com/api/?name=CEO&background=44aec3&color=fff&size=160"
                                alt="CEO"
                                className="object-cover"
                            />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">
                            Nguyễn Văn A
                        </h3>
                        <p className="text-blue-600">CEO & Founder</p>
                    </div>

                    <div className="text-center">
                        <div className="relative mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
                            <img
                                src="https://ui-avatars.com/api/?name=CTO&background=44aec3&color=fff&size=160"
                                alt="CTO"
                                className="object-cover"
                            />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">
                            Trần Thị B
                        </h3>
                        <p className="text-blue-600">CTO</p>
                    </div>

                    <div className="text-center">
                        <div className="relative mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
                            <img
                                src="https://ui-avatars.com/api/?name=CEO&background=44aec3&color=fff&size=160"
                                alt="Marketing Director"
                                className="object-cover"
                            />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">
                            Lê Văn C
                        </h3>
                        <p className="text-blue-600">Marketing Director</p>
                    </div>

                    <div className="text-center">
                        <div className="relative mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
                            <img
                                src="https://ui-avatars.com/api/?name=CEO&background=44aec3&color=fff&size=160"
                                alt="Sales Manager"
                                className="object-cover"
                            />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">
                            Phạm Thị D
                        </h3>
                        <p className="text-blue-600">Sales Manager</p>
                    </div>
                </div>
            </div>

            <div className="mb-8 text-center">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                    Liên hệ với chúng tôi
                </h2>
                <p className="mb-6 text-gray-600">
                    Bạn có câu hỏi hoặc cần hỗ trợ? Đừng ngần ngại liên hệ với
                    chúng tôi!
                </p>
            </div>
        </div>
    )
}
