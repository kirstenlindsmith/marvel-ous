import React, {Component} from 'react'
import PropTypes from 'prop-types'
import PageButton from './pageButton'

class Paginator extends Component {
  constructor(props){
    super(props)
    this.state = {
      pages: []
    }

    this.setPages = this.setPages.bind(this)
    this.handleNumbers = this.handleNumbers.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)
    this.handleTurnPage = this.handleTurnPage.bind(this)
  }

  componentDidMount(){
    this.setPages(this.props.page, this.props.maxPage)
  }

  async setPages(page, maxPage) {
    if (typeof(page)!=='number') page = parseInt(page) //to avoid type coercion
    let pages = []
    if(page > 0){
      for (let i=0; i<5; i++){ //5 is total # of page buttons shown
        const pageNum = page + i
        if (pageNum <= maxPage){
          pages.push(pageNum)
        }
      }
    }
    await this.setState({ pages })
  }

  handleNumbers(event) {
    const key = event.charCode || event.keyCode || 0
    if (!(
      key===8 ||
      key===9 ||
      key===13 ||
      key===46 ||
      (key >= 35 && key <= 40) ||
      (key >= 48 && key <= 57) ||
      (key >= 96 && key <= 105)
    )) {
      event.preventDefault()
    }
  }

  handlePrevious() {
    const minPage = this.state.pages[0]
    if (minPage > 1){
      this.setPages(minPage - 5, this.props.maxPage)
      this.props.onPrevious(minPage)
    }
  }

  handleTurnPage(event) {
    const page = event.target.value
    try {
      if(isNaN(page) || page===0 || page > this.props.maxPage){
        throw new Error('Invalid page number.')
      } else {
        this.props.onChangePage(page)
        this.input.value = ''
      }
    } catch (error) {
      console.error('Error incrementing page!', error)
    }
  }

  render(){
    return (
      <div className='paginator'>
        <div className="text-center center-block paginator-goToPage">
          <small className="help-block">
            Page {this.props.page} out of {this.props.maxPage}.
          </small>
        </div>

        <nav className='text-center' aria-label="page navigation">
          <ul className='pagination'>
            <li>
              {/* GO BACK ONE PAGE CYCLE BUTTON */}
              <a
                role='button'
                aria-label="previous"
                onClick={this.handlePrevious}
              >
                <span aria-hidden='true'>&laquo;</span>
              </a>
            </li>

              {/* CHANGE PAGE BUTTONS  */}
            {
              this.state.pages.map(pageNumber => (
                <PageButton
                  key={pageNumber}
                  page={pageNumber}
                  current={this.props.page}
                  clickHandler={this.handleTurnPage}
                />
              ))
            }

            {/* GO FORWARD ONE PAGE CYCLE BUTTON */}
            <li>
              <a
                role='button'
                aria-label="next"
                onClick={()=> this.props.onNext(this.state.pages[4])}
              >
                <span aria-hidden='true'>&raquo;</span>
              </a>
            </li>

          </ul>
        </nav>
      </div>
    )
  }
}

Paginator.propTypes = {
  page: PropTypes.number.isRequired,
  maxPage: PropTypes.number.isRequired,
  onChangePage: PropTypes.func,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
}

export default Paginator
