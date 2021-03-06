//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES, production } from '../utils/utils';
import { Header, Table, Loader, Grid, Dropdown} from 'semantic-ui-react';
import sortBy from 'lodash/sortBy';
import { MostrarMensaje } from './Mensajes';
import { Msjerror } from './Mensajeserror';
import FilaInsumo from './FilaInsumo';
import FilaPt from './FilaPt';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from 'gatsby';





export default class Iniciar extends Component {
	state = {
		series:[],
		recursos:[],
		formulas:[],
		detalle:[],
		orden:null,
		insumoscont:1,
		despercont:1,
		ptcont:1,
		buttonactive:false,
		itemst:[],
		equipo_id:0,
		date:new Date().toLocaleDateString('en-GB'),
		ip:"192.168.100.1"
				
	};
	
	
    

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}


	pesar=async (id)=>{

		

		let pesoanterior=""
		let listo = false
		let x=0
		let y=0
		if (this.state.equipo_id != 0){
			while(!listo){	

				await Axios.get(FUNCIONES.getpeso+'?id='+this.state.equipo_id)
				.then(res => {
				let persons = res.data.peso;
				console.log(persons)

				if(persons==pesoanterior){
					y++
					console.log("iguales")
					if(y==2)
						//console.log("capturado: "+pesoanterior)
						listo=true
						let detalle = this.state.detalle
						detalle.map((linea, i)=> (
						
							linea.id == id ? linea.cantidad = parseFloat(pesoanterior) : false		

						));		
		
							this.setState(
								{
									detalle:detalle
								})
						return pesoanterior
						

				}else{
					pesoanterior = persons
					y=0
				}
				})
				x++
				if (x==10)
					listo=true
				
			}
		}else{
			alert("Seleccione equipo!");
		}

	return 0;

}

