//@ts-check
import React, { Component } from 'react';
import '../css/style.css';
import Axios from 'axios';
import { FUNCIONES, headers } from '../utils/utils';
import { Loader, Table, Grid, Button,Dropdown } from 'semantic-ui-react';
import { MostrarMensaje } from './Mensajes';
import { Msjerror } from './Mensajeserror';
import FilaDetalle from './FilaDetalleCompra';
import PesaDetalle from './PesaDetalle';
import { isLoggedIn, logout , getUser} from "../utils/identity"
import { navigate } from 'gatsby';
import { domainToASCII } from 'url';



export default class PurchaseDetail extends Component {
	state = {
		loafing:false,
		from_agency: 0,
		to_agency:0,
		nombre: "",		
		equipo_id:0,
		buttonactive:false,
		items:[],
		detalle:[],
		id:0,
		show:false,
		getmem:null,
		guardarmem:null,
		date: "",
		empleado:0,
		from_orden:false,
		insumoscont:2,
		guardar:true,
		visilee:false,
		defaultdate: new Date(),
		descripcion:"",
		orden:null,
		ip:"192.168.100.1",
		pesocapturado:"0",

				
	};

	
	 
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
    

	setStateAsync(state) {
		return new Promise((resolve) => {
			this.setState(state, resolve);
		});
	}


	guardarcantidad = (id, cantidad) => {
		console.log(id)
		let detalle = this.state.detalle
		detalle.map((linea, i)=> (
		
			linea.id == id ? linea.cantidad = parseInt(cantidad) : false		

		));		
	
		this.setState(
			{
				detalle:detalle
			})
		
	};

	guardarlote = (id, lote) => {
		console.log(id)
		let detalle = this.state.detalle
		detalle.map((linea, i)=> (
		
			linea.id == id ? linea.lote = lote : false		

		));		
	
		this.setState(
			{
				detalle:detalle
			})
		
	};

	guardarserie = (id, serie) => {
		console.log(id)
		let detalle = this.state.detalle
		detalle.map((linea, i)=> (
		
			linea.id == id ? linea.series = serie : false		

		));		
	
		this.setState(
			{
				detalle:detalle
			})
		
	};
	
    
    guardar = (dte) => {
	
		this.setState({
			fecha:dte})

		 //console.log(dte)

	};
	

	async componentDidMount() {
		let user = isLoggedIn();
		this.setState({
			islogin: user
		});

		let userdata={group_id:0}

		userdata = getUser()

		this.setState({
			userdata: getUser()
		});
		
			let { action, agencias, comprables,  getmem, guardarmem } = this.props;
			this.setState ({
				getmem, guardarmem, comprables, action, agencias
				
			});
			let res = await this.equipos();
							
				
				let id = parseInt(this.props.id)
				let detalle = []
				let linedet
				console.log(id)
				this.setState({
					loading: true
				});
				Axios.get(FUNCIONES.PurchaseOrder+"?id="+id)
				.then(({ data }) => {
					//console.log(data)
					let date = new Date();
					var options = {  year: 'numeric', month: '2-digit', day: '2-digit', hour12: false, hour: '2-digit', minute: '2-digit' };
					let fechastr = date.toLocaleString('en-US',options);
					//console.log(fechastr)
					let hotastr = fechastr.substring(12,16)
					//console.log(hotastr)
					fechastr = fechastr.substring(0,10)
					fechastr = fechastr.trim();
					let fecha = fechastr.split('/');
					let hora = hotastr.split(":")
					fechastr = fecha[0]+fecha[1]+fecha[2]+hora[0]+hora[1]
					let detalleinf = data.purchase_order_details
					let orden_id = data.id
					let orden = data
					let cont = 1
					detalle = []
					for(let linea in detalleinf){
						linedet = {id:detalleinf[linea].id, 
							name:detalleinf[linea].item.name,
							unit_cost:detalleinf[linea].unit_cost, 
							reference:detalleinf[linea].reference, 
							item_id:detalleinf[linea].item_id, 
							item_cantidad:detalleinf[linea].booked_quantity,
							//cantidad:detalleinf[linea].booked_quantity, 
							cantidad:0,
							unico:false, 
							series:[],
							lote:fechastr+cont,
							item_category_id:detalleinf[linea].item.item_category_id,
							product_type:detalleinf[linea].item.product_type,
							measurement_unit:detalleinf[linea].item.measurement_unit,
							payee_id:detalleinf[linea].item.payee_id}
						detalle.push(linedet)
						cont++
					}
					//console.log(detalle)
						this.setState({
							detalle:detalle,
							orden_id:orden_id,
							loading:false,
							orden:orden,
							Selectequipo:this.Selectequipo,
					});
				})
				.catch((error) => {
					console.error(error);
				});
					
					this.setStateAsync({show:true})			
			
    
}

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



