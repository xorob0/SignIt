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
import SignaturePad from 'react-signature-pad-wrapper';

const TextInput = styled.input.attrs({type: 'text'})`
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

  console.log(contracts);

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
        dataSource={volonteers}
        gridName="Liste des bénévoles"
        onError="Erreur de mise a jour des bénévoles"
        onRowClick={e => signFor(e.id)}
      />
      <CenteredModal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      >
        <ModalChild>
          {selectedContract ? (
            <>
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedContract.html
                    .replace('${lastname}', selectedVolonteer.lastname)
                    .replace('${firstname}', selectedVolonteer.firstname),
                }}
              ></div>
              <SignaturePad
                options={{
                  minWidth: 5,
                  maxWidth: 10,
                  penColor: 'rgb(66, 133, 244)',
                }}
              />
            </>
          ) : (
            <ChooseContract setSelectedContract={setSelectedContract} />
          )}
        </ModalChild>
      </CenteredModal>
    </>
  );
};

export default Index;
