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
      encryptedMessage
      createdAt
    }
  }
`;

const decryptMessage = (message) => {
  return message;
};

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
                    <span>AN</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold">Anonymous user</h2>
                  <h3>Horns and hooves</h3>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="line-clamp-5">
                  {decryptMessage(proposal.encryptedMessage)}
                </div>
                <div className="flex gap-2 w-full justify-between items-center">
                  <div className="text-xs text-gray-600">
                    {' '}
                    {format(
                      new Date(proposal.createdAt * 1000),
                      'MMM dd, yyyy HH:MM'
                    )}
                  </div>
                  <button className="btn btn-outline">View details</button>
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