	SeleccionarTipo = (e, item) => {
		
		this.setState(
			{
                empleadoid:item.value,
				empleado:item
			})
	};

	Selectequipo = (e, item) => {
		//console.log(item)
		this.setState(
			{
                equipo_id:item.value
			})
		
	};






	esunicol = (e, item) => {
		
		let detalle = [];
		detalle = this.state.detalle
		//console.log(item)
		let id = item.id;
		id = id.toString().split("_");	
		//console.log(id)	
		if (item.checked){
		detalle.map((insumo, i)=> (
			//console.log(insumo)
			insumo.id == id[1] ? insumo.unico = true : false		

		));
		for (let linea in detalle){
			if(detalle[linea].id == id[1]){
				let items =detalle[linea].item_cantidad
				let series=[]
				for (let x = 0; x<items; x++){
					series.push({id:x,serie:"",linea_id:id, name:detalle[linea].name, peso:0})
				}
				detalle[linea].series=series
			}
		}
		}else{
		detalle.map((insumo, i)=> (
			//console.log(invoice)
			insumo.id == id[1] ? insumo.unico = false : false		

		));
		detalle.map((insumo, i)=> (
			//console.log(invoice)
			insumo.id == id[1] ? insumo.series = [] : false		

		));
		}

		
		//console.log(this.state.insumos);
			
		this.setState(
			{
				detalle:detalle
			})
	};

	

	buscariitem = (id, items) => {
		
		let name = null
		items.map((item, i)=> (
		
			item.key == id  ? name = item.text :  false	

		));		
		
		return name
	};

	
	buscarag = (id) => {
		let name = null
		this.state.agencias.map((agencia, i)=> (
		
			agencia.id == id  ? name = agencia.name :  false	

		));		
		
		return name
	};



	

	tipoinsumo = (e, item) => {
		//console.log(item)
		let tipo_insumo
		let items;
		tipo_insumo= item.value

		if(tipo_insumo=='paquete'){
			items = this.state.vendibles
		}else{
			items = this.state.comprables
		}
	
		this.setState({
			tipo_insumo: tipo_insumo,
			items:items,
			buttonactive:true,
		});
		
		
	};

	selecAg = (e, item) => {
		//console.log(item)
		//let agencia
		this.setState({
			[item.name]:item.value		
			
		});
		

		
	};

	editar_orden= async () => {
		//let string= '{"purchase_order":{"purchase_order_details_attributes":{"0":{"id":"'+this.state.orden.id+'", "_destroy":"false", "booked_quantity":"'+quantity+'","reference":"'+reference+'"}}}}'
	}

	get_lote=async (id)=>{
		
		
		let res = await Axios.get(FUNCIONES.lotezauru+'?id='+id)
		
		return res.data
	}
	
	
	crear_item=async (data)=>{
		
		let string = '{"item":{"name":"'+data.name.replace('"', '\\"')+'", "code":"'+data.code+'","ean13":"'+data.code+'","item_category_id":"'+data.item_category_id+'", "stockable":"true","measurement_unit":"'+data.measurement_unit+'","purchasable":"true", "product_type":"'+data.product_type+'","weight":"'+data.peso+'","payee_id":"'+data.payee_id+'"}}';
		//console.log(string)
		let res = await Axios.post(FUNCIONES.crearitem, string)
		//console.log(res.data) 
		string = '{"code":"'+data.code+'","name":"'+data.name.replace('"', '\\"')+'","category_id":"'+data.item_category_id+'","id":"'+res.data.id+'","store_id":"'+this.state.userdata.store+'", "details":null, "quantity":"'+data.peso+'"}'
		//console.log(string)
		let res2 = await Axios.post(FUNCIONES.guardaritem, string) 
		return res.data
	}	

