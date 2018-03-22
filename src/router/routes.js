
export default [
  {
    path: '/',
    component: () => import('layouts/nav'),
    alias: '/index',
    children: [
      {
        path: '',
        component: () => import('pages/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/nav'),
    children: [
      {
        path: '',
        component: () => import('pages/login')
      }
    ]
  },
  {
    path: '/input',
    component: () => import('layouts/nav'),
    children: [
      {
        path: '',
        component: () => import('pages/input'),
        meta: { auth: true }
      }
    ]
  },
  {
    path: '/table',
    component: () => import('layouts/nav'),
    children: [
      {
        path: '',
        component: () => import('pages/table'),
        meta: { auth: true }
      }
    ]
  },
  {
    path: '/summary',
    component: () => import('layouts/nav'),
    children: [
      {
        path: '',
        component: () => import('pages/summary'),
        meta: { auth: true }
      }
    ]
  },
  {
    path: '/settings',
    component: () => import('layouts/nav'),
    children: [
      {
        path: '',
        component: () => import('pages/settings'),
        meta: { auth: true }
      }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('layouts/nav'),
    children: [
      { path: '', component: () => import('pages/404') }
    ]
  }
]
