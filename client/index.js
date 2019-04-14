import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'
import { Auth } from 'aws-amplify'
import Analytics from '@aws-amplify/analytics'
import awsConfig from './amplify'

Auth.configure({Auth: awsConfig})
Analytics.configure({Auth: awsConfig})

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
)
