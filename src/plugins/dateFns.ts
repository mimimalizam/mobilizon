import type { Locale } from "date-fns";
import { App, ref } from "vue";

const dateFnsLocale = ref<Locale>();

function dateFnsfileForLanguage(lang: string) {
  const matches: Record<string, string> = {
    en: "en-US",
    sr_Cyrl: "sr",
    sr_Latn: "sr-Latn",
  };
  return matches[lang] ?? lang.replace("_", "-");
}

export async function setDateFnsLocale(lang: string): Promise<void> {
  const localeEntity = await import(
    `../../node_modules/date-fns/esm/locale/${dateFnsfileForLanguage(lang)}/index.js`
  );
  dateFnsLocale.value = localeEntity.default;
}

export const dateFnsPlugin = {
  install(app: App, options: { locale: string }) {
    setDateFnsLocale(options.locale);
    app.provide("dateFnsLocale", dateFnsLocale);
    app.config.globalProperties.$dateFnsLocale = dateFnsLocale;
  },
};

export { dateFnsLocale };
