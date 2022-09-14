import { ReactComponent as Company } from '../assets/company.svg';
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

      <Company className="my-16 w-[200px] h-[200px]" />

      <div className="flex gap-8">
        <button
          onClick={() => navigate('/candidates')}
          className="btn btn-primary btn-outline"
        >
          Find talent
        </button>
        <button
          onClick={() => navigate('/profile/new')}
          className="btn btn-secondary btn-outline"
        >
          Find job
        </button>
      </div>
    </div>
  );
};

export default Welcome;
