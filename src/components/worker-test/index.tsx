import { memo, useEffect, useState } from "react";
import SideLayout from "../side-layout";
import s from "./styles.module.css";
import { longOperation } from "../../utils/jobs";


function WorkerTest() {
  const [elements, setElements] = useState<string[]>([]);
  const [worker, setWorker] = useState<Worker>(null);

  useEffect(() => {
    const newWorker = new Worker('../../utils/appWorker.ts', {type: "module"});
    newWorker.onmessage = callbacks.workerMessage;
    newWorker.onerror = callbacks.workerError;
    setWorker(newWorker);



    return () => newWorker.terminate();
  }, [])

  const callbacks = {
    withoutWorker: () => {
      setElements([`Расчет в основном потоке запущен: ${(new Date(Date.now())).toLocaleTimeString()}`])
      longOperation()
      setElements(state => [...state, `Расчет в основном потоке завершен: ${(new Date(Date.now())).toLocaleTimeString()}`]);
    },

    workerMessage: (ev: MessageEvent<any>) => {
      setElements(state => [...state, ev.data])
    },
    workerError: (ev: ErrorEvent) => {
      setElements(state => [...state, ev.toString()])
    },

    withWorker: () => {
      setElements([]);
      worker.postMessage('start');
    },
    fetchData: () => {
      setElements([]);
      worker.postMessage('fetch')
    }
  }

  return (
    <SideLayout padding="small" direction="column" alignItems="stretch">
      <div className={s.ButtonContainer}>
        <button onClick={callbacks.withoutWorker}>Без воркера</button>
        <button onClick={callbacks.withWorker}>С воркером</button>
        <button onClick={callbacks.fetchData}>API Запрос</button>
      </div>
      <div className={s.Railway}>
        <div className={s.Slider} />
      </div>
      <div className={s.TextContainer}>
        {elements.map((e, i) => <div style={{whiteSpace: "pre-line"}} key={i} >{e}</div>)}
      </div>
    </SideLayout>
  );
}

export default memo(WorkerTest);
