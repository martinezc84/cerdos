//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES } from '../utils/utils';

import {  Table, Dropdown, Loader, Grid, Button} from 'semantic-ui-react';

import { MostrarMensaje } from './Mensajes';
import { Msjerror } from './Mensajeserror';
import FilaTransfer from './FilaTransfer';
import {  getUser} from "../utils/identity"
import { navigate } from 'gatsby';
import {DateInput} from 'semantic-ui-calendar-react';

export default class Formula extends Component {
	state = {
		vendibles:[],
		loading:false,
		insumos:[],
		from_agency: 0,
		to_agency:0,
		nombre: "",		
		activa:null,
		insumoscont:1,
		buttonactive:false,
		itemst:[],
		id:0,
		show:false,
		visiblee:false,
		errormsj:"Error",
		date:new Date().toLocaleDateString('es-GT',{year: 'numeric', month: '2-digit', day: '2-digit'}),
		empleado:0,
		equipo_id:0
				
	};
	
	
    

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}



	
    
    guardar = (dte) => {
	
		this.setState({
			fecha:dte})

		 console.log(dte)

	};

	

	async componentDidMount() {
	
		this.setState({
			userdata: getUser()
		});
		
			let { action, comprables, vendibles  } = this.props;

			let res = await this.empleados();
			res = await this.equipos();
			await Axios.get(FUNCIONES.getip)
				.then(({ data }) => {
					let ip = data.ip

					console.log(ip)
					this.setState({
						ip
					});
				})
			
			if(action!='new'){
				let id = this.props.id
				Axios.get(FUNCIONES.formula+"?id="+id)
				.then(({ data }) => {
					//console.log(data)
						
					this.setState({
						
					});
				})
				.catch((error) => {
					console.error(error);
				});
			}else{
				this.setState({
					nombre: "",					
					tiempo_de_produccion:"00:00:00",					
					activa:1,
					formula:null,
					insumos:[],					
					action:action,
					comprables:comprables,
					vendibles:vendibles
				});
			}

			let items = [...comprables, vendibles]
			this.setState ({
				esunico:this.esunico,
				items:items,
				action:action,
				guardarcantidad:this.guardarcantidad,
				Selectequipo:this.Selectequipo
				
			});
					
					
					this.setStateAsync({show:true})			
			
    
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
					let detalle = this.state.insumos
					detalle.map((linea, i)=> (
					
						linea.id == id ? linea.booked_quantity = parseFloat(pesoanterior) : false		

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

Selectequipo = (e, item) => {
	//console.log(item)
	this.setState(
		{
			equipo_id:item.value
		})
	
};

	SeleccionarTipo = (e, item) => {
		
		this.setState(
			{
                empleadoid:item.value,
				empleado:item
			})
	};

	selectAg = (e, item) => {
		//console.log(item)
		//let agencia
		this.setState({
			[item.name]:item.value		
			
		});
		

		
	};
	

	
	SelectItem = (e, item) => {
		let id = item.id;
		id = id.toString().split("_");
		if(id[0]=='insumo'){
			let insumos = this.state.insumos
			insumos.map((insumo, i)=> (
				//console.log(invoice)
				insumo.id == id[1] ? insumo.item_id = item.value : false		
	
			));
			this.setState(
				{
					insumos:insumos
				})
		}else{
			let pts = [];
			pts = this.state.pts
			console.log(item)
			pts.map((pt, i)=> (
				
				pt.id == id[1] ? pt.item_id = item.value : false		
	
			));
			this.setState(
				{
					pts:pts
				})
		}
		
	};

	esunico = (e, item) => {
		
		let un = null;

		item.checked ==true ? un =true: un=false; 

		this.setState(
			{
                unico:un,
               
			})
	};



	esunicol = (e, item) => {
		
		let insumos = {};
		insumos = this.state.insumos
		//console.log(item)
		let id = item.id;
		id = id.toString().split("_");	
		//console.log(id)	
		if (item.checked)
		this.state.insumos.map((insumo, i)=> (
			//console.log(invoice)
			insumo.id == id[1] ? insumo.unico = true : false		

		));
		else
		insumos.map((insumo, i)=> (
			//console.log(invoice)
			insumo.id == id[1] ? insumo.unico = false : false		

		));
		
		//console.log(this.state.insumos);
			
		this.setState(
			{
				insumos:insumos
			})
	};

	guardarcantidad = (id, cantidad) => {
		let insumos = this.state.insumos
		insumos.map((insumo, i)=> (
		
			insumo.id == id ? insumo.booked_quantity = cantidad : false		

		));		
		//console.log(insumos)
		this.setState(
			{
				insumos:insumos
			})
		
	};

	guardarlote = (id, lote) => {
		let insumos = this.state.insumos
		insumos.map((insumo, i)=> (
		
			insumo.id == id ? insumo.lote = lote : false		

		));		
		//console.log(insumos)
		this.setState(
			{
				insumos:insumos
			})
		
	};



	buscariitem = (id, items) => {
		//console.log(items)
		let name = null
		items.map((item, i)=> (
		
			item.key == id  ? name = item.text :  false	

		));		
		
		return name
	};

	Selectempleado = (e, item) => {
		
		this.setState(
			{
                empleado:parseInt(item.value)
			})
		
	};
	
	buscarag = (id) => {
		let name = null
		this.state.agencias.map((agencia, i)=> (
		
			agencia.id == id  ? name = agencia.name :  false	

		));		
		
		return name
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

	async empleados(){
		if(this.props.getmem('empleados')===undefined){
			
				try {
					
					let res = await Axios.get(FUNCIONES.empleados);
					let empleados = res.data
					empleados = this.trataEquipo(empleados)
					//console.log(res.data)
					this.props.guardarmem('empleados', empleados);
					this.props.guardar('empleados', empleados);
					this.setState({
						empleados: empleados,
						
					});

					//cargar formula
					return true
					
				
				}catch(error) {
					console.error(error);
					return false
				};
			}else{
				//console.log(this.props.getmem('empleados'))
				this.setState({
					empleados:this.props.getmem('empleados')
					
				});
				return true
			}
	}
	  guardar_formula = async () => {
	
		this.setState({
			loading: true
        });
        
       
	
		// Ciclo de llamadas
		
			try {
			
				let guardar =true;
				let booking ={
					
					booker_id:this.state.empleado,
					planned_delivery:this.state.date,
					movements_attributes:"|insumos|",
					needs_transport:0,
					agency_from_id:this.state.from_agency,
					agency_to_id:this.state.to_agency,
					reference:this.state.nombre,
				
					memo:"",
					payee_id:393185,
					
				}
				let shipment = {shipment:booking}
				if((booking.reference!=="")  ){
					let x=0
					
					let lot_id
					let lotinfo
					let stringdet="{"
					let insumos = this.state.insumos
					for (let linea in insumos){
						if(x>0) stringdet+=","
						if(insumos[linea].lote!=""){ 
							lotinfo = await Axios.get(FUNCIONES.lote+'?id='+insumos[linea].lote+"&item_id="+insumos[linea].item_id)
							lot_id = lotinfo.data.id
							let pesoactual = insumos[linea].booked_quantity
							insumos[linea].booked_quantity= insumos[linea].booked_quantity - lotinfo.data.pesoactual
							Axios.post(FUNCIONES.editarlote,'{"id":"'+lot_id+'","pesoactual":"'+pesoactual+'"}')
							Axios.post(FUNCIONES.guardarloteag,'{"lote_id":"'+lot_id+'","cantidad":"'+pesoactual+'","agencia_id":"'+this.state.to_agency+'"}')
					   }else{ 
						   lot_id = ""
					   }
						stringdet+='"'+x+'":{"item_id":"'+insumos[linea].item_id+'", "booked_quantity":"'+insumos[linea].booked_quantity+'", "lot_id":"'+lot_id+'"}'
						x++
					}
					stringdet+="}"

					
				let poststr = JSON.stringify(shipment)
				//console.log(poststr)
				poststr= poststr.replace('"|insumos|"',stringdet)
				let data;
				//console.log(poststr)

				await Axios.post(`${FUNCIONES.reservaciones}`,poststr)
				.then(({ data }) => {

					Axios.post(FUNCIONES.deliver+"?id="+data.id)

					this.setState({
						loading:false,
						visible:true,
						
					});
					//console.log(data)	
				})
				.catch((error) => {
					//console.error(error);

					
						this.setState({
							loading:false,
							visiblee:true,
							errormsj:"Sus datos no se guardaron, contacte al Administrador \n"+JSON.stringify(error.response.data)
						});
					

				
				});
					
				}else{
					this.setState({
						loading:false,
						visiblee:true,
						errormsj:"Llene todos los datos del formulario"
					});
				}
			
				
			
				//console.log(data)
			} catch (error) {
				console.error({ error });
				this.setState({
					loading:false,
					visiblee:true,
					errormsj:"Sus datos no se guardaron, contacte al Administrador \n"+JSON.stringify(error.response.data)
				});
				
			} finally {
				
			
			
			}
		
		
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
		
		agregar_item = () =>{
			let id =this.state.insumoscont;
			let insum={id:id,item_id:0,booked_quantity:1,lote:""}
			id++;
			let insumos = this.state.insumos;
			insumos.push(insum)

		//console.log(insumos)
		this.setState(
			{
				insumos:insumos,
				insumoscont:id
			}
			
		);		
			
		}

		handleDateChange = (event, {name, value}) => {
			console.log(value)
			
			  this.setState({ [name]: value });
			
		  }

		  saveDate = (date, name) => {
			
			this.setState({
				[name]: date
			  })
					  }
        
        handleInputChange = event => {
            const target = event.target
            const value = target.value
            const name = target.name
        
            this.setState({
              [name]: value,
            })
          }
        
          handleSubmit = event => {
			  //console.log("enviando info")
            event.preventDefault()
            this.guardar_formula()
            //alert(`Welcome ${this.state.firstName} ${this.state.lastName}!`)
					}

				
					

				

	render() {
		
		let {  agencias } = this.props
		

		let {
			
			insumos,
			guardarcantidad,				
			from_agency,
			to_agency,
            nombre, items, action, empleado, empleados, loading, equipo_id, Selectequipo,equipos
			
		} = this.state;

	
		
		if (loading) {
			return <Loader active inline="centered" />;
		} else
		
		if(action=='view')
			return(
				<div></div>
			)
		else if (action=='edit')
			return (
				<div >
				</div>
				
			
		)
		else
		return(
			<div >
				<form onSubmit={this.handleSubmit}>
				<Grid columns={2}>
		<Grid.Row>
			<Grid.Column> 
				<label>Fecha
					<DateInput
							name="date"
							placeholder="Fecha"
							value={this.state.date}
							iconPosition="left"
							onChange={this.handleDateChange}
							localization='us'
							dateFormat="DD/MM/YYYY"
							icon={false}
							initialDat={this.state.date}
							
							/>
				</label>
			</Grid.Column>
			<Grid.Column> 
			<label>Equipo<Dropdown
						value={equipo_id}
						placeholder='Equipo'
						onChange={Selectequipo}					
						selection
						options={equipos}
						className="ui segment"
					/></label>
			</Grid.Column>
						
		</Grid.Row>
			
							{nombre!==null ? (
			<Grid.Row><Grid.Column>
			<label>
			  Nombre
			  <input type="text" placeholder="Nombre"  name="nombre"
                     className="mr-sm-2" value={this.state.nombre}
				onChange={this.handleInputChange} />
			</label></Grid.Column>
			<Grid.Column><label>Empleado<Dropdown
					value={empleado}
					placeholder='Empleado'
					onChange={this.Selectempleado}				
					selection
					search
					options={empleados}
					className="ui segment"
				/></label></Grid.Column></Grid.Row>):("")
							}

		
			<Grid.Row><Grid.Column><label>
			  Origen
			  <Dropdown
					  value={from_agency}
					placeholder='Agencia'
					onChange={this.selectAg}
					search
					selection
					options={agencias}
					className="mr-sm-2"
					name="from_agency"
				/>
			</label></Grid.Column><Grid.Column><label>
			  Destino
			  <Dropdown
					  value={to_agency}
					placeholder='Agencia'
					onChange={this.selectAg}
					search
					selection
					options={agencias}
					className="mr-sm-2"
					name="to_agency"
				/>
			</label></Grid.Column></Grid.Row>

			 <React.Fragment> <Grid.Row><Grid.Column><Button type="button" variant="primary"  className="submitform" onClick={() => {
										this.agregar_item();
									}}	>Agregar Insumo</Button></Grid.Column></Grid.Row></React.Fragment>
			
			
		  
		  </Grid>	
					<br></br>	<br></br>	
		 
								<p >ITEMS</p>
			<Table sortable celled>
			<Table.Header>
			<Table.Row>
							
				<Table.HeaderCell
					
				>
					ITEM
				</Table.HeaderCell>
				<Table.HeaderCell
					
				>
					LOTE
				</Table.HeaderCell>
				
				<Table.HeaderCell
					
				>
					CANTIDAD
				</Table.HeaderCell>
			
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{
					insumos
					.map((t) => (
						<FilaTransfer
							items={items}
							selectitem={this.SelectItem}
							id={t.id}							
							item_id={t.item_id}
							cantidad={t.booked_quantity}							
							guardarcantidad={guardarcantidad}
							guardarlote={this.guardarlote}
							pesar={this.pesar}
						/>
					))}
			</Table.Body>
			</Table>

			

			
			<button type="submit" className="submitform">Iniciar</button>
			</form>
			<MostrarMensaje titulo={'Sus Datos fueron guardados con exito'} mensajes={'Guardar'}  visible={this.state.visible} onConfirm={this.onConfirm} />
			<Msjerror titulo={this.state.errormsj} mensajes={'Error'}  visible={this.state.visiblee} onConfirm={this.onConfirme} />
			</div>
		  
		)
	
}
}