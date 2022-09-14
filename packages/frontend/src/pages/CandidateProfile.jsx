import { EMPLOYMENT_TYPES } from '../utils/constants';
import {
  displayCountry,
  displayEnglish,
  displayExperience,
  getEmoji,
} from '../utils/helpers';
import { useParams } from 'react-router-dom';
import { useQuery } from 'urql';

const ProfileQuery = `
  query($id: String!) {
    profile(id: $id){
      owner {
        id
      }
      identifier
      createdAt

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

const CandidateProfile = () => {
  const params = useParams();

  const [result] = useQuery({
    query: ProfileQuery,
    variables: { id: `${params.contractAddress}/${params.tokenId}` },
  });

  const profile = result.data?.profile;

  if (!profile) {
    return null;
  }

  return (
    <div className="container mt-16 mx-auto max-w-2xl px-8 pb-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">{profile.position}</h1>
            <div className="flex text-gray-500 text-sm">
              <span>{displayCountry(profile.country)}</span>
              <div className="divider divider-horizontal m-0"></div>
              <span>{displayExperience(profile.experience)}</span>
              <div className="divider divider-horizontal m-0"></div>
              <span>{displayEnglish(profile.english)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Work experience</h3>
            <p>{profile.details}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Skills</h3>
            <p>{profile.skills.join(', ')}</p>
          </div>
        </div>
        <div className="border text-sm rounded-md">
          <h4 className="font-semibold p-4 border-b">Employment preferences</h4>
          <div className="p-4 flex flex-col gap-2">
            {EMPLOYMENT_TYPES.map((type) => (
              <div key={type.value}>
                {getEmoji(profile.employmentTypes.includes(type.value))}{' '}
                {type.displayLabel}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="flex flex-col gap-4">
        <textarea
          rows={5}
          className="textarea textarea-bordered"
          placeholder={`Hello, I'm Johnas Embedded from Pessimism Foundation.
You look like a fit for our blockchain startup. Let's hop on a call and discuss details.`}
        ></textarea>
        <p className="text-xs text-gray-600">
          Briefly describe proposition. Candidate will see your name, title and
          company details fetched from your profile.
        </p>
        <button className="btn btn-primary">Send proposition</button>
      </div>
    </div>
  );
};

export default CandidateProfile;
