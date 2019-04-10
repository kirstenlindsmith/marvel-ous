import React, {Component} from 'react'
import {connect} from 'react-redux'
import {me, fetchFavorites, deleteFavorite} from '../store'

class Favorites extends Component {
  componentDidMount(){
    this.props.fetchFavorites()
    this.props.getUser()
  }

  render(){

    return (
      <div className="landing-page">
        <br />
        <center>
          <div>
            <h4>
              Under Construction
            </h4>
          </div>
        </center>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchFavorites() {
      dispatch(fetchFavorites())
    },
    getUser() {
      dispatch(me())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites)
