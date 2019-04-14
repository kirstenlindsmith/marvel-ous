/* eslint-disable complexity */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {handleConfirmation} from '../store'

class confirmationForm extends Component {

  constructor() {
    super()
    this.state = {
      email: '',
      code: '',
      interactedWith: {
        email: false,
        code: false
      }
    }
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.isEmailValid = this.isEmailValid.bind(this)
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

  doFieldsHaveErrors() {
    return {
      email: this.isEmailValid() === false,
      code: this.state.code.length > 0
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
    const isCodeWarningDisplayed = this.shouldTheFieldMarkError('code')
      ? 'errorWarning'
      : 'hidden'

    return {
      isButtonWorking,
      errorDisplay,
      isEmailWarningDisplayed,
      isCodeWarningDisplayed
    }
  }

  render() {
    const {handleSubmit, error} = this.props
    const {
      isButtonWorking,
      errorDisplay,
      isEmailWarningDisplayed,
      isCodeWarningDisplayed
    } = this.variablesForRender()

    return (
      <div className="login confirm">
      <h1>Confirm Account</h1>
        <div className="form-container">
          <form onSubmit={handleSubmit} name='confirm'>
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
            <label className='authLabel' htmlFor="code">Confirmation Code</label>
            <span className={isCodeWarningDisplayed}>
              Code is required.<br />
            </span>
            <input
              name="code"
              type="code"
              onChange={this.handleFieldChange}
              className={errorDisplay('code') ? 'fieldError' : ''}
              onBlur={this.handleBlurWhenInteracting('code')}
            />
            <Link to='/login'>
              <button type="button" id="loginFromSignup" className="signupButton">
                Confirm
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


const mapStateToProps = state => {
  return {
    error: state.user.error,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const email = evt.target.email.value
      const code = evt.target.code.value

      dispatch(handleConfirmation(email, code))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(confirmationForm)
