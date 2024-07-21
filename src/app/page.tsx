import Welcome from '@/components/Welcome';

function Home() {
  return (
    <main className="px-12">
      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-2">
          <Welcome />
        </div>
      </div>
    </main>
  );
}

export const revalidate = 30;

export default Home;
