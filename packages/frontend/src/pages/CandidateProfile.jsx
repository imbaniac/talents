import { NFTStorage } from 'nft.storage';
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from 'wagmi';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'urql';

import { EMPLOYMENT_TYPES } from '../utils/constants';
import {
  displayCategory,
  displayCountry,
  displayEnglish,
  displayExperience,
  getEmoji,
} from '../utils/helpers';
import { useForm } from 'react-hook-form';
import UserNFTsCollapse from '../components/UserNFTsCollapse';
import contracts from '../contracts/hardhat_contracts.json';

const ProfileQuery = `
  query($id: String!) {
    profile(id: $id){
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

const CandidateProfile = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [result] = useQuery({
    query: ProfileQuery,
    variables: { id: `${params.contractAddress}/${params.tokenId}` },
  });

  const { register, handleSubmit } = useForm();

  const [ipfsCID, setIpfsCID] = useState('');
  const [isIpfsLoading, setIpfsLoading] = useState(false);

  const addRecentTransaction = useAddRecentTransaction();

  const { chain } = useNetwork();
  const { address } = useAccount();

  const ProposalContract = contracts[chain?.id]?.[0].contracts.Proposal || {};

  const { config } = usePrepareContractWrite({
    addressOrName: ProposalContract.address,
    contractInterface: ProposalContract.abi,
    functionName: 'mintProposal',
    enabled: address && ipfsCID,
    chainId: chain?.id,
    args: [params.tokenId, ipfsCID],
    overrides: {
      gasLimit: 250000,
    },
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess(data) {
      addRecentTransaction({
        hash: data.hash,
        description: 'Minting proposal',
      });
    },
  });

  const profile = result.data?.profile;

  const onSubmit = async (data) => {
    const nftData = {
      name: 'Proposal',
      description: `Message from ${address} to candidate ${profile.owner.id}`,
      properties: data,
    };

    setIpfsLoading(true);

    const blobData = new Blob([JSON.stringify(nftData)], {
      type: 'application/json',
    });

    const nftstorage = new NFTStorage({
      token: import.meta.env.VITE_NFT_STORAGE_KEY,
    });
    const CID = await nftstorage.storeBlob(blobData);
    console.log('Saved on IPFS as address: ', CID);
    setIpfsCID(CID);
    setIpfsLoading(false);
  };

  useEffect(() => {
    if (write) {
      write();
      setIpfsCID(null);
    }
  }, [write]);

  if (!profile) {
    return null;
  }

  const isMyProfile = address?.toLocaleLowerCase() === profile.owner.id;

  return (
    <div className="container mt-16 mx-auto max-w-2xl px-8 pb-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {isMyProfile && (
              <>
                <div className="alert">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-success flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h3>This is your profile</h3>
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
                <div className="divider"></div>
              </>
            )}
            <div className="badge badge-secondary badge-outline p-4 text-xs">
              {displayCategory(profile.category)}
            </div>
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
            <p className="whitespace-pre-wrap">{profile.details}</p>
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
      {!isMyProfile && (
        <>
          <div className="divider"></div>
          <form
            className="flex flex-col gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="text-xl font-bold">Contact form</h2>
            <div className="form-control w-full gap-4">
              <label className="text-sm font-semibold">Name</label>
              <input
                type="text"
                placeholder="Justin Drake"
                className="input input-bordered w-full"
                {...register('name', {
                  required: true,
                })}
              />
            </div>
            <div className="form-control w-full gap-4">
              <label className="text-sm font-semibold">
                Position and Company
              </label>
              <label className="input-group">
                <input
                  type="text"
                  placeholder="Researcher"
                  className="input input-bordered w-full"
                  {...register('position', {
                    required: true,
                  })}
                />
                <span>at</span>
                <input
                  type="text"
                  placeholder="Ethereum Foundation"
                  className="input input-bordered w-full"
                  {...register('company', {
                    required: true,
                  })}
                />
              </label>
            </div>
            <div className="form-control w-full gap-4">
              <label className="text-sm font-semibold">
                Briefly describe your proposition
              </label>
              <textarea
                rows={5}
                className="textarea textarea-bordered"
                placeholder={`You look like a fit for our blockchain startup. Would like to discuss details with you.`}
                {...register('message', {
                  required: true,
                })}
              ></textarea>
              <p className="text-xs text-gray-600">
                Do not put here any secret information, as it could be seen by
                anyone.
              </p>
            </div>
            <button
              type="submit"
              className={`btn btn-primary ${isIpfsLoading ? 'loading' : ''}`}
            >
              Send a proposal
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CandidateProfile;
