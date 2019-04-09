import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Panel, ButtonToolbar, Button, FormGroup, ControlLabel, FormControl, HelpBlock, Checkbox } from 'react-bootstrap';

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
      <Panel
        collapsible
        className='filters'
        bsStyle='primary'
        header='Filter Your Search'
      >
        <form onSubmit={this.handleSubmit}>
          <div className='row'>
            <div className='col-md-4'>
              <FormGroup ControlId="filterByName">
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  type='text'
                  value={this.state.name}
                  onChange={this.handleNameFilterChange}
                />
                {!this.state.exactMatch &&
                  <HelpBlock>
                    Matching names beginning with the input (e.g., 'spid')
                  </HelpBlock>
                }
              </FormGroup>

              <Checkbox
                checked={this.state.exactMatch}
                onChange={this.handleExactMatchChange}
              >
                Match the exact input (e.g., 'spider-man')
              </Checkbox>
            </div>
          </div>

          <ButtonToolbar>
            <Button type='reset' onClick={this.handleReset}>RESET</Button>
            <Button type='submit' bsStyle="primary">APPLY</Button>
          </ButtonToolbar>
        </form>
      </Panel>
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
