# Text Highlight - Quick Reference

## Installation & Setup

Already integrated! No additional install needed.

## Basic Usage

```typescript
import { useRef } from 'react';
import DocViewer, { DocViewerRef } from '@cyntler/react-doc-viewer';

const App = () => {
  const ref = useRef<DocViewerRef>(null);

  return (
    <>
      <input onChange={(e) => ref.current?.setHighlight(e.target.value)} />
      <DocViewer ref={ref} documents={docs} />
    </>
  );
};
```

## API Reference

### `setHighlight(searchText: string)`
Start highlighting text in the document.
```typescript
ref.current?.setHighlight('hello');     // Highlight "hello"
ref.current?.setHighlight('');          // Clear highlights
```

### `nextHighlight()`
Jump to next match (arrow down ↓).
```typescript
ref.current?.nextHighlight();
```

### `prevHighlight()`
Jump to previous match (arrow up ↑).
```typescript
ref.current?.prevHighlight();
```

### `clearHighlight()`
Remove all highlights (escape Esc).
```typescript
ref.current?.clearHighlight();
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↓` | Next match |
| `↑` | Previous match |
| `Esc` | Clear highlights |

## Matching Rules

### Case-Insensitive
```
Search: "hello"
✓ Matches: Hello, HELLO, hELLo
```

### Whitespace-Insensitive
```
Search: "hello world"
✓ Matches: hello world, helloworld, hello  world
```

## Styling

Override CSS classes to customize appearance:

```css
/* All matches */
.react-doc-viewer-highlight {
  background-color: yellow;
}

/* Current match */
.react-doc-viewer-highlight-active {
  background-color: orange;
  font-weight: bold;
}
```

## Complete Example

```typescript
import React, { useRef, useState } from 'react';
import DocViewer, { DocViewerRef, IDocument } from '@cyntler/react-doc-viewer';

export default function App() {
  const ref = useRef<DocViewerRef>(null);
  const [search, setSearch] = useState('');

  const docs: IDocument[] = [
    { uri: 'document.txt' }
  ];

  return (
    <div>
      <div style={{ padding: '10px', display: 'flex', gap: '5px' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') ref.current?.setHighlight(search);
            if (e.key === 'Escape') ref.current?.clearHighlight();
          }}
          placeholder="Type to search..."
        />
        <button onClick={() => ref.current?.setHighlight(search)}>
          Search
        </button>
        <button onClick={() => ref.current?.prevHighlight()}>↑</button>
        <button onClick={() => ref.current?.nextHighlight()}>↓</button>
        <button onClick={() => ref.current?.clearHighlight()}>✕</button>
      </div>
      
      <DocViewer ref={ref} documents={docs} />
    </div>
  );
}
```

## Hooks (Advanced)

### `useDocumentHighlight()`
Manually apply highlighting to a DOM element.

```typescript
import { useDocumentHighlight } from '@cyntler/react-doc-viewer';

function MyComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { matchCount, currentIndex } = useDocumentHighlight(containerRef);
  
  return (
    <div ref={containerRef}>
      {/* Content here gets highlighted */}
    </div>
  );
}
```

### `useHighlightKeyboardNavigation()`
Enable arrow key navigation (auto-enabled by default).

```typescript
import { useHighlightKeyboardNavigation } from '@cyntler/react-doc-viewer';

function MyComponent() {
  useHighlightKeyboardNavigation(); // Enable global shortcuts
  
  return <DocViewer ... />;
}
```

## Utilities (Advanced)

If you need lower-level control:

```typescript
import {
  normalizeText,
  findTextMatches,
  highlightTextInDOM,
  clearHighlightsInDOM,
  scrollToHighlight
} from '@cyntler/react-doc-viewer';

// Find all matches
const matches = findTextMatches(content, 'search');
// -> [{ index: 0, text: 'search', position: 45 }, ...]

// Apply highlights
const count = highlightTextInDOM(element, 'search', 0);

// Clear highlights
clearHighlightsInDOM(element);

// Scroll to active
scrollToHighlight(element);
```

## Limitations

- Works best with text-based renderers (TXT, PDF with text)
- Image/binary renderers have limited support
- Large documents may have performance impact
- Highlights clear when switching documents

## Browser Support

✓ Chrome/Edge 90+
✓ Firefox 88+
✓ Safari 14+
✓ All modern browsers supporting ES6

## Performance Tips

1. For very large documents, limit search results
2. Use debouncing for real-time search:
   ```typescript
   const debounce = (fn, delay) => {
     let timer;
     return (...args) => {
       clearTimeout(timer);
       timer = setTimeout(() => fn(...args), delay);
     };
   };
   
   const debouncedSearch = debounce(
     (text) => ref.current?.setHighlight(text),
     500
   );
   ```

## Troubleshooting

**Highlights not appearing?**
- Check that renderer supports highlighting (TXT works best)
- Verify CSS is loaded (global styles injected automatically)

**Keyboard shortcuts not working?**
- Focus on document viewer
- Check that no other listeners are preventing defaults

**Performance issues?**
- Reduce frequency of highlight updates
- Use debouncing for search input

---

For more details, see `HIGHLIGHT_FEATURE.md`
