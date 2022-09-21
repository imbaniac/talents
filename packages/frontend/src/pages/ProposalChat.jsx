import { useAccount } from 'wagmi';
import { useParams } from 'react-router-dom';
import { useQuery } from 'urql';

import ReceiverChat from '../components/ReceiverChat';
import SenderChat from '../components/SenderChat';

const ProposalQuery = `
  query($id: String!) {
    proposal(id: $id){
      id
      identifier
      owner {
        id
      }
      sender {
        id
      }
      name
      position
      company
      message
      createdAt
      status
      profile {
        position
      }
    }
  }
`;

const ProposalChat = () => {
  const { address } = useAccount();
  const params = useParams();

  const [result] = useQuery({
    query: ProposalQuery,
    variables: { id: `${params.contractAddress}/${params.proposalId}` },
  });

  const proposal = result.data?.proposal;

  if (!proposal) return;

  if (address.toLocaleLowerCase() === proposal.owner.id) {
    return <ReceiverChat proposal={proposal} />;
  }
  if (address.toLocaleLowerCase() === proposal.sender.id) {
    return <SenderChat proposal={proposal} />;
  }
  return null;
};

export default ProposalChat;
