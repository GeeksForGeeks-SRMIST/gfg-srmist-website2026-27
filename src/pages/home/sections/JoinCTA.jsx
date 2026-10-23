import { useOutletContext } from 'react-router';
import Button from '../../../components/ui/Button';
import ComingSoon from './ComingSoon';
import Reveal from '../../../components/ui/Reveal';

// Raushan (#3): final "Join us" section.
// onJoin opens the same Join dialog as the navbar's Join Now button.
export default function JoinCTA() {
  const { onJoin } = useOutletContext();
  return (
    <Reveal className="mx-3 my-4 overflow-x-hidden rounded-4xl glass bg-[radial-gradient(60%_120%_at_100%_50%,rgba(70,196,107,.18),transparent_70%)] sm:mx-4 md:mx-6 lg:mx-0">
      <ComingSoon id="final-cta" label="// 06 — Join us ">
        <Button
          onClick={onJoin}
          aria-haspopup="dialog"
          className="w-full glass bg-[radial-gradient(60%_120%_at_100%_50%,rgba(70,196,107,.18),transparent_70%)] sm:w-auto"
        >
          Join now
        </Button>
      </ComingSoon>
    </Reveal>
  );
}
