import { IconDashboard } from '../components/icons'
import { HomePage } from '../pages'

export const ROUTES = {
    HomePage: '/',
    SignUp: '/signup',
    Login: '/login',
}

const routerList = [
    {
        title: 'Dashboard',
        href: ROUTES.HomePage,
        component: HomePage,
        icon: IconDashboard,
    },
]

// export const defaultTitle = 'Default'

// export const routeTitleMapper = {
//     [ROUTES.HomePage]: 'HomePage',
//     [ROUTES.SignUp]: 'SignUp',
//     [ROUTES.Login]: 'Login',
// }

// export const getRouteTitle = (route) => {
//     return routeTitleMapper[route] ?? defaultTitle
// }

export default routerList
