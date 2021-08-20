import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import mandadostyles from '../css/mandados.css';
import {  Checkbox, Label, Button, Icon } from 'semantic-ui-react';
import ImageBox from '../components/ImageBox'
import UploadBox from '../components/uploadbox'
// Functional Component
export default class SortableList extends Component {
cambiar=(id, tipo)=>{
    //console.log(id)
    this.props.onSelect(id, tipo)
}

empezar=(id, tipo)=>{
    //console.log(id)
    this.props.onStart(id, tipo)
}

tags=(id, mandado, payee)=>{
    //console.log(id)
    this.props.tags(id, mandado, payee)
}

borrar=(id)=>{
    //console.log(id)
    this.props.Borrar(id)
}

asignar_sub=(id)=>{

this.props.child(id)
}
render(){

   let  {
        items,sub
    } = this.props;
   
    const listItems = items.map(val => (
    <li className={(val.tipo == 1) ? 'cobro' : (val.tipo == 3) ? 'soporte':(val.tipo == 5) ? 'compra':''} key={uniqueId()}  data-id={val.id}>
    {val.listorder} )Hora: {val.hora} Descripción: {val.descripcion} Cliente: {val.cliente} <strong>Nota:</strong>{(val.nota!=null ) ?  val.nota :('')}
      {val.hora_inicio !== null ?(' Hora de inicio'+val.hora_inicio):('')}


    {val.time == 1 && val.hora_inicio != null ?(
    <Checkbox
   
    checked={1==1}
/>):('')

    }

    {val.time == 1 && val.hora_inicio == null && val.realizado == 0 ? ( 
      
    <Checkbox
    
    onChange={() => {
        
       let resp= this.empezar(val.id,val.tipo)
       if(resp){
        val.hora_inicio = 1
       }
        
    }}    
    checked={val.hora_inicio == 1}
/>
    ):(  <Checkbox
        onChange={() => {
            
            if(val.realizado == 0){
                val.realizado = 1;
                this.cambiar(val.id,val.tipo)
            }
            
        }}    
        checked={val.realizado == 1}
    />)
}
{val.realizado == 1 && val.sign == 1 ? (
<ImageBox
    image={process.env.GATSBY_URL_IMAGES+'/signature_'+val.id+'.png'}
    label={"Firma"}
/>

) :("")
}

{val.image != null ? (
    <ImageBox
        image={val.image}
        label={"Foto"}
    />
    
    ) :(<UploadBox
        mandado={val.id}
        >       
    </UploadBox>)
    }

{val.tipo>4 && sub==1 && val.realizado == 0 ? (
    <Button onClick={() => {
        this.tags(val.zauru_id, val.id, val.payee_id);
    }} >
Ingresar Bultos
<Button.Content  >
</Button.Content>
</Button>
    
    ) :('')
    }
       

</li>
)

);
    return (
        <div id="list">
            
           <ul>
               {listItems}
           </ul>
        </div>
    );
};


}
