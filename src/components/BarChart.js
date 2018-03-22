import { Bar } from 'vue-chartjs'

var options = {
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  }
}

export default {
  extends: Bar,
  props: ['data'],
  mounted () {
    this.renderChart(this.data, options)
  }
}
