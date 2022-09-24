/* eslint-disable react/prop-types */
const NFTModal = ({ modalId, nft }) => (
  <>
    <input type="checkbox" id={modalId} className="modal-toggle" />
    <div className="modal modal-bottom sm:modal-middle">
      <div className="modal-box flex flex-col gap-4">
        <span className="badge badge-lg capitalize">{nft.chain}</span>
        <h3 className="font-bold text-lg">{`${nft.metadata.name} #${nft.token_id}`}</h3>
        <p>{nft.metadata.description}</p>
        <img className="max-h-[200px] mx-auto" src={nft.metadata.image} />

        <div>
          <div>Contract address:</div>
          <span className="link">{nft.token_address}</span>
        </div>

        <div className="modal-action">
          <label htmlFor={modalId} className="btn btn-outline">
            Close
          </label>
        </div>
      </div>
    </div>
  </>
);

export default NFTModal;
