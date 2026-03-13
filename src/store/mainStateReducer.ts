import { DocRenderer, IConfig, IDocument } from "..";
import {
  MainStateActions,
  NEXT_DOCUMENT,
  PREVIOUS_DOCUMENT,
  SetAllDocuments,
  SetDocumentLoading,
  SetMainConfig,
  SetRendererRect,
  SET_ALL_DOCUMENTS,
  SET_DOCUMENT_LOADING,
  SET_MAIN_CONFIG,
  SET_RENDERER_RECT,
  UpdateCurrentDocument,
  UPDATE_CURRENT_DOCUMENT,
  SET_HIGHLIGHT_TEXT,
  SET_HIGHLIGHT_INDEX,
  CLEAR_HIGHLIGHT,
  SET_PDF_PAGE,
} from "./actions";
import { AvailableLanguages, defaultLanguage } from "../i18n";

export type IMainState = {
  currentFileNo: number;
  documents: IDocument[];
  documentLoading?: boolean;
  currentDocument?: IDocument;
  rendererRect?: DOMRect;
  config?: IConfig;
  pluginRenderers?: DocRenderer[];
  prefetchMethod?: string;
  requestHeaders?: Record<string, string>;
  language: AvailableLanguages;
  activeDocument?: IDocument;
  onDocumentChange?: (document: IDocument) => void;
  highlightText?: string;
  highlightMatchCount?: number;
  highlightCurrentIndex?: number;
  pdfPage?: number;
  onPdfPageChange?: (pageNumber: number) => void;
};

export const initialState: IMainState = {
  currentFileNo: 0,
  documents: [],
  documentLoading: true,
  currentDocument: undefined,
  rendererRect: undefined,
  config: {},
  pluginRenderers: [],
  language: defaultLanguage,
  highlightText: undefined,
  highlightMatchCount: 0,
  highlightCurrentIndex: 0,
  pdfPage: 1,
};

export type MainStateReducer = (
  state: IMainState,
  action: MainStateActions,
) => IMainState;

export const mainStateReducer: MainStateReducer = (
  state = initialState,
  action: MainStateActions,
): IMainState => {
  switch (action.type) {
    case SET_ALL_DOCUMENTS: {
      const { documents, initialActiveDocument } = action as SetAllDocuments;

      return {
        ...state,
        documents,
        currentDocument: initialActiveDocument
          ? initialActiveDocument
          : documents[0] || null,
        currentFileNo:
          initialActiveDocument && documents.includes(initialActiveDocument)
            ? documents.indexOf(initialActiveDocument)
            : initialState.currentFileNo,
      };
    }

    case SET_DOCUMENT_LOADING: {
      const { value } = action as SetDocumentLoading;

      return { ...state, documentLoading: value };
    }

    case NEXT_DOCUMENT: {
      if (state.currentFileNo >= state.documents.length - 1) return state;
      const nextDocumentNo = state.currentFileNo + 1;

      if (state.onDocumentChange) {
        state.onDocumentChange(state.documents[nextDocumentNo]);
      }

      return {
        ...state,
        currentFileNo: nextDocumentNo,
        currentDocument: state.documents[nextDocumentNo],
        documentLoading: true,
      };
    }

    case PREVIOUS_DOCUMENT: {
      if (state.currentFileNo <= 0) return state;
      const prevDocumentNo = state.currentFileNo - 1;

      if (state.onDocumentChange) {
        state.onDocumentChange(state.documents[prevDocumentNo]);
      }

      return {
        ...state,
        currentFileNo: state.currentFileNo - 1,
        currentDocument: state.documents[prevDocumentNo],
        documentLoading: true,
      };
    }

    case UPDATE_CURRENT_DOCUMENT: {
      const { document } = action as UpdateCurrentDocument;

      return {
        ...state,
        currentDocument: document,
        currentFileNo: state.documents.findIndex(
          (doc) => doc.uri === document.uri,
        ),
      };
    }

    case SET_RENDERER_RECT: {
      const { rect } = action as SetRendererRect;

      return {
        ...state,
        rendererRect: rect,
      };
    }

    case SET_MAIN_CONFIG: {
      const { config } = action as SetMainConfig;

      return {
        ...state,
        config,
      };
    }

    case SET_HIGHLIGHT_TEXT: {
      const { searchText, matchCount } = action as any;

      return {
        ...state,
        highlightText: searchText,
        highlightMatchCount: matchCount,
        highlightCurrentIndex: 0,
      };
    }

    case SET_HIGHLIGHT_INDEX: {
      const { index } = action as any;

      if (index < 0 || index >= (state.highlightMatchCount || 0)) {
        return state;
      }

      return {
        ...state,
        highlightCurrentIndex: index,
      };
    }

    case CLEAR_HIGHLIGHT: {
      return {
        ...state,
        highlightText: undefined,
        highlightMatchCount: 0,
        highlightCurrentIndex: 0,
      };
    }

    case SET_PDF_PAGE: {
      const { value } = action as any;
      const newState = {
        ...state,
        pdfPage: value,
      };
      // Call onPdfPageChange callback if it exists
      if (state.onPdfPageChange) {
        state.onPdfPageChange(value);
      }
      return newState;
    }

    default:
      return state;
  }
};
