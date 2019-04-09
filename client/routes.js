import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Login,
  Signup,
  Home,
  AllCharacters,
  OneCharacter,
  NoMatch
} from './components'
import {me} from './store'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props

    return (
      <Switch>
        {/* Routes placed here are available to all visitors, logged in or not*/}


        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route exact path="/characters" component={AllCharacters} />
        <Route path="/character/:characterId" component={OneCharacter} />

        {isLoggedIn && (
          <Switch>
            {/* Below routes are only available after logging in */}
            <Route exact path="/" component={Home} />
            <Route path="/home" component={Home} />
            {/* <Route path="/favorites" component={Favorites} /> */}
            <Route path="*" component={NoMatch} status={404} />
          </Switch>
        )}
        {/* Displays 404 page as a fallback */}
        <Route path="*" component={NoMatch} status={404} />
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked when the url changes
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
