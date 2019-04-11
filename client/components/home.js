import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

export const Home = (props) => {

  return (
    <div className="landing-page">
      <br />
      <center>
        <div id="graphic">
          <img src="/assets/characters.jpg"/>
          {/* <video muted preload="auto" autoPlay="autoplay" loop="loop" id="img">
            <source src="/assets/marvel.mp4" type="video/mp4" />
          </video> */} 
          {/* the video is a little too obnoxious maybe... */}
        </div>  
        
          <div id='welcome'>
            <h4 className="homeTitle">
              Welcome
            </h4>
            
            <Link to='/characters'><p>click here to start</p></Link>
          </div>
          
           
      </center>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapStateToProps)(Home)
