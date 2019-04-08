import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Modal} from 'react-bootstrap'
import {
  fetchOneCharacter,
  addFavorite,
  fetchFavorites,
  deleteFavorite
} from '../store'
import toastr from 'toastr'

class OneCharacter extends Component {
  constructor(props) {
    super(props)
    const {instance} = props
    this.state= {
      displayModal: false,
      id: instance.id,
      name: instance.name,
      imageUrl: `${instance.thumbnail.path}.${instance.thumbail.extension}`,
      description: !instance.description.length ? 'Description not found.' : instance.description,
      descriptionPreview: !instance.description.length ? 'Description not found.' : instance.description.length > 100 ? instance.description.substring(0.150)+"..." : instance.description,
      detail: instance.urls.find(element => element.type==='detail' ? element.url : null),
      wiki: instance.urls.find(element => element.type==="wiki" ? element.url : null),
      comics: instance.urls.find(element => element.type==="comiclink" ? element.url : null)
    }

    this.showModal = this.showModal.bind(this)
    this.handleAddToFavorites = this.handleAddToFavorites.bind(this)
    this.isUserLoggedIn = this.isUserLoggedIn.bind(this)
    this.redirectToLogin = this.redirectToLogin.bind(this)
    this.handleRemoveFromFavorites = this.handleRemoveFromFavorites.bind(this)
  }

  componentDidMount() {
    this.props.fetchCharacter()
    this.props.fetchFavorites()
  }

  openModal() {
    this.setState({ displayModal: true })
  }

  closeModal() {
    this.setState({ displayModal: false })
  }

  handleAddToFavorites() {
    const character = this.props.product
    const characterId = this.props.character.id

    this.props.addCharacter(characterId, character)

    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: 'toast-bottom-left',
      preventDuplicates: false,
      onclick: null,
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '5000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut'
    }
    toastr.success('Added character to favorites.', 'Success!')
  }

  handleRemoveFromFavorites() {
    const characterId = this.props.character.id

    this.props.deleteFavorite(characterId)

    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: 'toast-bottom-left',
      preventDuplicates: false,
      onclick: null,
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '5000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut'
    }
    toastr.error('Character removed from favorites.', 'Success!')
  }

  isUserLoggedIn() {
    const user = this.props.user
    if (Object.keys(user).length) return true
    else return false
  }

  redirectToLogin() {
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: 'toast-bottom-left',
      preventDuplicates: false,
      onclick: null,
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '5000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut'
    }
    toastr.warning('You must be signed in to save favorite characters!', 'Notice:')

    const history = this.props.history
    history.push('/login')
  }

  render() {
    const {id, name, imageUrl, description, descriptionPreview, detail, wiki, comics} = this.state

    return (
      <div className='character'>
        <div className='text-center character-name'>
          <h3>{name}</h3>
        </div>
        <div className="Character-image" style={{backgroundImage: `url('${this.image}')`}} />
        <p className='character-description'>
          {descriptionPreview}
        </p>
        <button
          type='button'
          className='oneCharacterButton'
          onClick={this.openModal}
        >
            Select
        </button>
        <Modal
          show={this.state.displayModal}
          onHide={this.closeModal}
          dialogClassName='character-modal'
        >
          <Modal.Header closeButton>
            <Modal.Title>{name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={imageUrl} alt={name} className='character-modal-image' />
            <div className='character-modal-description'>
              <h4>Description</h4>
              <p>{description}</p>

            </div>
          </Modal.Body>
        </Modal>
      </div>
    )

    // if (id) {
    //   let inFaves = []

    //   if (this.props.favorites.favoritesList) {
    //     inFaves = this.props.order.favoritesList.filter(
    //       item => item.id === character.id
    //     )
    //   } else inFaves = []

    //   const buttonClickAction = this.isUserLoggedIn()
    //     ? this.handleAddToFavorites
    //     : this.redirectToLogin

    //   return (
    //     <div>
    //       <div className="detailed-container">
    //         <Link to="/characters" className="link">
    //           <b>
    //             {'⇦ '}
    //             <u>Return to All Characters</u>
    //           </b>
    //         </Link>
    //         <img src={imageUrl} />
    //         <div className="about">
    //           <h1>{name}</h1>
    //           <hr />
    //           {inFaves.length === 0 ? (
    //             <button type="button" name="add" onClick={buttonClickAction}>
    //               Save to Favorites
    //             </button>
    //           ) : (
    //             <button
    //               type="button"
    //               className="remove"
    //               onClick={this.handleRemoveFromFavorites}
    //             >
    //               Remove from Favorites
    //             </button>
    //           )}
    //           <p>
    //             <b>Description</b>:
    //           </p>
    //           {description}
    //         </div>
    //       </div>
    //     </div>
    //   )
    // } else {
    //   return <div />
    // }
  }
}

const mapStateToProps = state => {
  return {
    character: state.characters.selectedCharacter,
    user: state.user,
    favorites: state.favorites
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchProduct: () => {
      const characterId = ownProps.match.params.characterId
      dispatch(fetchOneCharacter(characterId))
    },
    fetchCart: () => {
      dispatch(fetchFavorites())
    },
    addItem: (id, character) => {
      dispatch(addFavorite(id, character))
    },
    deleteCartItem: (characterId) => {
      dispatch(deleteFavorite(characterId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OneCharacter)
