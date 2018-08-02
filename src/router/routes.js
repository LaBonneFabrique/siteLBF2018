import auth from '../utils/authRouter'

export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      {
        name: 'accueil',
        path: '',
        props: false,
        component: () => import('pages/index')
      },
      {
        name: 'verifAbonnements',
        path: 'abonnements',
        props: (route) => ({abonnement: true}),
        component: () => import('pages/index')
      },
      {
        name: 'verifAbonnementMail',
        path: 'abonnements/:mML',
        props: (route) => ({abonnement: true, mML: route.params.mML}),
        component: () => import('pages/index')
      },
      {
        name: 'annulerAbonnementsMail',
        path: 'annulerAbonnements/:mML',
        props: (route) => ({annulerAbonnements: true, mML: route.params.mML}),
        component: () => import('pages/index')
      },
      {
        name: 'reset MDP',
        path: 'resetmdp/:uId/:tId',
        props: true,
        component: () => import('pages/resetMDP')
      }
    ]
  },
  {
    path: '/lettreDiffusion',
    component: () => import('layouts/sansFiltre'),
    children: [
      {
        path: ':ldId',
        name: 'VisuLettreDiffusion',
        props: true,
        component: () => import('pages/lettreInfo')
      }
    ]
  },
  {
    path: '/atelier',
    component: () => import('layouts/sansFiltre'),
    children: [
      {
        path: ':idAtelier',
        name: 'bilanAtelier',
        props: (route) => ({idAtelier: route.params.idAtelier}),
        component: () => import('pages/bilanAtelier')
      }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('layouts/dashboardLayout'),
    beforeEnter: requireAuth,
    children: [
      {
        path: ':userId',
        name: 'Tableau de bord',
        component: () => import('pages/dashboard'),
        props: true,
        beforeEnter: requireAuth
      },
      {
        path: ':userId/:membreId',
        name: 'Page adherent',
        component: () => import('pages/adherent'),
        props: true,
        beforeEnter: requireAuth
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
        path: 'lesateliers',
        component: () => import('pages/admin/listeActivites')
      },
      {
        path: 'listeAdherents',
        name: 'listeUsers',
        component: () => import('pages/admin/listUsers')
      },
      {
        path: 'nouvelAtelier',
        component: () => import('pages/admin/formulaireActivite'),
        props: {type: 'Ateliers', dupliquer: false},
        name: 'ajoutAtelier'
      },
      {
        path: 'listeAteliers',
        name: 'lesateliers',
        component: () => import('pages/admin/listeActivites')
      },
      {
        name: 'modifierAtelier',
        path: 'modifierAtelier/:idAtelier',
        props: (route) => ({idAtelier: route.params.idAtelier, dupliquer: false, type: 'edit'}),
        component: () => import('pages/admin/formulaireActivite')
      },
      {
        name: 'dupliquerAtelier',
        path: 'dupliquerAtelier/:idAtelier',
        props: (route) => ({idAtelier: route.params.idAtelier, dupliquer: true, type: 'dupliquer'}),
        component: () => import('pages/admin/formulaireActivite')
      },
      {
        path: 'news',
        name: 'news',
        component: () => import('pages/admin/news')
      },
      {
        path: 'modifierNews/:newsId',
        name: 'modifierNews',
        props: true,
        component: () => import('pages/admin/news')
      },
      {
        path: 'listeNews',
        name: 'listeNews',
        component: () => import('pages/admin/listeNews')
      },
      {
        path: 'listeInscrits/:idAtelier',
        name: 'listeInscrits',
        props: (route) => ({idAtelier: route.params.idAtelier}),
        component: () => import('pages/admin/listeInscrits')
      },
      {
        path: 'mailing/:mailId',
        name: 'mailing',
        props: true,
        component: () => import('pages/admin/envoiML')
      },
      {
        path: 'newMailing',
        name: 'newMailing',
        props: false,
        component: () => import('pages/admin/envoiML')
      },
      {
        path: 'listeMailings',
        name: 'listeMailings',
        props: false,
        component: () => import('pages/admin/listeLettres')
      }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]

function requireAuth (to, from, next) {
  if (!auth.loggedIn() || to.params.userId !== auth.loggedInUser()) {
    next({
      name: 'accueil',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

async function requireIsAdmin (to, from, next) {
  let isAdminOrDie = await auth.isAdmin()
  if (!isAdminOrDie || !auth.loggedIn()) {
    next({
      name: 'accueil',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}
