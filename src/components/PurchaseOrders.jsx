//@ts-check
import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES } from '../utils/utils';
import { Header, Table, Loader, Pagination, Button, Menu, Icon } from 'semantic-ui-react';
import FilaCompra from './FilaCompra';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from '@reach/router';



export default class UnpaidInvoices extends Component {
	state = {
		Invoices: [],
		seleccionados: [],
		seleccionadosId: [],
		vendedoresseleccionados:[],
		vendedoresseleccionadosId:[],
		paginaSeleccionada: 1,
		cantidadPaginas: 0,
		first: 20,
		offset: 0,
		step: 20,
		buscar:"",
		column: null,
		direction: null,
		empleados:[],
		startDate: new Date(),
		fechas:[],
		date: new Date(),
		visible:false,
		userdata:null
	
	};

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}



	// Método para seleccionar o des seleccionar checkbox de turnos
	seleccionar = (turno) => {
		let seleccionados = [];
		let seleccionadosId = [];
		//console.log(turno)
		if (this.state.seleccionadosId.includes(turno.id)) {
			seleccionados = this.state.seleccionados.filter((s) => s.id !== turno.id);
			seleccionadosId = this.state.seleccionadosId.filter((s) => s !== turno.id);
		} else {
			seleccionados = [ ...this.state.seleccionados, turno ];
			seleccionadosId = [ ...this.state.seleccionadosId, turno.id ];
		}

		//console.log(seleccionados)
		this.setState(
			{
				seleccionados,
				seleccionadosId
			},
			() => {
				this.props.guardar('seleccionadosVendidos', this.state.seleccionados);
				this.props.guardar('seleccionadosVendidosID', this.state.seleccionadosId);
			}
		);
	};

	quitarlink(text){
		const resp = text.split('>')
		const textresp = resp[1].split('<');
		return textresp[0];
	}

	get_cliente(text){
		const resp = text.split('vendors/')
	
		const textresp =  resp[1].substring(0,6);
		return textresp;
	}

	

	fechain(id){
		for (var i=0; i<this.state.fechas.length; i++) {
			//console.log(this.state.fechas[i])
            if (this.state.fechas[i].id==id){
				return true;
			}
            //a b c
		}
		
		return false;
	} 

	get_id(text){
		const resp = text.split('-')
		return resp[3];
	}

	ver(id){
		console.log(id)
		navigate('/app/ordencompra/edit/'+id)
	}



	 componentDidMount() {
		
		

		let { buscar } = this.state;

		let user = getUser();
		this.setState({
			userdata: user
		});

		
		
			let { guardar, valores } = this.props;
			
				this.setState({
					loading: true
				});

				
                
				Axios.post(`${FUNCIONES.PurchaseOrders}`,'{"valor":"'+buscar+'"}')
					.then(({ data }) => {
						//console.log(data)
						let Invoices2=[]
						let Invoices = data.data;
						//console.log(Invoices)
						//Invoices = sortBy(Invoices, [ 'id' ]);
						Invoices.map((invoice, i)=> (
							//console.log(invoice)
						 invoice.r2.includes('Recibir') ? Invoices2.push(invoice) : null
							
				
						));

						Invoices = Invoices2;
						
						Invoices.map((invoice, i)=> (
							//console.log(invoice)
						 invoice.id =	this.get_id(invoice.DT_RowId)
							
				
						));


						Invoices.map((invoice, i)=> (
							//console.log(invoice)
							invoice.z != '' ? invoice.z = this.quitarlink(invoice.z) :''
							
				
						));

						Invoices.map((invoice, i)=> (
							//console.log(invoice)
							invoice.i != '' ? invoice.i = this.quitarlink(invoice.i) :''
							
				
						));

						Invoices.map((invoice, i)=> (
							//console.log(invoice)
							invoice.ref != '' ? invoice.ref = this.quitarlink(invoice.ref) :''
							
				
						));

						Invoices.map((invoice, i)=> (
							//console.log(invoice)
							invoice.ven != '' ? invoice.venid = this.get_cliente(invoice.ven) :invoice.venid = 0
							//console.log(this.get_cliente(invoice.ven))
							
						));

						Invoices.map((invoice, i)=> (
							//console.log(invoice)
							invoice.ven != '' ? invoice.ven = this.quitarlink(invoice.ven) :''
							
				
						));

					
							//console.log(Invoices);

						guardar('Purchases', Invoices);
						this.setState({
							Invoices: Invoices,
							loading: false,
							
							cantidadPaginas: Math.floor(Invoices / this.state.first) + 1
						});
					})
					.catch((error) => {
						console.error(error);
					});

				
		
		
	}

	// Método para cambiar de página de turnos
	cambioDePagina = (e, { activePage }) => {
		let offset = (activePage - 1) * this.state.step;
		let first = offset + this.state.step;
		this.setState({ paginaSeleccionada: activePage, offset, first });
	};

	

	handleSort = (clickedColumn) => () => {
		const { column, Invoices, direction } = this.state;

		if (column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				Invoices: sortBy(Invoices, [ clickedColumn ]),
				direction: 'ascending'
			});

			return;
		}

		this.setState({
			Invoices: Invoices.reverse(),
			direction: direction === 'ascending' ? 'descending' : 'ascending'
		});
	};



	handleChange=(event)=> {
		
		let {  seleccionadosVendidosID } = this.state;

		let { guardar, } = this.props;
		if (event.target.value.length>4){
			
		}
		this.setState({
				
			buscar:event.target.value
		});
		
			
			Axios.post(`${FUNCIONES.PurchaseOrders}`,'{"valor":"'+event.target.value+'"}')
				.then(({ data }) => {
					//console.log(data)
					
					let Invoices = data.data;
					//console.log(Invoices)
					//Invoices = sortBy(Invoices, [ 'id' ]);
					Invoices.map((invoice, i)=> (
						//console.log(invoice)
					 invoice.id =	this.get_id(invoice.DT_RowId)
						
			
					));

					Invoices.map((invoice, i)=> (
						//console.log(invoice)
						invoice.z != '' ? invoice.z = this.quitarlink(invoice.z) :''
						
			
					));

					Invoices.map((invoice, i)=> (
						//console.log(invoice)
						invoice.i != '' ? invoice.i = this.quitarlink(invoice.i) :''
						
			
					));

					Invoices.map((invoice, i)=> (
						//console.log(invoice)
						invoice.ref != '' ? invoice.ref = this.quitarlink(invoice.ref) :''
						
			
					));

					Invoices.map((invoice, i)=> (
						//console.log(invoice)
						invoice.ven != '' ? invoice.ven = this.quitarlink(invoice.ven) :''
						
			
					));

					guardar('Purchases', Invoices);
					this.setState({
						Invoices: Invoices,
						loading: false,
						cantidadPaginas: Math.floor(Invoices.length / this.state.first) + 1,
						
					});
				})
				.catch((error) => {
					console.error(error);
				});
		
	  }

	render() {
		let {
			Invoices,
			loading,
			seleccionadosId,
			seleccionados,
			vendedoresseleccionadosId,
			vendedoresseleccionados,
			paginaSeleccionada,
			first,
			cantidadPaginas,
			offset,
			column,
			direction
		} = this.state;

		if (loading) {
			return <Loader active inline="centered" />;
		} else
			return (
				<React.Fragment>
					<label>
          Buscar :
          <input type="text" value={this.state.buscar} onChange={this.handleChange} />
        </label>
					{Invoices.length === 0 ? (
						<Header as="h2">No hay  O/C </Header>
					) : (
						<React.Fragment>
							
							<div className="pt-8">
								<Header>Ordenes de compra autorizadas</Header>
								<div className="inline-block pr-4">
									<Menu compact>
										<Menu.Item active>Cantidad de O/C: {Invoices.length}</Menu.Item>
									</Menu>
								</div>

								<div className="inline-block">
									<Pagination
										activePage={paginaSeleccionada}
										boundaryRange={1}
										//@ts-ignore
										onPageChange={this.cambioDePagina}
										siblingRange={4}
										totalPages={cantidadPaginas}
										ellipsisItem={true ? undefined : null}
										firstItem={true ? undefined : null}
										lastItem={true ? undefined : null}
										prevItem={true ? undefined : null}
										nextItem={true ? undefined : null}
									/>


								</div>
								
								<Table sortable celled>
									<Table.Header>
									<Table.Row>
										
										
										<Table.HeaderCell
											sorted={column === 'i' ? direction : null}
											onClick={this.handleSort('i')}
										>
											ORDEN
										</Table.HeaderCell>
										
										<Table.HeaderCell
											sorted={column === 'ref' ? direction : null}
											onClick={this.handleSort('ref')}
										>
											REFERENCIA
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'dte' ? direction : null}
											onClick={this.handleSort('dte')}
										>
											FECHA
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'o' ? direction : null}
											onClick={this.handleSort('o')}
										>
											ORIGEN
										</Table.HeaderCell>
										<Table.HeaderCell
											sorted={column === 'ven' ? direction : null}
											onClick={this.handleSort('ven')}
										>
											PROVEEDOR
										</Table.HeaderCell>
										<Table.HeaderCell>
											
										
										</Table.HeaderCell>
										
									
									
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{Invoices
											.slice(offset, first)
											.map((t) => (
												<FilaCompra
													key={t.id}
													turno={t}
													ver = {this.ver}
												/>
											))}
									</Table.Body>
								</Table>
							</div>
						</React.Fragment>
						
					)}
					
				</React.Fragment>
				
			);
	}
}