pesarr=async (id)=>{

		

	let pesoanterior=""
	let listo = false
	let x=0
	let y=0
	if (this.state.equipo_id != 0){
		while(!listo){	

			await Axios.get(FUNCIONES.getpeso+'?id='+this.state.equipo_id)
			.then(res => {
			let persons = res.data.peso;
			console.log(persons)

			if(persons==pesoanterior){
				y++
				console.log("iguales")
				if(y==2)
					//console.log("capturado: "+pesoanterior)
					listo=true
					let recursos = this.state.recursos
					recursos.map((linea, i)=> (
					
						linea.id == id ? linea.cantidad = parseFloat(pesoanterior) : false		

					));		
	
						this.setState(
							{
								recursos:recursos
							})
					return pesoanterior
					

			}else{
				pesoanterior = persons
				y=0
			}
			})
			x++
			if (x==10)
				listo=true
			
		}
	}else{
		alert("Seleccione equipo!");
	}

return 0;

}
	
    
    guardar = (dte) => {
	
		this.setState({
			fecha:dte})

		 console.log(dte)

	};

	trataEquipo= (empleados) => {
		return empleados.map((t) => ({
			key: t.id,
			value: t.id,
			text: t.name,
			
		}));
	};
	

	async equipos(){
		if(this.props.getmem('equipos')===undefined){
			let userdata = getUser()
				try {
					
					let res = await Axios.get(FUNCIONES.equipos+"?id=5");
					let equipos = res.data
					equipos = this.trataEquipo(equipos)
					console.log(equipos)
					this.props.guardarmem('equipos', equipos);
					
					this.setState({
						equipos: equipos,
						
					});
	
					//cargar formula
					return true
					
				
				}catch(error) {
					console.error(error);
					return false
				};
			}else{
				//console.log(this.props.getmem('equipos'))
				this.setState({
					equipos:this.props.getmem('equipos')
					
				});
				return true
			}
	}

	

	async componentDidMount() {
	
		this.setState({
			userdata: getUser(),
			loading:true
		});
		
			let { action, comprables, vendibles  } = this.props;
		
				let id = this.props.id
				let formula
				let formula_id
				let res = await this.equipos();
				await Axios.get(FUNCIONES.getip)
				.then(({ data }) => {
					let ip = data.ip

					console.log(ip)
					this.setState({
						ip
					});
				})
				
				Axios.get(FUNCIONES.orden+"?id="+id)
				.then(({ data }) => {
					//console.log(data)
					let orden =data
					let detalle = data.detalle
					let formulas = data.formulas
					let recursos=[]
					let series=[]
					let utilizados=[]
					let recurso
					let serie
					let ids=1
					let from_agency
					for(let linea in detalle){
						detalle[linea].generar=true
						formula_id = detalle[linea].formula_id

						formulas.map((formu, i)=> (		
						formu.id == formula_id ? formula= formu : null 					
						));	
						 from_agency=formula.from_agency
						if (formula.rv==1){	
						detalle[linea].generar=false						
							//console.log("recurso variable")						
							for(let insumo in formula.insumos){
								recurso = {id:ids, lote:"", lineid:detalle[linea].id, item_id:formula.insumos[insumo].item_id,  producto:formula.insumos[insumo].name, cantidad:(detalle[linea].cantidad*formula.insumos[insumo].cantidad)}
								recursos.push(recurso)
								ids++
							}
						}

						for(let insumo in formula.insumos){
							if (formula.insumos[insumo].unico==1){
								detalle[linea].generar=false
								//console.log("es unico")	
								for (let y=0; y<formula.insumos[insumo].cantidad;y++){
									serie = {id:ids, lineid:detalle[linea].id, producto:formula.insumos[insumo].name, serie:""}
									series.push(serie)
									ids++
								}
							}
						}
					}


					this.setState({
						orden,
						detalle,
						formulas,
						series,
						recursos,
						from_agency:from_agency
						
					});
				})
				.catch((error) => {
					console.error(error);
				});
		
			this.setState ({
				loading:false,
				action:action,
				guardarcantidad:this.guardarcantidad,
				guardarcantidadpt:this.guardarcantidadpt,
				guardarcantidadflex:this.guardarcantidadflex,
				Selectequipo:this.Selectequipo,
				
			});
					
					
					this.setStateAsync({show:true})			
			
    
}

	guardarcantidad = (id, cantidad) => {
		let insumos = this.state.insumos
		insumos.map((insumo, i)=> (
		
			insumo.id == id ? insumo.cantidad = cantidad : false		

		));		
		//console.log(insumos)
		this.setState(
			{
				insumos:insumos
			})
		
	};

	guardarcantidadflex = (id, cantidad) => {
		let desperdicios = this.state.desperdicios
		desperdicios.map((desperdicio, i)=> (
		
			desperdicio.id == id ? desperdicio.cantidad = cantidad : false		

		));		
		//console.log(insumos)
		this.setState(
			{
				desperdicios:desperdicios
			})
		
	};

	get_item=async (serie)=>{
		
		
		let res = await Axios.get(FUNCIONES.itemserie+"?serie="+serie)
		//console.log(res.data) 
		if(res.data!=null){
			return res.data
		}else{
			return null
		}
	}	

	buscariitem = (id, items) => {
		//console.log(items)
		let name = null
		items.map((item, i)=> (
		
			item.key == id  ? name = item.text :  false	

		));		
		
		return name
	};



	guardarcantidadpt = (id, cantidad) => {

		let pts=[];			
		let linea = this.state.pts.filter((s) => s.id == id);
		pts = this.state.pts.filter((s) => s.id !== id[1]);
			linea[0].cantidad =cantidad;		

		//console.log(this.state.pts)
		this.setState(
			{
				pts:pts
			})
	};
	
	
	  iniciar = async () => {
	
		this.setState({
			loading: true
        });
        
       
		let detalle= this.state.detalle
		let recursos =  this.state.recursos
		let series = this.state.series
		let orden = this.state.orden
		// Ciclo de llamadas
		
			try {
							
				let booking ={
					
					booker_id:orden.employee_id,
					planned_delivery:this.state.date,
					movements_attributes:"|insumos|",
					needs_transport:0,
					//agency_from_id:this.state.from_agency,
					agency_to_id:production,
					reference:orden.descripcion,
					memo:"",
					payee_id:393185
				}
				

					let x=0
					let z=10000000
					let stringdet="{"
					let stringorden=""
					let itemserie
					let formula_id
					let formula={}
					let utilizados=[]
					let error = {error:false,msj:""}

					for (let linea in detalle){
						let formulas = this.state.formulas
						if(detalle[linea].generar){
							formula_id = detalle[linea].formula_id

							formulas.map((formu, i)=> (		
							formu.id == formula_id ? formula= formu : null 					
							));	
							

							for(let insumo in formula.insumos){
								if(x>0) stringdet+=","
								stringdet+='"'+x+'":{"item_id":"'+formula.insumos[insumo].item_id+'", "booked_quantity":"'+(detalle[linea].cantidad*formula.insumos[insumo].cantidad)+'"}'
								let item = { orden_line_id:formula.insumos[insumo], item_id:formula.insumos[insumo].item_id,cantidad:(detalle[linea].cantidad*formula.insumos[insumo].cantidad),orden_id:this.state.orden.id, nombre:formula.insumos[insumo].name}
								utilizados.push(item)
								z++
								x++
							}

							
						}
					}

					for (let linea in recursos){
						if(x>0) stringdet+=","
						let lot_id

						if(recursos[linea].lote!=""){
							 lot_id = await Axios.get(FUNCIONES.lote+'?id='+recursos[linea].lote+'&item_id='+recursos[linea].item_id)
							 lot_id = lot_id.data.id
						}else{
							lot_id = ""
						}
								stringdet+='"'+x+'":{"item_id":"'+recursos[linea].item_id+'", "booked_quantity":"'+recursos[linea].cantidad+'", "lot_id":"'+lot_id+'"}'
								let item = {id:z,lote_id:lot_id, lote:recursos[linea].lote, orden_line_id:recursos[linea].lineid,   item_id:recursos[linea].item_id,cantidad:(recursos[linea].cantidad),orden_id:this.state.orden.id, nombre:recursos[linea].producto}
								utilizados.push(item)
								x++
								z++
					}
					let y=0;
					for (let linea in series){
						itemserie= await this.get_item(series[linea].serie)
						let item = {id:z,item_id:itemserie.id,cantidad:1,orden_id:this.state.orden.id, orden_line_id:recursos[linea].lineid,nombre:itemserie.name}
						utilizados.push(item)
						z++
						if(itemserie!==undefined){
						if(x>0) stringdet+=","
						if(y>0) stringorden+=","
								stringdet+='"'+x+'":{"item_id":"'+itemserie.id+'", "booked_quantity":"1"}'
								stringorden+='"'+y+'":{"id":"'+series[linea].lineid+'", "serie":"'+series[linea].serie+'"}'
								x++
								y++
						}else{
						itemserie= await this.get_item(series[linea].serie)
							error = {error:true,msj:"No se encontro el numero de serie "+series[linea].serie}
							
						}
					}
					stringdet+="}"

					if(error.error){
						this.setState(
							{
								loading: false,
								visiblee:true,
								errormsj:error.msj
							})
					}else{
						booking.agency_from_id=this.state.from_agency
						let shipment = {shipment:booking}
						let poststr = JSON.stringify(shipment)
						poststr= poststr.replace('"|insumos|"',stringdet)
						console.log(poststr)
						let res = await Axios.post(`${FUNCIONES.reservaciones}`,poststr)
						

							if (res.data.id!==undefined){
								let resp = await Axios.post(FUNCIONES.deliver+"?id="+res.data.id)
								//console.log(JSON.stringify(utilizados))
								let editorden = '{"id":'+this.state.orden.id+', "estado":"iniciada","detalle":{'+stringorden+'},"consumidos":'+JSON.stringify(utilizados)+'}'
								//console.log(editorden)
								 resp = await Axios.post(`${FUNCIONES.editarorden}`,editorden)
								this.setState({
									loading: false,
									visible:true,
									
								});
							}else{
								this.setState({
									loading: false,
									visiblee:true,
									errormsj:"Sus datos no se guardaron, contacte al Administrador"
								});	
							}

							
							//console.log(data)	
						
						
						
					}

					

			} catch (error) {
				//console.error(error.response.data );
				this.setState({
					loading: false,
					visiblee:true,
					errormsj:"Sus datos no se guardaron, contacte al Administrador \n "+JSON.stringify(error.response.data)
				});	
				
				
			} finally {
				
			
			
			}
		
		
		};

		Selectequipo = (e, item) => {
			//console.log(item)
			this.setState(
				{
					equipo_id:item.value
				})
			
		};
		
	

		onConfirm = ()=>{
			this.setState({				
				visible:false,
				
			});
			navigate('/app/ordenesp/')
		}

		onConfirme = ()=>{
			this.setState({				
			
				visiblee:false
			});
			//navigate('/app/formulas/')
		}
        
        handleInputChange = event => {

			const target = event.target
            const value = target.value
			const name = target.name
			const id = target.id
			//console.log(id)
			if(name=='serie'){
				let series = this.state.series
				series.map((serie, i)=> (
				
					serie.id == id ? serie.serie = value : false		
		
				));		
				
			}else{
				let recursos = this.state.recursos
				recursos.map((recurso, i)=> (
				
					recurso.id == id ? recurso.cantidad = value : false		
		
				));	

			}
        
            this.setState({
              [name]: value,
            })
		  }
		  
		  handleInputChangelote = event => {

			const target = event.target
            const value = target.value
			const name = target.name
			const id = target.id
			//console.log(id)
		
				let recursos = this.state.recursos
				recursos.map((recurso, i)=> (
				
					recurso.id == id ? recurso.lote = value : false		
		
				));	

			
        
            this.setState({
              [name]: value,
            })
          }
        
          handleSubmit = event => {
			  //console.log("enviando info")
            event.preventDefault()
            this.iniciar()
            //alert(`Welcome ${this.state.firstName} ${this.state.lastName}!`)
					}
					

				

	render() {
		
		

		let {
				
			series, recursos, loading, equipo_id, Selectequipo, equipos
           
			
		} = this.state;

		if (loading) {
			return <Loader active inline="centered" />;
		} else
		
			return(
				<div >
				
                <form onSubmit={this.handleSubmit}>

				{  (recursos.length>0)?(
				
				

				
				<React.Fragment>
					<Grid.Row columns={1}>
				<Grid.Column><label>Equipo<Dropdown
						value={equipo_id}
						placeholder='Equipo'
						onChange={Selectequipo}					
						selection
						options={equipos}
						className="ui segment"
					/></label></Grid.Column>
					</Grid.Row>
					<p >RECURSOS</p>
			<Table sortable celled>
			<Table.Header>
			<Table.Row>
							
				<Table.HeaderCell
					
				>
					ITEM
				</Table.HeaderCell>
				
				<Table.HeaderCell
					
				>
					CANTIDAD
				</Table.HeaderCell>
				<Table.HeaderCell
					
				>
					
				</Table.HeaderCell>
				
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{
					recursos
					.map((t) => (
						<Table.Row>
										
					<Table.Cell>{t.producto}</Table.Cell>
					<Table.Cell>{<input
					autoFocus
                    type="number"
					name="cantidad"
					id={t.id}
                    value={t.cantidad}
					//onChange={this.handleInputChange}				
					className="inputform"
					onDoubleClick={() => {
						this.pesarr(t.id);
					}}
                  />}</Table.Cell>
				  <Table.Cell>{<input
				  placeholder={"Lote"}
					autoFocus
                    type="text"
					name="lote"
					id={t.id}
                    value={t.lote}
					onChange={this.handleInputChangelote}				
                    className="inputform"
                  />}</Table.Cell>
											
					
						
				</Table.Row>
					))}
			</Table.Body>
			</Table></React.Fragment>):('')}
								
			{  (series.length>0)?(<React.Fragment>
				<Grid.Row columns={1}>
				<Grid.Column><label>Equipo<Dropdown
						value={equipo_id}
						placeholder='Equipo'
						onChange={Selectequipo}					
						selection
						options={equipos}
						className="ui segment"
					/></label></Grid.Column>
					</Grid.Row>
			<p >SERIES DE PRODUCTOS</p>
			<Table sortable celled>
			<Table.Header>
			<Table.Row>
				<Table.HeaderCell
				>
					ITEM
				</Table.HeaderCell>
				
				<Table.HeaderCell
				>
					SERIE
				</Table.HeaderCell>
				
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{
					series
					.map((t) => (
						<Table.Row>
										
					<Table.Cell>{t.producto} </Table.Cell>
					<Table.Cell>{<input
					autoFocus
                    type="text"
					name="serie"
					id={t.id}
                    value={t.serie}
					onChange={this.handleInputChange}				
					className="inputform"
					
					onDoubleClick={() => {
						this.pesar(t.id);
					}}
                  />}</Table.Cell>
											
					
						
				</Table.Row>
					))}
			</Table.Body>
			</Table></React.Fragment>):('')}
			<button type="submit" className="submitform">Iniciar</button>
			
			</form>	
			<MostrarMensaje titulo={'Sus Datos fueron guardados con exito'} mensajes={'Guardar'}  visible={this.state.visible} onConfirm={this.onConfirm} />
			<Msjerror titulo={this.state.errormsj} mensajes={'Error'}  visible={this.state.visiblee} onConfirm={this.onConfirme} />
			
              </div>
			)
		
	
}
}