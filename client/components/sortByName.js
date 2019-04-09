import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {FormGroup, ControlLabel, FormControl, Form} from 'react-bootstrap'

class SortByName extends Component {
  constructor(props){
    super(props)
    this.state = {
      sort: '',
      perPage: 20
    }

    this.handleSortChange = this.handleSortChange.bind(this)
    this.handlePerPageChange = this.handlePerPageChange.bind(this)
  }

  handleSortChange(event) {
    this.setState({ sort: event.target.value })
    this.props.onChangeSort(event)
  }

  handlePerPageChange(event) {
    this.setState({ perPage: event.target.value })
    this.props.onChangeLimit(event)
  }

  render(){
    return (
      <div className='sortByName'>
        <Form
          inline
          className='sortByName-form'
        >
          <FormGroup controlId="sortByName">
            <ControlLabel>Sort by Name</ControlLabel>{' '}
            <FormControl
              componentClass='select'
              value={this.state.sort}
              onChange={this.handleSortChange}
            >
              <option value=''>Ascending</option>
              <option value="-">Descending</option>
            </FormControl>
          </FormGroup>

          {' '}

          <FormGroup controlId='resultsPerPage'>
            <ControlLabel>Results Per Page</ControlLabel>{' '}
            <FormControl
              componentClass='select'
              value={this.state.perPage}
              onChange={this.handlePerPageChange}
            >
              <option value={20}>20</option>
              <option value={50}>40</option>
              <option value={60}>60</option>
              <option value={100}>100</option>
            </FormControl>{' '}
          </FormGroup>
        </Form>
      </div>
    )
  }
}

SortByName.PropTypes = {
  onChangeSort: PropTypes.func,
  onChangeLimit: PropTypes.func
}

SortByName.defaultProps = {
  onChangeSort: () => console.warn('Sort change handler is not defined in props!'),
  onChangeLimit: () => console.warn('Page limit change handler is not defined in props!')
}

export default SortByName
