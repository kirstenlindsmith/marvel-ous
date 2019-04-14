import { Auth } from 'aws-amplify'

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


export function signUp(username, password){

  Auth.signUp({
      username,
      password,
      })
      .then(data => console.log(data))
      .catch(err => console.error('Error signing up new user:', err))

}

export function handleConfirmationCode(username, code){
  //aws will send an email to the username provided. The user then needs to copy paste that code back into the front end to confirm ownership of their email

  Auth.confirmSignUp(username, code, {
      // Optional. Force user confirmation irrespective of existing alias. By default set to True.
      forceAliasCreation: true
  }).then(data => console.log(data))
    .catch(err => console.error('Error confirming email:', err))

  Auth.resendSignUp(username).then(() => {
      console.log('code resent successfully')
  }).catch(err => {
      console.error('Error resending signup after email verification:', err)
  })
}


export function signIn(username, password){
  try {
    Auth.signIn(username, password).then(user => console.log('Signed in: ', user))
  } catch (error) {
    console.error('Error signing in:', error)
  }
}

export function signOut(){
  Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.error('Error signing out:', err))
}
