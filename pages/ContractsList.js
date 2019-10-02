import {useEffect, useState} from 'react';
import Link from 'next/link';
import {DataGrid} from 'tubular-react';
import {ColumnModel} from 'tubular-common';
import {ToolbarOptions} from 'tubular-react';
import firestore from '../utils/firestore';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import {Modal} from '@material-ui/core';
import styled from 'styled-components';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import {
  ImageSideButton,
  Block,
  addNewBlock,
  createEditorState,
  Editor,
  BLOCK_BUTTONS,
} from 'medium-draft';
import mediumDraftExporter from 'medium-draft/lib/exporter';
import 'medium-draft/lib/index.css';

const blockButtons = [
  {
    label: 'H1',
    style: 'header-one',
    icon: 'header',
    description: 'Heading 1',
  },
  {
    label: 'H2',
    style: 'header-two',
    icon: 'header',
    description: 'Heading 2',
  },
].concat(BLOCK_BUTTONS);

const toolbarConfig = {
  block: ['unordered-list-item', 'header-one', 'header-three'],
  inline: ['BOLD', 'UNDERLINE', 'hyperlink'],
};

const StyledInput = styled.input.attrs({type: 'text'})`
  background: rgba(100, 100, 100, 0.24);
  border-radius: 20px;
  border: 0px;
  height: 35px;
  padding: 0px 7px;
  min-width: 300px;
  color: white;
  margin: 10px;
  ::placeholder {
    color: #eee;
  }
`;

export const TextInput = ({
  field: {value, name},
  form: {setFieldValue},
  placeholder,
}) => (
  <StyledInput
    onChange={e => setFieldValue(name, e.target.value)}
    value={value}
    placeholder={placeholder}
  />
);

export const StartButton = styled.button`
  background: #ffc613;
  box-shadow: 8px 0px 20px rgba(166, 173, 201, 0.16),
    0px 4px 4px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  color: white;
  border: 0px;
  padding: 10px;
  width: 100px;
  margin: 10px;
`;

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

const ModalChild = styled(Column)`
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

const CenteredModal = styled(Modal)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const columns = [
  new ColumnModel('name', {
    Name: 'name',
    DataType: 'STRING',
    Filterable: true,
    IsKey: true,
    Label: 'Nom du contrat',
    Searchable: true,
    Sortable: true,
  }),
  new ColumnModel('email'),
];

const Index = () => {
  const [contracts, setContracts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editorState, setEditorState] = useState(createEditorState());
  useEffect(
    () =>
      firestore.collection('contracts').onSnapshot(querySnapshot => {
        let contractsFromFirestore = [];
        querySnapshot.forEach(doc => {
          contractsFromFirestore = [...contractsFromFirestore, doc.data()];
        });
        setContracts(contractsFromFirestore);
      }),
    [],
  );

  const toolbarButton = new ToolbarOptions({
    customItems: (
      <IconButton color="default" onClick={() => setModalIsOpen(true)}>
        <AddIcon />
      </IconButton>
    ),
  });

  const handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  return (
    <>
      <div>
        <p>Hello Next.js</p>
        <Link href="/ContractsList">
          <a>Liste de contrats</a>
        </Link>

        <Link href="/VolonteersList">
          <a>Liste de bénévoles</a>
        </Link>
      </div>

      <DataGrid
        columns={columns}
        dataSource={contracts}
        gridName="Liste des contrats"
        onError="Erreur de mise a jour des contrats"
        onRowClick={e => console.log('clicked on contrats', e)}
        toolbarOptions={toolbarButton}
      />
      <CenteredModal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      >
        <ModalChild>
          <Formik
            initialValues={{name: ''}}
            onSubmit={({name}) => {
              firestore
                .collection('contracts')
                .add({
                  name,
                  html: mediumDraftExporter(editorState.getCurrentContent()),
                })
                .catch(error => {
                  console.error('Error adding document: ', error);
                });
            }}
            render={() => (
              <Column as={Form} padding={20}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: mediumDraftExporter(
                      editorState.getCurrentContent(),
                    ),
                  }}
                />
                <Field
                  component={TextInput}
                  name="name"
                  placeholder="Nom du contrat"
                />
                <ErrorMessage name="name" />
                <Editor
                  editorState={editorState}
                  onChange={setEditorState}
                  blockButtons={blockButtons}
                  toolbarConfig={toolbarConfig}
                />
                <StartButton type="submit">Ajouter</StartButton>
              </Column>
            )}
          />
        </ModalChild>
      </CenteredModal>
    </>
  );
};

export default Index;
