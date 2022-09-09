import { Controller, useForm } from 'react-hook-form';

import {
  DEFAULT_OPTION,
  DEVELOPMENT_JOB_OPTIONS,
  ENGLISH_LEVELS,
  EXPERIENCE_GRADE,
} from '../utils/constants';

const NewProfile = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      experience: EXPERIENCE_GRADE[0].value,
    },
  });

  const onSubmit = (data) => {
    const parsedExperience = EXPERIENCE_GRADE[data.experience].value;
    const newData = { ...data, experience: parsedExperience };
    console.log(newData);
  };
  // TODO: handle errors
  console.log('ERRORS', errors);

  const experienceValue = watch('experience');
  const experienceLabel = EXPERIENCE_GRADE[experienceValue]?.displayLabel;

  return (
    <div className="container mx-auto">
      <form
        className="m-16 flex flex-col gap-8"
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
            {...register('category')}
          >
            {[DEFAULT_OPTION, ...DEVELOPMENT_JOB_OPTIONS].map((option) => (
              <option
                defaultValue={DEFAULT_OPTION.value}
                key={option.value}
                value={option.value}
              >
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

        <button type="submit" className="btn btn-primary max-w-sm">
          Mint
        </button>
      </form>
    </div>
  );
};

export default NewProfile;