	guardar_lote=async (data)=>{
	
		let string = '{"cantidad":"'+data.cantidad+'", "saldo":"'+data.cantidad+'"  ,"lote":"'+data.name.replace('"', '\\"')+'","id":"'+data.id+'","store_id":"'+this.state.userdata.store+'", "vence":"'+data.vence+'", "item_id":"'+data.item_id+'"}'
		//console.log(string)
		let res = await Axios.post(FUNCIONES.guardarlote, string) 
		return res.data
	}	
	
	
	  guardar_orden = async () => {
	
		this.setState({
			loading: true
        });
        

		
			try {
				let guardar=true;			
				let date = new Date();
				let fechastr = date.toLocaleDateString('en-US');
				let fecha = fechastr.split('/');
				fechastr = fecha[2]+'/'+fecha[0]+'/'+fecha[1]
				let x=0;
				let stringdet="";
				let stringedit="";
				let detalle = this.state.detalle
				let nuevositems=[]
				let edit = false
				let lineas = 0;
				let res;
				let capturarlotes = false;
				for(let linea in detalle){
					let series = detalle[linea].series
					if(detalle[linea].unico){
						edit = true;
						for(let x = 0 ; x<series.length; x++ ){
							detalle[linea].code =series[x].serie
							detalle[linea].peso = series[x].peso
							let res = await this.crear_item(detalle[linea]);
							if(lineas>0) stringedit+=","
							stringedit+='"'+lineas+'":{"item_id":"'+res.id+'", "booked_quantity":"1","reference":"","unit_cost":"'+detalle[linea].unit_cost+'"}'
							lineas++
						}
						stringedit+=","

						stringedit+='"'+lineas+'":{"id":"'+detalle[linea].id+'", "item_id":"'+detalle[linea].item_id+'","_destroy":"true", "booked_quantity":"0"}'
						lineas++
					}else{

					if(x>0) stringdet+=","

					if(detalle[linea].product_type==3){
						capturarlotes = true;
						let date = new Date();
						date.setDate(date.getDate() + 15);
						let fechastr = date.toLocaleDateString('en-US');
						let fecha = fechastr.split('/');
						fechastr = fecha[2]+'-'+fecha[0]+'-'+fecha[1]

						stringdet+='"'+x+'":{"id":"'+detalle[linea].id+'", "item_id":"'+detalle[linea].item_id+'", "booked_quantity":"'+detalle[linea].item_cantidad+'", "lot_delivered_quantity":["'+detalle[linea].cantidad+'"], "lot_name":["'+detalle[linea].lote+'"],"lot_expire":["'+fechastr+'"],"reference":"'+detalle[linea].lote+'" }'
					}else{
						stringdet+='"'+x+'":{"id":"'+detalle[linea].id+'", "item_id":"'+detalle[linea].item_id+'", "booked_quantity":"'+detalle[linea].item_cantidad+'", "delivered_quantity":"'+detalle[linea].cantidad+'"}'
					}
						x++
					}
					
				}

				if(edit){

					let stringorden = '{"purchase_order":{"purchase_order_details_attributes":{'+stringedit+'}},"exchange_rate":"1"}'
					//console.log(stringorden)
					res = await Axios.post(FUNCIONES.PurchaseOrderEdit+'?id='+this.props.id, stringorden)
					
					res = res.data
					detalle = res.purchase_order_details;
					x=0
					stringdet="";
					for(let linea in detalle){
						if(x>0) stringdet+=","

					stringdet+='"'+x+'":{"id":"'+detalle[linea].id+'", "item_id":"'+detalle[linea].item_id+'", "booked_quantity":"'+detalle[linea].booked_quantity+'", "delivered_quantity":"'+detalle[linea].booked_quantity+'"}'
					x++
					}

					let request='{"id":"'+this.state.orden.id+'", "agency_id":"'+this.state.orden.agency_id+'","exchange_rate":"1","delivery_date":"'+fechastr+'","purchase_order_details_attributes":{'+stringdet+'}}';
					//console.log(request)
					res = await Axios.post(FUNCIONES.recibir, request)
					this.setState({
						loading: false,
						visible:true
					});

				}else{
					let request='{"id":"'+this.state.orden.id+'", "agency_id":"'+this.state.orden.agency_id+'","exchange_rate":"1","delivery_date":"'+fechastr+'","purchase_order_details_attributes":{'+stringdet+'}}';
					console.log(request)
					res = await Axios.post(FUNCIONES.recibir, request) 
					
					if (capturarlotes)
					{
						let lotesdata =res.data
						//console.log(lotesdata)
						let entregas  = lotesdata.shipment_purchase_orders
						 for(let entrega in entregas){
							let ide=entregas[entrega].shipment_id
							//console.log(ide)
						let movements = await Axios.get(FUNCIONES.entrega+'?id='+ide)
							movements = movements.data.movements
						for(let linea in movements){
							if(movements[linea].lot_id!=null){

								let loteinfo = await this.get_lote(movements[linea].lot_id)
								let lote = {name:loteinfo.name, item_id:loteinfo.item_id, id:movements[linea].lot_id,cantidad:movements[linea].delivered_quantity, vence:loteinfo.expires}
								this.guardar_lote(lote)
							}
						}
					}
						
					}
						this.setState({
							loading: false,
							visible:true
						});
				}
					

			} catch (error) {
				console.error({ error });
				this.setState({
					loading: false,
					visiblee:true
				});
				
			} finally {
			
			
			
			}
		
		
		};
		
	
		agregar_linea = () =>{
			let id =this.state.insumoscont;
			let linedet = {id:id,  formula_id:0,item_bundle_name:"",quantity:0,cantidad:0}
			
			id++;
			let detalle = [...this.state.detalle, linedet]

		//console.log(insumos)
		this.setState(
			{
				detalle:detalle,
				insumoscont:id
			}
			
		);		
			
		}
		onConfirm = ()=>{
			this.setState({				
				visible:false
			});
			navigate('/app/ordenescompra')
		}

