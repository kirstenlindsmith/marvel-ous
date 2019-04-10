import React, {Component} from 'react'
import {connect} from 'react-redux'
import OneCharacter from './one-character'
import Paginator from './paginator';
import Filters from './filters';
import SortByName from './sortByName';
import Loading from './loading';
import {getMarvelCharacters, getFavoriteCharacter} from '../../server/api/characters'
import {me, fetchFavorites, deleteFavorite} from '../store'

class AllCharacters extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false,
      filters: {
        name: {
          value: '',
          exactMatch: false
        }
      },
      sortName: '',
      characters: [],
      page: 1,
      maxPage: 0,
      limitPerPage: 20,
      searchIsOpen: false
    }

    this.search = this.search.bind(this)
    this.turnPage = this.turnPage.bind(this)
    this.upcomingPages = this.upcomingPages.bind(this)
    this.previousPages = this.previousPages.bind(this)
    this.filterResults = this.filterResults.bind(this)
    this.resetFilters = this.resetFilters.bind(this)
    this.afterFilter = this.afterFilter.bind(this)
    this.sortByName = this.sortByName.bind(this)
    this.changeTotalPerPage = this.changeTotalPerPage.bind(this)
    this.toggleSearchMenu = this.toggleSearchMenu.bind(this)

  }

  async componentDidMount() {
    if (this.props.pageType === 'favorites' && !this.props.user.id){
      await this.props.fetchFavorites()
    }
     
    this.search({
      name: this.state.filters.name.value,
      exactMatch: this.state.filters.name.exactMatch,
      sortName: this.state.sortName,
      page: this.state.page,
      limit: this.state.limitPerPage
    })
  }
  
  componentDidUpdate(prevProps){
    if (this.props.favorites.length !== prevProps.favorites.length){
      this.search({
        name: this.state.filters.name.value,
        exactMatch: this.state.filters.name.exactMatch,
        sortName: this.state.sortName,
        page: this.state.page,
        limit: this.state.limitPerPage
      })
    }
  }

  async search(options = {}) {

    const {page, name, exactMatch, sortName, limit} = Object.assign({
      page: 1,
      name: this.state.filters.name.value,
      exactMatch: this.state.filters.name.exactMatch,
      sortName: this.state.sortName,
      limit: this.state.limitPerPage
    }, options)

    const offset = page ? (page -1) * limit : 0

    try {
      this.setState({
        loading: true
      })
      
      const filtering = !!(this.state.filters.name.value.length || this.state.sortName.length)
      const searchName = this.state.filters.name.value
      const sortName = this.state.sortName
      //NOT USING THIS RN BUT IF I HAVE TIME I WANT TO ADD FILTERS ON THE FAVES
      
      if (this.props.pageType==='favorites' && this.props.user.id) {
        try {
          await this.props.fetchFavorites()
          let maxPage = 1;
          let characters = await Promise.all(
            this.props.favorites.map(faveName=> {
              return (
                getFavoriteCharacter({name:faveName, exactMatch:true, sortName, limit:1})
              )
            })
          )
          console.log('CHARACTERS IN FAVE SEARCH', characters)
          if (filtering){
            if (exactMatch){
              characters = characters.filter(char => char.name === searchName.toLowerCase().trim())
            } else {
              characters = characters.filter(char => char.name.startsWith(searchName.toLowerCase().trim()))
            }
          }
          
          this.setState({
          characters,
          maxPage,
          page: characters.length ? parseInt(page) : 0, //to avoid type coercion
          filters: {
            name: {
              value: name,
              exactMatch
            }
          },
          sortName,
          limitPerPage: limit
        })
        this.setState({
          loading: false
        })
      } catch (error) {
        console.error('Error searching for favorites:', error)
      }
        
      } else {

        try {
          const {characters, maxPage} = await getMarvelCharacters({ offset, name, exactMatch, sortName, limit })
        
          this.setState({
            characters,
            maxPage,
            page: characters.length ? parseInt(page) : 0, //to avoid type coercion
            filters: {
              name: {
                value: name,
                exactMatch
              }
            },
            sortName,
            limitPerPage: limit
          })
          this.setState({
            loading: false
          })
        } catch (error) {
          console.error('Error searching Marvel characters:', error)
        }
        
      }
      
    } catch (error) {
      console.error('Search failed!', error)
      this.setState({
        loading: false
      })
    }
  }

  async filterResults (charName, matchSetting) {
    try {
      await this.search({
        name: charName,
        exactMatch: matchSetting
      })
      this.afterFilter()
    } catch (error) {
      console.error('Filtering error!', error)
    }
  }

  async resetFilters() {
    try {
      await this.search({ name: '', exactMatch: false})
      this.afterFilter()
    } catch (error) {
      console.error('Failed to reset search filters!', error)
    }
  }

  afterFilter = ({page, maxPage}=this.state) => {
    this.paginator.setPages(page, maxPage)
  }

  sortByName = (event) => {
    this.search({ page: this.state.page, sortName: event.target.value })
  }

  changeTotalPerPage = (event) => {
    this.search({ page: this.state.page, limit: event.target.value })
  }

  toggleSearchMenu(command){
    const {searchIsOpen} = this.state
    if (command==='open'){
      if (!searchIsOpen) {
        this.setState({searchIsOpen: true})
      }
    } else {
      if (searchIsOpen) {
        this.setState({searchIsOpen: false})
      }
    }
  }

  turnPage = (page) => {
    if (page !== this.state.page){
      this.search({page})
    }
  }

  upcomingPages = (maxPage) => {
    this.turnPage(maxPage + 1)
  }

  previousPages = (minPage) => {
    if (minPage > 1){
      this.turnPage(minPage - 5)
    }
  }

  render() {
    const searchFontColor = this.state.searchIsOpen ? 'rgb(255, 158, 158)' : 'rgb(243, 102, 102)'
    const searchTextStyle = {
      color: searchFontColor
    }
    const searchDropDownClass = this.state.searchIsOpen ? '' : 'hidden'

    return (
      <div className='all-characters'>
      {this.props.pageType!=='favorites' && <div id="mainSearchDiv" className="dropdown search">
        <span
          className='dropLink'
          onMouseOver={()=>this.toggleSearchMenu('open')}
          style={searchTextStyle}
        > Search & Filter </span>
        <div className={`searchDropdown ${searchDropDownClass}`}>
          <button
            id='closeSearch'
            type='button'
            onClick={()=>this.toggleSearchMenu('close')}
          >x</button>
          <Filters
            ref={filters => this.filters = filters}
            onApply={this.filterResults}
            onReset={this.resetFilters}
          />
          <SortByName
            onChangeSort={this.sortByName}
            onChangeLimit={this.changeTotalPerPage}
          />
        </div>
      </div>}

        {!this.state.loading &&
          <div className="character-gallery">
            {this.state.characters.map((char, i) =>
              <OneCharacter key={char.id || i} instance={char} />
            )}
          </div>
        }

        {this.state.loading && <Loading />}

        {!this.state.loading && this.props.pageType!=='favorites' && <Paginator
          ref={paginator => this.paginator = paginator}
          page={this.state.page}
          maxPage={this.state.maxPage}
          onChangePage={this.turnPage}
          onNext={this.upcomingPages}
          onPrevious={this.previousPages}
        />}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  // console.log('faves in mapState:', state.favorites)
  return {
    user: state.user,
    favorites: state.favorites,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchFavorites: () => {
      dispatch(fetchFavorites())
    },
    getUser: () => {
      dispatch(me())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllCharacters)
