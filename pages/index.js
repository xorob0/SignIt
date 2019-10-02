import Link from "next/link";

const Index = () => (
  <div>
    <p>Hello Next.js</p>
    <Link href="/ContractsList">
      <a>Liste de contrats</a>
    </Link>

    <Link href="/VolonteersList">
      <a>Liste de bénévoles</a>
    </Link>
  </div>
);

export default Index;
