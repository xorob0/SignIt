import Link from 'next/link';
import {Row} from '../components/dumbs';

export default () => (
  <Row>
    <Link href="/ContractsList">
      <a>Liste de contrats</a>
    </Link>

    <Link href="/VolonteersList">
      <a>Liste de bénévoles</a>
    </Link>
  </Row>
);
