import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../redux/ducks/profile';
import Spinner from '../layout/Spinner';
import Experience from './Experience';
import Education from './Education';

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading }
}) => {
  useEffect(() => {
    getCurrentProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome {user && user.name}
      </p>

      {profile !== null ? (
        <Fragment>
          <div className='dash-buttons'>
            <Link to='/edit-profile' className='btn btn-light'>
              <i className='fas fa-user-circle text-primary' /> Edit Profile
            </Link>
            <Link to='/add-experience' className='btn btn-light'>
              <i className='fab fa-black-tie text-primary' /> Add Experience
            </Link>
            <Link to='/add-education' className='btn btn-light'>
              <i className='fas fa-graduation-cap text-primary' /> Add Education
            </Link>
          </div>
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
        </Fragment>
      ) : (
        <Fragment>
          <p>You don't have a profile yet, let's create your profile now?</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Dashboard);
