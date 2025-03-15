import React from 'react'

export const Login = () => {
    return (
        <div className="flex h-screen">
            {/* Left Section */}
            <div className="flex w-[650px] flex-col bg-[url('../assets/image/bgloginleft.png')] bg-cover bg-bottom"></div>

            {/* Right Section */}
            <div className="flex flex-1 flex-col justify-center">
                <div className="mt-3 h-[115px] w-[361px]">
                    <h1 className="text-3xl font-bold text-[#02173F]">
                        Đăng nhập
                    </h1>
                    <p className="mt-3 text-[#858D92]">
                        Bạn chưa có tài khoản?{' '}
                        <a href="#" className="text-[#44AEC3]">
                            Đăng ký
                        </a>
                    </p>
                </div>

                <form className="w-full max-w-[520px]">
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        className="mb-3 w-full rounded-lg border bg-gray-100 p-3"
                        defaultValue="HuyenTrang6666"
                    />
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            className="mb-3 w-full rounded-lg border p-3"
                        />
                        <span className="absolute top-3 right-3 cursor-pointer">
                            👁️
                        </span>
                    </div>
                    <div className="mb-3 text-right text-sm text-gray-500">
                        <a href="#">Quên mật khẩu?</a>
                    </div>
                    <button className="w-full cursor-pointer rounded-2xl bg-[#44AEC3] p-3 text-white">
                        Đăng nhập
                    </button>
                </form>

                <div className="mt-6 w-full max-w-[520px]">
                    <div className="flex flex-row items-center justify-center gap-3">
                        <span className="h-px w-full bg-gray-300"></span>
                        <span className="whitespace-nowrap text-gray-500">
                            Đăng nhập với
                        </span>
                        <span className="h-px w-full bg-gray-300"></span>
                    </div>

                    <button className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border p-3">
                        <img
                            src="https://img.icons8.com/color/20/000000/google-logo.png"
                            alt="Google"
                        />
                        Đăng nhập với Google
                    </button>
                    <div className="mt-3 flex gap-3">
                        <button className="flex w-1/2 cursor-pointer items-center justify-center gap-2 rounded-lg border p-3">
                            <img
                                src="https://img.icons8.com/color/20/000000/facebook-new.png"
                                alt="Facebook"
                            />{' '}
                            Facebook
                        </button>
                        <button className="flex w-1/2 cursor-pointer items-center justify-center gap-2 rounded-lg border p-3">
                            <img
                                src="https://img.icons8.com/color/20/000000/zalo.png"
                                alt="Zalo"
                            />{' '}
                            Zalo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
