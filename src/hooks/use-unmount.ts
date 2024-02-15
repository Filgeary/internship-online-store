import { useEffect } from "react";

export default function useUnmount(unmountFunc: (...args: any[]) => void) {
  useEffect(() => unmountFunc, [])
}