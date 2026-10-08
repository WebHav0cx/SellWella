export const THEME_STORAGE_KEY = "sellwella-theme";

export const themeInitializationScript = `(() => {
  let theme = "light";
  try { if (localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}) === "dark") theme = "dark"; } catch {}
  document.documentElement.dataset.theme = theme;
})();`;
