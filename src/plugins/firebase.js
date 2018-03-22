import firebase from 'firebase'
import VueFire from 'vuefire'

// Initialize Firebase
var config = {
  projectId: 'rocky-money',
  apiKey: 'AIzaSyAM__B97wa0y931akA6ZaUY62lqXz7IlUc',
  authDomain: 'rocky-money.firebaseapp.com',
  databaseURL: 'https://rocky-money.firebaseio.com',
  storageBucket: 'rocky-money.appspot.com',
  messagingSenderId: '748653210909'
}

const connection = firebase.initializeApp(config)
const db = connection.database()
const auth = connection.auth()
const storage = firebase.storage()

export default ({ app, router, Vue }) => {
  Vue.use(VueFire)

  router.beforeEach((to, from, next) => {
    console.log('onAuthStateChanged inside firebase.js')
    const authRequired = to.matched.some((route) => route.meta.auth)

    auth.onAuthStateChanged(user => {
      if (authRequired && !user) {
        next('/login')
      } else {
        next()
        // router.push({ path: '/input' })
      }
    })
  })

  // auth.onAuthStateChanged(user => {
  //   if (!user) {
  //     Vue.prototype.$user = user
  //     // Vue.prototype.$authenticated = true
  //     console.log('redirect to login')
  //     // console.log(next)
  //     // next('/login')
  //     router.push({ path: 'login' })
  //   } else {
  //     // Vue.prototype.$authenticated = false
  //     // router.push({ path: 'login' })
  //     console.log('redirect to index')
  //     // console.log(next)
  //     // next()
  //     // router.push({ path: '/' })
  //   }
  // })

  Object.defineProperties(Vue.prototype, {
    $db: {
      get () {
        return db
      }
    },
    $auth: {
      get () {
        return auth
      }
    },
    $storage: {
      get () {
        return storage
      }
    }
  })
}
