import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {me, logout} from '../store'
import { Auth } from 'aws-amplify'

class Navbar extends Component {

  componentDidMount(){
    this.props.getUser()
    // console.log('USER IN NAVBAR CDM:', Auth.currentAuthenticatedUser())
  }

  // shouldComponentUpdate(nextProps) {
  //   // return (this.props !== nextProps)
  // }

  // componentDidUpdate(prevProps) {
  //   if (Object.keys(this.))
  // }

  render(){
    const {handleClick, isLoggedIn} = this.props

    return (
      <div className='navContainer'>
        <nav className='navBar'>
          <Link to="/">
            <h1>Marvelous</h1>
          </Link>

          {isLoggedIn ? (
            <div className="right navLinks">
              {/* The navbar will show these links AFTER a user logs in */}
              <Link to="/characters">
                Characters
              </Link>
              <div className="dropdown">
                <a href="#" className="dropLink">
                  Account
                </a>
                <div className="dropdown-content">
                  {/* <Link to="/favorites">
                    Favorites
                  </Link> */}
                  <a href="#" onClick={handleClick}>
                    Logout
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="right navLinks">
              {/* The navbar will show these links BEFORE a user logs in */}
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
}


const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.user.attributes,
    user: state.user.attributes,
    state: state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    },
    getUser() {
      dispatch(me())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)


Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
}
