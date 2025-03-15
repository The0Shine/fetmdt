import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import routerList from './constants/routes'
import { Login, SignUp } from './pages'
import { MainLayout } from './layouts'

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<MainLayout />}>
                {routerList.map(({ href, component: Component }, index) => (
                    <Route key={index} path={href} element={<Component />} />
                ))}
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
    </Router>
)

export default App
