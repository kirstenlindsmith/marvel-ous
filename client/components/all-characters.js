import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
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
      limitPerPage: 20
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

  render() {

    return (
      <div className='all-characters'>
        {/* <Filters
          ref={filters => this.filters = filters}
          onApply={this.filterResults}
          onReset={this.resetFilters}
        />
        <SortByName
          onChangeSort={this.sortByName}
          onChangeLimit={this.changeTotalPerPage}
        /> */}

        {!this.state.loading &&
          <div className="character-gallery">
            {this.state.characters.map(char =>
              <OneCharacter key={char.id} instance={char} />
            )}
          </div>
        }

        {this.state.loading && <Loading />}
        <Paginator
          ref={paginator => this.paginator = paginator}
          page={this.state.page}
          maxPage={this.state.maxPage}
          onChangePage={this.turnPage}
          onNext={this.upcomingPages}
          onPrevious={this.previousPages}
        />
      </div>
    )
  }
}

// const mapStateToProps = state => {
//   return {
//     characters: state.characters.allCharacters
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     fetchCharacters: () => {
//       dispatch(fetchAllCharacters())
//     }
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(AllCharacters)
export default AllCharacters

const filterResultsUtil = this.filterResults
const resetFiltersUtil = this.resetFilters
const onChangeSortUtil = this.sortByName
const onChangeLimitUtil = this.onChangeLimit

export const searchUtils = {
  'Filters': {
    // 'ref': filters => this.filters = filters,
    'onApply': filterResultsUtil,
    'onReset': resetFiltersUtil
  },
  'SortByName': {
    'onChangeSort': onChangeSortUtil,
    'onChangeLimit': onChangeLimitUtil
  }
}
