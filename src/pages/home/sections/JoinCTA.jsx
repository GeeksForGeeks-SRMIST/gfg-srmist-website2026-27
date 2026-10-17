import { useOutletContext } from 'react-router';
import Button from '../../../components/ui/Button';
import ComingSoon from './ComingSoon';

// Raushan (#3): final "Join us" section.
// onJoin opens the same Join dialog as the navbar's Join Now button.
export default function JoinCTA() {
  const { onJoin } = useOutletContext();
  return (
    <ComingSoon id="final-cta" label="// 06 — Join us">
      <Button onClick={onJoin} aria-haspopup="dialog">Join now</Button>
    </ComingSoon>
  );
}
