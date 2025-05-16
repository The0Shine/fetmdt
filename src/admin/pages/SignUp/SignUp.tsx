import { useState } from 'react'
import { registerApi } from '../../../services/apiAuth.service'

export const SignUp = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        // Validate input fields
        if (!firstName || !lastName || !username || !password) {
            setError('Tất cả các trường đều phải được điền đầy đủ.')
            return
        }

        if (username.length < 3) {
            setError('Tên đăng nhập phải có ít nhất 3 ký tự.')
            return
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.')
            return
        }

        if (!/\d/.test(password)) {
            setError('Mật khẩu phải chứa ít nhất một chữ số.')
            return
        }

        if (!/[A-Za-z]/.test(password)) {
            setError('Mật khẩu phải chứa ít nhất một chữ cái.')
            return
        }

        try {
            // Call the API to register
            await registerApi({ firstName, lastName, username, password })
            setSuccess('Đăng ký thành công!')
            // Optional: chuyển hướng sang trang đăng nhập
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Đăng ký thất bại!')
        }
    }

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
                        Đã có tài khoản ?{' '}
                        <span className="text-[#44AEC3]">Đăng nhập</span>
                    </div>
                </div>

                <form
                    className="mt-5 flex w-[428px] flex-col"
                    onSubmit={handleRegister}
                >
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Tên"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="mr-5 mb-3 rounded-lg border p-3"
                        />
                        <input
                            type="text"
                            placeholder="Họ"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="mb-3 rounded-lg border p-3"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mb-3 rounded-lg border p-3"
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-3 rounded-lg border p-3"
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
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
                            />
                            <img
                                className="mx-2"
                                src="https://img.icons8.com/color/20/000000/zalo.png"
                                alt="Zalo"
                            />
                            <img
                                src="https://img.icons8.com/color/20/000000/google-logo.png"
                                alt="Google"
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* Right Section */}
            <div className="flex flex-1 flex-col bg-[url('/image/bgsignupright.png')] bg-cover bg-bottom"></div>
        </div>
    )
}
