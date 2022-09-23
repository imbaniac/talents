import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

import ConnectButton from './ConnectButton';

const Navbar = () => {
  const { address } = useAccount();

  return (
    <div className="navbar bg-base-100 p-4">
      <div className="navbar-start">
        {address && (
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 gap-1"
            >
              <li>
                <Link to="inbox">Inbox</Link>
              </li>
              <li>
                <Link to="outbox">Outbox</Link>
              </li>
              <li>
                <Link to="candidates">Candidates</Link>
              </li>
            </ul>
          </div>
        )}
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Talents
        </Link>
      </div>
      <div className="navbar-end w-[60%]">
        {address && (
          <ul className="menu menu-horizontal p-0 gap-4 mr-4 hidden lg:flex">
            <li>
              <Link className="btn btn-ghost" to="inbox">
                Inbox
              </Link>
            </li>
            <li>
              <Link className="btn btn-ghost" to="outbox">
                Outbox
              </Link>
            </li>
            <li>
              <Link className="btn btn-ghost" to="candidates">
                Candidates
              </Link>
            </li>
          </ul>
        )}
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;
