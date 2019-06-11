import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../redux/ducks/auth';

const Navbar = ({ auth: { isAuthenticated, loading }, logoutUser }) => {
  const guestLinks = (
    <ul>
      <li>
        <Link to='/developers'>
          <i className='fab fa-connectdevelop' /> Developers
        </Link>
      </li>
      <li>
        <Link to='/register'>
          <i className='fas fa-user-plus' /> Register
        </Link>
      </li>
      <li>
        <Link to='/login'>
          <i className='fas fa-sign-in-alt' /> Login
        </Link>
      </li>
    </ul>
  );
  const authLinks = (
    <ul>
      <li>
        <Link to='/developers'>
          <i className='fab fa-connectdevelop' /> Developers
        </Link>
      </li>
      <li>
        <Link to='/posts'>
          <i class='fas fa-comment-alt' /> Posts
        </Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user' /> Dashboard
        </Link>
      </li>
      <li>
        <a onClick={logoutUser} href='#!'>
          <i className='fas fa-sign-out-alt' />{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code' /> WeDev
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ auth: state.auth });

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);
