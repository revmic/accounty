<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn
          flat
          dense
          round
          :disabled="!username"
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          <router-link to="/" id="home-link" style="color:white; text-decoration:none">Accounty</router-link>
          <div slot="subtitle">
            <router-link to="/" id="home-link" style="color:white; text-decoration:none">Make money, spend money</router-link>
          </div>
        </q-toolbar-title>

        <div v-if="username">
          <q-btn flat @click="logout">
            <div>
              <div>Logout</div>
              <div style="font-size:8px">{{ username }}</div>
            </div>
          </q-btn>
        </div>
        <div v-else>
          <q-btn flat @click="login">
            Login
          </q-btn>
        </div>

      </q-toolbar>
    </q-layout-header>

    <!-- <q-dialog
      v-model="loginOpened"
      cancel="Cancel"
      ok="Login"
      @ok="login"
      @cancel="loginOpened=false"
    >
      <span slot="title">Login to Accounty</span>

      <div slot="body">
        <q-field class="q-pb-lg">
          <q-input
            v-model="email"
            float-label="Email"
          />
        </q-field>

        <q-field>
          <q-input
            v-model="password"
            type="password"
            float-label="Password"
          />
        </q-field>
      </div>

    </q-dialog> -->

<!--     <q-modal v-model="loginOpened" position="top">
      <h4>Login Modal</h4>
      <q-btn
        color="primary"
        @click="loginOpened=false"
        label="Close"
      />
    </q-modal> -->

<!--     <q-modal v-model="loginOpened">
      <h4>Login Modal</h4>
      <q-btn
        color="primary"
        @click="loginOpened=false"
        label="Close"
      />
    </q-modal> -->

    <q-layout-drawer
      v-model="leftDrawerOpen"
      content-class="bg-grey-2"
    >
      <q-list
        no-border
      >
        <q-list-header>Accounty Menu</q-list-header>

        <q-item>
          <router-link to="/input">
            <q-btn flat>Enter Data</q-btn>
          </router-link>
        </q-item>
        <q-item>
          <router-link to="/table">
            <q-btn flat>View & Edit</q-btn>
          </router-link>
        </q-item>
        <q-item>
          <router-link to="/summary">
            <q-btn flat>Summaries & Charts</q-btn>
          </router-link>
        </q-item>
        <q-item>
          <router-link to="/settings" disabled>
            <q-btn flat disable>Settings</q-btn>
          </router-link>
        </q-item>

      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <transition name="fade">
        <router-view />
      </transition>
    </q-page-container>

  </q-layout>
</template>

<script>

export default {
  name: 'LayoutMain',
  data () {
    return {
      leftDrawerOpen: false,
      username: ''
      // loginOpened: false,
      // email: '',
      // password: '',
      // loginOptions: {
      //   title: 'Login',
      //   prompt: {
      //     type: 'text',
      //     items: [
      //       { label: 'Email', value: 'email' }
      //     ]
      //   },
      //   ok: {
      //     push: true,
      //     label: 'Yeah OK'
      //   }
      // }
    }
  },
  computed: {
    // username () {
    //   return this.$user.email.split('@')[0]
    // }
  },
  created () {
    // this.$q.dialog(this.loginOptions)
  },
  mounted () {
    // this.username = this.$user.email.split('@')[0]
    this.$auth.onAuthStateChanged(user => {
      console.log('onAuthStateChanged inside nav.vue')
      // Get username for display
      if (user) {
        this.username = user.email.split('@')[0]
      } else {
        this.leftDrawerOpen = false
      }
      // Open login dialog
      // if (this.$route.query.login === 'true') {
      //   this.loginOpened = true
      // }
    })
  },
  methods: {
    // login () {
    //   if (this.email && this.password) {
    //     this.$auth.signInWithEmailAndPassword(
    //       this.email,
    //       this.password
    //     ).catch((error) => {
    //       this.$q.notify({
    //         type: 'warning',
    //         message: error.code + ' -- ' + error.message
    //       })
    //       this.$q.dialog(this.loginOptions)
    //     })
    //   }
    // },
    login () {
      this.$router.push({ path: '/login' })
    },
    logout () {
      this.$router.push({ path: '/login' })
      this.$auth.signOut()
      this.username = ''
    }
  }
}
</script>

<style lang="stylus">
.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}
.fade-enter-active {
  transition-delay: .25s;
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
