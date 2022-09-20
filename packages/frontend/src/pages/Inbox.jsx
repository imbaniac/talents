import { format } from 'date-fns';
import { useAccount } from 'wagmi';
import { useQuery } from 'urql';

const ProposalsQuery = `
  query($ownerAddress: String!) {
    proposals(where: { owner_in: [$ownerAddress] }) {
      id
      sender {
        id
      }
      name
      position
      company
      message
      createdAt
    }
  }
`;

const Inbox = () => {
  const { address } = useAccount();
  const [result] = useQuery({
    query: ProposalsQuery,
    variables: { ownerAddress: address },
  });

  const proposals = result.data?.proposals || [];

  return (
    <div className="container mt-16 mx-auto max-w-2xl px-8 pb-8">
      <h1 className="text-3xl font-bold">Inbox</h1>
      <div className="mt-8 flex flex-col gap-8">
        {proposals.length ? (
          proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="flex flex-col gap-4 p-4 bg-base-200 rounded-2xl"
            >
              <div className="flex gap-4">
                <div className="avatar placeholder">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-12 h-12">
                    <span>{proposal.name.substring(0, 1).toUpperCase()}</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold">{proposal.name}</h2>
                  <h3>
                    {proposal.position} at {proposal.company}
                  </h3>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="line-clamp-5">{proposal.message}</div>
                <div className="flex gap-2 w-full justify-between items-center">
                  <div className="text-xs text-gray-600">
                    {' '}
                    {format(
                      new Date(proposal.createdAt * 1000),
                      'MMM dd, yyyy HH:mm'
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost">Reject</button>
                    <button className="btn btn-outline">Accept</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>
            You will see offers from companies here after you mint your Profile.
          </p>
        )}
      </div>
    </div>
  );
};

export default Inbox;
