import { memo } from 'react';

import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart } from 'recharts';

import { useAppSelector } from '@src/hooks/use-selector';

import totalSumMultiple from '@src/utils/total-sum-multiple';

function ArticlesCharts() {
  const select = useAppSelector((state) => ({
    articles: state.admin.articles.list,
  }));

  const data = {
    totalSum: totalSumMultiple(select.articles),
  };

  return (
    <BarChart
      width={1024}
      height={300}
      data={data.totalSum}
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
      <Tooltip labelFormatter={() => 'Цена'} />
      <Legend content={() => <div>Цена за все товары</div>} />
      <CartesianGrid strokeDasharray='3 3' />
      <Bar dataKey='price' fill='#8884d8' background={{ fill: '#eee' }} />
    </BarChart>
  );
}

export default memo(ArticlesCharts);
