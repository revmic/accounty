import { Line } from 'vue-chartjs'

var options = {
}

export default {
  extends: Line,
  props: ['data'],
  mounted () {
    this.renderChart(this.data, options)
  }
}
