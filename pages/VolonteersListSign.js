import {useEffect, useState, useRef} from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {DataGrid} from 'tubular-react';
import {ColumnModel} from 'tubular-common';
import firebase from '../utils/firebase';
import SignaturePad from 'react-signature-pad-wrapper';
import {Column, CenteredModal, ModalChild, Row} from '../components/dumbs';

const firestore = firebase.firestore();
const storage = firebase.storage();

const columnsContracts = [
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

const ChooseContract = ({setSelectedContract}) => {
  const [contracts, setContracts] = useState([]);

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

  return (
    <>
      <DataGrid
        columns={columnsContracts}
        dataSource={contracts}
        gridName="Liste des contrats"
        onError="Erreur de mise a jour des contrats"
        onRowClick={e =>
          setSelectedContract({...contracts.find(c => c.id === e.id), id: e.id})
        }
      />
    </>
  );
};

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
  const [selectedContract, setSelectedContract] = useState();
  const SignatureRef = useRef();

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

  const signFor = id => {
    const volonteer = volonteers.find(volonteer => volonteer.id === id);
    setSelectedVolonteer(volonteer);
    setModalIsOpen(true);
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
        onRowClick={e => signFor(e.id)}
      />
      <CenteredModal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false);
          setSelectedVolonteer(undefined);
          setSelectedContract(undefined);
        }}
      >
        <ModalChild>
          {selectedContract ? (
            <Column>
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedContract.html
                    .replace('${lastname}', selectedVolonteer.lastname)
                    .replace('${firstname}', selectedVolonteer.firstname),
                }}
              ></div>
              <SignaturePad
                style={{minHeight: 100}}
                options={{
                  minWidth: 5,
                  maxWidth: 10,
                  penColor: 'rgb(66, 133, 244)',
                }}
                ref={ref => (SignatureRef.current = ref)}
              />
              <button
                onClick={() => {
                  let jsPDF = require('jspdf');
                  let doc = new jsPDF();
                  doc.fromHTML(
                    selectedContract.html
                      .replace('${lastname}', selectedVolonteer.lastname)
                      .replace('${firstname}', selectedVolonteer.firstname),
                  );

                  doc.addImage(
                    SignatureRef.current && SignatureRef.current.toDataURL(),
                    'JPEG',
                    15,
                    40,
                    180,
                    160,
                  );

                  // doc.save(
                  //   `${selectedVolonteer.name}-${selectedVolonteer.firstname}_${selectedContract.name}.pdf`,
                  // );
                  //
                  firestore
                    .collection('volonteers')
                    .doc(selectedVolonteer.id)
                    .update({
                      signature:
                        SignatureRef.current &&
                        SignatureRef.current.toDataURL(),
                    });

                  storage
                    .ref()
                    .child(
                      `${selectedVolonteer.lastname}-${selectedVolonteer.firstname}_${selectedContract.name}.pdf`,
                    )
                    .putString(doc.output('datauri'), 'data_url');

                  setModalIsOpen(false);
                  setSelectedContract(undefined);
                  setSelectedVolonteer(undefined);
                }}
              >
                finir
              </button>
            </Column>
          ) : (
            <ChooseContract setSelectedContract={setSelectedContract} />
          )}
        </ModalChild>
      </CenteredModal>
    </>
  );
};

export default Index;
