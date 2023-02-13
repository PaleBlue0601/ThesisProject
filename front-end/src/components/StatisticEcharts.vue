<template>
  <div style="width:100%;height:500px" ref="chart"></div>
</template>

<script>
const echarts = require('echarts');
export default {
  name: 'StatisticEcharts',
  props: {
    option: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    initCharts() {
      let myChart = echarts.init(this.$refs.chart);
      // 绘制图表
      myChart.setOption(this.option);
    }
  },
  mounted() {
    this.initCharts();
  }
}
</script>

<style lang="less" scoped>

</style>