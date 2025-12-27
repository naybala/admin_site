// src/primevue-themes.d.ts (or wherever you prefer to keep custom type declarations)
declare module '@primeuix/themes/aura' {
  // If the module exports primarily CSS or a configuration object,
  // you can declare its type here. For theme presets, it's often an object.
  // A simple 'any' is usually sufficient if you're not interacting with its types directly.
  const AuraPreset: any; // Or a more specific type if known (e.g., PrimeVueThemePreset)
  export default AuraPreset;
}

// You might also need this for the base styling if imported directly (though main.ts handles the preset)
declare module '@primeuix/themes/aura/theme.css' {
  const content: any; // Or simply declare as module if no content is expected
  export default content;
}

// Add any other PrimeVue theme paths you might import directly, e.g.:
// declare module '@primeuix/themes/primeone/theme.css' {
//   const content: any;
//   export default content;
// }