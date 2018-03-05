import auth from '../utils/authRouter'

export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      {
        name: 'accueil',
        path: '',
        component: () => import('pages/index')
      },
      {
        path: '/dashboard/:userId',
        name: 'Tableau de bord',
        component: () => import('pages/dashboard'),
        props: true,
        beforeEnter: requireAuth
      },
      {
        path: '/resetmdp/:uId/:tId',
        props: true,
        component: () => import('pages/resetMDP')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/admin'),
    beforeEnter: requireIsAdmin,
    children: [
      {
        name: 'accueilAdmin',
        path: '',
        component: () => import('pages/admin/index')
      },
      {
        path: 'listeAdherents',
        name: 'listeUsers',
        component: () => import('pages/admin/listUsers')
      },
      {
        path: 'nouvelAtelier',
        component: () => import('pages/admin/formulaireActivite'),
        props: {type: 'Ateliers'},
        name: 'ajoutActivite'
      },
      {
        path: 'listeAteliers',
        name: 'lesateliers',
        component: () => import('pages/admin/listeActivites')
      },
      {
        path: 'modifierAtelier/:idAtelier',
        props: true,
        component: () => import('pages/admin/formulaireActivite')
      },
      {
        path: 'dupliquerAtelier/:idAtelier',
        props: (route) => ({idAtelier: route.params.idAtelier, dupliquer: true}),
        component: () => import('pages/admin/formulaireActivite')
      },
      {
        path: 'creerInfo',
        name: 'creerInfo',
        component: () => import('pages/admin/news')
      }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]

function requireAuth (to, from, next) {
  if (!auth.loggedIn() || !auth.hasLoggedUser() || to.params.userId !== auth.loggedInUser()) {
    next({
      name: 'accueil',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

function requireIsAdmin (to, from, next) {
  if (!auth.isAdmin() || !auth.loggedIn()) {
    next({
      name: 'accueil',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}
