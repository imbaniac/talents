import { useAccount } from 'wagmi';
import { useQuery } from 'urql';

import { PROPOSAL_STATUSES_ENUM } from '../utils/constants';
import SenderProposalItem from '../components/SenderProposalItem';

const SenderProposalsQuery = `
  query($senderAddress: String!, $status: Int!) {
    proposals(where: { sender_in: [$senderAddress], status_in: [$status] }, orderBy: createdAt, orderDirection: desc) {
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
      owner {
        id
      }
      profile {
        id
        position
      }
    }
  }
`;

const Outbox = () => {
  const { address } = useAccount();
  const [pendingProposalsResp] = useQuery({
    query: SenderProposalsQuery,
    variables: {
      senderAddress: address,
      status: PROPOSAL_STATUSES_ENUM.Pending,
    },
  });

  const [acceptedProposalsResp] = useQuery({
    query: SenderProposalsQuery,
    variables: {
      senderAddress: address,
      status: PROPOSAL_STATUSES_ENUM.Accepted,
    },
  });

  const [rejectedProposalsResp] = useQuery({
    query: SenderProposalsQuery,
    variables: {
      senderAddress: address,
      status: PROPOSAL_STATUSES_ENUM.Rejected,
    },
  });

  const pendingProposals = pendingProposalsResp.data?.proposals || [];
  const acceptedProposals = acceptedProposalsResp.data?.proposals || [];
  const rejectedProposals = rejectedProposalsResp.data?.proposals || [];

  return (
    <div className="container mt-16 mx-auto max-w-2xl px-8 pb-8">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Outbox</h1>

        {!!pendingProposals.length && (
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Waiting for response</h2>
            <div className="mt-4 flex flex-col gap-8">
              {pendingProposals.map((proposal) => (
                <SenderProposalItem key={proposal.id} data={proposal} />
              ))}
            </div>
          </div>
        )}

        {!!acceptedProposals.length && (
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Active</h2>
            <div className="mt-4 flex flex-col gap-8">
              {acceptedProposals.map((proposal) => (
                <SenderProposalItem key={proposal.id} data={proposal} />
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
                <SenderProposalItem key={proposal.id} data={proposal} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Outbox;
