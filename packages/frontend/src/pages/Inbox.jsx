import { useAccount } from 'wagmi';
import { useQuery } from 'urql';

import { PROPOSAL_STATUSES_ENUM } from '../utils/constants';
import ProposalItem from '../components/ProposalItem';

const ProposalsQuery = `
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
    query: ProposalsQuery,
    variables: {
      ownerAddress: address,
      status: PROPOSAL_STATUSES_ENUM.Pending,
    },
  });

  const [acceptedProposalsResp] = useQuery({
    query: ProposalsQuery,
    variables: {
      ownerAddress: address,
      status: PROPOSAL_STATUSES_ENUM.Accepted,
    },
  });

  const [rejectedProposalsResp] = useQuery({
    query: ProposalsQuery,
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
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">New</h2>
          <div className="mt-4 flex flex-col gap-8">
            {pendingProposals.length ? (
              pendingProposals.map((proposal) => (
                <ProposalItem key={proposal.id} data={proposal} />
              ))
            ) : (
              <p>
                You will see offers from companies after you mint your Profile.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-xl font-bold">In progress</h2>
          <div className="mt-4 flex flex-col gap-8">
            {acceptedProposals.length ? (
              acceptedProposals.map((proposal) => (
                <ProposalItem key={proposal.id} data={proposal} />
              ))
            ) : (
              <p>
                You will see offers from companies after you mint your Profile.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-xl font-bold">Rejected</h2>
          <div className="mt-4 flex flex-col gap-8">
            {rejectedProposals.length ? (
              rejectedProposals.map((proposal) => (
                <ProposalItem key={proposal.id} data={proposal} />
              ))
            ) : (
              <p>
                You will see offers from companies after you mint your Profile.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
