import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchAllCharacters} from '../store'

class AllCharacters extends React.Component {

  componentDidMount() {
    this.props.fetchCharacters()
  }

  render() {
    const characters = this.props.characters

    return (
      <div>
        <div className="characters-container">
          <h1>Characters</h1>
          {characters.map(character => (
            <Link
              to={`/characters/${character.id}`}
              className="characters"
              key={character.id}
            >
              <img src={character.imageUrl} />
              <h3>{character.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    characters: state.characters.allCharacters
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCharacters: () => {
      dispatch(fetchAllCharacters())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllCharacters)
