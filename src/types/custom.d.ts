declare module "*.svg" {
  const content: any //React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
