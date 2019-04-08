import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

export const Home = () => {

  return (
    <div className="landing-page">
      <br />
      <center>
        <div>
          <img src="https://3c1703fe8d.site.internapcdn.net/newman/gfx/news/hires/2018/plantindoor.jpg" />
          {/* <video preload="auto" autoPlay="autoplay" loop="loop" id="img">
            <source src="https://i.imgur.com/G6qr5Ek.mp4" type="video/mp4" />
          </video> */}
          <div id="landingDiv">
            <h4 className="promotion" id="promotion">
              To plant a garden <br />is to believe in tomorrow.
            </h4>
            <button type="button" className="btn">
              <Link to="/products" className="link">
                SHOP
              </Link>
            </button>
          </div>
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
