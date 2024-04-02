export {};

declare global {
  interface Window {
    __INITIAL_STATE__: any;
    __INITIAL_JOBS_DUMP__: any;
  }
}
