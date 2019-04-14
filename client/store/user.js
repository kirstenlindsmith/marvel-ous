import history from '../history'
import { Auth } from 'aws-amplify'
import {signUp, handleConfirmationCode, signIn, signOut} from '../utils'

// let username = Math.random() + 'cody@gmail.com';

// signUp(username, '12345678910aB!')
// handleConfirmationCode('kirstenlindsmith@gmail.com', '070887')
// async function on(){
//   await signIn('kirstenlindsmith@gmail.com', '12345678910aB!')
//   console.log('CURRENT USER:', Auth.currentAuthenticatedUser())
// }

// on()

// console.log('current user line 28:', Auth.currentAuthenticatedUser())

// async function off(){
//   console.log('hit sign out')
//   await signOut()
//   console.log('CURRENT USER after signout:', Auth.currentAuthenticatedUser())
// }
// if (Auth.currentAuthenticatedUser().attributes) off()

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
    await signIn(email, password)
    console.log('SIGNED IN (in store):', Auth.currentAuthenticatedUser())
  } catch (err) {
    console.error('Error signing in in store:', err)
  }

  try {
    dispatch(getUser({username: Auth.currentAuthenticatedUser().attributes.email}))
    history.push('/home')
  } catch (err) {
    console.error('Error storing signed in user on state:', err)
  }
}

export const handleSignUp = (email, password) => async dispatch => {
  try {
    await signUp(email, password)
  } catch (err) {
    console.error('Error signing up in store:', err)
  }

  try {
    dispatch(sentCode())
  } catch (err) {
    console.error('Error sending code status to state:', err)
  }
}

export const handleConfirmation = (email, code) => async dispatch => {
  try {
    await handleConfirmationCode(email, code)
  } catch (err) {
    console.error('Error handling confirmation code in store:', err)
  }

  try {
    dispatch(sentCode())
  } catch (err) {
    console.error('Error sending code status to state:', err)
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
