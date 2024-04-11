import { useAppSelector } from '@src/hooks/use-selector';
import React, { PureComponent, memo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
  BarChart,
} from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
  },
];

function CitiesCharts() {
  const select = useAppSelector((state) => ({
    cities: state.admin.cities.list,
  }));

  return (
    <BarChart
      width={1024}
      height={300}
      data={select.cities}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
      barSize={20}
    >
      <XAxis dataKey='title' scale='point' padding={{ left: 10, right: 10 }} />
      <YAxis />
      <Tooltip labelFormatter={() => 'Население'} />
      <Legend content={<div>Население</div>} />
      <CartesianGrid strokeDasharray='3 3' />
      <Bar dataKey='population' fill='#8884d8' background={{ fill: '#eee' }} />
    </BarChart>
  );
}

export default memo(CitiesCharts);
