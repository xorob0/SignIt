import {useEffect, useState} from 'react';
import Link from 'next/link';
import {DataGrid} from 'tubular-react';
import {ColumnModel} from 'tubular-common';
import {ToolbarOptions} from 'tubular-react';
import firebase from '../utils/firebase';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import {Input, Button} from '@material-ui/core';
import {Column, CenteredModal, ModalChild, Row} from '../components/dumbs';

const firestore = firebase.firestore();

const columns = [
  new ColumnModel('firstname', {
    Name: 'firstname',
    DataType: 'STRING',
    Filterable: true,
    IsKey: true,
    Label: 'Prénom',
    Searchable: true,
    Sortable: true,
  }),
  new ColumnModel('lastname', {
    Name: 'lastname',
    DataType: 'STRING',
    Filterable: true,
    IsKey: true,
    Label: 'Nom',
    Searchable: true,
    Sortable: true,
  }),
  new ColumnModel('email'),
  new ColumnModel('id', {
    Name: 'id',
    IsKey: true,
    Visible: false,
  }),
];

const Index = () => {
  const [volonteers, setVolonteers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedVolonteer, setSelectedVolonteer] = useState({
    lastname: '',
    firstname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    date: '',
    role: '',
    schedule: '',
    hours: '',
  });

  useEffect(
    () =>
      firestore.collection('volonteers').onSnapshot(querySnapshot => {
        let contractsFromFirestore = [];
        querySnapshot.forEach(doc => {
          contractsFromFirestore = [
            ...contractsFromFirestore,
            {...doc.data(), id: doc.id},
          ];
        });
        setVolonteers(contractsFromFirestore);
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

  const editVolonteer = id => {
    const volonteer = volonteers.find(volonteer => volonteer.id === id);
    setSelectedVolonteer(volonteer);
    setModalIsOpen(true);
  };

  const addToFirebase = () => {
    firestore.collection('volonteers').add(selectedVolonteer);
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
        dataSource={volonteers}
        gridName="Liste des bénévoles"
        onError="Erreur de mise a jour des bénévoles"
        onRowClick={e => editVolonteer(e.id)}
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
              value={selectedVolonteer.lastname}
              onChange={e =>
                setSelectedVolonteer(s => ({...s, lastname: e.target.value}))
              }
              placeholder="Nom"
            />
            <Input
              value={selectedVolonteer.firstname}
              onChange={e =>
                setSelectedVolonteer(s => ({...s, firstname: e.target.value}))
              }
              placeholder="Prénom"
            />
            <Input
              value={selectedVolonteer.email}
              onChange={e =>
                setSelectedVolonteer(s => ({...s, email: e.target.value}))
              }
              placeholder="Email"
            />
            <Input
              value={selectedVolonteer.phone}
              onChange={e =>
                setSelectedVolonteer(s => ({...s, phone: e.target.value}))
              }
              placeholder="Numéro de téléphone"
            />
            <Input
              value={selectedVolonteer.address}
              onChange={e =>
                setSelectedVolonteer(s => ({...s, address: e.target.value}))
              }
              placeholder="Adresse"
            />
            <Input
              value={selectedVolonteer.city}
              onChange={e =>
                setSelectedVolonteer(s => ({...s, city: e.target.value}))
              }
              placeholder="Localité"
            />
            <Input
              value={selectedVolonteer.zip}
              onChange={e =>
                setSelectedVolonteer(s => ({...s, zip: e.target.value}))
              }
              placeholder="Code postal"
            />
            <Input
              value={selectedVolonteer.date}
              onChange={e =>
                setSelectedVolonteer(s => ({...s, date: e.target.value}))
              }
              placeholder="Date du contrat"
            />
            <Input
              value={selectedVolonteer.role}
              onChange={e =>
                setSelectedVolonteer(s => ({...s, role: e.target.value}))
              }
              placeholder="Fonction"
            />
            <Input
              value={selectedVolonteer.schedule}
              onChange={e =>
                setSelectedVolonteer(s => ({...s, schedule: e.target.value}))
              }
              placeholder="Fonction"
            />
            <Input
              value={selectedVolonteer.hours}
              onChange={e =>
                setSelectedVolonteer(s => ({...s, hours: e.target.value}))
              }
              placeholder="Temps total"
            />
            <Button onClick={addToFirebase}>Ajouter</Button>
          </Column>
        </ModalChild>
      </CenteredModal>
    </>
  );
};

export default Index;
