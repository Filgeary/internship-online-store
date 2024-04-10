//importScripts('./jobs.ts')

import { longOperation } from "./jobs";

self.onmessage = (e: MessageEvent<any>) => {
  // console.log(window)
  // console.log(document)
  if(e.data === "start") {
    self.postMessage(`Расчет в воркере запущен: ${new Date(Date.now()).toLocaleTimeString()}`);

    longOperation();

    self.postMessage(`Расчет в воркере завершен: ${new Date(Date.now()).toLocaleTimeString()}`);
  }

  if(e.data === "fetch") {
    const res = fetch(`/api/v1/categories?fields=_id,title,parent(_id)&limit=*`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    });

    res.then(res => res.json())
       .then(res => {
          const result = res.result.items.reduce((acc: string, el: any) => `${acc}${el.title}\n`, "")
          self.postMessage(result)
        })
       .catch(err => self.postMessage(err))
  }
};
