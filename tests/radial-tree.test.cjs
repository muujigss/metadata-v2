const assert = require('node:assert/strict');
const { test } = require('node:test');
const echarts = require('echarts');
const load = require('./load-typescript.cjs');

function setup() {
  let hook = 0;
  const states = [];
  const react = require('react');
  const Component = load('src/components/admin/dashboard/TreeViewRadial.tsx', {
    react: { ...react, useEffect() {}, useMemo: fn => fn(), useState(initial) {
      const i = hook++;
      if (!(i in states)) states[i] = initial;
      return [states[i], next => { states[i] = typeof next === 'function' ? next(states[i]) : next; }];
    } },
    '@/utils/dashboardConvertData': load('src/utils/dashboardConvertData.ts'),
    'echarts-for-react': 'chart',
    '@mui/material': Object.fromEntries(['Box', 'Typography', 'TextField', 'Autocomplete'].map(name => [name, name])),
  }).default;
  return () => {
    hook = 0;
    const nodes = [];
    const walk = element => {
      if (!element || typeof element !== 'object') return;
      nodes.push(element);
      [element.props?.children].flat().forEach(walk);
    };
    walk(Component({ userLevel: { user_level: 1 }, data: [{ org_name: 'Org', db_name: 'Database', tbl_name: 'Table', indicator_name: 'Indicator' }] }));
    return { chart: nodes.find(node => node.type === 'chart'), nodes };
  };
}

test('collapsing a deeply expanded radial branch removes every descendant edge', () => {
  const render = setup();
  let chart = render().chart;
  const edgeCount = current => {
    const instance = echarts.init(null, null, { renderer: 'svg', ssr: true, width: 1000, height: 700 });
    try {
      instance.setOption(current.props.option);
      return instance.getZr().storage.getDisplayList(true).filter(item => item.type === 'bezier-curve').length;
    } finally { instance.dispose(); }
  };
  const org = current => current.props.option.series[0].data[0].children[0];
  const toggle = node => {
    const oldKey = chart.key;
    chart.props.onEvents.click({ data: node });
    chart = render().chart;
    assert.notEqual(chart.key, oldKey);
  };
  assert.equal(chart.props.option.series[0].layout, 'radial');
  const initial = edgeCount(chart);
  for (let cycle = 0; cycle < 3; cycle++) {
    toggle(org(chart));
    if (org(chart).children[0].collapsed) toggle(org(chart).children[0]);
    if (org(chart).children[0].children[0].collapsed) toggle(org(chart).children[0].children[0]);
    assert.equal(edgeCount(chart), initial + 3);
    toggle(org(chart));
    assert.equal(edgeCount(chart), initial);
    assert.equal(org(chart).collapsed, true);
  }
  const key = chart.key;
  chart.props.onEvents.click({ data: org(chart).children[0].children[0].children[0] });
  assert.equal(render().chart.key, key, 'leaf clicks do not change filtering or expansion');
});

test('level controls reset the chart even when the same level is selected again', () => {
  const render = setup();
  const first = render();
  const control = first.nodes.find(node => node.props?.children === 'Байгууллага');
  control.props.onClick();
  assert.notEqual(render().chart.key, first.chart.key);
  const indicator = render().nodes.find(node => node.props?.children === 'Үзүүлэлт');
  indicator.props.onClick();
  assert.equal(render().chart.props.option.series[0].initialTreeDepth, 4);
});
