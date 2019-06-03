import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addExperience } from '../../redux/ducks/profile';

const AddExperience = ({ addExperience, history }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    startDate: '',
    endDate: '',
    current: false
  });

  const [endDateDisabled, toggleEndDateDisabled] = useState(false);

  const {
    title,
    company,
    location,
    description,
    startDate,
    endDate,
    current
  } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    addExperience(formData, history);
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Add An Experience</h1>
      <p className='lead'>
        <i className='fab fa-black-tie' /> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Job Title'
            name='title'
            value={title}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Company'
            name='company'
            value={company}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Location'
            name='location'
            value={location}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <h4>Start Date</h4>
          <input
            type='date'
            name='startDate'
            value={startDate}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <h4>End Date</h4>
          <input
            type='date'
            name='endDate'
            value={endDate}
            onChange={e => onChange(e)}
            disabled={endDateDisabled ? 'disabled' : ''}
          />
        </div>
        <div className='form-group'>
          <p>
            <input
              type='checkbox'
              checked={current}
              name='current'
              value={current}
              onChange={e => {
                setFormData({ ...formData, current: !current });
                toggleEndDateDisabled(!endDateDisabled);
              }}
            />{' '}
            Current Job
          </p>
        </div>
        <div className='form-group'>
          <textarea
            cols='30'
            rows='5'
            placeholder='Job Description'
            name='description'
            value={description}
            onChange={e => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn my-1' to='dashboard'>
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired
};

export default connect(
  null,
  { addExperience }
)(withRouter(AddExperience));
