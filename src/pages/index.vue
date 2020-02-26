<template>
  <q-page padding style="max-width: 800px">
    <q-card class="q-pa-sm">
      <!-- <q-card-title></q-card-title> -->

      <q-card-main>
        <p>Accounty keeps track of income and expenses related to your employment. You can add one or more jobs and track hours, earnings, and expenses and provide a description, tags, and link documentation and images. Accounty summarizes your data and provides visualization for insight. All of your data is searchable, including uploaded files, to make tasks like monthly budgeting and tax time a breeze.</p>
        <!-- Check out <a href="#">the demo</a> and <a href="#">register for a free account</a>!
        Or <a href="#">sign in</a> if you already have an account.
        <br><br>
        We're currently targetting hourly and freelance income. -->
      </q-card-main>

      <q-card-actions align="center">
        <q-btn style="width:33%"
          icon="add"
          color="primary"
          label="Start Tracking"
          @click="$router.push('/input')"
        />
      </q-card-actions>

      <!-- <q-card-separator /> -->
      <!-- <q-card-actions align="center" class="q-pt-lg">
      </q-card-actions> -->
    </q-card>

    <q-card class="q-pa-sm">

      <q-card-title>Features</q-card-title>

      <q-card-main class="q-pl-none">
        <q-list dense no-border>
          <q-item>
            <q-item-side icon="attach_money" />
            Track income and expenses for multiple jobs
          </q-item>
          <q-item>
            <q-item-side icon="monochrome_photos" />
            Image scanning with text recognition
          </q-item>
          <q-item>
            <q-item-side icon="search" />
            Searchable data
          </q-item>
          <q-item>
            <q-item-side icon="insert_chart" />
            Visualization
          </q-item>
        </q-list>
      </q-card-main>

      <!-- <q-card-separator /> -->
      <!-- <q-card-actions align="center" class="q-pt-lg">
      </q-card-actions> -->
    </q-card>

    <q-card class="q-pa-sm">
      <q-card-title>Security</q-card-title>

      <q-card-main>
        <p>Application built on <a href="https://firebase.google.com/">Google Firebase</a> platform. All information is private to your account and protected with Firebase authentication.</p>
      </q-card-main>

      <!-- <q-card-separator /> -->
      <!-- <q-card-actions align="center" class="q-pt-lg">
      </q-card-actions> -->
    </q-card>

  </q-page>
</template>

<script>
export default {
  data () {
    return {}
  },
  created () {
  },
  mounted () {
    console.log('index mounted')
  }
}
</script>

<style lang="stylus">
.q-card
  margin-bottom 20px
.q-card-main
  font-size 16px
.q-item
  font-size 16px
</style>
