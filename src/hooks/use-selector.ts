import {useLayoutEffect, useMemo, useState} from "react"
import shallowequal from 'shallowequal'
import useStore from "./use-store"

type SelectorFunc<State, Selected> = (state: State) => Selected;

export default function useSelector<State, Selected>(selectorFunc: SelectorFunc<State, Selected>): Selected {
  const store = useStore()

  const [state, setState] = useState(() =>
  selectorFunc(store.getState() as State)
)

  const unsubscribe = useMemo(() => {
    return store.subscribe(() => {
      const newState = selectorFunc(store.getState() as State)
      setState(prevState =>
        shallowequal(prevState, newState) ? prevState : newState
      );
    });
  }, [store, selectorFunc]);

  useLayoutEffect(() => {
    return () => unsubscribe();
  }, [unsubscribe]);

  return state as Selected
}

