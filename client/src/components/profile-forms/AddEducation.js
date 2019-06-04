import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addEducation } from '../../redux/ducks/profile';

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    description: '',
    startDate: '',
    endDate: '',
    current: false
  });

  const [endDateDisabled, toggleEndDateDisabled] = useState(false);

  const {
    school,
    degree,
    fieldOfStudy,
    description,
    startDate,
    endDate,
    current
  } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    addEducation(formData, history);
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Add Your Education</h1>
      <p className='lead'>
        <i className='fas fa-graduation-cap' /> Add any school, bootcamp, etc
        that you have attended
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* School or Bootcamp'
            name='school'
            value={school}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Degree or Certificate'
            name='degree'
            value={degree}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Field Of Study'
            name='fieldOfStudy'
            value={fieldOfStudy}
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
            Current School
          </p>
        </div>
        <div className='form-group'>
          <textarea
            cols='30'
            rows='5'
            placeholder='Program Description'
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

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired
};

export default connect(
  null,
  { addEducation }
)(withRouter(AddEducation));
