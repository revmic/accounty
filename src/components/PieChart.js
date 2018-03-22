import { Doughnut } from 'vue-chartjs'

var options = {
}

export default {
  extends: Doughnut,
  props: ['data'],
  mounted () {
    this.renderChart(this.data, options)
  }
}
