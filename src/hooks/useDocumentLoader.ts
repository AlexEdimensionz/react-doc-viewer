import { Dispatch, useContext, useEffect } from "react";
import { DocViewerContext } from "../store/DocViewerProvider";
import {
  MainStateActions,
  setDocumentLoading,
  updateCurrentDocument,
} from "../store/actions";
import { IMainState } from "../store/mainStateReducer";
import { DocRenderer } from "..";
import {
  defaultFileLoader,
  FileLoaderComplete,
  FileLoaderFuncProps,
} from "../utils/fileLoaders";
import { useRendererSelector } from "./useRendererSelector";

/**
 * Custom Hook for loading the current document into context
 */
export const useDocumentLoader = (): {
  state: IMainState;
  dispatch: Dispatch<MainStateActions>;
  CurrentRenderer: DocRenderer | null | undefined;
} => {
  const { state, dispatch } = useContext(DocViewerContext);
  const { currentFileNo, currentDocument, prefetchMethod, requestCredentials } = state;
  console.log("[DocViewer] state.requestCredentials:", requestCredentials);
  console.log("[DocViewer] state.requestHeaders:", state?.requestHeaders);

  const { CurrentRenderer } = useRendererSelector();

  const documentURI = currentDocument?.uri || "";

  useEffect(
    () => {
      if (!currentDocument || currentDocument.fileType !== undefined) return;

      const controller = new AbortController();
      const { signal } = controller;

      console.log("[DocViewer] prefetch fetch:", documentURI, { method: prefetchMethod || documentURI.startsWith("blob:") ? "GET" : "HEAD", headers: state?.requestHeaders, credentials: requestCredentials });
      fetch(documentURI, {
        method:
          prefetchMethod || documentURI.startsWith("blob:") ? "GET" : "HEAD",
        signal,
        headers: state?.requestHeaders,
        credentials: requestCredentials,
      })
        .then((response) => {
          const contentTypeRaw = response.headers.get("content-type");
          const contentTypes = contentTypeRaw?.split(";") || [];
          const contentType = contentTypes.length ? contentTypes[0] : undefined;

          dispatch(
            updateCurrentDocument({
              ...currentDocument,
              fileType: contentType || undefined,
            }),
          );
        })
        .catch((error) => {
          if (error?.name !== "AbortError") {
            throw error;
          }
        });

      return () => {
        controller.abort();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFileNo, documentURI, currentDocument],
  );

  useEffect(() => {
    if (!currentDocument || CurrentRenderer === undefined) return;

    const controller = new AbortController();
    const { signal } = controller;

    const fileLoaderComplete: FileLoaderComplete = (fileReader) => {
      if (!currentDocument || !fileReader) {
        dispatch(setDocumentLoading(false));
        return;
      }

      const updatedDocument = { ...currentDocument };
      if (fileReader.result !== null) {
        updatedDocument.fileData = fileReader.result;
      }

      dispatch(updateCurrentDocument(updatedDocument));
      dispatch(setDocumentLoading(false));
    };

    console.log("[DocViewer] fileLoader props:", { documentURI, headers: state?.requestHeaders, credentials: requestCredentials });
    const loaderFunctionProps: FileLoaderFuncProps = {
      documentURI,
      signal,
      fileLoaderComplete,
      headers: state?.requestHeaders,
      credentials: requestCredentials,
    };

    if (CurrentRenderer === null) {
      dispatch(setDocumentLoading(false));
    } else if (CurrentRenderer.fileLoader !== undefined) {
      CurrentRenderer.fileLoader?.(loaderFunctionProps);
    } else {
      defaultFileLoader(loaderFunctionProps);
    }

    return () => {
      controller.abort();
    };
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [CurrentRenderer, currentFileNo]);

  return { state, dispatch, CurrentRenderer };
};
