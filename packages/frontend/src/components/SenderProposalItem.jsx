/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useQuery } from 'urql';

import { PROPOSAL_STATUSES_ENUM } from '../utils/constants';

const SenderProposalItem = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 p-4 bg-base-200 rounded-2xl indicator w-full">
      <h2 className="text-lg font-bold">
        To:{' '}
        <Link to={`/profile/${data.profile.id}`} className="link">
          {data.profile.position}
        </Link>
      </h2>
      <div className="divider m-0"></div>
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

export default SenderProposalItem;
