# PDF Page Navigation & Scroll API

Complete API for controlling PDF page navigation and implementing custom scroll functionality in react-doc-viewer.

## Quick Start

### Pre-select PDF Page

```typescript
<DocViewer 
  documents={documents}
  initialPdfPage={5}  // Start on page 5
/>
```

### Jump to Page Programmatically

```typescript
const ref = useRef<DocViewerRef>(null);

<button onClick={() => ref.current?.goToPage(10)}>
  Go to Page 10
</button>

<DocViewer ref={ref} documents={documents} />
```

### Controlled Page Selection

```typescript
const [currentPage, setCurrentPage] = useState(1);

<DocViewer
  documents={documents}
  pdfPage={currentPage}
  onPdfPageChange={setCurrentPage}
/>

<div>Page: {currentPage}</div>
```

## API Reference

### Props

#### `initialPdfPage?: number`
Sets the initial PDF page to display when the viewer first loads (1-indexed).

```typescript
<DocViewer 
  documents={documents}
  initialPdfPage={1}
/>
```

#### `pdfPage?: number`
Controlled prop for current PDF page. Must use with `onPdfPageChange` callback.

```typescript
const [page, setPage] = useState(1);

<DocViewer
  documents={documents}
  pdfPage={page}
  onPdfPageChange={setPage}
/>
```

#### `onPdfPageChange?: (pageNumber: number) => void`
Callback when PDF page changes (either from user interaction or programmatic calls).

```typescript
<DocViewer
  documents={documents}
  onPdfPageChange={(page) => console.log(`Switched to page ${page}`)}
/>
```

### Ref Methods

#### `goToPage(pageNumber: number)`
Jump to a specific PDF page (1-indexed).

```typescript
const ref = useRef<DocViewerRef>(null);

// Go to page 5
ref.current?.goToPage(5);

// Go to first page
ref.current?.goToPage(1);
```

#### `scrollToPosition(x: number, y: number, options?: ScrollOptions)`
Scroll to specific coordinates within the document.

```typescript
const ref = useRef<DocViewerRef>(null);

// Scroll to top-left
ref.current?.scrollToPosition(0, 0);

// Scroll to position with smooth animation
ref.current?.scrollToPosition(100, 200, { smooth: true });
```

**ScrollOptions:**
- `smooth?: boolean` - Enable smooth scrolling animation (default: false)
- `block?: ScrollLogicalPosition` - Align with viewport ('start' | 'center' | 'end')

#### `scrollToElement(selector: string, options?: ScrollOptions)`
Scroll to the first element matching a CSS selector.

```typescript
const ref = useRef<DocViewerRef>(null);

// Scroll to highlight
ref.current?.scrollToElement('.react-doc-viewer-highlight');

// Scroll to custom element
ref.current?.scrollToElement('#my-custom-element', { smooth: true });
```

## Complete Example

```typescript
import React, { useRef, useState } from 'react';
import DocViewer, { DocViewerRef, IDocument } from '@cyntler/react-doc-viewer';

export function PdfViewer() {
  const ref = useRef<DocViewerRef>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const documents: IDocument[] = [
    { uri: 'document.pdf' }
  ];

  return (
    <div>
      {/* Navigation Controls */}
      <div style={{ padding: '10px', display: 'flex', gap: '10px' }}>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => ref.current?.goToPage(Number(e.target.value))}
        />
        
        <span>of {totalPages}</span>
        
        <button onClick={() => ref.current?.goToPage(currentPage - 1)}>
          Previous
        </button>
        
        <button onClick={() => ref.current?.goToPage(currentPage + 1)}>
          Next
        </button>

        <button onClick={() => ref.current?.scrollToPosition(0, 0)}>
          Top
        </button>

        <button onClick={() => ref.current?.scrollToElement('.react-doc-viewer-highlight')}>
          First Highlight
        </button>
      </div>

      {/* Viewer */}
      <DocViewer
        ref={ref}
        documents={documents}
        initialPdfPage={1}
        pdfPage={currentPage}
        onPdfPageChange={setCurrentPage}
        config={{
          header: { disableHeader: false }
        }}
      />
    </div>
  );
}

export default PdfViewer;
```

## Advanced Usage

### Synced Page Input

