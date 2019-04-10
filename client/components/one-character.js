import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Modal, Tabs, Tab} from 'react-bootstrap'
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
    // console.log('instance!', instance)
    this.state= {
      displayModal: false,
      id: instance.id,
      name: instance.name.length>15 ? instance.name.slice(0,15)+"..." : instance.name,
      imageUrl: `${instance.thumbnail.path}.${instance.thumbnail.extension}`,
      description: !instance.description.length ? 'This character has no description. See the resource links for more information.' : instance.description,
      descriptionPreview: !instance.description.length ? `This character has no description. Click for more info!` : instance.description.length > 100 ? instance.description.slice(0,100)+"..." : instance.description,
      comics: instance.comics.items,
      series: instance.series.items,
      stories: instance.stories.items,
      detail: instance.urls.find(element => element.type==='detail'),
      wiki: instance.urls.find(element => element.type==="wiki"),
      comicLink: instance.urls.find(element => element.type==="comiclink")
    }

    this.openModal = this.openModal.bind(this)
    this.handleAddToFavorites = this.handleAddToFavorites.bind(this)
    this.isUserLoggedIn = this.isUserLoggedIn.bind(this)
    this.redirectToLogin = this.redirectToLogin.bind(this)
    this.handleRemoveFromFavorites = this.handleRemoveFromFavorites.bind(this)
    this.createTab = this.createTab.bind(this)
  }

  componentDidMount() {
    // this.props.fetchCharacter()
    // this.props.fetchFavorites()
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

  createTab(category, number){
    const categoryField = this.state[category]
    // console.log('category', category)
    return (
      <Tab eventKey={number} title={`${category.slice(0,1).toUpperCase()+category.slice(1)} ( ${categoryField.length} )`}>
        {categoryField.length ?
          <ul className='list-inline'>
            {categoryField.map((item, index)=>
              <li key={index}>
                <span className='label label-default'>{item.name}</span>
              </li>
            )}
          </ul> :
          <p className='noneFound'>None available.</p>
        }
      </Tab>
    )
  }

  render() {
    const {id, name, imageUrl, description, descriptionPreview, detail, wiki, comicLink} = this.state
    let inFaves = []

    if (this.props.favorites.favoritesList) {
      inFaves = this.props.order.favoritesList.filter(
        item => item.id === id
      )
    } else inFaves = []

    const buttonClickAction = this.isUserLoggedIn()
      ? this.handleAddToFavorites
      : this.redirectToLogin

    return (
      <div className='character' onClick={this.openModal}>
        <div className='text-center character-name'>
          <h3>{name}</h3>
        </div>
        <div className="character-image" style={{backgroundImage: `url('${imageUrl}')`}} />
        <p className='character-description descriptionPreview'>
          {descriptionPreview}
        </p>
        {/* <button
          type='button'
          className='oneCharacterButton'
          onClick={this.openModal}
        >
            Open
        </button> */}
        <Modal
          show={this.state.displayModal}
          onHide={this.closeModal}
          dialogClassName='character-modal'
        >
          <Modal.Header closeButton>
            <Modal.Title>{name}</Modal.Title>
            {inFaves.length === 0 ? (
              <button className="addFaveButton" type="button" name="add" onClick={buttonClickAction}>
                Save to Favorites
              </button>
            ) : (
              <button
                type="button"
                className="remove"
                onClick={this.handleRemoveFromFavorites}
              >
                Remove from Favorites
              </button>
            )}
          </Modal.Header>
          <Modal.Body>
            <img src={imageUrl} alt={name} className='character-modal-image' />
            <div className='character-modal-description'>
              <p>{description}</p>
              {detail &&
                <a href={detail.url} className="smallButton">
                  More Details
                </a>
              }
              {wiki &&
                <a href={wiki.url} className="smallButton">
                  Marvel Wiki Page
                </a>
              }
              {comicLink &&
                <a href={comicLink.url} className="smallButton">
                  See Comics
                </a>
              }
            </div>

            <Tabs defaultActiveKey={1} id="characterTabs" className="hidden-xs character-modal-tabs">

              {this.createTab('comics', 1)}
              {this.createTab('series', 2)}
              {this.createTab('stories', 3)}

            </Tabs>
          </Modal.Body>
        </Modal>
      </div>
    )
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
    // fetchCharacter: () => {
    //   const characterId = ownProps.match.params.characterId
    //   dispatch(fetchOneCharacter(characterId))
    // },
    // fetchFavorites: () => {
    //   dispatch(fetchFavorites())
    // },
    // addFavorite: (id, character) => {
    //   dispatch(addFavorite(id, character))
    // },
    // deleteFavorite: (characterId) => {
    //   dispatch(deleteFavorite(characterId))
    // }
  }
}

OneCharacter.propTypes = {
  instance: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(OneCharacter)
