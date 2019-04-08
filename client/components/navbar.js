import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn, user}) => {
  let username
  if (user) {
    username = user.slice(0, user.indexOf('@'))
    username = username.split('')
    username[0] = username[0].toUpperCase()
    username = username.join('')
  } else username = ''
  return (
    <div>
      <nav>
        <Link to="/">
          <h1>Marvelous</h1>
        </Link>
        {isLoggedIn ? (
          <div className="right">
            {/* The navbar will show these links after a user logs in */}
            <Link to="/characters">
              Characters
            </Link>
            <div className="dropdown">
              <a href="#" className="dropLink">
                Account
              </a>
              <div className="dropdown-content">
                <Link to="/favorites">
                  Favorites
                </Link>
                <a href="#" onClick={handleClick}>
                  Logout
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="right">
            {/* The navbar will show these links before a user logs in */}
            <Link to="/characters">
              Characters
            </Link>
            <div className="dropdown">
              <a href="#" className="dropLink">
                Account
              </a>
              <div className="dropdown-content">
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.user.id,
    user: state.user.email
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
