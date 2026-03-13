import "core-js/proposals/promise-with-resolvers";
import React, { CSSProperties, forwardRef, memo } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { HeaderBar } from "./components/HeaderBar";
import { ProxyRenderer } from "./components/ProxyRenderer";
import { defaultTheme } from "./defaultTheme";
import { AvailableLanguages } from "./i18n";
import {
  DocRenderer,
  DocViewerRef,
  IConfig,
  IDocument,
  ITheme,
} from "./models";
import { DocViewerRenderers } from "./renderers";
import { DocViewerProvider } from "./store/DocViewerProvider";

// Global styles for text highlighting
const HighlightStyles = createGlobalStyle`
  .react-doc-viewer-highlight {
    background-color: rgba(255, 240, 0, 0.4);
    transition: background-color 0.2s ease;
  }

  .react-doc-viewer-highlight-active {
    background-color: rgba(255, 165, 0, 0.7);
    box-shadow: 0 0 4px rgba(255, 165, 0, 0.8);
  }
`;

export interface DocViewerProps {
  documents: IDocument[];
  className?: string;
  style?: CSSProperties;
  config?: IConfig;
  theme?: ITheme;
  pluginRenderers?: DocRenderer[];
  prefetchMethod?: string;
  requestHeaders?: Record<string, string>;
  initialActiveDocument?: IDocument;
  language?: AvailableLanguages;
  activeDocument?: IDocument;
  onDocumentChange?: (document: IDocument) => void;
  /** Initial PDF page number (1-indexed) */
  initialPdfPage?: number;
  /** Current PDF page number (1-indexed) for controlled component */
  pdfPage?: number;
  /** Called when PDF page changes */
  onPdfPageChange?: (pageNumber: number) => void;
}

const DocViewer = forwardRef<DocViewerRef, DocViewerProps>((props, ref) => {
  const { documents, theme } = props;

  if (!documents) {
    throw new Error("Please provide an array of documents to DocViewer!");
  }

  return (
    <>
      <HighlightStyles />
      <DocViewerProvider
        ref={ref}
        pluginRenderers={DocViewerRenderers}
        {...props}
      >
        <ThemeProvider
          theme={theme ? { ...defaultTheme, ...theme } : defaultTheme}
        >
          <Container
            id="react-doc-viewer"
            data-testid="react-doc-viewer"
            className={props.className}
            style={props.style}
          >
            <HeaderBar />
            <ProxyRenderer />
          </Container>
        </ThemeProvider>
      </DocViewerProvider>
    </>
  );
});

export default memo(DocViewer);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  width: 100%;
  height: 100%;
`;
