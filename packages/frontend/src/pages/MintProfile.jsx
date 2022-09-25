import { NFTStorage } from 'nft.storage';
import { WorldIDWidget } from '@worldcoin/id';
import { defaultAbiCoder as abi } from '@ethersproject/abi';
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from 'wagmi';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
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
import contracts from '../contracts/hardhat_contracts.json';

const WORLDCOIN_CHAINS = [80001, 137];

const MintProfile = () => {
  const navigate = useNavigate();
  const addRecentTransaction = useAddRecentTransaction();

  const newProfileForm = useStore((state) => state.newProfileForm);

  const [ipfsCID, setIpfsCID] = useState('');
  const [isIpfsLoading, setIpfsLoading] = useState(false);
  const [worldcoinVerification, setWorldcoinVerification] = useState({});

  const { chain } = useNetwork();
  const { address } = useAccount();

  const CandidateContract = contracts[chain?.id]?.[0].contracts.Candidate || {};

  const [shouldUseWorldcoin, setShouldUseWorldcoin] = useState(
    WORLDCOIN_CHAINS.includes(chain?.id)
  );

  const { config } = usePrepareContractWrite({
    addressOrName: CandidateContract.address,
    contractInterface: CandidateContract.abi,
    functionName: shouldUseWorldcoin ? 'mintProfile' : 'mintProfileLocal',
    enabled: address && ipfsCID && worldcoinVerification.merkle_root,
    chainId: chain.id,
    args: [
      address,
      ipfsCID,
      ...(shouldUseWorldcoin
        ? [
            worldcoinVerification.merkle_root,
            worldcoinVerification.nullifier_hash,
            worldcoinVerification.proof
              ? abi.decode(['uint256[8]'], worldcoinVerification.proof)[0]
              : [],
          ]
        : []),
    ],
    overrides: {
      // TODO: change to adequate amount
      gasLimit: 1000000,
    },
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess(data) {
      addRecentTransaction({
        hash: data.hash,
        description: 'Minting profile NFT',
      });
      navigate('/inbox');
    },
    onError(data) {
      console.log('ERROR', data);
    },
  });

  const handleMint = async () => {
    const nftData = {
      name: newProfileForm.position,
      description: 'Pseudo-anonymous candidate profile soulbound NFT',
      properties: { ...newProfileForm },
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

  useEffect(() => {
    if (!newProfileForm.position) {
      console.log('NAVIGATE');
      navigate('/profile/new');
    }
  }, [newProfileForm.position, navigate]);

  if (!newProfileForm.position) {
    return null;
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
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            Back to edit
          </button>
        </div>
      </div>
      <div className="divider" />
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="badge badge-secondary badge-outline p-4 text-xs">
            {displayCategory(newProfileForm.category)}
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">{newProfileForm.position}</h1>
            <div className="flex text-gray-500 text-sm">
              <span>{displayCountry(newProfileForm.country)}</span>
              <div className="divider divider-horizontal m-0"></div>
              <span>{displayExperience(newProfileForm.experience)}</span>
              <div className="divider divider-horizontal m-0"></div>
              <span>{displayEnglish(newProfileForm.english)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Work experience</h3>
            <p className="whitespace-pre-wrap">{newProfileForm.details}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">Skills</h3>
            <p>{newProfileForm.skills.join(', ')}</p>
          </div>
        </div>
        <div className="border text-sm rounded-box">
          <h4 className="font-semibold p-4 border-b">Employment preferences</h4>
          <div className="p-4 flex flex-col gap-2">
            {EMPLOYMENT_TYPES.map((type) => (
              <div key={type.value}>
                {getEmoji(newProfileForm.employmentTypes.includes(type.value))}{' '}
                {type.displayLabel}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="divider" />
          <div className="flex flex-col items-center gap-8">
            {shouldUseWorldcoin &&
              address &&
              !worldcoinVerification.merkle_root && (
                <div>
                  <p className="mb-4">
                    Please verify that you are a real person
                  </p>
                  <WorldIDWidget
                    actionId={import.meta.env.VITE_WORLDCOIN_ACTION_ID}
                    signal={address}
                    enableTelemetry
                    appName="Talents"
                    debug
                    onSuccess={(verificationResponse) => {
                      console.log(verificationResponse);
                      setWorldcoinVerification(verificationResponse);
                    }}
                    onError={(error) => console.error(error)}
                    onInitSuccess={() => console.log('Init successful')}
                    onInitError={(error) =>
                      console.log('Error while initialization World ID', error)
                    }
                  />
                </div>
              )}
            {/* <label className="label cursor-pointer justify-center gap-4">
              <div className="flex flex-col">
                <span className="label-text">DEBUG: toggle verification</span>
                <span className="label-text text-xs">
                  Click if Worldcoin Simulator is down.
                </span>
              </div>
              <input
                type="checkbox"
                checked={shouldUseWorldcoin}
                onChange={(e) => {
                  setShouldUseWorldcoin(e.target.checked);
                }}
                className="toggle"
              />
            </label> */}
            <button
              disabled={
                shouldUseWorldcoin && !worldcoinVerification.merkle_root
              }
              type="submit"
              onClick={handleMint}
              className={`btn btn-primary modal-button w-full ${
                isIpfsLoading ? 'loading' : ''
              }`}
            >
              Mint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintProfile;
