import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Autor } from 'src/app/interfaces/autor.interface';
import { Libro } from 'src/app/interfaces/libro.interface';
import { AutoresService } from 'src/app/servicios/autores.service';
import { LibrosService } from 'src/app/servicios/libros.service';

@Component({
  selector: 'app-formulario-libro',
  templateUrl: './formulario-libro.component.html',
  styleUrls: ['./formulario-libro.component.scss'],
})

export class FormularioLibroComponent implements OnInit {

  @Output()
  recargar = new EventEmitter<boolean>();
  public modo: "Registrar" | "Editar" = "Registrar";
  public listaAutores: Autor[] = [];

  public form: FormGroup = new FormGroup({
    idCtrl: new FormControl<number>(null, Validators.required),
    tituloCtrl: new FormControl<string>(null, Validators.required),
    idautorCtrl: new FormControl<number>(null, Validators.required),
    paginasCtrl: new FormControl<number>(null, Validators.required),
  });

  constructor(
    private servicioAutores: AutoresService,
    private serviciosToast: ToastController,
    private sevicioLibros: LibrosService
  ) { }
  private cargarAutores() {
    this.servicioAutores.get().subscribe({
      next: (autores) => {
        this.listaAutores = autores;
      },
      error: (e) => {
        console.error('Error al cargar', e);
        this.serviciosToast.create({
          header: 'Error al cargar Autores',
          message: e.error,
          color: 'danger'
        })
      }
    });
  }
  ngOnInit() {
    this.cargarAutores();
  }
  guardar() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.modo === 'Registrar') {
        this.registrar();
      } else {
        this.editar();
      }

    }
  }
  private registrar() {
    const libro: Libro = {
      idlibro: this.form.controls.idCtrl.value,
      titulo: this.form.controls.tituloCtrl.value,
      idautor: this.form.controls.idautorCtrl.value,
      paginas: this.form.controls.paginasCtrl.value,
      autor: null
    }
    this.sevicioLibros.post(libro).subscribe({
      next: () => {
        this.recargar.emit(true);
        this.serviciosToast.create({
          header: 'Exito',
          message: 'Se registro correctamente el libro',
          duration: 2000,
          color: 'success'
        }).then(t => t.present());
      },
      error: (e) => {
        console.error('Error al registrar libro', e);
        this.serviciosToast.create({
          header: 'Error al registrar',
          message: e.message,
          duration: 3500,
          color: 'danger',
        }).then(t => t.present());
      }
    });
  }
  private editar() {
    const libro: Libro = {
      idlibro: this.form.controls.idCtrl.value,
      titulo: this.form.controls.tituloCtrl.value,
      idautor: this.form.controls.idautorCtrl.value,
      paginas: this.form.controls.paginasCtrl.value,
      autor: null
    }
    this.sevicioLibros.put(libro).subscribe({
      next: () => {
        this.recargar.emit(true);
        this.serviciosToast.create({
          header: 'Exito',
          message: 'Se edito correctamente el libro',
          duration: 2000,
          color: 'success'
        }).then(t => t.present());
      },
      error: (e) => {
        console.error('Error al Editar libro', e);
        this.serviciosToast.create({
          header: 'Error al Editar',
          message: e.message,
          duration: 3500,
          color: 'danger',
        }).then(t => t.present());
      }
    });
  }
}