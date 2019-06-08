import React from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import PropTypes from 'prop-types';

const ProfileEducation = ({
  education: { school, degree, fieldOfStudy, startDate, endDate, description }
}) => (
  <div>
    <h3 className='text-dark'>{school}</h3>
    <p>
      <Moment format='DD/MM/YYYY'>{moment.utc(startDate)}</Moment> -{' '}
      {!endDate ? (
        ' Now'
      ) : (
        <Moment format='DD/MM/YYYY'>{moment.utc(endDate)}</Moment>
      )}
    </p>
    <p>
      <strong>Degree: </strong> {degree}
    </p>
    <p>
      <strong>Field Of Study: </strong> {fieldOfStudy}
    </p>
    <p>
      <strong>Description: </strong> {description}
    </p>
  </div>
);

ProfileEducation.propTypes = { education: PropTypes.object.isRequired };

export default ProfileEducation;