```typescript
function PdfWithPageSelector() {
  const ref = useRef<DocViewerRef>(null);
  const [page, setPage] = useState(1);
  const [input, setInput] = useState('1');

  const handleGoToPage = () => {
    const pageNum = parseInt(input, 10);
    if (pageNum > 0) {
      ref.current?.goToPage(pageNum);
      setPage(pageNum);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleGoToPage()}
          placeholder="Enter page number"
        />
        <button onClick={handleGoToPage}>Go</button>
        <span>Current: {page}</span>
      </div>

      <DocViewer
        ref={ref}
        documents={documents}
        pdfPage={page}
        onPdfPageChange={setPage}
      />
    </div>
  );
}
```

### Jump Back to Search Result

```typescript
function SearchableDocument() {
  const ref = useRef<DocViewerRef>(null);

  const handleSearchResult = (resultPage: number, elementId: string) => {
    // Jump to page
    ref.current?.goToPage(resultPage);
    
    // Wait for page to load, then scroll to result
    setTimeout(() => {
      ref.current?.scrollToElement(`#${elementId}`, { smooth: true });
    }, 500);
  };

  return (
    <div>
      <button onClick={() => handleSearchResult(5, 'search-result-1')}>
        Jump to Result on Page 5
      </button>

      <DocViewer ref={ref} documents={documents} />
    </div>
  );
}
```

### Programmatic Navigation with Validation

```typescript
function SafePdfNavigator() {
  const ref = useRef<DocViewerRef>(null);
  const [totalPages, setTotalPages] = useState(0);

  const goToValidPage = (pageNumber: number) => {
    // Validate page number
    const safePageNumber = Math.max(1, Math.min(pageNumber, totalPages));
    ref.current?.goToPage(safePageNumber);
  };

  return (
    <div>
      <button onClick={() => goToValidPage(1)}>First</button>
      <button onClick={() => goToValidPage(Math.ceil(totalPages / 2))}>Middle</button>
      <button onClick={() => goToValidPage(totalPages)}>Last</button>

      <DocViewer
        ref={ref}
        documents={documents}
        onPdfPageChange={(page) => console.log(`Page: ${page}`)}
      />
    </div>
  );
}
```

## Integration with Text Highlighting

```typescript
function SearchWithPageNavigation() {
  const ref = useRef<DocViewerRef>(null);
  const [searchPage, setSearchPage] = useState(1);

  const handleSearch = (text: string) => {
    // Jump to page where search result exists
    ref.current?.goToPage(searchPage);
    // Then highlight the text
    ref.current?.setHighlight(text);
    // Scroll to first highlight
    ref.current?.scrollToElement('.react-doc-viewer-highlight-active', {
      smooth: true
    });
  };

  return (
    <div>
      <input 
        type="number" 
        onChange={(e) => setSearchPage(Number(e.target.value))}
        placeholder="Search on page..."
      />
      <button onClick={() => handleSearch('search term')}>Search</button>

      <DocViewer ref={ref} documents={documents} />
    </div>
  );
}
```

## Best Practices

1. **Validate Page Numbers**
   ```typescript
   const goToPage = (page: number, maxPages: number) => {
     const validated = Math.max(1, Math.min(page, maxPages));
     ref.current?.goToPage(validated);
   };
   ```

2. **Use Smooth Scroll for UX**
   ```typescript
   ref.current?.scrollToElement('.target', { smooth: true });
   ```

3. **Debounce Rapid Navigation**
   ```typescript
   const debouncedGoToPage = useCallback(
     debounce((page: number) => ref.current?.goToPage(page), 300),
     []
   );
   ```

4. **Handle Page Load Timing**
   ```typescript
   // Wait for PDF to render before scrolling
   const goToPageAndScroll = async (page: number, selector: string) => {
     ref.current?.goToPage(page);
     await new Promise(resolve => setTimeout(resolve, 500));
     ref.current?.scrollToElement(selector);
   };
   ```

## Limitations

- Page navigation works primarily with PDF documents
- Other document types have limited pagination support
- Scroll position may reset when switching documents
- Page number is 1-indexed

## Browser Support

✓ Chrome/Edge 90+
✓ Firefox 88+
✓ Safari 14+
✓ All modern browsers

---

For combined usage with text highlighting, see [HIGHLIGHT_FEATURE.md](./HIGHLIGHT_FEATURE.md)
