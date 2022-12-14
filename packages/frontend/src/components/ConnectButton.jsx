import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import { string } from 'prop-types';

import Spinner from './_atoms/Spinner';

const ConnectButton = ({ className }) => {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            className={className}
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="btn btn-outline"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="btn btn-error"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="flex flex-col lg:flex-row gap-4">
                  <button
                    onClick={openChainModal}
                    className="btn btn-outline btn-accent"
                    type="button"
                  >
                    {/* {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )} */}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    className={`btn btn-info btn-outline`}
                    type="button"
                  >
                    {account.hasPendingTransactions && <Spinner />}
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};

ConnectButton.propTypes = {
  className: string,
};

export default ConnectButton;
