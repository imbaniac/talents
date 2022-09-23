import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'urql';

import { useAccount } from 'wagmi';
import { useStore } from './store';
import Footer from './components/_molecules/Footer';
import Navbar from './components/Navbar';

const ProfileQuery = `
  query($address: String!) {
    profiles(where:{owner_in:[$address]}) {
      owner {
        id
      }
      identifier
      createdAt

      category
      position
      skills
      experience
      english
      employmentTypes
      details
      country
    }
  }
`;

const App = () => {
  const navigate = useNavigate();

  const { address } = useAccount();
  const setProfile = useStore((state) => state.setProfile);

  const [result] = useQuery({
    query: ProfileQuery,
    pause: !address,
    variables: { address },
  });

  const myProfile = result.data?.profiles[0];

  useEffect(() => {
    setProfile(myProfile);
  }, [myProfile, setProfile]);

  useEffect(() => {
    if (!address) {
      navigate('/');
    }
  }, [address]);

  return (
    <div className="flex flex-col h-screen justify-between">
      <Navbar hasProfile={!!myProfile} />
      <div className="mb-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default App;
