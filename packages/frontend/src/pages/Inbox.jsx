import { useAccount } from 'wagmi';
import { useQuery } from 'urql';

import { PROPOSAL_STATUSES_ENUM } from '../utils/constants';
import ProposalItem from '../components/ProposalItem';

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

  return (
    <div className="container mt-16 mx-auto max-w-2xl px-8 pb-8">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Inbox</h1>

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
      </div>
    </div>
  );
};

export default Inbox;
