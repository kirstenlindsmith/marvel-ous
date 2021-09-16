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
  Favorites,
  NoMatch
} from './components'
import {me} from './store'


class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props

    return (
      <Switch>
        {/* These first routes are available to ALL visitors, logged in or not*/}

        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route
          exact path="/characters"
          render={()=> <AllCharacters pageType='allCharacters'/>}
        />

        {isLoggedIn && (
          <Switch>
            {/* Below routes are only available AFTER logging in */}
            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Home} />
            <Route
              exact path="/favorites"
              render={()=> <AllCharacters pageType='favorites'/>}
            />
            <Route path="*" component={NoMatch} status={404} />
          </Switch>
        )}
        {/* Displays 404 page as a fallback */}
        <Route path="*" component={NoMatch} status={404} />
      </Switch>
    )
  }
}


const mapStateToProps = state => {
  return {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes))


Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
