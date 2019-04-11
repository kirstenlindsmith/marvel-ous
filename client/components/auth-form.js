import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {auth} from '../store'

class AuthForm extends Component {
  freshpage = false
  
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      interactedWith: {
        email: false,
        password: false
      }
    }
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.isEmailValid = this.isEmailValid.bind(this)
    this.doFieldsHaveErrors = this.doFieldsHaveErrors.bind(this)
    this.shouldTheFieldMarkError = this.shouldTheFieldMarkError.bind(this)
    this.handleBlurWhenInteracting = this.handleBlurWhenInteracting.bind(this)
    this.variablesForRender = this.variablesForRender.bind(this)
  }
  
  componentDidMount(){
    this.freshpage = true
  }
  
  shouldComponentUpdate(nextProps){
    return !!(this.props.displayName !== nextProps.displayname)
  }
  
  componentWillUnmount(){
    this.freshpage = false
  }

  handleFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  isEmailValid() {
    const {email} = this.state
    return email.includes('@') && email.includes('.')
  }

  doFieldsHaveErrors() {
    const {password} = this.state
    return {
      email: this.isEmailValid() === false,
      password: password.length === 0
    }
  }

  shouldTheFieldMarkError(field) {
    const errors = this.doFieldsHaveErrors()
    const hasError = errors[field]
    const shouldDisplayError = this.state.interactedWith[field]

    return hasError ? shouldDisplayError : false
  }

  handleBlurWhenInteracting(field) {
    return () => {
      this.setState({
        interactedWith: {[field]: true}
      })
    }
  }

  variablesForRender() {
    const isButtonWorking = !Object.values(this.doFieldsHaveErrors()).includes(
      true
    )
    const errorDisplay = this.shouldTheFieldMarkError
    const isEmailWarningDisplayed = this.shouldTheFieldMarkError('email')
      ? 'errorWarning'
      : 'hidden'
    const isPasswordWarningDisplayed = this.shouldTheFieldMarkError('password')
      ? 'errorWarning'
      : 'hidden'

    return {
      isButtonWorking,
      errorDisplay,
      isEmailWarningDisplayed,
      isPasswordWarningDisplayed
    }
  }

  render() {
    const {name, displayName, handleSubmit, error} = this.props
    const {
      isButtonWorking,
      errorDisplay,
      isEmailWarningDisplayed,
      isPasswordWarningDisplayed
    } = this.variablesForRender()

    if (displayName === 'Login') {
      return (
        <div className="login">
          <img className='authImage' id="spidey" src="/assets/spidey.png" />
          <div className="form-container" id="loginForm">
            <h1>Login</h1>
            <form onSubmit={handleSubmit} name={name}>
              <label className='authLabel' htmlFor="email">Email</label>
              <input name="email" type="text" />

              <label className='authLabel' htmlFor="password">Password</label>
              <input name="password" type="password" />
              <button id='loginSubmit' type="submit">{displayName}</button>
              <a href="/auth/google">
                <button type="button" className="googleOAuth">
                  <img id='googleLoginImg' src="https://www.searchpng.com/wp-content/uploads/2018/11/google_icon_2048.png" />
                  <span id="loginWithGoogle">{displayName} with Google</span>
                </button>
              </a>
              <Link to="/signup">
                <button type="button" id="signUpFromLogin" className="remove">
                  Sign Up
                </button>
              </Link>
              {error && error.response && !this.freshpage && <div id="error"> {error.response.data} </div>}
            </form>
          </div>
        </div>
      )
    } else { //signup
      return (
        <div className="login">
          <div className="form-container">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} name={name}>
              <label className='authLabel' htmlFor="email">Email</label>
              <span className={isEmailWarningDisplayed}>
                Must be a valid email address
              </span>
              <input
                name="email"
                type="text"
                onChange={this.handleFieldChange}
                className={errorDisplay('email') ? 'fieldError' : ''}
                onBlur={this.handleBlurWhenInteracting('email')}
              />
              <label className='authLabel' htmlFor="password">Password</label>
              <span className={isPasswordWarningDisplayed}>
                Password required<br />
              </span>
              <input
                name="password"
                type="password"
                onChange={this.handleFieldChange}
                className={errorDisplay('password') ? 'fieldError' : ''}
                onBlur={this.handleBlurWhenInteracting('password')}
              />
              <button className="signupButton" id="signup" type="submit" disabled={!isButtonWorking}>
                {displayName}
              </button>
              <a href="/auth/google">
                <button type="button" className="googleOAuth">
                  <img id='googleSignupImg' src="https://www.searchpng.com/wp-content/uploads/2018/11/google_icon_2048.png" />
                  <span id='signupWithGoogle'>{displayName} with Google</span>
                </button>
              </a>
              <Link to='/login'>
                <button type="button" id="loginFromSignup" className="signupButton">
                  Login
                </button>
              </Link>
              {error && error.response && !this.freshpage && <div id="error"> {error.response.data} </div>}
            </form>
          </div>
          <img className='authImage' id="peter" src="/assets/peter.png" />
        </div>
      )
    }
  }
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLoginToProps = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignupToProps = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export const Login = connect(mapLoginToProps, mapDispatchToProps)(AuthForm)
export const Signup = connect(mapSignupToProps, mapDispatchToProps)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
