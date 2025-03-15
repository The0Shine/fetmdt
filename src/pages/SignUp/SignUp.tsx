import React from 'react'

export const SignUp = () => {
    return (
        <div className="flex h-screen">
            {/* Left Section */}
            <div className="flex w-[900px] flex-col pl-30">
                <div className="my-10 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-[#44AEC3]"></div>
                    <div className="ml-2 font-bold">SHOP</div>
                </div>
                <div>
                    <div className="text-gray-500">BẮT ĐẦU MIỄN PHÍ</div>
                    <h1 className="my-3 text-4xl font-bold">Tạo tài khoản</h1>
                    <div className="text-gray-500">
                        Đã có tài khoản ?
                        <span className="text-[#44AEC3]"> Đăng nhập</span>
                    </div>
                </div>
                <form className="mt-5 flex w-[428px] flex-col" action="">
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Tên"
                            className="mr-5 mb-3 rounded-lg border p-3"
                        />
                        <input
                            type="text"
                            placeholder="Họ"
                            className="mb-3 rounded-lg border p-3"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        className="mb-3 rounded-lg border p-3"
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className="mb-3 rounded-lg border p-3"
                    />
                    <button className="mt-5 rounded-3xl bg-[#44AEC3] p-3 text-white">
                        Tạo tài khoản
                    </button>
                    <div className="mt-6 w-full max-w-[520px]">
                        <div className="flex flex-row items-center justify-center gap-3">
                            <span className="h-px w-full bg-gray-300"></span>
                            <span className="whitespace-nowrap text-gray-500">
                                Đăng ký qua mạng xã hội
                            </span>
                            <span className="h-px w-full bg-gray-300"></span>
                        </div>
                        <div className="flex justify-center">
                            <img
                                src="https://img.icons8.com/color/20/000000/facebook-new.png"
                                alt="Facebook"
                            />{' '}
                            <img
                                className="mx-2"
                                src="https://img.icons8.com/color/20/000000/zalo.png"
                                alt="Zalo"
                            />{' '}
                            <img
                                src="https://img.icons8.com/color/20/000000/google-logo.png"
                                alt="Google"
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* Right Section */}
            <div className="flex flex-1 flex-col bg-[url('../assets/image/bgsignupright.png')] bg-cover bg-bottom"></div>
        </div>
    )
}
