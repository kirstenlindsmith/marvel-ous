import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

export const Home = (props) => {
  const email = props.email
  let username
  if (email){
   const emailUsername = props.email.slice(0, (props.email.indexOf('@')))
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
            
            {!username && 
              <div id='noUserTitle'>
                <h4>
                  Welcome
                </h4>
                <Link to='/characters'><p>click here to start</p></Link>
              </div>
            }
            
            {username &&
              <div id="userTitle">
                <h4>
                  Welcome
                </h4>
                <h3 id="homeUsername">
                  {username}
                </h3>
                <Link to='/characters'><p>click here to start</p></Link>
              </div>  
            }
            
          </div>
          
           
      </center>
    </div>
  )
}


const mapStateToProps = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapStateToProps)(Home)
