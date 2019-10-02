import Link from "next/link";
import { DataGrid } from "tubular-react";
import { ColumnModel } from "tubular-common";

const columns = [
  new ColumnModel("ContractName", {
    Name: "ContractName",
    DataType: "STRING",
    Filterable: true,
    IsKey: true,
    Label: "Nom du contrat",
    Searchable: true,
    Sortable: true
  })
  // new ColumnModel("NumberOfVolonteers"),
  // new ColumnModel("NumberOfVolonteersNotSigned")
];

const dataSource = [
  {
    ContractName: "test",
    NumberOfVolonteers: "4",
    NumberOfVolonteersNotSigned: "5"
  }
];

const Index = () => (
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
      dataSource={dataSource}
      gridName="Liste des contracts"
      onError="Erreur de mise a jour des contrats"
      onRowClick={e => console.log("clicked on row", e)}
      itemsPerPage={100}
    />
  </>
);

export default Index;
