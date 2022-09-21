import { useAccount } from 'wagmi';
import { useParams } from 'react-router-dom';
import { useQuery } from 'urql';

import ChatWrapper from '../components/ChatWrapper';

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

  const isSender = address.toLocaleLowerCase() === proposal.sender.id;

  if (
    address.toLocaleLowerCase() !== proposal.owner.id &&
    address.toLocaleLowerCase() !== proposal.sender.id
  ) {
    return null;
  }

  return <ChatWrapper proposal={proposal} isSender={isSender} />;
};

export default ProposalChat;
