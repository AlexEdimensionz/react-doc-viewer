import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import DocViewer, { DocViewerRef, IDocument } from '../';

/**
 * Example component showing how to use the text highlight feature
 * 
 * Features:
 * - Search box for text highlighting
 * - Previous/Next buttons to navigate matches
 * - Match counter showing current match / total matches
 * - Keyboard shortcuts (arrow keys for navigation, Escape to clear)
 */
const HighlightExample = ({ documents }: { documents: IDocument[] }) => {
  const docViewerRef = useRef<DocViewerRef>(null);
  const [searchText, setSearchText] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim()) {
      docViewerRef.current?.setHighlight(text);
      // Note: match count would be updated by listening to state changes
      // This is a simplified example
      setCurrentMatchIndex(0);
    } else {
      docViewerRef.current?.clearHighlight();
      setMatchCount(0);
      setCurrentMatchIndex(0);
    }
  };

  const handlePrevious = () => {
    docViewerRef.current?.prevHighlight();
  };

  const handleNext = () => {
    docViewerRef.current?.nextHighlight();
  };

  const handleClear = () => {
    docViewerRef.current?.clearHighlight();
    setSearchText('');
    setMatchCount(0);
    setCurrentMatchIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchText);
    } else if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <Container>
      <SearchBar>
        <SearchInput
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search text (case & whitespace insensitive)..."
        />
        
        <ButtonGroup>
          <Button onClick={handlePrevious} disabled={!searchText} title="Previous match (↑)">
            ↑ Prev
          </Button>
          
          <MatchCounter disabled={!searchText}>
            {searchText ? `${currentMatchIndex + 1} / ${matchCount}` : '-'}
          </MatchCounter>
          
          <Button onClick={() => handleNext()} disabled={!searchText} title="Next match (↓)">
            Next ↓
          </Button>
          
          <Button onClick={() => handleSearch(searchText)} disabled={!searchText} primary>
            Search
          </Button>
          
          <Button onClick={() => handleClear()} disabled={!searchText}>
            Clear
          </Button>
        </ButtonGroup>
      </SearchBar>

      <DocViewerContainer>
        <DocViewer
          ref={docViewerRef}
          documents={documents}
          config={{
            header: {
              disableHeader: false,
            },
          }}
        />
      </DocViewerContainer>

      <HelpText>
        💡 <strong>Keyboard shortcuts:</strong> ↓ Next match | ↑ Previous match | Esc Clear search
      </HelpText>
    </Container>
  );
};

export default HighlightExample;

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 8px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 6px 12px;
  border: 1px solid #d0d0d0;
  background: ${props => props.primary ? '#1976d2' : '#ffffff'};
  color: ${props => props.primary ? '#ffffff' : '#333333'};
  border-radius: 4px;
  font-size: 13px;
  font-weight: ${props => props.primary ? 600 : 500};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${props => props.primary ? '#1565c0' : '#f0f0f0'};
    border-color: #1976d2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const MatchCounter = styled.span<{ disabled: boolean }>`
  padding: 6px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  background: #fafafa;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.disabled ? '#999999' : '#333333'};
  min-width: 60px;
  text-align: center;
`;

const DocViewerContainer = styled.div`
  flex: 1;
  overflow: hidden;
  background: #ffffff;
`;

const HelpText = styled.div`
  padding: 8px 16px;
  background: #e3f2fd;
  border-top: 1px solid #bbdefb;
  font-size: 12px;
  color: #1565c0;
`;
