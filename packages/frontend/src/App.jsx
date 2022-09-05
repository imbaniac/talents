import Navbar from './components/Navbar';

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="mt-32 flex flex-col items-center">
        <h1 className="text-4xl font-bold">Welcome to Talents</h1>
        <p className="text-lg mt-4 text-center">
          If you expect people to be looking for your project and your job
          openings, <br />
          you can wait for a long time.
        </p>
        <button className="btn btn-primary mt-8 w-32">Start</button>
      </div>
    </div>
  );
};

export default App;
