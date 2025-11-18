import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import type { EChartsOption } from '../components/ChartPreview';

const ChartPreview = dynamic(() => import('../components/ChartPreview').then((mod) => mod.ChartPreview), {
  ssr: false
});

type ChartSpec = {
  id: string;
  title: string;
  description: string;
  option: EChartsOption;
  height?: number;
};

type ChartGroup = {
  id: string;
  title: string;
  description: string;
  charts: ChartSpec[];
};

const buildChartGroups = (): ChartGroup[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const baseLine: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Visitors'] },
    toolbox: {
      feature: {
        dataZoom: { yAxisIndex: 'none' },
        restore: {},
        saveAsImage: {}
      }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: months },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Visitors',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        areaStyle: { opacity: 0.12 },
        emphasis: { focus: 'series' },
        data: [820, 932, 901, 934, 1290, 1330, 1320, 1422, 1512, 1620, 1754, 1890],
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: { data: [{ type: 'average', name: 'Avg' }] }
      }
    ]
  };

  const stackArea: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Email', 'Affiliate', 'Video Ads', 'Direct', 'Search'] },
    toolbox: { feature: { magicType: { type: ['line', 'bar', 'stack'] }, restore: {}, saveAsImage: {} } },
    xAxis: { type: 'category', boundaryGap: false, data: months },
    yAxis: { type: 'value' },
    series: [
      { name: 'Email', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: [120, 132, 101, 134, 90, 230, 210, 186, 170, 240, 260, 310] },
      { name: 'Affiliate', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: [220, 182, 191, 234, 290, 330, 310, 320, 330, 370, 380, 420] },
      { name: 'Video Ads', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: [150, 232, 201, 154, 190, 330, 410, 390, 420, 460, 480, 520] },
      { name: 'Direct', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: [320, 332, 301, 334, 390, 330, 320, 340, 360, 380, 400, 440] },
      { name: 'Search', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: [820, 932, 901, 934, 1290, 1330, 1320, 1420, 1512, 1600, 1650, 1750] }
    ]
  };

  const comboOption: EChartsOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    toolbox: { feature: { dataView: { readOnly: false }, magicType: { type: ['line', 'bar'] }, restore: {}, saveAsImage: {} } },
    legend: { data: ['Revenue', 'Profit', 'Growth'] },
    xAxis: [
      { type: 'category', data: months, axisPointer: { type: 'shadow' } }
    ],
    yAxis: [
      { type: 'value', name: 'Revenue', min: 0, max: 120, axisLabel: { formatter: '{value}k' } },
      { type: 'value', name: 'Growth', min: 0, max: 20, axisLabel: { formatter: '{value}%' } }
    ],
    series: [
      { name: 'Revenue', type: 'bar', data: [56, 52, 63, 77, 85, 90, 95, 98, 102, 105, 109, 115] },
      { name: 'Profit', type: 'bar', data: [12, 14, 15, 18, 20, 22, 23, 24, 26, 28, 30, 32] },
      { name: 'Growth', type: 'line', yAxisIndex: 1, smooth: true, data: [8, 7, 9, 12, 13, 14, 15, 15, 16, 17, 18, 19] }
    ]
  };

  const scatterOption: EChartsOption = {
    dataset: {
      source: [
        ['age', 'Height', 'Weight'],
        [10, 120, 30],
        [15, 150, 45],
        [20, 160, 60],
        [25, 172, 70],
        [30, 178, 82],
        [35, 180, 88],
        [40, 175, 85],
        [45, 168, 80],
        [50, 165, 78]
      ]
    },
    tooltip: {
      trigger: 'item',
      formatter: ((params: any) => {
        const value = Array.isArray(params.value) ? params.value : [];
        return `Age ${value?.[0]}<br/>Height ${value?.[1]} cm<br/>Weight ${value?.[2]} kg`;
      }) as any
    },
    xAxis: { type: 'value', name: 'Age', splitLine: { lineStyle: { type: 'dashed' } } },
    yAxis: { type: 'value', name: 'Height (cm)', splitLine: { lineStyle: { type: 'dashed' } } },
    visualMap: { type: 'continuous', dimension: 2, min: 20, max: 100, calculable: true, text: ['Heavy', 'Light'], inRange: { color: ['#4f8ef7', '#81fbb8'] } },
    series: [
      {
        name: 'Vitals',
        type: 'scatter',
        symbolSize: (val) => Number(val[2]) / 2,
        emphasis: { focus: 'series' }
      }
    ]
  };

  const candlestickOption: EChartsOption = {
    title: { text: 'Synthetic Stock', left: 0 },
    legend: { data: ['Daily', 'MA5', 'MA10'] },
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    toolbox: { feature: { dataZoom: { yAxisIndex: false }, restore: {}, saveAsImage: {} } },
    xAxis: { type: 'category', data: months, boundaryGap: true, axisLine: { onZero: false } },
    yAxis: { scale: true },
    dataZoom: [{ type: 'inside', start: 30, end: 70 }, { show: true, type: 'slider', top: '90%', start: 30, end: 70 }],
    series: [
      {
        name: 'Daily',
        type: 'candlestick',
        itemStyle: {
          color: '#ef5350',
          color0: '#26a69a',
          borderColor: '#ef5350',
          borderColor0: '#26a69a'
        },
        data: [
          [20, 34, 10, 38],
          [40, 35, 30, 55],
          [33, 38, 33, 40],
          [40, 42, 32, 42],
          [42, 46, 38, 48],
          [48, 52, 42, 52],
          [52, 55, 50, 60],
          [50, 52, 47, 53],
          [47, 49, 43, 50],
          [52, 58, 50, 60],
          [58, 62, 57, 66],
          [62, 68, 60, 70]
        ]
      },
      {
        name: 'MA5',
        type: 'line',
        smooth: true,
        data: [null, null, null, null, 38, 42, 45, 49, 50, 53, 57, 62],
        lineStyle: { opacity: 0.5 }
      },
      {
        name: 'MA10',
        type: 'line',
        smooth: true,
        data: [null, null, null, null, null, null, null, 44, 48, 51, 55, 60],
        lineStyle: { opacity: 0.5 }
      }
    ]
  };

  const pieOption: EChartsOption = {
    tooltip: { trigger: 'item' },
    legend: { top: 'bottom' },
    series: [
      {
        name: 'Traffic Sources',
        type: 'pie',
        radius: ['35%', '65%'],
        roseType: 'area',
        itemStyle: { borderRadius: 10 },
        data: [
          { value: 35, name: 'Direct' },
          { value: 28, name: 'Email' },
          { value: 26, name: 'Affiliate' },
          { value: 20, name: 'Video Ads' },
          { value: 18, name: 'Search' }
        ]
      }
    ]
  };

  const radarOption: EChartsOption = {
    tooltip: {},
    radar: {
      indicator: [
        { name: 'Design', max: 100 },
        { name: 'Usability', max: 100 },
        { name: 'Performance', max: 100 },
        { name: 'Security', max: 100 },
        { name: 'Accessibility', max: 100 },
        { name: 'Support', max: 100 }
      ]
    },
    series: [
      {
        name: 'Product Rating',
        type: 'radar',
        areaStyle: { color: 'rgba(126, 151, 255, 0.4)' },
        lineStyle: { width: 2 },
        data: [{ value: [85, 90, 80, 75, 70, 88], name: 'Product A' }]
      }
    ]
  };

  const boxplotOption: EChartsOption = {
    title: { text: 'Boxplot', left: 'center' },
    dataset: [
      {
        source: [
          [850, 740, 900, 1070, 930, 850, 950, 980, 900, 850, 870, 840, 780],
          [960, 940, 960, 940, 880, 840, 830, 810, 880, 880, 870, 840, 830],
          [880, 880, 880, 860, 720, 720, 700, 690, 770, 720, 610, 660, 720],
          [890, 860, 720, 720, 690, 680, 660, 620, 650, 630, 640, 620, 630]
        ]
      },
      {
        transform: { type: 'boxplot', config: { itemNameFormatter: (params: any) => `Experiment ${Number(params.value) + 1}` } }
      },
      {
        fromDatasetIndex: 1,
        fromTransformResult: 1
      }
    ],
    tooltip: { trigger: 'item', axisPointer: { type: 'shadow' } },
    grid: { left: '10%', right: '10%', bottom: '15%' },
    xAxis: { type: 'category', boundaryGap: true, splitArea: { show: true } },
    yAxis: { type: 'value', name: 'Observations', splitArea: { show: true } },
    series: [
      { name: 'boxplot', type: 'boxplot', datasetIndex: 1 },
      { name: 'outlier', type: 'scatter', datasetIndex: 2 }
    ]
  };

  const heatmapOption: EChartsOption = {
    tooltip: { position: 'top' },
    grid: { height: '60%', top: '10%' },
    xAxis: { type: 'category', data: Array.from({ length: 24 }, (_, i) => `${i}:00`), splitArea: { show: true } },
    yAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], splitArea: { show: true } },
    visualMap: { min: 0, max: 10, calculable: true, orient: 'horizontal', left: 'center', bottom: '0%' },
    series: [
      {
        name: 'Punch Card',
        type: 'heatmap',
        data: Array.from({ length: 24 * 7 }, (_, idx) => {
          const hour = Math.floor(idx / 7);
          const day = idx % 7;
          return [hour, day, Math.floor(Math.random() * 10)];
        }),
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
      }
    ]
  };

  const calendarOption: EChartsOption = {
    tooltip: { trigger: 'item' },
    visualMap: { min: 0, max: 500, calculable: true, orient: 'horizontal', left: 'center', top: 16 },
    calendar: [
      {
        range: '2024',
        cellSize: ['auto', 18],
        top: 80,
        left: 60,
        right: 40,
        itemStyle: { borderRadius: 4, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: Array.from({ length: 365 }, (_, day) => {
          const date = new Date(2024, 0, day + 1);
          const yyyy = date.getFullYear();
          const mm = `${date.getMonth() + 1}`.padStart(2, '0');
          const dd = `${date.getDate()}`.padStart(2, '0');
          return [`${yyyy}-${mm}-${dd}`, Math.round(Math.random() * 500)];
        })
      }
    ]
  };

  const sankeyOption: EChartsOption = {
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [
      {
        type: 'sankey',
        data: [
          { name: 'Prospects' },
          { name: 'Qualified' },
          { name: 'Proposal' },
          { name: 'Negotiation' },
          { name: 'Won' },
          { name: 'Lost' }
        ],
        links: [
          { source: 'Prospects', target: 'Qualified', value: 320 },
          { source: 'Qualified', target: 'Proposal', value: 210 },
          { source: 'Proposal', target: 'Negotiation', value: 140 },
          { source: 'Negotiation', target: 'Won', value: 90 },
          { source: 'Negotiation', target: 'Lost', value: 50 },
          { source: 'Proposal', target: 'Lost', value: 70 },
          { source: 'Qualified', target: 'Lost', value: 80 }
        ],
        lineStyle: { color: 'gradient', curveness: 0.5 },
        emphasis: { focus: 'adjacency' }
      }
    ]
  };

  const funnelOption: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: ((params: any) => `${params.name}: ${params.value}%`) as any
    },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: 'Conversion',
        type: 'funnel',
        left: '20%',
        width: '60%',
        sort: 'descending',
        gap: 2,
        label: { show: true, position: 'inside', formatter: '{b}: {c}%' },
        labelLine: { length: 10, lineStyle: { width: 2 } },
        itemStyle: { borderColor: '#fff', borderWidth: 2 },
        data: [
          { value: 100, name: 'Awareness' },
          { value: 80, name: 'Interest' },
          { value: 60, name: 'Consideration' },
          { value: 35, name: 'Intent' },
          { value: 20, name: 'Purchase' }
        ]
      }
    ]
  };

  const gaugeOption: EChartsOption = {
    series: [
      {
        type: 'gauge',
        center: ['50%', '55%'],
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: { lineStyle: { width: 12, color: [[0.3, '#26a69a'], [0.7, '#ffb74d'], [1, '#ef5350']] } },
        pointer: { show: true, length: '70%', width: 6 },
        detail: { valueAnimation: true, formatter: '{value}%', fontSize: 24, offsetCenter: [0, '70%'] },
        data: [{ value: 68, name: 'Completion' }]
      }
    ]
  };

  const treeOption: EChartsOption = {
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [
      {
        type: 'tree',
        data: [
          {
            name: 'Company',
            children: [
              { name: 'Product', children: [{ name: 'Design' }, { name: 'Engineering' }, { name: 'QA' }] },
              { name: 'Growth', children: [{ name: 'Marketing' }, { name: 'Sales' }, { name: 'Success' }] },
              { name: 'Operations', children: [{ name: 'Finance' }, { name: 'People' }, { name: 'Legal' }] }
            ]
          }
        ],
        top: '5%',
        left: '15%',
        bottom: '10%',
        right: '20%',
        symbolSize: 12,
        label: { position: 'left', verticalAlign: 'middle', align: 'right' },
        leaves: { label: { position: 'right', verticalAlign: 'middle', align: 'left' } },
        emphasis: { focus: 'descendant' },
        expandAndCollapse: true,
        initialTreeDepth: 2,
        animationDuration: 550,
        animationDurationUpdate: 750
      }
    ]
  };

  const treemapOption: EChartsOption = {
    tooltip: { formatter: '{b}: {c} GB' },
    series: [
      {
        type: 'treemap',
        breadcrumb: { show: true },
        roam: false,
        nodeClick: 'zoomToNode',
        label: { show: true, formatter: '{b}' },
        upperLabel: { show: true, height: 26 },
        itemStyle: { borderColor: '#0f1219', borderWidth: 2, gapWidth: 2 },
        data: [
          {
            name: 'Applications',
            value: 120,
            children: [
              { name: 'Design Suite', value: 45 },
              { name: 'Analytics', value: 35 },
              { name: 'Productivity', value: 40 }
            ]
          },
          {
            name: 'Media',
            value: 200,
            children: [
              { name: 'Photos', value: 70 },
              { name: 'Videos', value: 110 },
              { name: 'Audio', value: 20 }
            ]
          },
          {
            name: 'System',
            value: 80,
            children: [
              { name: 'OS', value: 40 },
              { name: 'Cache', value: 25 },
              { name: 'Logs', value: 15 }
            ]
          }
        ]
      }
    ]
  };

  const sunburstOption: EChartsOption = {
    series: [
      {
        type: 'sunburst',
        radius: [0, '95%'],
        sort: undefined,
        levels: [
          {},
          { r0: '10%', r: '30%', label: { rotate: 'tangential' } },
          { r0: '30%', r: '70%', label: { align: 'right' } },
          { r0: '70%', r: '72%', itemStyle: { borderWidth: 2 } }
        ],
        data: [
          {
            name: 'Frontend',
            value: 6,
            children: [
              { name: 'React', value: 3 },
              { name: 'Vue', value: 2 },
              { name: 'Svelte', value: 1 }
            ]
          },
          {
            name: 'Backend',
            value: 8,
            children: [
              { name: 'Node.js', value: 3 },
              { name: 'Go', value: 3 },
              { name: 'Rust', value: 2 }
            ]
          },
          {
            name: 'Infrastructure',
            value: 5,
            children: [
              { name: 'Kubernetes', value: 2 },
              { name: 'CI/CD', value: 2 },
              { name: 'Monitoring', value: 1 }
            ]
          }
        ]
      }
    ]
  };

  const graphOption: EChartsOption = {
    tooltip: {},
    legend: [{ data: ['Team', 'Project', 'Platform'] }],
    series: [
      {
        type: 'graph',
        layout: 'force',
        roam: true,
        label: { show: true },
        force: { repulsion: 120, edgeLength: 80 },
        categories: [{ name: 'Team' }, { name: 'Project' }, { name: 'Platform' }],
        data: [
          { id: '1', name: 'AI Team', category: 0, value: 50 },
          { id: '2', name: 'Web Team', category: 0, value: 40 },
          { id: '3', name: 'Mobile Team', category: 0, value: 35 },
          { id: '4', name: 'Vision Platform', category: 2, value: 60 },
          { id: '5', name: 'Analytics Platform', category: 2, value: 55 },
          { id: '6', name: 'Project Atlas', category: 1, value: 45 },
          { id: '7', name: 'Project Borealis', category: 1, value: 42 },
          { id: '8', name: 'Project Cosmos', category: 1, value: 38 }
        ],
        links: [
          { source: '1', target: '6' },
          { source: '1', target: '4' },
          { source: '2', target: '6' },
          { source: '2', target: '7' },
          { source: '3', target: '8' },
          { source: '5', target: '7' },
          { source: '4', target: '6' },
          { source: '5', target: '8' }
        ],
        lineStyle: { width: 2, curveness: 0.2 }
      }
    ]
  };

  const parallelOption: EChartsOption = {
    tooltip: { trigger: 'item' },
    parallelAxis: [
      { dim: 0, name: 'Budget' },
      { dim: 1, name: 'Timeline' },
      { dim: 2, name: 'Complexity' },
      { dim: 3, name: 'Risk' },
      { dim: 4, name: 'Impact' }
    ],
    parallel: { left: '5%', right: '12%', bottom: '10%', top: '10%' },
    series: [
      {
        name: 'Portfolio',
        type: 'parallel',
        smooth: true,
        lineStyle: { width: 2, opacity: 0.5 },
        data: [
          [120, 6, 3, 2, 5],
          [90, 4, 2, 4, 4],
          [60, 5, 4, 3, 3],
          [75, 3, 1, 2, 4],
          [55, 2, 2, 3, 2]
        ]
      }
    ]
  };

  const timelineOption: EChartsOption = {
    baseOption: {
      timeline: {
        axisType: 'category',
        autoPlay: true,
        playInterval: 2000,
        data: ['2019', '2020', '2021', '2022', '2023']
      },
      tooltip: { trigger: 'axis' },
      legend: { data: ['Products', 'Services', 'Subscriptions'] },
      calculable: true,
      grid: { top: 80, bottom: 100 },
      xAxis: [{ type: 'category', axisLabel: { interval: 0, rotate: 45 }, data: months }],
      yAxis: [{ type: 'value', name: 'Revenue (k)' }]
    },
    options: Array.from({ length: 5 }, (_, idx) => {
      const base = 2019 + idx;
      return {
        title: { text: `Revenue ${base}` },
        series: [
          {
            name: 'Products',
            type: 'bar',
            data: months.map((_, monthIdx) => Math.round(40 + monthIdx * 4 + idx * 10 + Math.random() * 5))
          },
          {
            name: 'Services',
            type: 'bar',
            data: months.map((_, monthIdx) => Math.round(25 + monthIdx * 3 + idx * 8 + Math.random() * 5))
          },
          {
            name: 'Subscriptions',
            type: 'line',
            smooth: true,
            data: months.map((_, monthIdx) => Math.round(15 + monthIdx * 2 + idx * 5 + Math.random() * 3))
          }
        ]
      };
    })
  };

  const pictorialOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { data: months, axisTick: { show: false } },
    yAxis: {},
    series: [
      {
        type: 'pictorialBar',
        symbol: 'path://M150 0 L75 200 L225 200 Z',
        symbolClip: true,
        itemStyle: { color: '#7e97ff' },
        data: months.map((_, idx) => 50 + idx * 5)
      }
    ]
  };

  const datasetTransformOption: EChartsOption = {
    dataset: [
      {
        id: 'raw',
        source: [
          ['region', 'category', 'count'],
          ['Americas', 'A', 120],
          ['Americas', 'B', 60],
          ['Americas', 'C', 90],
          ['EMEA', 'A', 80],
          ['EMEA', 'B', 70],
          ['EMEA', 'C', 50],
          ['APAC', 'A', 100],
          ['APAC', 'B', 110],
          ['APAC', 'C', 95]
        ]
      },
      {
        id: 'aggregate',
        fromDatasetId: 'raw',
        transform: {
          type: 'filter',
          config: { dimension: 'category', value: 'A' }
        }
      }
    ],
    tooltip: { trigger: 'axis' },
    legend: { data: ['All Categories', 'Category A'] },
    xAxis: { type: 'category' },
    yAxis: { type: 'value' },
    series: [
      { name: 'All Categories', type: 'bar', datasetId: 'raw', encode: { x: 'region', y: 'count' } },
      { name: 'Category A', type: 'bar', datasetId: 'aggregate', encode: { x: 'region', y: 'count' } }
    ]
  };

  const brushScatterOption: EChartsOption = {
    color: ['#5470c6', '#91cc75', '#fac858', '#ee6666'],
    toolbox: {
      feature: {
        brush: { type: ['rect', 'polygon', 'clear'] },
        saveAsImage: {}
      }
    },
    brush: {},
    legend: { data: ['setosa', 'versicolor', 'virginica'] },
    grid: [{ left: '10%', right: '7%', bottom: '12%', containLabel: true }],
    xAxis: [{ type: 'value', name: 'Petal Length' }],
    yAxis: [{ type: 'value', name: 'Petal Width' }],
    series: [
      {
        name: 'setosa',
        type: 'scatter',
        emphasis: { focus: 'series' },
        data: Array.from({ length: 50 }, () => [Math.random() * 1.5 + 1, Math.random() * 0.3 + 0.1])
      },
      {
        name: 'versicolor',
        type: 'scatter',
        emphasis: { focus: 'series' },
        data: Array.from({ length: 50 }, () => [Math.random() * 2 + 3, Math.random() * 1 + 0.8])
      },
      {
        name: 'virginica',
        type: 'scatter',
        emphasis: { focus: 'series' },
        data: Array.from({ length: 50 }, () => [Math.random() * 2 + 4.5, Math.random() * 1 + 1.4])
      }
    ]
  };

  const visualMapOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    visualMap: {
      top: 50,
      right: 10,
      precision: 1,
      pieces: [
        { gt: 0, lte: 20, color: '#d4f0ff' },
        { gt: 20, lte: 50, color: '#9bd7ff' },
        { gt: 50, lte: 80, color: '#69b9ff' },
        { gt: 80, color: '#2a7fff' }
      ],
      outOfRange: { color: '#999' }
    },
    series: [
      {
        name: 'Utilization',
        type: 'line',
        smooth: true,
        data: [12, 18, 35, 48, 56, 72, 83, 88, 76, 62, 40, 25]
      }
    ]
  };

  const threeDScatterOption: EChartsOption = {
    tooltip: {},
    grid3D: { viewControl: { projection: 'perspective', autoRotate: true }, boxWidth: 100, boxDepth: 100 },
    xAxis3D: { type: 'value', name: 'X' },
    yAxis3D: { type: 'value', name: 'Y' },
    zAxis3D: { type: 'value', name: 'Z' },
    series: [
      {
        type: 'scatter3D',
        symbolSize: 12,
        itemStyle: { opacity: 0.85 },
        data: Array.from({ length: 60 }, () => [
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 100)
        ])
      } as any
    ]
  };

  const threeDBarOption: EChartsOption = {
    tooltip: {},
    visualMap: { max: 20, inRange: { color: ['#b0f3f1', '#2c82ff', '#1b3fbf'] } },
    xAxis3D: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
    yAxis3D: { type: 'category', data: ['North', 'South', 'East', 'West'] },
    zAxis3D: { type: 'value' },
    grid3D: { boxWidth: 120, boxDepth: 80, light: { main: { intensity: 1.2 }, ambient: { intensity: 0.3 } } },
    series: [
      {
        type: 'bar3D',
        shading: 'lambert',
        data: ['Q1', 'Q2', 'Q3', 'Q4'].flatMap((quarter, qIdx) =>
          ['North', 'South', 'East', 'West'].map((region, rIdx) => ({
            value: [quarter, region, Math.round(Math.random() * 15 + (qIdx + rIdx))]
          }))
        )
      } as any
    ]
  };

  const wordCloudOption: EChartsOption = {
    tooltip: {},
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        sizeRange: [12, 48],
        rotationRange: [-90, 90],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        textStyle: {
          color: () => {
            const colors = ['#81fbb8', '#7e97ff', '#ff9a9e', '#fbc2eb', '#a18cd1'];
            return colors[Math.floor(Math.random() * colors.length)];
          }
        },
        data: [
          { name: 'Apache', value: 120 },
          { name: 'ECharts', value: 110 },
          { name: 'Visualization', value: 90 },
          { name: 'Dashboard', value: 80 },
          { name: 'Analytics', value: 70 },
          { name: 'Charts', value: 65 },
          { name: 'Lines', value: 60 },
          { name: 'Bars', value: 58 },
          { name: 'Pie', value: 55 },
          { name: 'Heatmap', value: 50 },
          { name: 'Map', value: 45 },
          { name: 'Timeline', value: 42 },
          { name: '3D', value: 40 },
          { name: 'Scatter', value: 38 },
          { name: 'Sankey', value: 36 },
          { name: 'Treemap', value: 34 },
          { name: 'Gauge', value: 32 },
          { name: 'Radar', value: 30 }
        ]
      } as any
    ]
  };

  const liquidFillOption: EChartsOption = {
    series: [
      {
        type: 'liquidFill',
        radius: '80%',
        amplitude: 8,
        data: [0.7, 0.6, 0.4],
        label: {
          formatter: '70%',
          fontSize: 32,
          color: '#fff'
        },
        outline: { show: true, borderDistance: 0, itemStyle: { borderWidth: 4, borderColor: '#7e97ff' } },
        backgroundStyle: { borderWidth: 0, color: 'rgba(126, 151, 255, 0.15)' }
      } as any
    ]
  } as EChartsOption;

  const customShapeOption: EChartsOption = {
    tooltip: {},
    xAxis: { type: 'value', min: 0, max: 100, show: false },
    yAxis: { type: 'value', min: 0, max: 100, show: false },
    series: [
      {
        type: 'custom',
        renderItem: (params: any, api: any) => {
          const xValue = api.value(0);
          const coord = api.coord([xValue, api.value(1)]);
          const size = api.size([0, api.value(2)]);
          return {
            type: 'group',
            children: [
              {
                type: 'rect',
                shape: { x: coord[0] - size[0] / 2, y: coord[1] - size[1] / 2, width: size[0], height: size[1] },
                style: api.style({ fill: api.value(3) })
              },
              {
                type: 'text',
                style: {
                  text: api.value(4),
                  x: coord[0],
                  y: coord[1],
                  fill: '#fff',
                  textAlign: 'center',
                  textVerticalAlign: 'middle',
                  fontSize: 14
                }
              }
            ]
          };
        },
        data: [
          [20, 70, 40, '#7e97ff', 'Design'],
          [50, 50, 60, '#81fbb8', 'Build'],
          [80, 30, 50, '#ff9a9e', 'Ship']
        ]
      }
    ]
  };

  const geoLinesOption: EChartsOption = {
    backgroundColor: '#0b1020',
    tooltip: { trigger: 'item' },
    geo: {
      map: 'world',
      roam: true,
      label: { show: false },
      itemStyle: { areaColor: '#1b2137', borderColor: '#3a3f5c' },
      emphasis: { itemStyle: { areaColor: '#2a3354' } }
    },
    series: [
      {
        type: 'lines',
        coordinateSystem: 'geo',
        zlevel: 2,
        effect: { show: true, period: 6, trailLength: 0.1, symbol: 'arrow', symbolSize: 6 },
        lineStyle: { width: 1, opacity: 0.6, curveness: 0.2 },
        data: [
          { coords: [[-74.006, 40.7128], [2.3522, 48.8566]] },
          { coords: [[-74.006, 40.7128], [139.6917, 35.6895]] },
          { coords: [[2.3522, 48.8566], [139.6917, 35.6895]] },
          { coords: [[-0.1276, 51.5074], [77.1025, 28.7041]] }
        ]
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: { brushType: 'stroke' },
        label: { show: true, position: 'right', formatter: '{b}' },
        symbolSize: 10,
        itemStyle: { color: '#7e97ff' },
        data: [
          { name: 'New York', value: [-74.006, 40.7128, 95] },
          { name: 'Paris', value: [2.3522, 48.8566, 90] },
          { name: 'Tokyo', value: [139.6917, 35.6895, 85] },
          { name: 'Delhi', value: [77.1025, 28.7041, 80] },
          { name: 'London', value: [-0.1276, 51.5074, 88] }
        ]
      }
    ]
  };

  return [
    {
      id: 'foundation',
      title: 'Foundational Charts',
      description: 'Essential chart types covering line, bar, pie, scatter, and candlestick visualizations.',
      charts: [
        { id: 'line-smooth', title: 'Smooth Line', description: 'Smoothed line chart with area fill, mark lines, and toolbox controls.', option: baseLine },
        { id: 'stacked-area', title: 'Stacked Area', description: 'Area charts stacked to show cumulative contribution across multiple sources.', option: stackArea },
        { id: 'combo-axis', title: 'Combo Axis', description: 'Bar and line series on dual axes for mixed quantitative comparisons.', option: comboOption },
        { id: 'scatter-bubble', title: 'Scatter Bubble', description: 'Scatter plot with bubble sizing and continuous visual map legend.', option: scatterOption },
        { id: 'candlestick', title: 'Candlestick', description: 'Financial candlestick chart augmented with moving averages and zoom.', option: candlestickOption },
        { id: 'pie-rose', title: 'Rose Pie', description: 'Doughnut-style pie chart in rose mode highlighting category proportions.', option: pieOption },
        { id: 'radar', title: 'Radar', description: 'Radar chart for comparing multi-dimensional product capabilities.', option: radarOption },
        { id: 'boxplot', title: 'Boxplot', description: 'Boxplot leveraging statistical transforms and outlier annotations.', option: boxplotOption }
      ]
    },
    {
      id: 'structure',
      title: 'Structural & Hierarchical',
      description: 'Hierarchical views including tree, treemap, sunburst, sankey, and funnel diagrams.',
      charts: [
        { id: 'tree', title: 'Tree Layout', description: 'Expandable organization tree with smooth transitions.', option: treeOption },
        { id: 'treemap', title: 'Treemap', description: 'Disk usage treemap with drill-down and breadcrumb navigation.', option: treemapOption },
        { id: 'sunburst', title: 'Sunburst', description: 'Radial hierarchy for visualizing technology investment breakdowns.', option: sunburstOption },
        { id: 'sankey', title: 'Sankey', description: 'Flow diagram tracking conversion across funnel stages.', option: sankeyOption },
        { id: 'funnel', title: 'Funnel', description: 'Descending funnel chart emphasizing stage-by-stage drop-off.', option: funnelOption }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytical & Statistical',
      description: 'Advanced analytics including heatmaps, calendar views, datasets, brushing, and parallel coordinates.',
      charts: [
        { id: 'heatmap', title: 'Heatmap', description: 'Hourly activity heatmap with continuous visual mapping.', option: heatmapOption },
        { id: 'calendar', title: 'Calendar Heatmap', description: 'Year calendar heatmap representing daily engagement intensity.', option: calendarOption, height: 360 },
        { id: 'parallel', title: 'Parallel Coordinates', description: 'Multi-dimensional performance comparison across projects.', option: parallelOption },
        { id: 'timeline', title: 'Timeline Replay', description: 'Automated playback of annual revenue across categories with timeline control.', option: timelineOption, height: 480 },
        { id: 'dataset-transform', title: 'Dataset Transform', description: 'Multi-series bar chart driven by dataset filtering transform.', option: datasetTransformOption },
        { id: 'brush-scatter', title: 'Brush Enabled Scatter', description: 'Interactive brushing with toolbox customization on Iris data.', option: brushScatterOption },
        { id: 'visualmap', title: 'Segmented VisualMap', description: 'Line chart segmented via piecewise visual map thresholds.', option: visualMapOption }
      ]
    },
    {
      id: 'networks',
      title: 'Networks & Relationships',
      description: 'Graphs, custom rendering, and geo lines for relationship heavy data stories.',
      charts: [
        { id: 'graph-force', title: 'Force Graph', description: 'Force-directed network chart depicting team-to-project relationships.', option: graphOption },
        { id: 'custom-shape', title: 'Custom Renderer', description: 'Custom series rendering bespoke workflow stage blocks.', option: customShapeOption },
        { id: 'geo-lines', title: 'Geo Lines', description: 'Animated global routes with scatter effects over world map.', option: geoLinesOption, height: 520 }
      ]
    },
    {
      id: 'immersive',
      title: 'Immersive & Specialty',
      description: '3D scenes, liquid gauges, word clouds, pictorial bars, and gauges for standout visuals.',
      charts: [
        { id: 'gauge', title: 'Gauge', description: 'Angular gauge showing progress with color-zoned axis line.', option: gaugeOption },
        { id: 'pictorial', title: 'Pictorial Bar', description: 'Icon-based pictorial bar chart with custom SVG symbols.', option: pictorialOption },
        { id: '3d-scatter', title: '3D Scatter', description: 'Animated 3D scatter plot showcasing volumetric distribution.', option: threeDScatterOption, height: 500 },
        { id: '3d-bar', title: '3D Bar', description: '3D bar matrix comparing regional performance by quarter.', option: threeDBarOption, height: 520 },
        { id: 'wordcloud', title: 'Word Cloud', description: 'Keyword emphasis using organic word cloud layout.', option: wordCloudOption },
        { id: 'liquidfill', title: 'Liquid Fill', description: 'Liquid fill gauge with layered waves and outline styling.', option: liquidFillOption }
      ]
    }
  ];
};

const HomePage = () => {
  const chartGroups = useMemo(() => buildChartGroups(), []);

  return (
    <main className="page">
      <header>
        <h1>Apache ECharts Grand Showcase</h1>
        <p>
          Explore an exhaustive gallery of Apache ECharts capabilities spanning foundational charts, advanced analytics,
          immersive 3D scenes, and custom renderers. Every example is interactive, responsive, and production-ready for
          rapid experimentation.
        </p>
        <nav className="nav-chip-row">
          {chartGroups.map((group) => (
            <a key={group.id} className="nav-chip" href={`#${group.id}`}>
              {group.title}
            </a>
          ))}
        </nav>
      </header>

      <section className="chart-groups">
        {chartGroups.map((group) => (
          <section key={group.id} id={group.id} className="chart-group">
            <h2>{group.title}</h2>
            <p>{group.description}</p>
            <div className="chart-grid">
              {group.charts.map((chart) => (
                <ChartPreview key={chart.id} title={chart.title} description={chart.description} option={chart.option} height={chart.height} />
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
};

export default HomePage;
