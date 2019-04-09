import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Filters from './filters';
import SortByName from './sortByName';
import {logout} from '../store'
import {searchUtils} from './all-characters'

class Navbar extends Component {
  static defaultProps = searchUtils

  constructor(props){
    super(props)
    this.state={
      handleClick: props.handleClick,
      isLoggedIn: props.isLoggedIn,
      user: props.user
    }
  }
  render(){
    let username;
    const {handleClick, isLoggedIn, user} = this.state
    console.log('searchUtils', this.props.searchUtils)

    if (user) {
      username = user.slice(0, user.indexOf('@'))
      username = username.split('')
      username[0] = username[0].toUpperCase()
      username = username.join('')
    } else username = ''
    return (
      <div className='navContainer'>
        <nav className='navBar'>
          <Link to="/">
            <h1>Marvelous</h1>
          </Link>

          {isLoggedIn ? (
            <div className="right navLinks">
              {/* The navbar will show these links after a user logs in */}
              <div className="dropdown">
                <a href="#" className="dropLink">
                  Search
                </a>
                <div className="dropdown-content">
                  {/* <Filters
                    ref={filters => this.filters = filters}
                    onApply={this.filterResults}
                    onReset={this.resetFilters}
                  />
                  <SortByName
                    onChangeSort={this.sortByName}
                    onChangeLimit={this.changeTotalPerPage}
                  /> */}
                </div>
              </div>
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
            <div className="right navLinks">
              {/* The navbar will show these links before a user logs in */}
              <div className="dropdown">
                <a href="#" className="dropLink">
                  Search
                </a>
                <div className="dropdown-content">
                  {/* <Filters
                    ref={filters => this.filters = filters}
                    onApply={this.filterResults}
                    onReset={this.resetFilters}
                  />
                  <SortByName
                    onChangeSort={this.sortByName}
                    onChangeLimit={this.changeTotalPerPage}
                  /> */}
                </div>
              </div>
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
  isLoggedIn: PropTypes.bool.isRequired,
}
