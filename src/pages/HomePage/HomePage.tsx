import { Note } from './components'
import { ChartLine } from './components/ChartLine'
import Overview from './components/Overview'

export const HomePage = () => {
    return (
        <div className="grid grid-cols-3 gap-6 py-5">
            <div className="col-span-2 rounded-3xl bg-slate-50 px-6 py-5">
                <header>
                    <h1 className="text-[30px] font-semibold">Dashboard</h1>
                    <p className="text-xl text-[#858D92]">
                        Chào mừng bạn trở lại, Huyền Trang!
                    </p>
                </header>
                <Overview />
                <div className="mt-10 h-[475px] w-[full] rounded-xl bg-[#FFFFFF] shadow-xl">
                    <p className="mb-6 text-2xl">Tài chính</p>
                    <ChartLine />
                </div>
            </div>
            <Note />
        </div>
    )
}
