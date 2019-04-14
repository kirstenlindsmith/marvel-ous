/* eslint-disable complexity */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {handleSignIn, handleSignUp} from '../store'

//test password: 12345678910aB!
//conf code for andrew: 345792
//conf code for kirsten@mailinator: 293319

class AuthForm extends Component {

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
    this.isPasswordValid = this.isPasswordValid.bind(this)
    this.doFieldsHaveErrors = this.doFieldsHaveErrors.bind(this)
    this.shouldTheFieldMarkError = this.shouldTheFieldMarkError.bind(this)
    this.handleBlurWhenInteracting = this.handleBlurWhenInteracting.bind(this)
    this.variablesForRender = this.variablesForRender.bind(this)
  }


  shouldComponentUpdate(nextProps){
    return !!(this.props.displayName !== nextProps.displayname)
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

  isPasswordValid() {
    const {password} = this.state
    const rightLength = password.length >= 6
    const hasUppercaseChar = new RegExp('/(?=.*[A-Z])/')
    const hasLowercaseChar = new RegExp ('/(?=.*[a-z])/')
    const hasNumber = new RegExp ('/(?=.*[0-9])/')
    // const hasSpecialChar = new RegExp('/(?=.[!@#\$%\^&])/')

    return (rightLength)
      // &&
  //           hasUppercaseChar.test(password) &&
  //           hasLowercaseChar.test(password) &&
  //           hasNumber.test(password)
  //           // && hasSpecialChar.test(password)
  //           )
  }

  doFieldsHaveErrors() {
    return {
      email: this.isEmailValid() === false,
      password: this.isPasswordValid() === false
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
    // const isButtonWorking = !Object.values(this.doFieldsHaveErrors()).includes(
    //   true
    // )
    const isButtonWorking = true
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
              <Link to="/signup">
                <button type="button" id="signUpFromLogin" className="remove">
                  Sign Up
                </button>
              </Link>
              {error && error.response && <div id="error"> {error.response.data}
              </div>}
              {error && !error.response && <div id="error"> {error} </div>}
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
                Password must be 6+ chars, <br/>with one UPPERCASE,  <br/>one lowercase,  <br/>and one special character.<br/>
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
              <Link to='/login'>
                <button type="button" id="loginFromSignup" className="signupButton">
                  Login
                </button>
              </Link>
              {error && error.response && <div id="error"> {error.response.data} </div>}
            </form>
          </div>
          <img className='authImage' id="peter" src="/assets/peter.png" />
        </div>
      )
    }
  }
}


const mapLoginToProps = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error,
    user: state.user
  }
}

const mapSignupToProps = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value

      formName === 'login' ? (
        dispatch(handleSignIn(email, password))
      ) : (
        dispatch(handleSignUp(email, password))
      )
    }
  }
}

export const Login = connect(mapLoginToProps, mapDispatchToProps)(AuthForm)
export const Signup = connect(mapSignupToProps, mapDispatchToProps)(AuthForm)


AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired
}
