import React from 'react';
import PropTypes from 'prop-types';

const PageButton = (props) => {
  return (
    <li className={props.current === props.page ? 'active': ''}>
      <button type="button" value={props.page} onClick={(event) => props.clickHandler(event)}>{props.page}</button>
    </li>
  )
}


PageButton.propTypes = {
  page: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  clickHandler: PropTypes.func,
}

export default PageButton;
