import { ArrowUpRight } from 'lucide-react';
import Button from './Button';
import { useToast } from './Toast';

// Opens the event's registration link. If there isn't one yet (registerUrl: ''),
// clicking shows a "coming soon" message instead.
export default function RegisterButton({ url, children = 'Register', ...rest }) {
  const toast = useToast();
  const label = <>{children} <ArrowUpRight aria-hidden="true" /></>;

  if (url && url !== '#') return <Button href={url} {...rest}>{label}</Button>;
  return (
    <Button onClick={() => toast('Registrations are coming soon. Stay tuned!')} {...rest}>
      {label}
    </Button>
  );
}
