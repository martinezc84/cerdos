//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES } from '../utils/utils';
import { Table, Loader, Grid,  Button } from 'semantic-ui-react';
import { MostrarMensaje } from './Mensajes';
import { Msjerror } from './Mensajeserror';
import {  getUser} from "../utils/identity"
import { navigate } from 'gatsby';





export default class CerdosNuevos extends Component {
	state = {
	
		lineas:[],
		lotes:[],
		
		orden:null,
		insumoscont:1,
		ptcont:1,
		buttonactive:false,
		loading:false,
		date:new Date().toLocaleDateString('en-GB'),
		consumototal:0,
		ip:"192.168.100.1",
		pesocapturado:"0",
				
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
		while(!listo){

			Axios.get(FUNCIONES.getpeso)
			.then(res => {
			  let persons = res.data.peso;
			  //console.log(persons)

			  if(persons==pesoanterior){
				y++
				//console.log("iguales")
				if(y==3)
					console.log("capturado: "+pesoanterior)
					listo=true

					
							let lineas = this.state.lineas
														
							lineas.map((ref, i)=> (
					
								ref.id == id  ? ref.quantity = parseFloat(pesoanterior) :  false	
					
							));	
							//console.log(referencias)
							this.setState({
								lineas
							})
				
					
					return pesoanterior
					

			  }else{
				  pesoanterior = persons
				  y=0
			  }
			})
			  x++
			  if (x==6)
				  listo=true
			
		}

	return 0;


	}
	
    
    guardar = (dte) => {
	
		this.setState({
			fecha:dte})

		 //console.log(dte)

	};

	obtener_referencia=(id, items) =>{
		let referencia = ''

		items.map((item, i)=> (
		
			item.orden_line_id == id ?  referencia = item.lote : false		

		));	
		
		return referencia;
	}
	

