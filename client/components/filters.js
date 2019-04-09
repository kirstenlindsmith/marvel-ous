import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Card, ButtonToolbar, Button, FormGroup, FormLabel, FormControl, InputGroup } from 'react-bootstrap';

class Filters extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      exactMatch: ''
    }

    this.handleReset = this.handleReset.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleNameFilterChange = this.handleNameFilterChange.bind(this)
    this.handleExactMatchChange = this.handleExactMatchChange.bind(this)
  }


  handleReset(){
    if (this.state.name.trim()){
      this.setState({ name: '' })
      this.props.onReset()
    }
  }

  handleSubmit(event){
    event.preventDefault()
    if (this.state.name.trim()) {
      this.props.onApply()
    }
  }

  handleNameFilterChange(event) {
    this.setState({
      name: event.target.value
    })
  }

  handleExactMatchChange(event) {
    this.setState({ exactMatch: event.target.checked })
  }

  render(){
    return (
      <Card
        collapsible
        className='filters'
        bsstyle='primary'
        header='Filter Your Search'
      >
        <form onSubmit={this.handleSubmit}>
          <div className='row'>
            <div className='col-md-4'>
              <FormGroup controlid="filterByName">
                <FormLabel>Name</FormLabel>
                <FormControl
                  type='text'
                  value={this.state.name}
                  onChange={this.handleNameFilterChange}
                />
                {!this.state.exactMatch &&
                  <div id="helpBlock">
                    Matching names beginning with the input (e.g., 'spid')
                  </div>
                }
              </FormGroup>

              <InputGroup.Checkbox
                checked={this.state.exactMatch}
                onChange={this.handleExactMatchChange}
              >
                Match the exact input (e.g., 'spider-man')
              </InputGroup.Checkbox>
            </div>
          </div>

          <ButtonToolbar>
            <Button type='reset' onClick={this.handleReset}>RESET</Button>
            <Button type='submit' bsstyle="primary">APPLY</Button>
          </ButtonToolbar>
        </form>
      </Card>
    )
  }
}

Filters.propTypes = {
  onApply: PropTypes.func,
  onReset: PropTypes.func
}

Filters.defaultProps = {
  onApply: () => {},
  onReset: () => {}
}


export default Filters
