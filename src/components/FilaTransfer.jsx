//@ts-check
import React, { Component } from 'react';
import { Table,  Button, Icon, Dropdown, Checkbox } from 'semantic-ui-react';

export default class FilaTransfer extends Component {

	state ={
		
	}
	componentDidMount() {
		let {  id, guardarcantidad } = this.props
		this.setState({guardarcantidad:guardarcantidad, id:id})
	}


	shouldComponentUpdate(np) {
		//return true;
		if(np.unico !== this.props.unico || np.item_id !== this.props.item_id || np.cantidad !== this.props.cantidad || np.items !== this.props.items  ){
			return true;
		}else{
			return false;
		}
		
	}

	handleInputChange = event => {
		const target = event.target
		const value = target.value
		const name = target.name
		this.state.guardarcantidad(this.state.id,value)
		this.setState({
		  [name]: value,
		})
	  }

	  handleInputChangelote = event => {
		const target = event.target
		const value = target.value
		const name = target.name
		this.props.guardarlote(this.state.id,value)
		this.setState({
		  [name]: value,
		})
	  }
	

	render() {
		let {  items, item_id, selectitem, id,  pesar, cantidad, view, buscaritem, lote } = this.props;
		let insumo=null
		
			item_id = parseInt(item_id)
			if(view){
		 	insumo = buscaritem(item_id, items)
		}
	//console.log(item_id)
	if (view) 
			return (
				<Table.Row>
					
					<Table.Cell>
						{insumo!==null?( insumo
					):('')}
					</Table.Cell>
					<Table.Cell>
					{cantidad!==null?(
					cantidad):('')}
					
					
					</Table.Cell>
					
				</Table.Row>
			)
	else
	return (
		<Table.Row>
			
			<Table.Cell>
				{items!==null?(
			<Dropdown
				  value={item_id}
				placeholder='Item'
				onChange={selectitem}
				search
				fluid
				selection
				id={"insumo_"+id}
				options={items}
				/>):('')}
			</Table.Cell>
			<Table.Cell>
			
			<input
			type="text"
			name="lote"
			value={lote}
			onChange={this.handleInputChangelote}
			className="inputform"
			
		  />
			</Table.Cell>
			<Table.Cell>
			{cantidad!==null?(
			<input
			type="text"
			name="cantidad"
			id={"cantidad_"+id}
			value={cantidad}
			onChange={this.handleInputChange}
			className="inputform"
		
		  />):('')}
			<Button
								
				primary
				onClick={() => {
					pesar(
						id
					);
				}}								
				icon
				labelPosition="right"
			>
				<Icon name="download" />
								pesar
							</Button>
			
			</Table.Cell>
			
		</Table.Row>
	)
	
		
	}
}