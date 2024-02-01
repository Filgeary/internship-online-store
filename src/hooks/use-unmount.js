import { useEffect } from "react";

export default function useUnmount(unmountFunc) {
  useEffect(() => unmountFunc, [])
}