import React from 'react'
import OneCharacter from './one-character'
import Paginator from './paginator';
import Filters from './filters';
import SortByName from './sortByName';
import Loading from './loading';
import {getMarvelCharacters} from '../../server/api/characters'

class AllCharacters extends React.Component {
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
      page: 0,
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

  componentDidMount() {
    this.search({
      name: this.state.filters.name.value,
      exactMatch: this.state.filters.name.exactMatch,
      sortName: this.state.sortName,
      page: this.state.page,
      limit: this.state.limitPerPage
    })
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
      this.turnPage(minPage - 1)
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
      const {characters, maxPage} = await getMarvelCharacters({ offset, name, exactMatch, sortName, limit })
      this.setState({
        characters,
        maxPage,
        page: characters.length ? page : 0,
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

  render() {
    const searchFontColor = this.state.searchIsOpen ? 'rgb(255, 158, 158)' : 'rgb(243, 102, 102)'
    const searchTextStyle = {
      color: searchFontColor
    }
    const searchDropDownClass = this.state.searchIsOpen ? '' : 'hidden'

    return (
      <div className='all-characters'>
      <div id="mainSearchDiv" className="dropdown search">
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
      </div>

        {!this.state.loading &&
          <div className="character-gallery">
            {this.state.characters.map(char =>
              <OneCharacter key={char.id} instance={char} />
            )}
          </div>
        }

        {this.state.loading && <Loading />}

        {!this.state.loading && <Paginator
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

export default AllCharacters
