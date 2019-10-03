import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: ${({justify}) => justify || 'space-around'};
  align-items: center;
  flex-grow: ${({growPriority}) => growPriority || 'unset'};
  padding: ${({padding}) => (padding ? `${padding}px` : 'unset')};
  margin: ${({margin}) => (margin ? `${margin}px` : 'unset')};
  margin-top: ${({marginTop}) => (marginTop ? `${marginTop}px` : 'unset')};
  padding-top: ${({paddingTop}) => (paddingTop ? `${paddingTop}px` : 'unset')};
  overflow-y: ${({overflowScroll}) => (overflowScroll ? 'scroll' : 'unset')};
  max-width: ${({maxWidth}) => (maxWidth ? `${maxWidth}px` : 'unset')};
  max-height: ${({maxHeight}) => (maxHeight ? `${maxHeight}px` : 'unset')};
  min-height: ${({minHeight}) => minHeight || 'unset'};
  width: ${({width}) => width || 'unset'};
  height: ${({height}) => height || 'unset'};
  position: ${({absolute}) => (absolute ? 'absolute' : 'unset')};

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const Row = styled(Wrapper)`
  flex-direction: row;
`;

export const Column = styled(Wrapper)`
  flex-direction: column;
  justify-content: ${({justify}) => justify || 'unset'};
`;

export const Delimiter = styled(Wrapper)`
  overflow: hidden;
  justify-content: flex-start;
  flex-direction: column;
  flex-grow: 1;
`;
