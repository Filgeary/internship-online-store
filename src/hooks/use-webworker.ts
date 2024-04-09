import { useState } from "react"

const workerHandler = (fn: (arg: number) => number) => {
  self.onmessage = (e) => {
    postMessage(fn(e.data));
  }
};

export const useWebWorker = (fn: (arg: number) => number) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = (value: number) => {
    console.time("Time Worker")
    setLoading(true);
    setError(null);
    const blob = new Blob([`(${workerHandler})(${fn})`]); //отправка функции через хэндлер
    const worker = new Worker(URL.createObjectURL(blob)); //доступ к функции через URL
    worker.onmessage = (e) => {
      setData(e.data);
      setLoading(false);
      console.timeEnd("Time Worker")
      worker.terminate();
    };
    worker.postMessage(value);
    worker.onerror = (e) => {
      setError(e.message);
      setLoading(false);
      worker.terminate();
    };
  };

  return {
    data,
    error,
    loading,
    run,
  };
};
