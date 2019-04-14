import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

export const Home = (props) => {
  let email;
  if (props.user) email = props.user.email
  let username
  if (email){
   const emailUsername = email.slice(0, (email.indexOf('@')))
   username = emailUsername.slice(0,1).toUpperCase()+emailUsername.slice(1)
  }

  return (
    <div className="landing-page">
      <br />
      <center>
        <div id="graphic">
          <img src="/assets/characters.jpg"/>
        </div>

          <div id='welcome'>

            {!username ? (
                <div id='noUserTitle'>
                  <h4>
                    Welcome
                  </h4>
                  <Link to='/characters'><p>click here to start</p></Link>
                </div>
              ) : (
                <div id="userTitle">
                  <h4>
                    Welcome
                  </h4>
                  <h3 id="homeUsername">
                    {username}
                  </h3>
                  <Link to='/characters'><p>click here to start</p></Link>
                </div>
              )
            }
          </div>
      </center>
    </div>
  )
}


const mapStateToProps = state => {
  return {
    user: state.user.attributes
  }
}

export default connect(mapStateToProps)(Home)
