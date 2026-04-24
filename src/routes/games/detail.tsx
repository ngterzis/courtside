import { useParams } from 'react-router-dom';
import { Placeholder } from '../_placeholder';

export default function GameDetailRoute() {
  const { gameId } = useParams();
  return <Placeholder title={`Game ${gameId}`} note="Full box score + coach note." />;
}
