import { useNavigate } from 'react-router-dom';

import { EMPLOYMENT_TYPES } from '../utils/constants';
import {
  displayCategory,
  displayCountry,
  displayEnglish,
  displayExperience,
  getEmoji,
} from '../utils/helpers';
import { useStore } from '../store';
import UserNFTsCollapse from '../components/UserNFTsCollapse';

const MintProfile = () => {
  const profile = useStore((state) => state.profile);
  const navigate = useNavigate();

  if (!profile) {
    return;
  }

  return (
    <div className="container mt-16 mx-auto max-w-2xl px-8 pb-8">
      <div className="alert">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info flex-shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <h3>This is how others will see your profile</h3>
          </div>
        </div>
        <div className="flex-none">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              navigate('/profile/self/edit');
            }}
          >
            Edit profile
          </button>
        </div>
      </div>
      <div className="divider" />
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="badge badge-secondary badge-outline p-4 text-xs">
            {displayCategory(profile.category)}
          </div>
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
        <div className="border text-sm rounded-box">
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
        <UserNFTsCollapse address={profile.owner.id} />
      </div>
    </div>
  );
};

export default MintProfile;
