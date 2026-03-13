# Complete Feature Usage Guide

This guide demonstrates all available APIs in react-doc-viewer including security improvements, text highlighting, and PDF page navigation.

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Basic Document Viewing](#basic-document-viewing)
3. [Text Highlighting Feature](#text-highlighting-feature)
4. [Page Navigation](#page-navigation)
5. [Combined Features](#combined-features)
6. [Real-World Examples](#real-world-examples)

## Installation & Setup

```bash
npm install @cyntler/react-doc-viewer
```

### Secure Setup with Dependencies

```bash
npm install react-pdf@9.0.0  # For PDF support
npm install dompurify@^1.0.0  # For HTML sanitization (already included)
```

## Basic Document Viewing

### Simple Document Display

```typescript
import DocViewer, { IDocument } from '@cyntler/react-doc-viewer';

export function SimpleViewer() {
  const documents: IDocument[] = [
    {
      uri: require('./my-document.pdf'),
      fileName: 'my-document.pdf'
    }
  ];

  return <DocViewer documents={documents} />;
}
```

### Multiple Documents with Tabs

```typescript
function MultiDocViewer() {
  const documents: IDocument[] = [
    { uri: 'contract.pdf', fileName: 'contract.pdf' },
    { uri: 'report.docx', fileName: 'report.docx' },
    { uri: 'data.csv', fileName: 'data.csv' },
    { uri: 'image.png', fileName: 'image.png' }
  ];

  return (
    <DocViewer
      documents={documents}
      config={{
        header: {
          disableHeader: false,
          disableFileName: false
        }
      }}
    />
  );
}
```

### Secure Document Loading

```typescript
function SecureDocumentLoader() {
  const loadDocument = async (documentUri: string) => {
    // URI is validated automatically by the library
    // Accepted protocols: http://, https://, blob:, data:
    // Prevents SSRF and other security issues
    
    const documents: IDocument[] = [
      {
        uri: documentUri,
        fileName: 'secure-document.pdf'
      }
    ];

    return <DocViewer documents={documents} />;
  };

  return loadDocument('https://example.com/document.pdf');
}
```

## Text Highlighting Feature

### Basic Text Highlight

```typescript
import { useRef } from 'react';
import DocViewer, { DocViewerRef } from '@cyntler/react-doc-viewer';

function HighlightExample() {
  const ref = useRef<DocViewerRef>(null);

  return (
    <div>
      <button onClick={() => ref.current?.setHighlight('important')}>
        Highlight 'important'
      </button>
      <button onClick={() => ref.current?.clearHighlight()}>
        Clear Highlights
      </button>

      <DocViewer
        ref={ref}
        documents={[{ uri: 'document.pdf' }]}
      />
    </div>
  );
}
```

### Interactive Highlight Navigation

```typescript
function SearchWithNavigation() {
  const ref = useRef<DocViewerRef>(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div style={{ padding: '10px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search text..."
        />
        
        <button onClick={() => ref.current?.setHighlight(searchTerm)}>
          Find All
        </button>
        
        <button onClick={() => ref.current?.nextHighlight()}>
          ↓ Next
        </button>
        
        <button onClick={() => ref.current?.prevHighlight()}>
          ↑ Previous
        </button>
        
        <button onClick={() => ref.current?.clearHighlight()}>
          Clear
        </button>
      </div>

      <DocViewer
        ref={ref}
        documents={[{ uri: 'document.txt' }]}
      />
    </div>
  );
}
```

### Highlight with Styling

```typescript
function StyledHighlight() {
  const ref = useRef<DocViewerRef>(null);

  return (
    <div>
      <style>{`
        .react-doc-viewer-highlight {
          background-color: yellow;
          padding: 2px 4px;
          border-radius: 2px;
        }

        .react-doc-viewer-highlight-active {
          background-color: orange;
          font-weight: bold;
          box-shadow: 0 0 4px rgba(255, 165, 0, 0.5);
        }
      `}</style>

      <button onClick={() => ref.current?.setHighlight('key data')}>
        Highlight 'key data'
      </button>

      <DocViewer
        ref={ref}
        documents={[{ uri: 'report.txt' }]}
      />
    </div>
  );
}
```

### Case-Insensitive & Whitespace-Insensitive Matching

```typescript
// The highlighting API automatically handles:
// - Case-insensitive: "Hello" matches "hello", "HELLO", "HeLLo"
// - Whitespace-insensitive: "hello world" matches "hello  world", "hello\nworld"

function SmartSearch() {
  const ref = useRef<DocViewerRef>(null);

  const searches = [
    'machine learning',    // Matches "Machine Learning", "machine  learning", etc.
    'firstName lastName',  // Matches "first  name  last  name", "FirstName LastName", etc.
    'JSON format',         // Case and whitespace insensitive
  ];

  return (
    <div>
      {searches.map(term => (
        <button 
          key={term}
          onClick={() => ref.current?.setHighlight(term)}
        >
          Search: {term}
        </button>
      ))}

      <DocViewer ref={ref} documents={[{ uri: 'document.txt' }]} />
    </div>
  );
}
```

### Highlight API Reference

```typescript
// All highlight methods on DocViewerRef
ref.current?.setHighlight(text: string)     // Find and highlight all matches
ref.current?.nextHighlight()                // Navigate to next match
ref.current?.prevHighlight()                // Navigate to previous match
ref.current?.clearHighlight()               // Remove all highlights
```

## Page Navigation

### Simple Page Selection

```typescript
function PageSelector() {
  const ref = useRef<DocViewerRef>(null);

  return (
    <div>
      <button onClick={() => ref.current?.goToPage(1)}>First</button>
      <button onClick={() => ref.current?.goToPage(5)}>Page 5</button>
      <button onClick={() => ref.current?.goToPage(10)}>Page 10</button>

      <DocViewer
        ref={ref}
        documents={[{ uri: 'large-document.pdf' }]}
        initialPdfPage={1}
      />
    </div>
  );
}
```

### Controlled Page Input

```typescript
function ControlledPageNavigation() {
  const ref = useRef<DocViewerRef>(null);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <div style={{ padding: '10px' }}>
        <input
          type="number"
          value={currentPage}
          onChange={(e) => {
            const page = Number(e.target.value);
            setCurrentPage(page);
            ref.current?.goToPage(page);
          }}
          min="1"
        />
      </div>

      <DocViewer
        ref={ref}
        documents={[{ uri: 'document.pdf' }]}
        pdfPage={currentPage}
        onPdfPageChange={setCurrentPage}
      />
    </div>
  );
}
```

### Smart Page Navigation

```typescript
function SmartPageNav() {
  const ref = useRef<DocViewerRef>(null);
  const [page, setPage] = useState(1);
  const [totalPages] = useState(100); // Get from PDF

  const goToPage = (targetPage: number) => {
    // Validate page number
    const validated = Math.max(1, Math.min(targetPage, totalPages));
    ref.current?.goToPage(validated);
    setPage(validated);
  };

  const goToPercentage = (percent: number) => {
    const targetPage = Math.ceil((percent / 100) * totalPages);
    goToPage(targetPage);
  };

  return (
    <div>
      <div style={{ padding: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={() => goToPage(1)}>First</button>
        <button onClick={() => goToPage(page - 1)}>Previous</button>
        
        <span>{page} / {totalPages}</span>
        
        <button onClick={() => goToPage(page + 1)}>Next</button>
        <button onClick={() => goToPage(totalPages)}>Last</button>

        <input
          type="range"
          min="1"
          max={totalPages}
          value={page}
          onChange={(e) => goToPage(Number(e.target.value))}
          style={{ flex: 1 }}
        />
      </div>

      <DocViewer
        ref={ref}
        documents={[{ uri: 'document.pdf' }]}
        pdfPage={page}
        onPdfPageChange={setPage}
      />
    </div>
  );
}
```

### Scroll to Specific Content

```typescript
function ScrollToContent() {
  const ref = useRef<DocViewerRef>(null);

  const jumpToSection = (sectionId: string, pageNumber: number) => {
    // Jump to page
    ref.current?.goToPage(pageNumber);
    
    // Wait for page render, then scroll to element
    setTimeout(() => {
      ref.current?.scrollToElement(`#${sectionId}`, { smooth: true });
    }, 500);
  };

  return (
    <div>
      <button onClick={() => jumpToSection('introduction', 1)}>
        Introduction
      </button>
      <button onClick={() => jumpToSection('chapter1', 5)}>
        Chapter 1
      </button>
      <button onClick={() => jumpToSection('conclusion', 20)}>
        Conclusion
      </button>

      <DocViewer
        ref={ref}
        documents={[{ uri: 'ebook.pdf' }]}
      />
    </div>
  );
}
```

## Combined Features

### Search + Highlight on Specific Page

```typescript
function AdvancedSearch() {
  const ref = useRef<DocViewerRef>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPage, setSearchPage] = useState(1);

  const handleSearch = () => {
    // Navigate to page
    ref.current?.goToPage(searchPage);
    
    // Highlight the search term
    ref.current?.setHighlight(searchTerm);
    
    // Scroll to first highlight
    setTimeout(() => {
      ref.current?.scrollToElement(
        '.react-doc-viewer-highlight-active',
        { smooth: true }
      );
    }, 300);
  };

  return (
    <div>
      <div style={{ padding: '10px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search term"
        />
        <input
          type="number"
          value={searchPage}
          onChange={(e) => setSearchPage(Number(e.target.value))}
          placeholder="Page"
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => ref.current?.nextHighlight()}>
          Next Match ↓
        </button>
      </div>

      <DocViewer
        ref={ref}
        documents={[{ uri: 'document.pdf' }]}
      />
    </div>
  );
}
```

### Bookmark System

```typescript
function BookmarkViewer() {
  const ref = useRef<DocViewerRef>(null);
  const [bookmarks, setBookmarks] = useState<Array<{ 
    page: number; 
    label: string 
  }>>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const addBookmark = () => {
    setBookmarks([
      ...bookmarks,
      { page: currentPage, label: `Bookmark ${bookmarks.length + 1}` }
    ]);
  };

  const goToBookmark = (page: number) => {
    ref.current?.goToPage(page);
    setCurrentPage(page);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ 
        width: '200px', 
        borderRight: '1px solid #ccc',
        padding: '10px'
      }}>
        <h3>Bookmarks</h3>
        <button onClick={addBookmark}>Add Bookmark</button>
        <ul>
          {bookmarks.map((bm, i) => (
            <li key={i}>
              <button onClick={() => goToBookmark(bm.page)}>
                {bm.label} (p.{bm.page})
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ padding: '10px' }}>
          Page: {currentPage}
        </div>
        <DocViewer
          ref={ref}
          documents={[{ uri: 'document.pdf' }]}
          pdfPage={currentPage}
          onPdfPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
```

## Real-World Examples

### E-Book Reader with Full Features

```typescript
function EBookReader() {
  const ref = useRef<DocViewerRef>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(234);
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [fontSize, setFontSize] = useState(16);

  const handleAddBookmark = () => {
    if (!bookmarks.includes(currentPage)) {
      setBookmarks([...bookmarks, currentPage].sort((a, b) => a - b));
    }
  };

  const handleSearch = (text: string) => {
    if (text) {
      ref.current?.setHighlight(text);
    } else {
      ref.current?.clearHighlight();
    }
  };

  const goToProgress = (percent: number) => {
    const page = Math.ceil((percent / 100) * totalPages);
    ref.current?.goToPage(page);
  };

  return (
    <div>
      {/* Header with Controls */}
      <div style={{
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd'
      }}>
        <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="Search text..."
          />
          <button onClick={handleAddBookmark}>
            ★ Bookmark (Page {currentPage})
          </button>
          <button onClick={() => ref.current?.setHighlight('')}>
            Clear Highlight
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={() => ref.current?.goToPage(1)}>|‹</button>
          <button onClick={() => ref.current?.goToPage(currentPage - 1)}>‹</button>
          
          <input
            type="range"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = Number(e.target.value);
              ref.current?.goToPage(page);
              setCurrentPage(page);
            }}
            style={{ flex: 1 }}
          />
          
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = Number(e.target.value);
              if (page >= 1 && page <= totalPages) {
                ref.current?.goToPage(page);
              }
            }}
            style={{ width: '60px' }}
          />
          <span> / {totalPages}</span>
          
          <button onClick={() => ref.current?.goToPage(currentPage + 1)}>›</button>
          <button onClick={() => ref.current?.goToPage(totalPages)}>›|</button>
        </div>

        {bookmarks.includes(currentPage) && (
          <div style={{ marginTop: '5px', color: '#ff6b6b' }}>
            ★ This page is bookmarked
          </div>
        )}
      </div>

      {/* Viewer */}
      <div style={{ minHeight: '600px' }}>
        <DocViewer
          ref={ref}
          documents={[{ uri: 'ebook.pdf' }]}
          pdfPage={currentPage}
          onPdfPageChange={setCurrentPage}
          config={{
            header: { disableHeader: false }
          }}
        />
      </div>

      {/* Bookmarks Sidebar */}
      {bookmarks.length > 0 && (
        <div style={{
          position: 'fixed',
          right: 0,
          top: 0,
          width: '200px',
          height: '100vh',
          backgroundColor: '#f9f9f9',
          borderLeft: '1px solid #ddd',
          padding: '20px',
          overflowY: 'auto'
        }}>
          <h3>Bookmarks</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {bookmarks.map(page => (
              <li key={page} style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => {
                    ref.current?.goToPage(page);
                    setCurrentPage(page);
                  }}
                  style={{
                    border: 'none',
                    background: page === currentPage ? '#e3f2fd' : '#fff',
                    padding: '8px',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  Page {page}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Document Comparison

```typescript
function DocumentComparison() {
  const ref1 = useRef<DocViewerRef>(null);
  const ref2 = useRef<DocViewerRef>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const syncPages = (pageNum: number) => {
    setPage(pageNum);
    ref1.current?.goToPage(pageNum);
    ref2.current?.goToPage(pageNum);
  };

  const syncSearch = (term: string) => {
    setSearchTerm(term);
    ref1.current?.setHighlight(term);
    ref2.current?.setHighlight(term);
  };

  return (
    <div>
      <div style={{ padding: '10px', display: 'flex', gap: '10px' }}>
        <input
          type="number"
          value={page}
          onChange={(e) => syncPages(Number(e.target.value))}
          placeholder="Page"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => syncSearch(e.target.value)}
          placeholder="Search both documents..."
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <h3>Document 1</h3>
          <DocViewer
            ref={ref1}
            documents={[{ uri: 'document-v1.pdf' }]}
            pdfPage={page}
            onPdfPageChange={syncPages}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h3>Document 2</h3>
          <DocViewer
            ref={ref2}
            documents={[{ uri: 'document-v2.pdf' }]}
            pdfPage={page}
            onPdfPageChange={syncPages}
          />
        </div>
      </div>
    </div>
  );
}
```

## Security Best Practices

✅ **Always Validate Document URIs**
```typescript
// Only accept http, https, blob, or data protocols
// Library validates automatically - no additional code needed
<DocViewer documents={documents} />  // Safe by default
```

✅ **HTML Content is Sanitized**
```typescript
// HTML documents are sanitized with DOMPurify
// Scripts and dangerous markup automatically removed
<DocViewer documents={[{ uri: 'document.html' }]} />
```

✅ **File Names are Sanitized**
```typescript
// Filenames are validated and unsafe characters removed
const documents = [{
  uri: 'file.pdf',
  fileName: 'my-document.pdf'  // Automatically sanitized
}];
```

✅ **Use Strong Content Security Policy (CSP)**
```html
<!-- In your HTML -->
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self'; object-src 'none';" />
```

---

**For more information:**
- [Text Highlighting API](./HIGHLIGHT_FEATURE.md)
- [Page Navigation API](./PDF_NAVIGATION_API.md)
- [Security Improvements](./IMPROVEMENTS_SUMMARY.md)
