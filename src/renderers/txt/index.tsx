import React, { ReactNode, useRef } from "react";
import styled from "styled-components";
import { DocRenderer } from "../..";
import { textFileLoader } from "../../utils/fileLoaders";
import { useDocumentHighlight } from "../../hooks/useHighlight";

const TXTRenderer: DocRenderer = ({ mainState: { currentDocument } }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Apply highlighting to text content
  useDocumentHighlight(containerRef, true);

  return (
    <Container ref={containerRef} id="txt-renderer">
      {currentDocument?.fileData as ReactNode}
    </Container>
  );
};

export default TXTRenderer;

TXTRenderer.fileTypes = ["txt", "text/plain"];
TXTRenderer.weight = 0;
TXTRenderer.fileLoader = textFileLoader;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 30px;
`;
