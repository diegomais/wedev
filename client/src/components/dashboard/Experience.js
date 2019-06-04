import React, { Fragment } from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteExperience } from '../../redux/ducks/profile';

const Experience = ({ experience, deleteExperience }) => {
  return (
    <Fragment>
      <h2 className='my-2'>Experience Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Company</th>
            <th className='hide-sm'>Title</th>
            <th className='hide-sm'>Years</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {experience.map(item => (
            <tr key={item._id}>
              <td>{item.company}</td>
              <td className='hide-sm'>{item.title}</td>
              <td>
                <Moment format='DD/MM/YYYY'>
                  {moment.utc(item.startDate)}
                </Moment>
                -{' '}
                {item.endDate === null ? (
                  ' Now'
                ) : (
                  <Moment format='DD/MM/YYYY'>
                    {moment.utc(item.endDate)}
                  </Moment>
                )}
              </td>
              <td>
                <button
                  className='btn btn-danger'
                  onClick={() => deleteExperience(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteExperience }
)(Experience);
