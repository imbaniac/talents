/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

import ConnectButton from './ConnectButton';
import logo from '../assets/logo.png';

const Navbar = ({ hasProfile }) => {
  const { address } = useAccount();

  return (
    <div className="navbar bg-base-100 p-4 max-h-[64px]">
      <div className="navbar-start w-[20%]">
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
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-64 gap-1"
            >
              <ConnectButton className="mb-4" />
              <li>
                {hasProfile ? (
                  <Link to="profile/self">My profile</Link>
                ) : (
                  <Link to="profile/new">Find job</Link>
                )}
              </li>
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
          <img className="w-[30px] h-auto mr-2" src={logo} />
          Talents Ninja
        </Link>
      </div>
      <div className="navbar-end w-[80%]">
        <ul className="menu menu-horizontal p-0 gap-4 mr-4 hidden lg:flex">
          {address && (
            <>
              <li>
                {hasProfile ? (
                  <Link className="btn btn-ghost" to="profile/self">
                    My profile
                  </Link>
                ) : (
                  <Link className="btn btn-ghost" to="profile/new">
                    Find job
                  </Link>
                )}
              </li>
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
            </>
          )}
          <ConnectButton />
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
