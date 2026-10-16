import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <>
      <PageHeader label="// 404 — Not found" title="lost?" subtitle="This page doesn't exist — maybe it's still compiling." />
      <section className="py-20">
        <div className="container-site">
          <Button to="/">Back to home</Button>
        </div>
      </section>
    </>
  );
}
