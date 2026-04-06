import React, {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  useEffect,
  useReducer,
} from "react";
import { IMainState } from "../../../store/mainStateReducer";
import { PDFActions, SET_CURRENT_MAIN_STATE } from "./actions";
import {
  initialPDFState,
  IPDFState,
  PDFStateReducer,
  reducer,
} from "./reducer";

const PDFContext = createContext<{
  state: IPDFState;
  dispatch: Dispatch<PDFActions>;
}>({ state: initialPDFState, dispatch: () => null });

const PDFProvider: FC<PropsWithChildren<{ mainState: IMainState }>> = ({
  children,
  mainState,
}) => {
  const [state, dispatch] = useReducer<PDFStateReducer>(reducer, {
    ...initialPDFState,
    defaultZoomLevel:
      mainState.config?.pdfZoom?.defaultZoom ??
      initialPDFState.defaultZoomLevel,
    zoomLevel:
      mainState.config?.pdfZoom?.defaultZoom ?? initialPDFState.zoomLevel,
    zoomJump: mainState.config?.pdfZoom?.zoomJump ?? initialPDFState.zoomJump,
    paginated: mainState.config?.pdfVerticalScrollByDefault
      ? false
      : initialPDFState.paginated,
    mainState,
  });

  useEffect(() => {
    dispatch({
      type: SET_CURRENT_MAIN_STATE,
      value: mainState,
    });
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    
<<<<<<< HEAD
    // Sync pdfPage from mainState to local PDF state immediately
    // React-pdf will handle rendering the correct page once loaded
    if (mainState.pdfPage !== undefined && mainState.pdfPage !== state.currentPage) {
=======
    // Sync pdfPage from mainState to local PDF state when it changes
    if (mainState.pdfPage && mainState.pdfPage !== state.currentPage) {
>>>>>>> parent of b83c3a9... fix: resolve page navigation issues with pdfPage and initialPdfPage props
=======
  }, [mainState]);

  // Sync pdfPage from mainState to local PDF state
  // Only sync if PDF has loaded (numPages > 0) to prevent race conditions
  useEffect(() => {
    if (
      mainState.pdfPage !== undefined &&
      mainState.pdfPage !== state.currentPage &&
      state.numPages > 0
    ) {
>>>>>>> parent of 3efe304... fix: resolve page navigation sync issue - remove numPages guard
=======
    
    // Sync pdfPage from mainState to local PDF state when it changes
    if (mainState.pdfPage && mainState.pdfPage !== state.currentPage) {
>>>>>>> parent of b83c3a9... fix: resolve page navigation issues with pdfPage and initialPdfPage props
      dispatch({
        type: SET_CURRENT_PAGE,
        value: mainState.pdfPage,
      });
    }
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  }, [mainState.pdfPage, state.currentPage]);
=======
  }, [mainState.pdfPage, state.currentPage, mainState]);
>>>>>>> parent of b83c3a9... fix: resolve page navigation issues with pdfPage and initialPdfPage props
=======
  }, [mainState.pdfPage, state.currentPage, state.numPages]);
>>>>>>> parent of 3efe304... fix: resolve page navigation sync issue - remove numPages guard
=======
  }, [mainState.pdfPage, state.currentPage, mainState]);
>>>>>>> parent of b83c3a9... fix: resolve page navigation issues with pdfPage and initialPdfPage props
=======
  }, [mainState]);
>>>>>>> parent of b8034df... docs: add comprehensive feature documentation for highlighting, page navigation, and usage guide

  return (
    <PDFContext.Provider value={{ state, dispatch }}>
      {children}
    </PDFContext.Provider>
  );
};

export { PDFContext, PDFProvider };
