/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

import { WHITELISTED_NFTs } from '../utils/constants';
import NFTModal from './_molecules/NFTModal';
import Spinner from './_atoms/Spinner';

const UserNFTsCollapse = ({ address }) => {
  const [isLoading, setLoading] = useState(false);
  const [showAllNFTs, setShowAllNFTs] = useState(true);
  const [NFTs, setNFTs] = useState([]);

  useEffect(() => {
    if (address) {
      setLoading(true);
      getNFTs(address).then((data) => {
        if (showAllNFTs) {
          setNFTs(data);
        } else {
          setNFTs(
            data.filter((item) => WHITELISTED_NFTs.includes(item.token_address))
          );
        }
        setLoading(false);
      });
    }
  }, [address, showAllNFTs]);

  console.log(NFTs);

  return (
    <div className="collapse border border-base-300 bg-base-100 rounded-box collapse-arrow">
      <input type="checkbox" />
      <div className="collapse-title font-semibold flex items-center gap-2 justify-between">
        NFTs {isLoading ? <Spinner /> : `(${NFTs.length})`}
        {/* <button className="btn btn-sm btn-ghost z-10">Show all</button> */}
      </div>
      {!!NFTs.length && (
        <div className="collapse-content  grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {NFTs.map((nft) => (
            <div
              key={`${nft.token_address}/${nft.token_id}`}
              className="p-8 lg:p-2 flex flex-col gap-4 justify-center items-center bg-base-200 rounded-box"
            >
              <img
                className="max-h-[200px]"
                src={processIPFSImages(nft.metadata.image)}
              />
              <label
                className="text-center font-bold link modal-button"
                htmlFor={`nft-modal-${nft.token_id}`}
              >
                {`${nft.metadata.name} #${nft.token_id}`}
              </label>
              <NFTModal nft={nft} modalId={`nft-modal-${nft.token_id}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserNFTsCollapse;

const getNFTs = async (address) => {
  const poapNFTs = await fetch(
    `https://frontend.poap.tech/actions/scan/${address}`,
    {
      headers: { accept: 'application/json' },
      method: 'GET',
    }
  )
    .then((res) => res.json())
    .then((poaps) => {
      console.log('poaps', poaps);
      return poaps.map((poap) => {
        return {
          chain: poap.chain,
          token_id: poap.tokenId,
          owner_of: poap.owner,

          metadata: {
            name: poap.event.name,
            image: poap.event.image_url,
            description: poap.event.description,
          },
        };
      });
    });

  const polygonNFTs = await fetch(
    `https://deep-index.moralis.io/api/v2/${address}/nft?chain=polygon&format=decimal`,
    {
      headers: {
        accept: 'application/json',
        'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY,
      },
      method: 'GET',
    }
  )
    .then((res) => res.json())
    .then((json) =>
      json.result.map((item) => ({
        ...item,
        chain: 'polygon',
        metadata: item.metadata ? JSON.parse(item.metadata) : {},
      }))
    )
    .catch(() => {
      return [];
    });

  const mainnetNFTs = await fetch(
    `https://deep-index.moralis.io/api/v2/${address}/nft?chain=eth&format=decimal`,
    {
      headers: {
        accept: 'application/json',
        'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY,
      },
      method: 'GET',
    }
  )
    .then((res) => res.json())
    .then((json) =>
      json.result.map((item) => ({
        ...item,
        chain: 'ethereum',
        metadata: item.metadata ? JSON.parse(item.metadata) : {},
      }))
    )
    .catch(() => {
      return [];
    });

  return [...poapNFTs, ...polygonNFTs, ...mainnetNFTs].filter(
    (nft) => nft.metadata?.name
  );
};

const processIPFSImages = (image = '') => {
  const [protocol, link] = image.split('://');
  if (protocol === 'ipfs') {
    return `https://nftstorage.link/ipfs/${link}`;
  }
  return image;
};
