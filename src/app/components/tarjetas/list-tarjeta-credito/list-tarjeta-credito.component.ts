import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/tarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';
import { TarjetaCreditoComponent } from '../tarjeta-credito/tarjeta-credito.component';


@Component({
  selector: 'app-list-tarjeta-credito',
  templateUrl: './list-tarjeta-credito.component.html',
  styleUrls: ['./list-tarjeta-credito.component.css']
})
export class ListTarjetaCreditoComponent implements OnInit { 
  listaTarjetas: TarjetaCredito[]=[];
  

  constructor(public tarjetaService:TarjetaService, public toastr:ToastrService) { }

  ngOnInit(): void {
    //metodo de tarjeta.service
    this.obtenerTarjeta();   

  }

  obtenerTarjeta(){
    this.tarjetaService.obtenerTarjeta().subscribe(data =>{
      this.listaTarjetas = data;
      console.log(data);
    });
  }

  eliminarTarjeta(id:number){
    if(confirm('Esta seguro de eliminar este registro?')){
      this.tarjetaService.eliminarTarjeta(id).subscribe(_data =>{
        this.toastr.warning('Registro eliminado','La tarjeta fue eliminada')
        this.tarjetaService.obtenerTarjeta();
      });
    }
    
  }

  editar(tarjeta: TarjetaCredito){
    this.tarjetaService.actualizar(tarjeta);
  }

  

}
