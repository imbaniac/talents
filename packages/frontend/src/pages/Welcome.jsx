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
      <h1 className="text-4xl font-bold text-center">
        Welcome to Talents Ninja
      </h1>
      <p className="text-lg mt-4 text-center">
        Tired of going through the same interviews? Be prejudiced before an
        interview because of age, gender, skin color, or{' '}
        <a
          href="https://www.raconteur.net/hr/diversity-inclusion/ethnic-name-bias/"
          target="_blank"
          rel="noreferrer"
          className="link"
        >
          name
        </a>
        ?
      </p>
      <p className="text-lg mt-4 text-center">
        Join our decentralized impersonal talent pool and start getting job
        offers from top Web3 companies.
      </p>

      <Company className="my-16 w-[200px] h-[200px]" />

      {!address ? (
        <button onClick={openConnectModal} className="btn btn-primary">
          Sign in to start
        </button>
      ) : (
        <div className="flex gap-8">
          <button
            onClick={() => navigate('/candidates')}
            className="btn btn-primary"
          >
            Find talent
          </button>
          <button
            onClick={() => navigate('/profile/new')}
            className="btn btn-secondary"
          >
            Find job
          </button>
        </div>
      )}
    </div>
  );
};

export default Welcome;
