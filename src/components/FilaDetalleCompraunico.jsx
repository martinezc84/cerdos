//@ts-check
import React, { Component } from 'react';
import { Table, Button, Icon } from 'semantic-ui-react';

export default class FilaDetalleCompraunico extends Component {

	state = {
		tel:null
	}


	handleInputChange = event => {
		
		const target = event.target
		const value = target.value
		const name = target.name
		this.props.guardarserie(this.props.id,value)
		this.setState({
		  [name]: value,
		})
	  }

	  handleInputChangepeso = event => {
		
		const target = event.target
		const value = target.value
		const name = target.name
		this.props.guardarpeso(this.props.id,value)
		this.setState({
		  [name]: value,
		})
	  }


	render() {

		
		let { id, serie, name, id_parent, peso, pesar } = this.props;
		//console.log(key);
	
			return (
				<Table.Row>
					<Table.Cell>{name}</Table.Cell>
					<Table.Cell><input
					autoFocus
                    type="text"
					name="serie"				
                    value={serie}
					onChange={this.handleInputChange}				
					className="inputform"
					id={"serie_"+id_parent+"_"+id}
                  /></Table.Cell>
					<Table.Cell>1</Table.Cell>
					
					<Table.Cell>
					1
					</Table.Cell>
					<Table.Cell>
					<input
					placeholder={"peso"}
					autoFocus
                    type="text"
					name="peso"				
                    value={peso}
					onChange={this.handleInputChangepeso}				
					className="inputform"
					id={"eso_"+id_parent+"_"+id}
					
                  />
				  <Button
								
								primary
								onClick={() => {
									pesar("eso_"+id_parent+"_"+id);
								}}								
								icon
								labelPosition="right"
							><Icon name="download" />
							pesar
						</Button>
					</Table.Cell>
					
				</Table.Row>
			);
	}
}
