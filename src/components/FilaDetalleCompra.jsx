//@ts-check
import React, { Component } from 'react';
import { Table, Checkbox, Label, Input } from 'semantic-ui-react';
import FilaDetalle from './FilaDetalleCompraunico';
export default class FilaDetalleCompra extends Component {

	state = {
		tel:null
	}

	guardarcantidad = (id, serie) => {
		let series = this.props.line.series
		series.map((linea, i)=> (
		
			linea.id == id ? linea.serie = serie : false		

		));	
		this.props.guardarserie(this.props.id,series)
			
		
	};

	guardarpeso = (id, peso) => {
		let series = this.props.line.series
		series.map((linea, i)=> (
		
			linea.id == id ? linea.peso = peso : false		

		));	
		this.props.guardarserie(this.props.id,series)			
		
	};


	handleInputChange = event => {
		
		const target = event.target
		const value = target.value
		const name = target.name
		this.props.guardarcantidad(this.props.id,value)
		this.setState({
		  [name]: value,
		})
	  }

	  

	handleInputChangelote = event => {
		
		const target = event.target
		const value = target.value
		const name = target.name
		this.props.guardarlote(this.props.id,value)
		this.setState({
		  [name]: value,
		})
	  }


	render() {

		
		let { id, cantidad,pesar, line, esunico } = this.props;
		//console.log(key);
	
			return (
				<React.Fragment>
				<Table.Row>
					<Table.Cell>{line.name}</Table.Cell>
					<Table.Cell>{line.refence}</Table.Cell>
					<Table.Cell>{line.item_cantidad}</Table.Cell>
					
					<Table.Cell>
					<input
					autoFocus
                    type="text"
					name="cantidad"
					id={id}
                    value={cantidad}
					//onChange={this.handleInputChange}
					onDoubleClick={() => {
						pesar(id);
					}}
                    className="inputform"
                  />
					</Table.Cell>
					{line.product_type==3 ? (
					<Table.Cell>
						<input
					placeholder="Lote"
					autoFocus
                    type="text"
					name="lote"
					id={'lote_'+id}
                    value={line.lote}
					onChange={this.handleInputChangelote}
					readOnly={true}
                    className="inputform"
                  />
					</Table.Cell>

					) :(<Table.Cell>
					<label>
						Es único?
						<Checkbox
									onChange={esunico}
									toggle
									checked={line.unico}
									id={"check_"+id}
									
								/>
						</label>
					</Table.Cell>)}
					
					
				</Table.Row>
				{ (line.series.length>0)?
						line.series
						.map((t) => (
							<FilaDetalle							
								id={t.id}		
								serie={t.serie}
								guardarserie={this.guardarcantidad}
								name={line.name}
								id_parent={id}
								peso={t.peso}
								guardarpeso={this.guardarpeso}
								pesar={pesar}								

								
							/>
						)):('')
					}
				</React.Fragment>
			);
	}
}
