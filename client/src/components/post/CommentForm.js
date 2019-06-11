import React, { useState } from 'react';
import { addComment } from '../../redux/ducks/post';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const CommentForm = ({ postId, addComment }) => {
  const [text, setText] = useState('');

  return (
    <div className='post-form'>
      <div className='post-form-header bg-primary'>
        <h3>Leave a comment</h3>
      </div>
      <form
        className='form my-1'
        onSubmit={e => {
          e.preventDefault();
          addComment(postId, { text });
          setText('');
        }}
      >
        <textarea
          cols='30'
          rows='5'
          placeholder='Create a post'
          name='text'
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <input type='submit' value='Submit' className='btn btn-dark my-1' />
      </form>
    </div>
  );
};

CommentForm.propTypes = { addComment: PropTypes.func.isRequired };

export default connect(
  null,
  { addComment }
)(CommentForm);
