import history from '../history'
import { Auth } from 'aws-amplify'
import {signUp, handleConfirmationCode, signIn, signOut} from '../utils'

//test password: 12345678910aB!

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const SENT_CODE = 'SENT_CODE'
const REMOVE_USER = 'REMOVE_USER'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const sentCode = () => ({type: SENT_CODE})
const removeUser = () => ({type: REMOVE_USER})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const user = await Auth.currentAuthenticatedUser()
    dispatch(getUser(user || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const handleSignIn = (email, password) => async dispatch => {
  try {
    if (email && password) {
      await signIn(email, password)
    } else return;
  } catch (err) {
    console.error('Error signing in in store:', err)
  }

  try {
    if (Auth.currentAuthenticatedUser().attributes){
      dispatch(getUser({username: Auth.currentAuthenticatedUser().attributes.email}))
      history.push('/characters')
    }
  } catch (err) {
    console.error('Error storing signed in user on state:', err)
    return dispatch(getUser({error: err}))
  }
}

export const handleSignUp = (email, password) => async dispatch => {
  try {
    await signUp(email, password)
  } catch (err) {
    console.error('Error signing up in store:', err)
    return dispatch(getUser({error: err}))
  }

  try {
    dispatch(sentCode())
    history.push('/confirm')
  } catch (err) {
    console.error('Error sending code status to state:', err)
  }
}

export const handleConfirmation = (email, code) => async dispatch => {
  try {
    await handleConfirmationCode(email, code)
  } catch (err) {
    console.error('Error handling confirmation code in store:', err)
    return dispatch(getUser({error: err}))
  }

  try {
    dispatch(sentCode())
    history.push('/login')
  } catch (err) {
    console.error('Error sending code status to state:', err)
    return dispatch(getUser({error: err}))
  }
}


export const logout = () => async dispatch => {
  try {
    await signOut()
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error('Error signing out in store:', err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case SENT_CODE:
      return {'pending': true}
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
