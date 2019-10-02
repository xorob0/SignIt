import Link from "next/link";
import { DataGrid } from "tubular-react";
import { ColumnModel } from "tubular-common";

const columns = [
  new ColumnModel("VolonteerName", {
    Name: "VolonteerName",
    DataType: "STRING",
    Filterable: true,
    IsKey: true,
    Label: "Nom du bénévole",
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
      gridName="Liste des bénévoles"
      onError="Erreur de mise a jour des bénévoles"
      onRowClick={e => console.log("clicked on bénévole", e)}
      itemsPerPage={100}
    />
  </>
);

export default Index;
