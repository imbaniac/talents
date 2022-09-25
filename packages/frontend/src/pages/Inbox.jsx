import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { useQuery } from 'urql';

import { PROPOSAL_STATUSES_ENUM } from '../utils/constants';
import ProposalItem from '../components/ProposalItem';
import Skeleton from '../components/_atoms/Skeleton';

const ReceiverProposalsQuery = `
  query($ownerAddress: String!, $status: Int!) {
    proposals(where: { owner_in: [$ownerAddress], status_in: [$status] }, orderBy: createdAt, orderDirection: desc) {
      id
      identifier
      sender {
        id
      }
      name
      position
      company
      message
      createdAt
      status
    }
  }
`;

const Inbox = () => {
  const { address } = useAccount();
  const [isEPNSshow, setEPNSshow] = useState(false);

  useEffect(() => {
    const epnsBanner = localStorage.getItem('epnsBanner');
    if (epnsBanner) {
      setEPNSshow(JSON.parse(epnsBanner));
    } else {
      setEPNSshow(true);
    }
  }, []);

  const [pendingProposalsResp] = useQuery({
    query: ReceiverProposalsQuery,
    variables: {
      ownerAddress: address,
      status: PROPOSAL_STATUSES_ENUM.Pending,
    },
  });

  const [acceptedProposalsResp] = useQuery({
    query: ReceiverProposalsQuery,
    variables: {
      ownerAddress: address,
      status: PROPOSAL_STATUSES_ENUM.Accepted,
    },
  });

  const [rejectedProposalsResp] = useQuery({
    query: ReceiverProposalsQuery,
    variables: {
      ownerAddress: address,
      status: PROPOSAL_STATUSES_ENUM.Rejected,
    },
  });

  const pendingProposals = pendingProposalsResp.data?.proposals || [];
  const acceptedProposals = acceptedProposalsResp.data?.proposals || [];
  const rejectedProposals = rejectedProposalsResp.data?.proposals || [];

  const isLoading =
    pendingProposalsResp.fetching ||
    acceptedProposalsResp.fetching ||
    rejectedProposalsResp.fetching;

  return (
    <div className="container mt-16 mx-auto max-w-2xl px-8 pb-8">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Inbox</h1>

        {isEPNSshow && (
          <div className="alert shadow-lg">
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
              <p>Subscribe for a new job proposals with EPNS</p>
            </div>
            <div className="flex-none">
              <a
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  localStorage.setItem('epnsBanner', false);
                  setEPNSshow(false);
                }}
              >
                Close
              </a>
              <a
                href="https://staging.epns.io/#/channels?channel=0x9Fc1436C9216040bb706e31064133083A06bfFD1"
                rel="noopener noreferrer"
                target="_blank"
                className="btn btn-sm btn-primary"
              >
                Subscribe
              </a>
            </div>
          </div>
        )}

        {isLoading && (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        )}

        {!!acceptedProposals.length && (
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Active</h2>
            <div className="mt-4 flex flex-col gap-8">
              {acceptedProposals.map((proposal) => (
                <ProposalItem key={proposal.id} data={proposal} />
              ))}
            </div>
          </div>
        )}

        {!!pendingProposals.length && (
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">New</h2>
            <div className="mt-4 flex flex-col gap-8">
              {pendingProposals.map((proposal) => (
                <ProposalItem key={proposal.id} data={proposal} />
              ))}
            </div>
          </div>
        )}

        {(!!pendingProposals.length || !!acceptedProposals.length) && (
          <div className="divider"></div>
        )}

        {!!rejectedProposals.length && (
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Rejected</h2>
            <div className="mt-4 flex flex-col gap-8">
              {rejectedProposals.map((proposal) => (
                <ProposalItem key={proposal.id} data={proposal} />
              ))}
            </div>
          </div>
        )}
        {!isLoading &&
          !pendingProposals.length &&
          !acceptedProposals.length &&
          !rejectedProposals.length && (
            <p>You do not have any incoming proposals yet 😔</p>
          )}
      </div>
    </div>
  );
};

export default Inbox;
