export const useTranslation = () => {
  const {
    state: { language },
  } = useContext(DocViewerContext);

  const defaultTranslations = locales[defaultLanguage];

  const t = useCallback(
    (
      key: keyof typeof defaultTranslations,
      variables?: Record<string, string | number>,
    ): string => {
      const translations = locales[language];

      if (translations[key]) {
        return mustache.render(translations[key], variables);
      }

      if (defaultTranslations[key]) {
        return mustache.render(defaultTranslations[key], variables);
      }

      // force return as string
      return String(key);
    },
    [language, defaultTranslations],
  );

  return { t };
};
