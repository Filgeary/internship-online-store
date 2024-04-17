import { Pie } from "@ant-design/plots";
import useSelector from "@src/hooks/use-selector";
import { useEffect, useState } from "react";
import './index.css';
import useTranslate from "@src/hooks/use-translate";
type Data = { type: string; value: number | undefined };

const PieCategory = () => {
  const select = useSelector((state) => ({
    categories: state["categories_admin"]?.list,
    products: state["catalog_admin"]?.all,
  }));
  const [config, setConfig] = useState<any>();
  const { t } = useTranslate();

  useEffect(() => {
    const sortData = [];
    if (select.categories?.length && select.products?.length) {
      for (let category of select.categories!) {
        const products = select.products?.filter(
          (item) => item.category._id === category._id
        );
        sortData.push({ type: category.title, value: products?.length });
      }
      const configCategories = {
        title: t('admin.pie'),
        data: sortData,
        angleField: "value",
        colorField: "type",
        radius: 0.8,
        label: {
          text: (d: Data) => `${d.type}\n ${d.value}`,
          position: "outside",
        },
        interaction: {
          elementHighlight: true,
        },
        state: {
          inactive: { opacity: 0.5 },
        },
        legend: {
          color: {
            title: false,
            position: "right",
            rowPadding: 5,
          },
        },
        tooltip: {
          title: "type",
          name: "type"
        },
      };
      setConfig(configCategories);
    }
  }, [select.categories, select.products, t]);

  return (
    <Pie {...config} className="pie"/>
  );
};

export default PieCategory;
