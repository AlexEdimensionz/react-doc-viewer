import React, {
  createContext,
  Dispatch,
  useEffect,
  useReducer,
  PropsWithChildren,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { DocViewerRef } from "..";
import { DocViewerProps } from "../DocViewer";
import { defaultLanguage, locales } from "../i18n";
import {
  MainStateActions,
  nextDocument,
  previousDocument,
  setAllDocuments,
  setMainConfig,
  updateCurrentDocument,
  setHighlightText,
  setHighlightIndex,
  clearHighlight,
  setPdfPage,
} from "./actions";
import {
  IMainState,
  initialState,
  mainStateReducer,
  MainStateReducer,
} from "./mainStateReducer";
import { findTextMatches } from "../utils/textHighlight";

const DocViewerContext = createContext<{
  state: IMainState;
  dispatch: Dispatch<MainStateActions>;
}>({ state: initialState, dispatch: () => null });

const DocViewerProvider = forwardRef<
  DocViewerRef,
  PropsWithChildren<DocViewerProps>
>((props, ref) => {
  const {
    children,
    documents,
    config,
    pluginRenderers,
    prefetchMethod,
    requestHeaders,
    initialActiveDocument,
    language,
    activeDocument,
    onDocumentChange,
    initialPdfPage,
    pdfPage,
    onPdfPageChange,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const [state, dispatch] = useReducer<MainStateReducer>(mainStateReducer, {
    ...initialState,
    documents: documents || [],
    currentDocument:
      documents && documents.length
        ? initialActiveDocument
          ? initialActiveDocument
          : documents[0]
        : undefined,
    config,
    pluginRenderers,
    prefetchMethod,
    requestHeaders,
    currentFileNo: initialActiveDocument
      ? documents.findIndex((doc) => doc === initialActiveDocument) ?? 0
      : 0,
    language: language && locales[language] ? language : defaultLanguage,
    activeDocument,
    onDocumentChange,
    pdfPage: initialPdfPage !== undefined ? initialPdfPage : 1,
    onPdfPageChange,
  });

  useEffect(() => {
    dispatch(setAllDocuments(documents, initialActiveDocument));
    config && dispatch(setMainConfig(config));
  }, [documents, config, initialActiveDocument]);

  useEffect(() => {
    if (activeDocument) {
      dispatch(updateCurrentDocument(activeDocument));
    }
  }, [activeDocument]);

  // Sync pdfPage prop to state whenever it changes
  useEffect(() => {
    if (pdfPage !== undefined && pdfPage !== state.pdfPage) {
      dispatch(setPdfPage(pdfPage));
      if (onPdfPageChange) {
        onPdfPageChange(pdfPage);
      }
    }
  }, [pdfPage, state.pdfPage, onPdfPageChange]);

  useImperativeHandle(
    ref,
    () => ({
      prev() {
        dispatch(previousDocument());
      },
      next() {
        dispatch(nextDocument());
      },
      setHighlight(searchText: string) {
        if (!searchText.trim()) {
          dispatch(clearHighlight());
          return;
        }

        // For simple text highlighting, we estimate match count
        // The actual count will be determined when rendering applies highlighting
        const contentText = state.currentDocument?.fileData as string;
        const matches = findTextMatches(contentText || '', searchText);
        dispatch(setHighlightText(searchText, matches.length));
      },
      nextHighlight() {
        if (!state.highlightText || !state.highlightMatchCount) return;

        const nextIndex =
          (state.highlightCurrentIndex || 0) + 1 >= state.highlightMatchCount
            ? 0
            : (state.highlightCurrentIndex || 0) + 1;

        dispatch(setHighlightIndex(nextIndex));
      },
      prevHighlight() {
        if (!state.highlightText || !state.highlightMatchCount) return;

        const prevIndex =
          (state.highlightCurrentIndex || 0) <= 0
            ? state.highlightMatchCount - 1
            : (state.highlightCurrentIndex || 0) - 1;

        dispatch(setHighlightIndex(prevIndex));
      },
      clearHighlight() {
        dispatch(clearHighlight());
      },
      goToPage(pageNumber: number) {
        if (pageNumber < 1) return;
        dispatch(setPdfPage(pageNumber));
      },
      scrollToPosition(x: number, y: number, options?: { smooth?: boolean; block?: ScrollLogicalPosition }) {
        if (!containerRef.current) return;
        containerRef.current.scrollLeft = x;
        containerRef.current.scrollTop = y;
      },
      scrollToElement(selector: string, options?: { smooth?: boolean; block?: ScrollLogicalPosition }) {
        if (!containerRef.current) return;
        const element = containerRef.current.querySelector(selector);
        if (element && element instanceof HTMLElement) {
          element.scrollIntoView({
            behavior: options?.smooth ? 'smooth' : 'auto',
            block: options?.block || 'center',
          });
        }
      },
    }),
    [dispatch, state],
  );

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <DocViewerContext.Provider value={{ state, dispatch }}>
        {children}
      </DocViewerContext.Provider>
    </div>
  );
});

export { DocViewerContext, DocViewerProvider };
