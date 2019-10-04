import styled from 'styled-components';
import {Column} from './Wrappers';
import {Modal} from '@material-ui/core';

export const ModalChild = styled(Column)`
  background: white;
  justify-content: center;
  flex-grow: 1;
  margin: 20px;
  padding: 20px;
  overflow-x: scroll;
  max-width: 90vw;
  max-height: 90vh;
`;

export const CenteredModal = styled(Modal)`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: scroll;
`;
