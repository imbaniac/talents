import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useQuery } from 'urql';

import {
  displayCountry,
  displayEnglish,
  displayExperience,
} from '../utils/helpers';
import Skeleton from '../components/_atoms/Skeleton';
import useDebounce from '../hooks/useDebounce';

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

const SearchProfileQuery = `
  query($searchQuery: String!) {
    profileSearch(text: $searchQuery) {
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

const specialCharacters = ['|', '&', '<->', ':*'];

// TODO: make normat formatter for queries
const formatQuery = (string) => {
  const array = string.split(' ');
  return array
    .map((word, idx) => {
      if (idx === array.length - 1) return word;
      if (
        specialCharacters.includes(word) ||
        specialCharacters.includes(array[idx + 1])
      )
        return word;
      return word + '&';
    })
    .join('');
};

const CandidatesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [result] = useQuery({
    query: ProfilesQuery,
  });

  const SHOULD_SEARCH = searchQuery.length > 2;

  const [searchResults] = useQuery({
    query: SearchProfileQuery,
    variables: { searchQuery: formatQuery(searchQuery) },
    pause: !SHOULD_SEARCH,
  });

  useDebounce(
    () => {
      setSearchQuery(searchValue);
    },
    [],
    800
  );

  useEffect(() => {
    if (result.fetching || searchResults.fetching) {
      setLoading(true);
    }
    if (!result.fetching || !searchResults.fetching) {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [result.fetching, searchResults.fetching]);

  const profiles = result.data?.profiles || [];
  const profileSearch = searchResults.data?.profileSearch || [];

  return (
    <div className="container mt-16 mx-auto max-w-2xl px-8 pb-8">
      <div className="flex flex-col md:items-center md:flex-row gap-4">
        <div className="flex items-end gap-2">
          <h1 className="text-3xl font-bold">Candidates </h1>
          <span className="text-gray-400 text-lg">
            {profiles[0] ? +profiles[0].identifier + 1 : 0}
          </span>
        </div>
        <div className="form-control w-full">
          <div className="input-group">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search query, e.g: Solidity & React & Middle"
              className="input input-bordered w-full"
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="flex flex-col gap-8 my-16">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : (
        (SHOULD_SEARCH ? profileSearch : profiles).map((profile) => (
          <>
            <div className="divider"></div>
            <div key={profile.id} className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <h1 className="text-xl font-bold btn-link">
                      <Link to={`/profile/${profile.id}`}>
                        {profile.position}
                      </Link>
                    </h1>
                    <span className="text-xs text-gray-500">
                      {format(
                        new Date(profile.createdAt * 1000),
                        'dd MMM, HH:mm'
                      )}
                    </span>
                  </div>
                  <div className="flex text-gray-500 text-sm">
                    <span>{displayCountry(profile.country)}</span>
                    <div className="divider divider-horizontal m-0"></div>
                    <span>{displayExperience(profile.experience)}</span>
                    <div className="divider divider-horizontal m-0"></div>
                    <span>{displayEnglish(profile.english)}</span>
                  </div>
                </div>
                <p className="whitespace-pre-wrap">{profile.details}</p>
                <p className="text-sm">{profile.skills.join(', ')}</p>
              </div>
            </div>
          </>
        ))
      )}
    </div>
  );
};

export default CandidatesList;
