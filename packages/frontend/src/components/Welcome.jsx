import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <div className="mt-32 flex flex-col items-center">
      <h1 className="text-4xl font-bold">Welcome to Talents</h1>
      <p className="text-lg mt-4 text-center">
        If you expect people to be looking for your project and your job
        openings, <br />
        you can wait for a long time.
      </p>
      <button
        onClick={() => navigate('/profile/new')}
        className="mt-8 btn btn-primary"
      >
        Create profile
      </button>
    </div>
  );
};

export default Welcome;
