import React, {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  useEffect,
  useReducer,
} from "react";
import { IMainState } from "../../../store/mainStateReducer";
import { PDFActions, SET_CURRENT_MAIN_STATE, SET_CURRENT_PAGE } from "./actions";
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
    // Sync pdfPage from mainState to local PDF state immediately
    // React-pdf will handle rendering the correct page once loaded
    if (mainState.pdfPage !== undefined && mainState.pdfPage !== state.currentPage) {
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
  }, [mainState.pdfPage, state.currentPage]);
=======
  }, [mainState.pdfPage, state.currentPage, mainState]);
>>>>>>> parent of b83c3a9... fix: resolve page navigation issues with pdfPage and initialPdfPage props

  return (
    <PDFContext.Provider value={{ state, dispatch }}>
      {children}
    </PDFContext.Provider>
  );
};

export { PDFContext, PDFProvider };
