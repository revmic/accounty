<template>

  <q-page class="layout-padding" style="max-width: 800px">
    <q-card>
      <div class="row" style="padding:10px; font-size:16px">
        <q-select class="col-4"
          v-model="rangePreset"
          :options="rangePresetOptions"
          float-label="Range"
          @input="rangeChange"
        />
        <q-datetime class="col-4"
          v-model="summaryStart"
          type="date"
          float-label="Starting"
          format="M/D/YYYY"
        />
        <q-datetime class="col-4"
          v-model="summaryEnd"
          type="date"
          float-label="Ending"
          format="M/D/YYYY"
        />
      </div>
    </q-card>

    <q-card>
      <q-collapsible opened label="Summaries" icon="view_headline">
        <!-- <h4></h4> -->
        <!-- <table class="q-table horizontal-separator" style="width:100%">
          <thead>
            Restaurant
          </thead>
          <tbody>
            <tr>
              <td>Total income:</td>
              <td>$ {{ summary.restaurantDollars }}</td>
            </tr>
            <tr>
              <td>Total hours:</td>
              <td>{{ summary.restaurantHours.toFixed(1) }} hrs</td>
            </tr>
            <tr>
              <td>Dollars per hour:</td>
              <td>$ {{ summary.hourlyWage }} / hr</td>
            </tr>
            <tr>
              <td>Average daily earnings:</td>
              <td>$ {{ summary.dailyAverage }}</td>
            </tr>
            <tr>
              <td>Highest daily earnings:</td>
              <td>$ {{ summary.dailyHigh }}</td>
            </tr>
            <tr>
              <td>Lowest daily earnings:</td>
              <td>$ {{ summary.dailyLow }}</td>
            </tr>
            <tr>
              <td>Best weekday:</td>
              <td>{{ summary.bestWeekday }}</td>
            </tr>
          </tbody>
        </table> -->

        <table class="q-table horizontal-separator" style="width:100%">
          <thead>
            Jewelry
          </thead>
          <tbody>
            <tr>
              <td>Total income:</td>
              <td>$ {{ summary.jewelryIncome.toFixed(2) }}</td>
            </tr>
            <tr>
              <td>Total expenses:</td>
              <td>$ {{ summary.jewelryExpenses.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </q-collapsible>
    </q-card>

    <q-card>
      <q-collapsible label="Dollars & Hours" icon="insert_chart">
        <div style="padding:0 50px">
          <q-select v-model="grouping" :options="groupingOptions" float-label="Group data" :disable='true'/>
        </div>
        <div v-if="loaded">
          <bar-chart :data="dollarsByMonth" />
        </div>
      </q-collapsible>
    </q-card>

    <q-card>
      <q-collapsible label="Dollars per Hour" icon="show_chart">
        <div v-if="loaded">
          <line-chart :data="dollarsPerHour" />
        </div>
      </q-collapsible>
    </q-card>

     <q-card>
      <q-collapsible label="Weekday Averages" icon="insert_chart">
        <div v-if="loaded">
          <bar-chart :data="weekdayTotals" />
        </div>
      </q-collapsible>
    </q-card>

    <q-card>
      <q-collapsible label="Restaurant vs Jewelry" icon="pie_chart">
        <div v-if="loaded">
          <pie-chart :data="restaurantVsJewelry" />
        </div>
      </q-collapsible>
    </q-card>

  </q-page>

</template>

<script>
import { date } from 'quasar'
import BarChart from '../components/BarChart.js'
import LineChart from '../components/LineChart.js'
import PieChart from '../components/PieChart.js'

const initTime = new Date()

export default {
  components: {
    BarChart,
    LineChart,
    PieChart
  },
  data () {
    return {
      loaded: false,

      summaryStart: new Date(initTime.getFullYear(), initTime.getMonth(), 1),
      summaryEnd: new Date(initTime.getFullYear(), initTime.getMonth() + 1, 0),
      filteredEntries: [],

      rangePreset: 'thisMonth',
      rangePresetOptions: [
        { 'label': 'This month', 'value': 'thisMonth' },
        { 'label': 'Last month', 'value': 'lastMonth' },
        { 'label': 'This year', 'value': 'thisYear' },
        { 'label': 'Last year', 'value': 'lastYear' },
        { 'label': 'All time', 'value': 'all' }
      ],

      grouping: 'byMonth',
      groupingOptions: [
        { 'label': 'By day', 'value': 'byDay' },
        { 'label': 'By month', 'value': 'byMonth' }
      ]
    }
  },
  firebase () {
    return {
      entries: this.$db.ref('users/' + this.uid).orderByChild('date')
    }
  },
  created () {
    if (this.$auth.currentUser) {
      this.uid = this.$auth.currentUser.uid
      this.entriesRef = this.$db.ref('users/' + this.uid).orderByChild('date')

      this.entriesRef.on('value', data => {
        this.entries = []
        console.log('entriesRef on value')
        var obj = data.val()

        for (const [key, value] of Object.entries(obj)) {
          value.id = key
          this.entries.push(value)
        }
        this.loaded = true

        this.entries.sort(function (a, b) {
          return new Date(a.date) - new Date(b.date)
        })

        this.filterEntries()
      })
    }
    this.rangePreset === 'thisMonth'
  },
  computed: {
    summary () {
      var s = {}
      // Restaurant numbers
      s.restaurantDollars = 0
      s.restaurantHours = 0
      s.hourlyWage = 0
      s.dailyAverage = 0
      s.dailyHigh = 0
      s.dailyLow = 9999
      s.bestWeekday = 'None'
      // Only consider hourly wage when hours are entered
      var hourlyWage = {}
      hourlyWage.dollars = 0
      hourlyWage.hours = 0
      var restaurantDays = 0
      // Jewelry numbers
      s.jewelryIncome = 0
      s.jewelryExpenses = 0

      for (let i = 0; i < this.filteredEntries.length; i++) {
        const entry = this.filteredEntries[i]
        // console.log(entry.id)
        // console.log(entry)

        if (entry.job === 'jewelry') {
          if (entry.type === 'income') {
            s.jewelryIncome += entry.dollars
          } else {
            s.jewelryExpenses += Math.abs(entry.dollars)
          }
        } else if (entry.job === 'restaurant') {
          restaurantDays += 1
          s.restaurantDollars += entry.dollars
          s.restaurantHours += entry.hours

          // Only calc dollars/hour if both are set
          if (entry.dollars && entry.hours) {
            hourlyWage.dollars += entry.dollars
            hourlyWage.hours += entry.hours
          }

          if (entry.dollars > s.dailyHigh) {
            s.dailyHigh = entry.dollars
          }
          if (entry.dollars < s.dailyLow) {
            s.dailyLow = entry.dollars
          }
        }
      }

      s.hourlyWage = (hourlyWage.dollars / hourlyWage.hours).toFixed(2)
      s.dailyAverage = (s.restaurantDollars / restaurantDays).toFixed(2)

      return s
    },
    dollarsByMonth () {
      var chart = {
        labels: [],
        datasets: [
          {
            backgroundColor: '#e3f4e5',
            label: 'Cash',
            data: []
          },
          {
            backgroundColor: '#e3f1f4',
            label: 'Hours',
            data: []
          }
        ]
      }
      var dollars = {}
      var hours = {}

      for (let i = 0; i < this.entries.length; i++) {
        const entry = this.entries[i]
        // console.log(entry.id)
        // console.log(entry)
        if (entry.job !== 'restaurant') {
          continue
        }

        const month = entry.dateStr.split(' ')[1]
        // initialize total for the month
        if (!(month in dollars)) {
          dollars[month] = 0
        }
        if (!(month in hours)) {
          hours[month] = 0
        }
        dollars[month] += entry.dollars
        hours[month] += entry.hours
      }

      for (var key in dollars) {
        chart.labels.push(key)
        chart.datasets[0].data.push(dollars[key])
        chart.datasets[1].data.push(hours[key])
      }
      return chart
    },
    dollarsPerHour () {
      var chart = {
        labels: [],
        datasets: [
          {
            // backgroundColor: '#e3f4e5',
            fill: false,
            label: 'Dollars/Hour',
            data: []
          }
        ]
      }
      for (let i = 0; i < this.entries.length; i++) {
        const entry = this.entries[i]

        // Only consider restaurant
        if (entry.hours === 0 || entry.job === 'jewelry') {
          continue
        }
        chart.labels.push(entry.dateStr)
        chart.datasets[0].data.push(entry.dollars / entry.hours)
      }
      return chart
    },
    weekdayTotals () {
      function average (arr) {
        var sum = 0
        if (!arr) {
          return sum
        }
        for (let i = 0; i < arr.length; i++) {
          sum += arr[i]
        }
        return sum / arr.length
      }

      var chartData = {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
          {
            backgroundColor: '#9cb3e5',
            label: 'Dollars',
            data: []
          },
          {
            backgroundColor: '#e59cb3',
            label: 'Per Hour',
            data: []
          }
        ]
      }
      var data = {}
      // Initialize weekday object for each label
      for (let i = 0; i < chartData.labels.length; i++) {
        const weekday = chartData.labels[i]
        data[weekday] = {}
        data[weekday].dollars = []
        data[weekday].perHour = []
      }

      // Group dollars and dollars per hour by weekday
      for (let i = 0; i < this.entries.length; i++) {
        const entry = this.entries[i]
        if (entry.job !== 'restaurant') {
          continue
        }
        const weekday = date.formatDate(entry.date, 'ddd')
        data[weekday].dollars.push(entry.dollars)
        // Only include dollars per hour if hours were recorded
        if (entry.hours > 0) {
          data[weekday].perHour.push(entry.dollars / entry.hours)
        }
      }
      // console.log(data)
      var avgDollars = chartData.datasets[0].data
      var perHour = chartData.datasets[1].data

      // Calculate for each label / day in week
      for (let i = 0; i < chartData.labels.length; i++) {
        const weekday = chartData.labels[i]
        avgDollars[i] = average(data[weekday].dollars)
        perHour[i] = average(data[weekday].perHour)
      }
      return chartData
    },
    restaurantVsJewelry () {
      var chart = {
        labels: [
          'Restaurant',
          'Jewelry'
        ],
        datasets: [
          {
            backgroundColor: ['#e3f4e5', '#f4f4e3'],
            data: []
          }
        ]
      }
      var restaurantDollars = 0
      var jewelryDollars = 0

      for (let i = 0; i < this.entries.length; i++) {
        const entry = this.entries[i]
        if (entry.job === 'restaurant') {
          restaurantDollars += entry.dollars
        } else if (entry.job === 'jewelry') {
          jewelryDollars += entry.dollars
        }
      }
      chart.datasets[0].data[0] = restaurantDollars
      chart.datasets[0].data[1] = jewelryDollars

      return chart
    }
  },
  watch: {
    // entries (val) {
    //   console.log('entries prop changed')
    // },
    summaryStart (val) {
      // console.log('summaryStart changed')
      this.filterEntries()
    },
    summaryEnd (val) {
      this.filterEntries()
    }
  },
  methods: {
    filterEntries () {
      // find element in entries for start date using binary search

      // start with that found element
      this.filteredEntries = []

      for (var i = 0; i < this.entries.length; i++) {
        const entry = this.entries[i]
        const entryDate = new Date(entry.date)

        if (date.isBetweenDates(entryDate, this.summaryStart, this.summaryEnd)) {
          this.filteredEntries.push(entry)
        }
      }
    },
    rangeChange () {
      if (this.rangePreset === 'thisMonth') {
        this.summaryStart = new Date(initTime.getFullYear(), initTime.getMonth(), 1)
        this.summaryEnd = new Date(initTime.getFullYear(), initTime.getMonth() + 1, 0)
      }
      if (this.rangePreset === 'lastMonth') {
        this.summaryStart = new Date(initTime.getFullYear(), initTime.getMonth()-1, 1)
        this.summaryEnd = new Date(initTime.getFullYear(), initTime.getMonth(), 0)
      }
      if (this.rangePreset === 'thisYear') {
        this.summaryStart = new Date(initTime.getFullYear(), 0, 1)
        this.summaryEnd = new Date(initTime.getFullYear(), 11, 31)
      }
      if (this.rangePreset === 'lastYear') {
        this.summaryStart = new Date(initTime.getFullYear() - 1, 0, 1)
        this.summaryEnd = new Date(initTime.getFullYear() - 1, 11, 31)
      }
      if (this.rangePreset === 'all') {
        this.summaryStart = new Date('2017-01-02')
        this.summaryEnd = new Date()
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.q-item-link:hover
  background: none
</style>
