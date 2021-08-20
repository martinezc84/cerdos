//@ts-check
import React, { Component } from 'react';
import { Table, Checkbox, Label, Input } from 'semantic-ui-react';
import FilaDetalle from './FilaDetalleCompraunico';
export default class FilaDetalleCompra extends Component {

	state = {
		tel:null
	}


	handleInputChange = event => {
		
		const target = event.target
		const value = target.value
		const name = target.name
	
		this.setState({
		  [name]: value,
		})
	  }


	render() {

		
		let { fila } = this.props;
		//console.log(key);
	
			return (
				<Table.Row>
					
					<Table.Cell>
					<input
					autoFocus
                    type="text"
					name="code"
					id={fila.id}
                    value={this.state.label}
					onChange={this.handleInputChange}
					onKeyDown={(event)=>{
						//console.log(event.keyCode);
						if(event.keyCode === 13){
							this.props.agregarlinea(this.state.code,fila.id)
							//console.log(this.state.code);

						}

						if(event.keyCode === 9){
							this.props.editarlinea(this.state.code,fila.id)
							//console.log(this.state.code);

						}
						
					}}
                    className="inputform"
                  />
					</Table.Cell>
					
					
				</Table.Row>
			);
	}
}
