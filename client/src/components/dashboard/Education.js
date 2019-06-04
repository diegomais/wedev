import React, { Fragment } from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteEducation } from '../../redux/ducks/profile';

const Education = ({ education, deleteEducation }) => {
  return (
    <Fragment>
      <h2 className='my-2'>Education Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>School</th>
            <th className='hide-sm'>Degree</th>
            <th className='hide-sm'>Years</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {education.map(item => (
            <tr key={item._id}>
              <td>{item.school}</td>
              <td className='hide-sm'>{item.degree}</td>
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
                  onClick={() => deleteEducation(item._id)}
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

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteEducation }
)(Education);
