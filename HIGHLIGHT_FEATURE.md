# Text Highlight Feature

A powerful text search and highlighting feature for react-doc-viewer that supports case-insensitive and whitespace-insensitive matching with keyboard navigation.

## Features

- **Case-Insensitive Search**: Find text regardless of letter case
- **Whitespace-Insensitive**: Match text even with different whitespace
- **Arrow Key Navigation**: Use Up/Down arrows to navigate between matches
- **Keyboard Shortcuts**:
  - `↓` - Next match
  - `↑` - Previous match
  - `Esc` - Clear highlights
- **Smooth Scrolling**: Automatically scrolls to active highlight

## API

### setHighlight(searchText: string)

Set text to highlight in the current document.

```tsx
const docViewerRef = useRef<DocViewerRef>(null);

<button onClick={() => docViewerRef.current?.setHighlight('search term')}>
  Search
</button>
```

### nextHighlight()

Move to the next occurrence of the highlighted text.

```tsx
<button onClick={() => docViewerRef.current?.nextHighlight()}>
  Next Match
</button>
```

### prevHighlight()

Move to the previous occurrence of the highlighted text.

```tsx
<button onClick={() => docViewerRef.current?.prevHighlight()}>
  Previous Match
</button>
```

### clearHighlight()

Clear all highlights and reset the search.

```tsx
<button onClick={() => docViewerRef.current?.clearHighlight()}>
  Clear Search
</button>
```

## Example Usage

```tsx
import React, { useRef, useState } from 'react';
import DocViewer, { DocViewerRef, IDocument } from '@cyntler/react-doc-viewer';

const MyComponent = () => {
  const docViewerRef = useRef<DocViewerRef>(null);
  const [searchText, setSearchText] = useState('');

  const documents: IDocument[] = [
    { uri: 'path/to/document.txt' }
  ];

  const handleSearch = () => {
    if (searchText.trim()) {
      docViewerRef.current?.setHighlight(searchText);
    }
  };

  const handleClear = () => {
    docViewerRef.current?.clearHighlight();
    setSearchText('');
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search text..."
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => docViewerRef.current?.prevHighlight()}>↑</button>
        <button onClick={() => docViewerRef.current?.nextHighlight()}>↓</button>
        <button onClick={handleClear}>Clear</button>
      </div>

      <DocViewer
        ref={docViewerRef}
        documents={documents}
      />
    </div>
  );
};

export default MyComponent;
```

## Keyboard Navigation

The highlighting feature supports arrow keys for navigation. Focus on the document viewer and use:

- **Arrow Down**: Navigate to next match
- **Arrow Up**: Navigate to previous match
- **Escape**: Clear all highlights

## Highlighting Behavior

### Case-Insensitive Matching

Searches find text regardless of case:

```
Search: "hello"
Matches: "Hello", "HELLO", "hello", "HeLLo"
```

### Whitespace-Insensitive Matching

Searches ignore whitespace differences:

```
Search: "hello world"
Matches: "hello world", "helloworld", "hello  world" (multiple spaces)
```

## Styling

The highlighting applies these CSS classes:

- `.react-doc-viewer-highlight` - Non-active matches (yellow background)
- `.react-doc-viewer-highlight-active` - Current match (orange background with shadow)

To customize the styling, override the CSS classes in your own styles:

```css
.react-doc-viewer-highlight {
  background-color: rgba(255, 240, 0, 0.4);
}

.react-doc-viewer-highlight-active {
  background-color: rgba(255, 165, 0, 0.7);
  box-shadow: 0 0 4px rgba(255, 165, 0, 0.8);
}
```

## Limitations

- Currently works best with text-based renderers (TXT, PDF with text layer)
- Image and binary renderers have limited highlighting support
- Highlighting is cleared when navigating to a different document

## Technical Details

The highlighting feature uses:

- **Text Normalization**: Converts text to lowercase and normalizes whitespace for matching
- **DOM Manipulation**: Wraps matches in `<span>` elements with CSS classes
- **State Management**: Tracks search text, match count, and current match index
- **Keyboard Event Listeners**: Automatically attached when highlighting is active
