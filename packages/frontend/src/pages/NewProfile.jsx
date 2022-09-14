import { Controller, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useNavigate } from 'react-router-dom';

import {
  COUNTRIES_LIST,
  DEVELOPMENT_JOB_OPTIONS,
  EMPLOYMENT_TYPES,
  ENGLISH_LEVELS,
  EXPERIENCE_GRADE,
  SKILLS,
} from '../utils/constants';
import { useStore } from '../store';
import MultipleComboBox from '../components/_molecules/MultiComboBox';

const NewProfile = () => {
  const navigate = useNavigate();
  const setProfileForm = useStore((state) => state.setProfileForm);
  const newProfileForm = useStore((state) => state.newProfileForm);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      // FILLED STATE
      ...newProfileForm,
      experience: EXPERIENCE_GRADE.findIndex(
        (opt) => opt.value === newProfileForm.experience
      ),
    },
  });

  const onSubmit = (data) => {
    const parsedExperience = EXPERIENCE_GRADE[data.experience].value;
    const newData = {
      ...data,
      experience: parsedExperience,
      employmentTypes: data.employmentTypes.filter((t) => t),
    };
    console.log('SUBMITTING', newData);
    setProfileForm(newData);
    navigate('/profile/mint');
  };
  // TODO: handle errors
  console.log('ERRORS', errors);

  const experienceValue = watch('experience');
  const experienceLabel = EXPERIENCE_GRADE[experienceValue]?.displayLabel;

  return (
    <div className="container max-w-2xl mt-16 mx-auto px-8 pb-8">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl font-bold">New Profile</h1>
        <div className="form-control flex gap-4">
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
        <div className="form-control flex gap-4">
          <label className="text-sm font-semibold">Category</label>
          <select
            className="select select-bordered w-full"
            {...register('category', {
              validate: (value) => value && value !== 'none',
            })}
          >
            {DEVELOPMENT_JOB_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.displayLabel}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control flex gap-4">
          <label className="text-sm font-semibold">Country</label>
          <select
            className="select select-bordered w-full"
            {...register('country')}
          >
            {COUNTRIES_LIST.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control flex gap-4">
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

        <div className="form-control flex gap-4">
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
                        checked={value === opt.value}
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

        <div className="form-control flex gap-4">
          <label className="text-sm font-semibold">Employment type</label>
          <div>
            {EMPLOYMENT_TYPES.map((opt) => (
              <div key={opt.value} className="form-control items-start">
                <label
                  htmlFor={`field-${opt.value}`}
                  className="label cursor-pointer gap-4"
                >
                  <Controller
                    name="employmentTypes"
                    control={control}
                    rules={{ required: true }}
                    render={({
                      field: { onChange, onBlur, value, ...rest },
                    }) => (
                      <input
                        type="checkbox"
                        className="checkbox"
                        name="employmentTypes"
                        id={`field-${opt.value}`}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onChange([...value, opt.value]);
                          } else {
                            onChange(value.filter((v) => v !== opt.value));
                          }
                        }}
                        onBlur={() => onBlur(opt.value)}
                        checked={value.includes(opt.value)}
                        value={opt.value}
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
        <div className="form-control flex gap-4">
          <label className="text-sm font-semibold">Skills</label>
          <Controller
            control={control}
            name="skills"
            render={({ field: { onChange, value } }) => (
              <MultipleComboBox
                initialAllItems={SKILLS}
                onChange={onChange}
                initialSelectedItems={value}
              />
            )}
          />
        </div>
        <div className="form-control flex gap-4">
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
        <button type="submit" className="btn btn-primary">
          Continue
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default NewProfile;
