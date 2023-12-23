// Based on https://webpack.js.org/guides/typescript/#importing-other-assets
declare module '*.svg' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is from the guide
  const content: any;

  export default content;
}
