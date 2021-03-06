import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { TarjetaCredito } from 'src/app/models/tarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit, OnDestroy {
  form:FormGroup;
  suscription!: Subscription;
  tarjeta!: TarjetaCredito;  
  idTarjeta: number | undefined;

  constructor(private formBuilder:FormBuilder,
               private tarjetaService:TarjetaService,
               private toastr: ToastrService) { 
    this.form = this.formBuilder.group({
      id:0,//formControlName
      titular:['',[Validators.required]],
      numeroTarjeta:['',[Validators.required, Validators.maxLength(16),Validators.minLength(16)]],
      fechaExpiracion:['',[Validators.required, Validators.maxLength(5),Validators.minLength(5)]],
      cvv:['',[Validators.required, Validators.maxLength(3),Validators.minLength(3)]],
    })
  }

  ngOnInit(): void {
    this.suscription = this.tarjetaService.obtenerTarjetas().subscribe(data =>{
      console.log(data);
      this.tarjeta = data;
      
      this.form.patchValue({
        titular: this.tarjeta.titular,
        numeroTarjeta: this.tarjeta.numeroTarjeta,
        fechaExpiracion: this.tarjeta.fechaExpiracion,
        cvv:this.tarjeta.cvv
      });      
      this.idTarjeta = this.tarjeta.id;
    });
  }
  
  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  guardarTarjeta(): void{
    if(this.idTarjeta == undefined){
      this.agregar();      
    }else{      
      this.editar();
    }
  }

  agregar(){
    const tarjeta : TarjetaCredito = {      
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value,
    };
    this.tarjetaService.guardarTarjeta(tarjeta).subscribe(data => {
      this.toastr.success('Registro agregado', 'la tarjeta fue agregada');
      this.tarjetaService.obtenerTarjeta();
      this.form.reset();
    });

  }

  editar(){
    
    const tarjeta : TarjetaCredito = {
      id: this.tarjeta.id,
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value
    };
    

    this.tarjetaService.actualizarTarjeta(this.idTarjeta!,tarjeta).subscribe(data =>{
      this.form.reset(); 
      this.toastr.info('Registro actualizado', 'la tarjeta fue actualizada');
      this.tarjetaService.obtenerTarjeta();
      this.idTarjeta = 0;
    });
  }

}
