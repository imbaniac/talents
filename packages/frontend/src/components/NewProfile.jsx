import { Controller, useForm } from 'react-hook-form';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from 'wagmi';
import contracts from '../contracts/hardhat_contracts.json';

import {
  DEFAULT_OPTION,
  DEVELOPMENT_JOB_OPTIONS,
  EMPLOYEMENT_TYPES,
  ENGLISH_LEVELS,
  EXPERIENCE_GRADE,
  SKILLS,
} from '../utils/constants';
import MultipleComboBox from './_molecules/MultiComboBox';

const NewProfile = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      // category: DEFAULT_OPTION.value,
      experience: EXPERIENCE_GRADE[0].value,
    },
  });

  const { chain } = useNetwork();
  const { address } = useAccount();

  const CandidateContract = contracts[chain.id]?.[0].contracts.Candidate || {};
  const TEMP_URL = 'https://google.com';
  const { config } = usePrepareContractWrite({
    addressOrName: CandidateContract.address,
    contractInterface: CandidateContract.abi,
    functionName: 'createCandidate',
    args: [address, TEMP_URL],
    overrides: {
      gasLimit: 200000,
    },
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const { data: balanceOf, error } = useContractRead({
    addressOrName: CandidateContract.address,
    contractInterface: CandidateContract.abi,
    functionName: 'balanceOf',
    args: address,
    chainId: chain.id,
  });

  const onSubmit = async (data) => {
    const parsedExperience = EXPERIENCE_GRADE[data.experience].value;
    const newData = {
      ...data,
      experience: parsedExperience,
      employmentTypes: data.employment_types.filter((type) => type),
    };
    console.log('SUBMITTING', newData);

    // const nftstorage = new NFTStorage({
    //   token: import.meta.env.VITE_NFT_STORAGE_KEY,
    // });

    // const preparedData = {
    //   name: data.position,
    //   description: 'Test description',
    //   properties: {
    //     category: data.category,
    //     experience: data.experience,
    //   },
    // };

    // const blobData = new Blob([JSON.stringify(preparedData)], {
    //   type: 'application/json',
    // });

    // const metadata = await nftstorage.storeBlob(blobData);

    // console.log('SAVED', metadata);

    // await write();
  };
  // TODO: handle errors
  console.log('ERRORS', errors);

  console.log(watch());

  const experienceValue = watch('experience');
  const experienceLabel = EXPERIENCE_GRADE[experienceValue]?.displayLabel;

  return (
    <div className="container mx-auto pb-8">
      <form
        className="m-8 flex flex-col gap-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-3xl font-bold">New Profile</h1>
        <div className="form-control max-w-sm flex gap-4">
          <label className="text-sm font-semibold">Position</label>
          <input
            type="text"
            placeholder="Junior Solidity developer"
            className="input w-full input-bordered"
            {...register('position', {
              required: true,
            })}
          />
        </div>
        <div className="form-control max-w-sm flex gap-4">
          <label className="text-sm font-semibold">Category</label>
          <select
            className="select select-bordered w-full"
            {...register('category', {
              validate: (value) => value && value !== DEFAULT_OPTION.value,
            })}
          >
            {[DEFAULT_OPTION, ...DEVELOPMENT_JOB_OPTIONS].map((option) => (
              <option key={option.value} value={option.value}>
                {option.displayLabel}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control max-w-sm flex gap-4">
          <label className="text-sm font-semibold">Work experience</label>
          <input
            type="range"
            min="0"
            max={EXPERIENCE_GRADE.length - 1}
            step="1"
            className="range"
            {...register('experience', {
              required: true,
            })}
          />
          <div className="w-full flex justify-between text-xs font-semibold scroll-pt-2">
            {experienceLabel}
          </div>
        </div>

        <div className="form-control max-w-sm flex gap-4">
          <label className="text-sm font-semibold">English level</label>
          <div>
            {ENGLISH_LEVELS.map((opt) => (
              <div key={opt.value} className="form-control items-start">
                <label
                  htmlFor={`field-${opt.value}`}
                  className="label cursor-pointer gap-4"
                >
                  <Controller
                    name="english"
                    control={control}
                    rules={{ required: true }}
                    render={({
                      field: { onChange, onBlur, value, ...rest },
                    }) => (
                      <input
                        type="radio"
                        className="radio"
                        name="english"
                        id={`field-${opt.value}`}
                        onChange={() => onChange(opt.value)}
                        onBlur={() => onBlur(opt.value)}
                        value={value}
                        {...rest}
                      />
                    )}
                  />
                  <span className="label-text">{opt.displayLabel}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-control max-w-sm flex gap-4">
          <label className="text-sm font-semibold">Employment type</label>
          <div>
            {EMPLOYEMENT_TYPES.map((opt, i) => (
              <div key={opt.value} className="form-control items-start">
                <label
                  htmlFor={`field-${opt.value}`}
                  className="label cursor-pointer gap-4"
                >
                  <input
                    id={`field-${opt.value}`}
                    type="checkbox"
                    className="checkbox"
                    value={opt.value}
                    {...register(`employementType[${i}]`, {
                      required: true,
                    })}
                  />
                  <span className="label-text">{opt.displayLabel}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-control max-w-sm flex gap-4">
          <label className="text-sm font-semibold">Skills</label>
          <Controller
            control={control}
            name="skills"
            render={({ field: { onChange } }) => (
              <MultipleComboBox initialItems={SKILLS} onChange={onChange} />
            )}
          />
        </div>
        <div className="form-control max-w-sm flex gap-4">
          <label className="text-sm font-semibold">
            Tell about your work experience
          </label>
          <textarea
            className="textarea textarea-bordered"
            rows={5}
            {...register('details')}
          ></textarea>
          <p className="text-xs text-gray-600">
            Tell about projects and tasks you have completed, what technologies
            you have used, your current role in the team, and what you want to
            improve
          </p>
        </div>
        <button type="submit" className="btn btn-primary max-w-sm">
          Mint
        </button>
      </form>
    </div>
  );
};

export default NewProfile;