		onConfirme = ()=>{
			this.setState({				
			
				visiblee:false
			});
			navigate('/app/ordenescompra')
		}
		
		handleDateChange = (event, {name, value}) => {
			console.log(value)
			if (this.state.hasOwnProperty(name)) {
			  this.setState({ [name]: value });
			}
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
            this.guardar_orden()
            //alert(`Welcome ${this.state.firstName} ${this.state.lastName}!`)
					}
					
		saveDate = (date, name) => {
			
			this.setState({
				[name]: date
			  })
					  }
				

	render() {
		
		let { items,  agencias } = this.props
		
		items = [items]
		let {
		loading, equipos, action, equipo_id, Selectequipo,  detalle, orden
			
		} = this.state;
		if (loading || orden==null) {
			return <Loader active inline="centered" />;
		} else
			
			return(
				<div >

					<PesaDetalle peso={this.state.pesocapturado} view={this.state.verpesa}></PesaDetalle>
					<form onSubmit={this.handleSubmit}>
					<Grid.Row columns={4}><Grid.Column> <label>Orden {orden.id_number}
						</label></Grid.Column>
						<Grid.Column> <label>Proveedor {orden.payee.name}
						</label></Grid.Column>
						<Grid.Column> <label>Fecha {orden.issue_date}
						</label></Grid.Column>
						<Grid.Column><label>Equipo<Dropdown
						value={equipo_id}
						placeholder='Equipo'
						onChange={Selectequipo}					
						selection
						options={equipos}
						className="ui segment"
					/></label></Grid.Column>
					</Grid.Row>						
					<p >DETALLE</p>
				<Table sortable celled>
				<Table.Header>
				<Table.Row>
					<Table.HeaderCell>
						PRODUCTO
					</Table.HeaderCell>
					<Table.HeaderCell>
						REFERENCIA
					</Table.HeaderCell>
					<Table.HeaderCell>
						CANTIDAD SOLICITADA
					</Table.HeaderCell>
					<Table.HeaderCell>
						ENTREGAR
					</Table.HeaderCell>
					
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{
						detalle
						.map((t) => (
							<FilaDetalle			
								line={t}							
								view={true}
								id={t.id}		
								cantidad={t.cantidad}
								guardarcantidad={this.guardarcantidad}
								esunico={this.esunicol}
								guardarserie={this.guardarserie}
								guardarlote={this.guardarlote}
								pesar={this.pesar}
								
							/>
						))}
				</Table.Body>
				</Table>
				
				<Button type="submit" variant="primary" className="submitform" 	>Recibir</Button>
				</form>
				<MostrarMensaje titulo={'Sus Datos fueron guardados con exito'} mensajes={'Guardar'}  visible={this.state.visible} onConfirm={this.onConfirm} />
				<Msjerror titulo={this.state.errormsj} mensajes={'Error'}  visible={this.state.visiblee} onConfirm={this.onConfirme} />
				</div>
			
			)
	
}
}