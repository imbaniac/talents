import { NFTStorage } from 'nft.storage';
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from 'wagmi';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'urql';

import { EMPLOYMENT_TYPES } from '../utils/constants';
import {
  displayCountry,
  displayEnglish,
  displayExperience,
  getEmoji,
} from '../utils/helpers';
import contracts from '../contracts/hardhat_contracts.json';

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

  const [message, setMessage] = useState('');
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
      gasLimit: 200000,
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

  const handleMint = async () => {
    const nftData = {
      name: 'Proposal',
      description: `Message from ${address} to candidate ${profile.owner.id}`,
      properties: { encryptedMessage: message },
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
          onChange={(e) => setMessage(e.target.value)}
          className="textarea textarea-bordered"
          placeholder={`Hello, I'm Johnas Embedded from Pessimism Foundation.
You look like a fit for our blockchain startup. Let's hop on a call and discuss details.`}
        ></textarea>
        <p className="text-xs text-gray-600">
          Briefly describe your proposition. Candidate will see your name, title
          and company details fetched from your company profile.
        </p>
        <button
          className={`btn btn-primary ${isIpfsLoading ? 'loading' : ''}`}
          onClick={handleMint}
        >
          Send a proposal
        </button>
      </div>
    </div>
  );
};

export default CandidateProfile;
