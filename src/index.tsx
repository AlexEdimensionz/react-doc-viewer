"use client";

import "./cssStyles";
import DocViewer from "./DocViewer";

export default DocViewer;
export { DocViewerRenderers } from "./renderers";
export * from "./models";
export * from "./utils/fileLoaders";
export { type AvailableLanguages, supportedLanguages } from "./i18n";
export * from "./renderers";
export * from "./utils/textHighlight";
export { useDocumentHighlight, useHighlightKeyboardNavigation } from "./hooks/useHighlight";
