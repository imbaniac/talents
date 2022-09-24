/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

import NFTModal from './_molecules/NFTModal';
import Spinner from './_atoms/Spinner';

const UserNFTsCollapse = ({ address }) => {
  const [isLoading, setLoading] = useState(false);
  const [NFTs, setNFTs] = useState([]);

  useEffect(() => {
    if (address) {
      setLoading(true);
      getNFTs(address).then((data) => {
        setNFTs(data);
        setLoading(false);
      });
    }
  }, [address]);

  return (
    <div className="collapse border border-base-300 bg-base-100 rounded-box collapse-arrow">
      <input type="checkbox" />
      <div className="collapse-title font-semibold flex items-center gap-2">
        NFTs {isLoading ? <Spinner width={4} height={4} /> : `(${NFTs.length})`}
      </div>
      {!!NFTs.length && (
        <div className="collapse-content  grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {NFTs.map((nft) => (
            <div
              key={`${nft.token_address}/${nft.token_id}`}
              className="p-8 lg:p-2 flex flex-col gap-4 justify-center items-center bg-base-200 rounded-box"
            >
              <img className="max-h-[200px]" src={nft.metadata.image} />
              <label
                className="text-center font-bold link modal-button"
                htmlFor="nft-modal"
              >
                {`${nft.metadata.name} #${nft.token_id}`}
              </label>
              <NFTModal nft={nft} modalId="nft-modal" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserNFTsCollapse;

const getNFTs = async (address) => {
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

  return [...polygonNFTs, ...mainnetNFTs];
};