	async componentDidMount() {
	
		this.setState({
			userdata: getUser(),
			loading:true
		});

	
		let to_agency
			let { action, comprables, vendibles  } = this.props;
				let lineas=[]
				
				let linea = {id:1,name:"",quantity:0,reference:""}
				lineas.push(linea)
		
			this.setState ({
				to_agency:to_agency,
				action:action,
				lineas,
				guardarcantidad:this.guardarcantidad,
				guardarcantidadpt:this.guardarcantidadpt,
				guardarcantidadflex:this.guardarcantidadflex,
				loading:false
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

	crear_item=async (data)=>{
		
		let string = '{"item":{"name":"'+data.name.replace('"', '\\"')+'", "code":"'+data.code+'","ean13":"'+data.code+'","item_category_id":"'+data.item_category_id+'", "stockable":"true","measurement_unit":"'+data.measurement_unit+'","purchasable":"true", "product_type":"'+data.product_type+'","weight":"'+data.peso+'","payee_id":"'+data.payee_id+'"}}';
		//console.log(string)
		let res = await Axios.post(FUNCIONES.crearitem, string)
		//console.log(res.data) 
		string = '{"code":"'+data.code+'","name":"'+data.name.replace('"', '\\"')+'","category_id":"'+data.item_category_id+'","id":"'+res.data.id+'","store_id":"'+this.state.userdata.store+'", "details":"'+this.state.orden.id+'"}'
		//console.log(string)
		let res2 = await Axios.post(FUNCIONES.guardaritem, string) 
		return res.data
	}	

	get_itemz=async (id)=>{
		
	
		let res = await Axios.get(FUNCIONES.itemzauru+"?id="+id )
		//sconsole.log(res.data) 
		
		return res.data
	}	

	get_item=async (serie)=>{
		
		
		let res = await Axios.get(FUNCIONES.itemserie+"?serie="+serie)
		//console.log(res.data) 
		if(res.data!=null){
			return res.data
		}else{
			return null
		}
	}

	crear_lote=async (data)=>{
		let date = new Date();
						date.setDate(date.getDate() + 15);
						let fechastr = date.toLocaleDateString('en-US');
						let fecha = fechastr.split('/');
						fechastr = fecha[2]+'-'+fecha[0]+'-'+fecha[1]
		
		let string = '{"lot":{"item_id":"'+data.item_id+'", "name":"'+data.lote+'","expires":"'+fechastr+'"}}'
		//console.log(string)
		let res = await Axios.post(FUNCIONES.crearlote, string) 

		 string = '{"cantidad":"'+data.cantidad+'", "saldo":"'+data.cantidad+'"  ,"lote":"'+data.lote.replace('"', '\\"')+'","id":"'+res.data.id+'","store_id":"'+this.state.userdata.store+'", "vence":"'+fechastr+'", "item_id":"'+data.item_id+'"}'
		//console.log(string)
		let res2 =  Axios.post(FUNCIONES.guardarlote, string) 
		return res.data.id
	}	
	
	
	
		
	agregar_item = () =>{
		let id =this.state.insumoscont;
		id++;
		let linea = {id:id,name:"",quantity:0,reference:""}
		
		let lineas = this.state.lineas;
		lineas.push(linea)



	//console.log(insumos)
	this.setState(
		{
			lineas:lineas,
			insumoscont:id
		}
		
	);		
		
	}

	guardar_cerdos = async () => {
	
		this.setState({
			loading: true
        });
        
		console.log(this.state.userdata)
	
		// Ciclo de llamadas
		
			try {
			
				let guardar =true;
				
			
					let x=0
					
					
					let lineas = this.state.lineas
					for (let linea in lineas){

						let data={store_id:this.state.userdata.store, item_id:47395, customer_id:288956,description:"INGRESO LECHONES", name:lineas[linea].name}

						//console.log(data)
						for(let x=1;x<=lineas[linea].quantity;x++){
							let resp = await Axios.post(FUNCIONES.postapi+"?method=crear_serie",JSON.stringify(data))
							let datar =resp.data
							if(datar.status=="ok"){
								let serial_id = datar.serial_id
								let name = datar.name;

								let data={store_id:this.state.userdata.store,name:name, item_id:377216}
								Axios.post(FUNCIONES.postapi+"?method=crear_lote",JSON.stringify(data))

								data={store_id:this.state.userdata.store,name:"", serial_id:serial_id, payee_info:"VENTASDIPRO",item_id:376531,user:"dipro"}
								resp = await Axios.post(FUNCIONES.postapi+"?method=abrir_caso",JSON.stringify(data))
								console.log(resp)
							}
							
						}

						
					}
					
					this.setState({
						loading:false,
						visible:true,
						
					});
					
				
				//console.log(poststr)
				
				let data;
				//console.log(poststr)

				
					
			
			
				
			
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
        
        handleInputChange = event => {
            const target = event.target
            const value = target.value
			const name = target.name
			let id = target.id
		
				let lineas = this.state.lineas
				id = id.split("_")
				lineas.map((desp, i)=> (
		
					desp.id == id[1]  ? desp.name = value :  false	
		
				));	

				this.setState({
					lineas
				  })
			
        
            
		  }
		  
		  handleInputChangepeso = event => {
            const target = event.target
            const value = target.value
			const name = target.name
			let id = target.id
			
				let referencias = this.state.lineas
				id = id.split("_")
				
				referencias.map((ref, i)=> (
		
					ref.id == id[1]  ? ref.quantity = value :  false	
		
				));	
				//console.log(referencias)
				this.setState({
					referencias
				  })

            
		  }
		  
		  handleInputChangeLote = event => {
            const target = event.target
            const value = target.value
			const name = target.name
			let id = target.id
			
				let lotes = this.state.lotes
				id = id.split("_")
				
				lotes.map((ref, i)=> (
		
					ref.id == id[1]  ? ref.lote = value :  false	
		
				));	
				//console.log(referencias)
				this.setState({
					lotes
				  })

            
          } 
		 
		  handleInputChangeCant = event => {
            const target = event.target
            const value = target.value
			const name = target.name
			let id = target.id
			
				let lotes = this.state.lotes
				id = id.split("_")
				
				lotes.map((ref, i)=> (
		
					ref.id == id[1]  ? ref.cantidad = value :  false	
		
				));	
				//console.log(referencias)
				this.setState({
					lotes
				  })

            
          }
        
          handleSubmit = event => {
			  //console.log("enviando info")
            event.preventDefault()
            this.guardar_cerdos()
            //alert(`Welcome ${this.state.firstName} ${this.state.lastName}!`)
					}
					

				

	render() {
		
		

		let {
				
			lineas, loading
           
			
		} = this.state;
		//console.log(lotes)

			if (loading) {
			return <Loader active inline="centered" />;
				} else
		
			return(
				<div >
						 <React.Fragment> <Grid.Row><Grid.Column><Button type="button" variant="primary"  className="submitform" onClick={() => {
										this.agregar_item();
									}}	>Agregar Linea</Button></Grid.Column></Grid.Row></React.Fragment>
                <form onSubmit={this.handleSubmit}>

				{  (lineas.length>0 )?(<React.Fragment><p >DETALLE</p>
			<Table sortable celled>
			<Table.Header>
			<Table.Row>
							
				<Table.HeaderCell
					
				>
					NOMBRE
				</Table.HeaderCell>
				
				
				<Table.HeaderCell
					
				>
					CANTIDAD
				</Table.HeaderCell>
				
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{
					lineas
					.map((t) => (
						<Table.Row>
										
					
					
					 
					<Table.Cell>{<input
					autoFocus
                    type="text"
					name="name"
					id={"name_"+t.id}
                    value={t.name}
					onChange={this.handleInputChange}				
					className="inputform"
					placeholder="Lote"
					
				  />}
				 
				  </Table.Cell>
				  <Table.Cell>{<input
					autoFocus
                    type="number"
					name="peso"
					id={"peso_"+t.id}
                    value={t.quantity}
					onChange={this.handleInputChangepeso}				
					className="inputform"
					placeholder="Cantidad"
					
				  />}
				 
				  </Table.Cell>
											
					
						
				</Table.Row>
					))}
				
			</Table.Body>
			</Table></React.Fragment>):('')}
								
		<button type="submit" className="submitform">Generar</button>
			</form>	
			<MostrarMensaje titulo={'Sus Datos fueron guardados con exito'} mensajes={'Guardar'}  visible={this.state.visible} onConfirm={this.onConfirm} />
			<Msjerror titulo={this.state.errormsj} mensajes={'Error'}  visible={this.state.visiblee} onConfirm={this.onConfirme} />
			
              </div>
			)
		
	
}
}