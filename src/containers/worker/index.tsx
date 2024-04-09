import SideLayout from "@src/components/side-layout";
import { useWebWorker } from "@src/hooks/use-webworker";
import { useState } from "react";

function bigTask(num: number): number {
  return new Array(num)
    .fill(0)
    .map((el, ind) => el + ind)
    .reduce((acc, cur) => acc + cur, 0);
}

async function bigTaskAsync(num: number) {
  return bigTask(num);
}

export const Worker = () => {
  const [value, setValue] = useState("1");
  const {data, loading, error, run} = useWebWorker(bigTask);
  const [syncValue, setSync] = useState<number| null>(null);
  const [asyncValue, setAsync] = useState<number | null>(null);
  const [isLoadingSync, setIsLoadingSync] = useState(false);
  const [isLoadingAsync, setIsLoadingAsync] = useState(false);

  const callbacks = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const count = Number(e.target.value).toString();
        setValue(count);
      },
    syncCalculation: () => {
      console.time("Time sync");
      setIsLoadingSync(true);
      const count = bigTask(+value);
      setSync(count);
      setIsLoadingSync(false);
      console.timeEnd("Time sync");
    },
    asyncCalculation: async () => {
      console.time("Time async");
      setIsLoadingAsync(true);
      const count = await bigTaskAsync(+value);
      setAsync(count);
      setIsLoadingAsync(false);
      console.timeEnd("Time async");
    }

  }
  if (error) return <SideLayout padding="medium">Error: {error}</SideLayout>;
  // if (loading || isLoading) return <SideLayout padding="medium">loading</SideLayout>;

  return (
    <>
      <SideLayout padding="medium">
        <label>Введите значение для вычисления функции:</label>
        <input
          type="number"
          min={0}
          value={value}
          onChange={callbacks.onChange}
        ></input>
      </SideLayout>
      <SideLayout padding="medium">
        <button onClick={() => run(+value)}>Web Worker: {value} раз</button>
        <button onClick={callbacks.syncCalculation}>
          Синхронное выполнение: {value} раз
        </button>
        <button onClick={callbacks.asyncCalculation}>
          Асинхронное выполнение: {value} раз
        </button>
      </SideLayout>
      <SideLayout padding="medium" direction="column">
        <span>
          Web Worker:{" "}
          {loading ? <span>loading</span> : data}
        </span>
        <span>
          Синхронное вычисление:{" "}
          {isLoadingSync ? (
            <span>loading</span>
          ) : (
            syncValue
          )}
        </span>
        <span>
          Асинхронное вычисление:{" "}
          {isLoadingAsync ? (
            <span>loading</span>
          ) : (
            asyncValue
          )}
        </span>
      </SideLayout>
    </>
  );
};
