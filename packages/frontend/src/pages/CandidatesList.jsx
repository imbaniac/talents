import { Link } from 'react-router-dom';
import { useQuery } from 'urql';

import {
  displayCountry,
  displayEnglish,
  displayExperience,
} from '../utils/helpers';

const ProfilesQuery = `
  query {
    profiles (orderBy:identifier, orderDirection: desc) {
    	id
      identifier
    	createdAt
    
      position
      country
      skills
      experience
      english
      details
    }
  }
`;

const CandidatesList = () => {
  const [result] = useQuery({
    query: ProfilesQuery,
  });

  const profiles = result.data?.profiles || [];

  return (
    <div className="container mt-16 mx-auto max-w-2xl px-8 pb-8">
      <h1 className="text-3xl font-bold">
        Candidates{' '}
        <span className="text-gray-400 text-lg">
          {profiles[0]?.identifier || '0'}
        </span>
      </h1>
      {profiles.map((profile) => (
        <>
          <div className="divider"></div>
          <div key={profile.id} className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <h1 className="text-xl font-bold btn-link">
                  <Link to={`/profile/${profile.id}`}>{profile.position}</Link>
                </h1>
                <div className="flex text-gray-500 text-sm">
                  <span>{displayCountry(profile.country)}</span>
                  <div className="divider divider-horizontal m-0"></div>
                  <span>{displayExperience(profile.experience)}</span>
                  <div className="divider divider-horizontal m-0"></div>
                  <span>{displayEnglish(profile.english)}</span>
                </div>
              </div>
              <p>{profile.details}</p>
              <p className="text-sm">{profile.skills.join(', ')}</p>
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default CandidatesList;
