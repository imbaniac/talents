/* eslint-disable react/prop-types */
import { format } from 'date-fns';
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from 'wagmi';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PROPOSAL_STATUSES_ENUM } from '../utils/constants';
import contracts from '../contracts/hardhat_contracts.json';

// const getBadgeColor = (status) => {
//   switch (status) {
//     case PROPOSAL_STATUSES_ENUM.Pending:
//       return 'badge-info';
//     case PROPOSAL_STATUSES_ENUM.Accepted:
//       return 'badge-success';
//     case PROPOSAL_STATUSES_ENUM.Rejected:
//       return 'badge-error';
//   }
// };

const ProposalItem = ({ data }) => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const addRecentTransaction = useAddRecentTransaction();

  const [selectedStatus, setSelectedStatus] = useState(null);

  const ProposalContract = contracts[chain?.id]?.[0].contracts.Proposal || {};

  const { config } = usePrepareContractWrite({
    addressOrName: ProposalContract.address,
    contractInterface: ProposalContract.abi,
    functionName: 'responseProposal',
    enabled: address && data.identifier && selectedStatus,
    chainId: chain?.id,
    args: [data.identifier, selectedStatus],
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess(data) {
      addRecentTransaction({
        hash: data.hash,
        description: 'Responding to proposal',
      });
    },
  });

  useEffect(() => {
    if (write) {
      write();
      setSelectedStatus(null);
    }
  }, [write]);

  const handleResponseProposal = (isAccepted) => {
    setSelectedStatus(
      isAccepted
        ? PROPOSAL_STATUSES_ENUM.Accepted
        : PROPOSAL_STATUSES_ENUM.Rejected
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-base-200 rounded-2xl indicator w-full">
      {/* <span
        className={`indicator-item badge badge-outline bg-white ${getBadgeColor(
          data.status
        )}`}
      >
        {Object.keys(PROPOSAL_STATUSES_ENUM)[data.status]}
      </span> */}
      <div className="flex gap-4">
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-12 h-12">
            <span>{data.name.substring(0, 1).toUpperCase()}</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <h2 className="text-lg font-bold">{data.name} </h2>
            <span className="text-xs text-gray-500 font-light truncate max-w-[160px] link link-hover">
              {data.sender.id}
            </span>
          </div>
          <h3>
            {data.position} at {data.company}
          </h3>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div>{data.message}</div>
        <div className="flex gap-2 w-full justify-between items-center">
          <div className="text-xs text-gray-600">
            {' '}
            {format(new Date(data.createdAt * 1000), 'MMM dd, yyyy HH:mm')}
          </div>
          {data.status === PROPOSAL_STATUSES_ENUM.Pending && (
            <div className="flex gap-2">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleResponseProposal(false)}
              >
                Reject
              </button>
              <button
                className="btn btn-sm"
                onClick={() => handleResponseProposal(true)}
              >
                Accept
              </button>
            </div>
          )}
          {data.status === PROPOSAL_STATUSES_ENUM.Accepted && (
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => navigate(`/chat/${data.id}`)}
            >
              Chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalItem;
