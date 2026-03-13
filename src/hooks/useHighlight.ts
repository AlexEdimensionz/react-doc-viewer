import { useEffect, useContext, useRef } from 'react';
import { DocViewerContext } from '../store/DocViewerProvider';
import {
  highlightTextInDOM,
  clearHighlightsInDOM,
  scrollToHighlight,
} from '../utils/textHighlight';

/**
 * Hook to apply text highlighting to a DOM element
 * @param elementRef - ref to the container element to highlight
 * @param enabled - whether highlighting is currently enabled
 */
export const useDocumentHighlight = (
  elementRef: React.RefObject<HTMLElement>,
  enabled: boolean = true,
) => {
  const { state } = useContext(DocViewerContext);
  const prevSearchTextRef = useRef<string>();

  useEffect(() => {
    if (!elementRef.current || !enabled) return;

    if (!state.highlightText) {
      clearHighlightsInDOM(elementRef.current);
      return;
    }

    // Apply highlights
    const matchCount = highlightTextInDOM(
      elementRef.current,
      state.highlightText,
      state.highlightCurrentIndex || 0,
    );

    // Scroll to active highlight
    setTimeout(() => {
      if (elementRef.current) {
        scrollToHighlight(elementRef.current);
      }
    }, 0);

    prevSearchTextRef.current = state.highlightText;
  }, [
    state.highlightText,
    state.highlightCurrentIndex,
    elementRef,
    enabled,
  ]);

  return {
    matchCount: state.highlightMatchCount,
    currentIndex: state.highlightCurrentIndex,
  };
};

/**
 * Hook to handle keyboard navigation of highlights (arrow keys)
 * Requires the ref to be focused or a capturing element
 */
export const useHighlightKeyboardNavigation = () => {
  const { state, dispatch } = useContext(DocViewerContext);

  useEffect(() => {
    if (!state.highlightText) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        // nextHighlight
        dispatch({
          type: 'SET_HIGHLIGHT_INDEX',
          index:
            (state.highlightCurrentIndex || 0) + 1 >= (state.highlightMatchCount || 0)
              ? 0
              : (state.highlightCurrentIndex || 0) + 1,
        } as any);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        // prevHighlight
        dispatch({
          type: 'SET_HIGHLIGHT_INDEX',
          index:
            (state.highlightCurrentIndex || 0) <= 0
              ? (state.highlightMatchCount || 0) - 1
              : (state.highlightCurrentIndex || 0) - 1,
        } as any);
      } else if (event.key === 'Escape') {
        dispatch({ type: 'CLEAR_HIGHLIGHT' } as any);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [state.highlightText, state.highlightCurrentIndex, state.highlightMatchCount, dispatch]);
};
