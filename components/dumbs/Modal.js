import styled from 'styled-components';
import {Column} from './Wrappers';
import {Modal} from '@material-ui/core';

export const ModalChild = styled(Column)`
  background: white;
  border-radius: 30px;
  max-width: 350px;
  min-height: 600px;
  max-height: 600px !important;
  justify-content: center;
  flex-grow: 1;
  margin: 20px;
  padding: 20px;
`;

export const CenteredModal = styled(Modal)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
