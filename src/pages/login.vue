<template>

  <div class="row q-pa-lg">
    <q-card class="q-pa-lg col-md-6 offset-md-3">
      <q-card-title>
        Login to Accounty
      </q-card-title>

      <q-card-main >
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
      </q-card-main>

      <q-card-separator />

      <q-card-actions align="center" class="q-pt-lg">
        <q-btn
          color="primary"
          @click="login">
          Go to tracker
        </q-btn>
      </q-card-actions>
    </q-card>

    <div class="q-pa-md"></div>

    <q-card class="q-pa-lg col-md-6 offset-md-3">
      <q-card-title>
        Register for a free account
      </q-card-title>

      <q-card-main >
        <q-field class="q-pb-lg">
          <q-input
            v-model="regName"
            float-label="Name"
          />
        </q-field>

        <q-field class="q-pb-lg">
          <q-input
            v-model="regEmail"
            float-label="Email"
          />
        </q-field>

        <q-field>
          <q-input
            v-model="regPassword"
            type="password"
            float-label="Password"
          />
        </q-field>
      </q-card-main>

      <q-card-separator />

      <q-card-actions align="center" class="q-pt-lg">
        <q-btn
          @click="login">
          Forgot password?
        </q-btn>
        <q-btn
          color="primary"
          @click="register">
          Register
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>

</template>

<style>
</style>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',

      regName: '',
      regEmail: '',
      regPassword: '',
      emailError: false,
      passwordError: false
    }
  },
  mounted () {
    this.$auth.onAuthStateChanged(user => {
      console.log('onAuthStateChanged inside login.vue')
      if (user) {
        this.$router.push({ path: '/input' })
      }
    })
  },
  methods: {
    login () {
      if (this.email && this.password) {
        this.$auth.signInWithEmailAndPassword(
          this.email,
          this.password
        ).catch((error) => {
          this.$q.notify({
            type: 'warning',
            message: error.code + ' -- ' + error.message
          })
        })
      }
    },
    register () {
      console.log('registering ' + this.regEmail)
      if (!this.regEmail) {
        return
      }

      const u = this.$auth.createUserWithEmailAndPassword(this.regEmail, this.regPassword)
        .catch((error) => {
          console.log(error)
          const notifyOptions = {
            type: 'negative',
            position: 'top',
            message: error.message
          }
          this.$q.notify(notifyOptions)
        })
      console.log(u)
    }
  }
}
</script>
