// Global type declarations for CSS imports
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.sass' {
  const content: { [className: string]: string };
  export default content;
}

// Allow importing CSS files without default export
declare module '*.css' {
  const content: string;
  export = content;
}