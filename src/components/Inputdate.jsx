import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';
 
export default class Inputdate extends Component {
  state = {
    date: new Date(),
    
  }
  
  onChange = date => this.managedate(date)

  managedate(date){
  
    this.setState({ date });
    this.props.guardar(date,this.props.name)
  }
 
  render() {
    let disable = this.props;
    return (
      <div>
        <DateTimePicker
          onChange={this.onChange}
          value={this.state.date}
          format="yy"
                   
         
        />
      </div>
    );
  }

  
}

