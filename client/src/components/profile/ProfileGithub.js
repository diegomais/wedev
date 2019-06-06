import React, { useEffect } from 'react';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGitHubRepositories } from '../../redux/ducks/profile';

const ProfileGithub = ({
  username,
  getGitHubRepositories,
  githubRepositories
}) => {
  useEffect(() => {
    getGitHubRepositories(username);
  }, [getGitHubRepositories, username]);

  return (
    <div className='profile-github'>
      <h2 className='text-primary my-1'>Github Repositories</h2>
      {githubRepositories === null ? (
        <Spinner />
      ) : (
        githubRepositories.map(repository => (
          <div key={repository._id} className='repo bg-white p-1 my-1'>
            <div>
              <h4>
                <a
                  href={repository.html_url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {repository.name}
                </a>
              </h4>
              <p>{repository.description}</p>
            </div>
            <div>
              <ul>
                <li className='badge badge-primary'>
                  Stars: {repository.stargazers_count}
                </li>
                <li className='badge badge-dark'>
                  Watchers: {repository.watchers_count}
                </li>
                <li className='badge badge-light'>
                  Forks: {repository.forks_count}
                </li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired,
  getGitHubRepositories: PropTypes.func.isRequired,
  githubRepositories: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  githubRepositories: state.profile.githubRepositories
});

export default connect(
  mapStateToProps,
  { getGitHubRepositories }
)(ProfileGithub);
