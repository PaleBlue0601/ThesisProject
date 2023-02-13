export const histogramOption = {
  title: { text: '个人成就柱状图', left: 'center', },
  tooltip: {},
  xAxis: {
    data: ["浏览数", "点赞数", "藏品数"]
  },
  yAxis: {},
  series: [{
    name: '数量',
    type: 'bar',
    data: []
  }]
}

export const pieChartOption = {
  title: {
    text: '藏品统计图',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '数量',
      type: 'pie',
      radius: '50%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      itemStyle: {
        normal: {
          label: {
            show: true,
            formatter: '{b}:({d}%)'
          },
          labelLine: { show: true }
        }
      }
    }
  ]
}
