declare module 'pdfjs-dist/build/pdf' {
  const getDocument: any;
  const GlobalWorkerOptions: {
    workerSrc: string;
  };
  export { getDocument, GlobalWorkerOptions };
}

declare module 'pdfjs-dist/build/pdf.worker.entry' {
  const worker: any;
  export default worker;
}
