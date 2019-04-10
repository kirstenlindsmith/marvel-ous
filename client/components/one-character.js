import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import history from '../history'
import {Modal, Tabs, Tab} from 'react-bootstrap'
import toastr from 'toastr'
import {me, addFavorite, fetchFavorites, deleteFavorite} from '../store'
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

class OneCharacter extends Component {
  constructor(props) {
    super(props)
    const {instance} = props
    this.state = {
      displayModal: false,
      id: instance.id,
      fullname: instance.name,
      name:
        instance.name.length > 15
          ? instance.name.slice(0, 15) + '...'
          : instance.name,
      imageUrl: `${instance.thumbnail.path}.${instance.thumbnail.extension}`,
      description: !instance.description.length
        ? 'This character has no description. See the resource links for more information.'
        : instance.description,
      descriptionPreview: !instance.description.length
        ? `This character has no description. Click for more info!`
        : instance.description.length > 100
          ? instance.description.slice(0, 100) + '...'
          : instance.description,
      comics: instance.comics.items,
      series: instance.series.items,
      stories: instance.stories.items,
      detail: instance.urls.find(element => element.type === 'detail'),
      wiki: instance.urls.find(element => element.type === 'wiki'),
      comicLink: instance.urls.find(element => element.type === 'comiclink')
    }

    this.toggleModal = this.toggleModal.bind(this)
    this.handleAddToFavorites = this.handleAddToFavorites.bind(this)
    this.isUserLoggedIn = this.isUserLoggedIn.bind(this)
    this.redirectToLogin = this.redirectToLogin.bind(this)
    this.handleRemoveFromFavorites = this.handleRemoveFromFavorites.bind(this)
    this.createTab = this.createTab.bind(this)
  }

  async componentDidMount() {
    await this.props.getUser()
    if (this.props.user.id){
      await this.props.fetchFavorites()
    }
  }

  toggleModal() {
    if(this.state.displayModal){
      this.setState({displayModal: false})
    } else this.setState({displayModal: true})
  }

  handleAddToFavorites() {
    const character = this.state.fullname
    if (!(this.props.favorites.includes(character))){
      this.props.addFavorite(character)
      toastr.success('Added character to favorites.', 'Success!')
    } else {
      toastr.warning('Character already in favorites.', 'Alert')
    }
  }

  handleRemoveFromFavorites() {
    const character = this.state.fullname
    if (this.props.favorites.includes(character)){
      this.props.deleteFavorite(character)
      toastr.error('Character removed from favorites.', 'Success!')
    } else {
      toastr.warning('Character not a favorite.', 'Alert')
    }
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
    toastr.info('You must be signed in to save favorite characters!', 'Alert')
    setTimeout(() => {
      toastr.info('Redirecting to login page.', 'Alert')
    }, 800)
    setTimeout(() => {
      history.push('/login')
    }, 3000)
  }

  createTab(category, number) {
    const categoryField = this.state[category]
    return (
      <Tab
        eventKey={number}
        title={`${category.slice(0, 1).toUpperCase() + category.slice(1)} ( ${
          categoryField.length
        } )`}
      >
        {categoryField.length ? (
          <ul className="list-inline">
            {categoryField.map((item, index) => (
              <li key={index}>
                <span className="label label-default">{item.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="noneFound">None available.</p>
        )}
      </Tab>
    )
  }

  render() {
    const {
      id,
      fullname,
      name,
      imageUrl,
      description,
      descriptionPreview,
      detail,
      wiki,
      comicLink
    } = this.state

    let inFaves

    if (this.props.favorites.includes(fullname)) {
      inFaves = true
    } else inFaves = false

    const buttonClickAction = this.isUserLoggedIn()
      ? this.handleAddToFavorites
      : this.redirectToLogin

    return (
      <div className="character">
        <div className="text-center character-name" onClick={this.toggleModal}>
          <h3>{name}</h3>
        </div>
        <div
          className="character-image"
          style={{backgroundImage: `url('${imageUrl}')`}}
          onClick={this.toggleModal}
        />
        <p className="character-description descriptionPreview" onClick={this.toggleModal}>
          {descriptionPreview}
        </p>

        <Modal
          show={this.state.displayModal}
          onHide={()=>{console.log('mandatory onClick function')}}
          dialogClassName="character-modal"
          className="character-modal"
        >
          <Modal.Header>
            <Modal.Title>{fullname}</Modal.Title>
            {!inFaves ? (
              <button
                className="addFaveButton"
                type="button"
                name="add"
                onClick={buttonClickAction}
              >
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
            <button type="button" onClick={this.toggleModal}>
              x
            </button>
          </Modal.Header>
          <Modal.Body>
            <img src={imageUrl} alt={name} className="character-modal-image" />
            <div className="character-modal-description">
              <p>{description}</p>
              {detail && (
                <a href={detail.url} className="smallButton"><button type='button'>
                    More Details
                  </button>
                </a>
              )}
              {wiki && (
                <a href={wiki.url} className="smallButton"><button type='button'>
                    Marvel Wiki Page
                  </button>
                </a>
              )}
              {comicLink && (
                <a href={comicLink.url} className="smallButton"><button type='button'>
                    See Comics
                  </button>
                </a>
              )}
            </div>

            <Tabs
              defaultActiveKey={1}
              id="characterTabs"
              className="hidden-xs character-modal-tabs"
            >
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
    user: state.user,
    favorites: state.favorites
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchFavorites: () => {
      dispatch(fetchFavorites())
    },
    addFavorite: (character) => {
      dispatch(addFavorite(character))
    },
    deleteFavorite: (character) => {
      dispatch(deleteFavorite(character))
    },
    getUser: () => {
      dispatch(me())
    }
  }
}

OneCharacter.propTypes = {
  instance: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(OneCharacter)
