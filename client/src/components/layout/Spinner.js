import React, { Fragment } from 'react';
import spinner from '../../img/spinner.gif';

export default () => (
  <Fragment>
    <img src={spinner} className={spinner} alt='Loading...' />
  </Fragment>
);
