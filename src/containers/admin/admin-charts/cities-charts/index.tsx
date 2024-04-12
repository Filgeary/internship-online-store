import { memo } from 'react';

import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart } from 'recharts';

import { useAppSelector } from '@src/hooks/use-selector';

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
      <Legend content={() => <div>Население</div>} />
      <CartesianGrid strokeDasharray='3 3' />
      <Bar dataKey='population' fill='#8884d8' background={{ fill: '#eee' }} />
    </BarChart>
  );
}

export default memo(CitiesCharts);
