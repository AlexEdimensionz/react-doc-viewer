/**
 * Utility functions for text highlighting and matching
 * Supports case-insensitive and whitespace-insensitive matching
 */

export interface TextMatch {
  index: number;
  text: string;
  position: number; // character position in original text
}

/**
 * Normalize text for matching (case and whitespace insensitive)
 */
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Find all matches of searchText in content
 * Returns array of match positions and matched text
 */
export const findTextMatches = (
  content: string,
  searchText: string,
): TextMatch[] => {
  if (!searchText || !content) return [];

  const normalizedSearch = normalizeText(searchText);
  const normalizedContent = normalizeText(content);
  
  const matches: TextMatch[] = [];
  let searchIndex = 0;
  
  while (searchIndex < normalizedContent.length) {
    const matchIndex = normalizedContent.indexOf(
      normalizedSearch,
      searchIndex,
    );
    
    if (matchIndex === -1) break;
    
    // Find the actual position in original text
    let originalPosition = 0;
    let normalizedPosition = 0;
    
    for (let i = 0; i < content.length; i++) {
      if (normalizedPosition === matchIndex) {
        originalPosition = i;
        break;
      }
      
      const char = content[i];
      if (/\s/.test(char)) {
        if (normalizedPosition > 0 && normalizedContent[normalizedPosition - 1] !== ' ') {
          normalizedPosition++;
        }
      } else {
        normalizedPosition++;
      }
    }
    
    matches.push({
      index: matches.length,
      text: searchText,
      position: originalPosition,
    });
    
    searchIndex = matchIndex + normalizedSearch.length;
  }
  
  return matches;
};

/**
 * Highlight text in DOM with span elements
 * Returns the count of highlighted matches
 */
export const highlightTextInDOM = (
  element: HTMLElement,
  searchText: string,
  activeMatchIndex: number = 0,
): number => {
  if (!searchText || !element) return 0;

  // Clear previous highlights
  clearHighlightsInDOM(element);

  if (!searchText.trim()) return 0;

  const normalizedSearch = normalizeText(searchText);
  let matchCount = 0;

  const walk = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      const normalizedText = normalizeText(text);
      
      if (normalizedText.includes(normalizedSearch)) {
        const span = document.createElement('span');
        let matchIndex = 0;
        let lastIndex = 0;

        // Split and highlight
        let pos = 0;
        while (pos < normalizedText.length) {
          const idx = normalizedText.indexOf(normalizedSearch, pos);
          if (idx === -1) break;

          if (idx > pos) {
            span.appendChild(
              document.createTextNode(text.substring(lastIndex, lastIndex + (idx - pos))),
            );
          }

          // Find original text length for this match
          let originalMatchLength = 0;
          let normalizedCount = 0;
          for (let i = 0; i < text.length - lastIndex; i++) {
            if (normalizedCount === normalizedSearch.length) break;
            if (!/\s/.test(text[lastIndex + i])) {
              normalizedCount++;
            }
            originalMatchLength++;
          }

          const highlightSpan = document.createElement('span');
          highlightSpan.className = `react-doc-viewer-highlight ${
            matchIndex === activeMatchIndex
              ? 'react-doc-viewer-highlight-active'
              : ''
          }`;
          highlightSpan.textContent = text.substring(
            lastIndex,
            lastIndex + originalMatchLength,
          );
          span.appendChild(highlightSpan);

          lastIndex += originalMatchLength;
          pos = idx + normalizedSearch.length;
          matchIndex++;
          matchCount++;
        }

        if (lastIndex < text.length) {
          span.appendChild(document.createTextNode(text.substring(lastIndex)));
        }

        node.parentNode?.replaceChild(span, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT') {
      const children = Array.from(node.childNodes);
      children.forEach(walk);
    }
  };

  walk(element);
  return matchCount;
};

/**
 * Clear all highlights from DOM
 */
export const clearHighlightsInDOM = (element: HTMLElement): void => {
  const highlights = element.querySelectorAll('.react-doc-viewer-highlight');
  highlights.forEach((highlight) => {
    const parent = highlight.parentNode;
    while (highlight.firstChild) {
      parent?.insertBefore(highlight.firstChild, highlight);
    }
    parent?.removeChild(highlight);
  });
};

/**
 * Scroll to a specific highlight element
 */
export const scrollToHighlight = (
  containerElement: HTMLElement,
): void => {
  const activeHighlight = containerElement.querySelector(
    '.react-doc-viewer-highlight-active',
  ) as HTMLElement;

  if (activeHighlight) {
    activeHighlight.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
};
