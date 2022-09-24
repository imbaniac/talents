import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as Company } from '../assets/company.svg';

const Welcome = () => {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const navigate = useNavigate();
  return (
    <div className="container mt-16 mx-auto max-w-2xl px-8 pb-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center">Welcome to Talents</h1>
      <p className="text-lg mt-4 text-center">
        If you expect people to be looking for your project and your job
        openings, <br />
        you can wait for a long time.
      </p>

      <Company className="my-16 w-[200px] h-[200px]" />

      {!address ? (
        <button onClick={openConnectModal} className="btn">
          Sign in to start
        </button>
      ) : (
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
      )}
    </div>
  );
};

export default Welcome;
