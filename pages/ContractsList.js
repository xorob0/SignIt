import {useEffect, useState} from 'react';
import Link from 'next/link';
import {DataGrid} from 'tubular-react';
import {ColumnModel} from 'tubular-common';
import {ToolbarOptions} from 'tubular-react';
import firebase from '../utils/firebase';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import {Input, Button} from '@material-ui/core';
import {createEditorState, Editor, BLOCK_BUTTONS} from 'medium-draft';
import mediumDraftExporter from 'medium-draft/lib/exporter';
import {convertToRaw} from 'draft-js';
import mediumDraftImporter from 'medium-draft/lib/importer';
import {Column, CenteredModal, ModalChild, Row} from '../components/dumbs';

import 'medium-draft/lib/index.css';

const firestore = firebase.firestore();

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

const columns = [
  new ColumnModel('name', {
    Name: 'name',
    DataType: 'STRING',
    Filterable: true,
    Label: 'Nom du contrat',
    Searchable: true,
    Sortable: true,
  }),
  new ColumnModel('id', {
    Name: 'id',
    IsKey: true,
    Visible: false,
  }),
];

const Index = () => {
  const [contracts, setContracts] = useState([]);
  const [editorState, setEditorState] = useState(createEditorState());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState({
    name: '',
    html: '',
  });

  useEffect(
    () =>
      firestore.collection('contracts').onSnapshot(querySnapshot => {
        let contractsFromFirestore = [];
        querySnapshot.forEach(doc => {
          contractsFromFirestore = [
            ...contractsFromFirestore,
            {...doc.data(), id: doc.id},
          ];
        });
        setContracts(contractsFromFirestore);
      }),
    [],
  );

  useEffect(
    () =>
      setSelectedContract(c => ({
        ...c,
        html: mediumDraftExporter(editorState.getCurrentContent()),
      })),

    [editorState],
  );

  useEffect(() => {
    const {id, ...data} = selectedContract;
    if (id) {
      firestore
        .collection('contracts')
        .doc(id)
        .update(data);
    }
  }, [selectedContract]);

  const toolbarButton = new ToolbarOptions({
    customItems: (
      <IconButton color="default" onClick={() => setModalIsOpen(true)}>
        <AddIcon />
      </IconButton>
    ),
  });

  const editContract = id => {
    const contract = contracts.find(contract => contract.id === id);
    setSelectedContract(contract);
    setEditorState(
      createEditorState(convertToRaw(mediumDraftImporter(contract.html))),
    );
    setModalIsOpen(true);
  };

  const addToFirebase = () => {
    if (selectedContract.name.length) {
      firestore.collection('contracts').add(selectedContract);
    }
  };

  return (
    <>
      <Row>
        <Link href="/ContractsList">
          <a>Liste de contrats</a>
        </Link>

        <Link href="/VolonteersList">
          <a>Liste de bénévoles</a>
        </Link>
      </Row>

      <DataGrid
        columns={columns}
        dataSource={contracts}
        gridName="Liste des contrats"
        onError="Erreur de mise a jour des contrats"
        onRowClick={e => editContract(e.id)}
        toolbarOptions={toolbarButton}
      />
      <CenteredModal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      >
        <ModalChild>
          <Column padding={20}>
            <Input
              placeholder="Nom du contrat"
              onChange={e =>
                setSelectedContract(c => ({...c, name: e.target.value}))
              }
              value={selectedContract.name}
            />
            <Editor
              editorState={editorState}
              onChange={setEditorState}
              blockButtons={blockButtons}
              toolbarConfig={toolbarConfig}
            />
            <Button onClick={addToFirebase}>Ajouter</Button>
          </Column>
        </ModalChild>
      </CenteredModal>
    </>
  );
};

export default Index;
