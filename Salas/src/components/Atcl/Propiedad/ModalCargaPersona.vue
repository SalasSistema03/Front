<template>
    <div class="modal fade" id="modalCargaPersona" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalVideosLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen-xxl-down atcl_foto_modal_high px-3">
            <div class=" modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="modalVideosLabel">Carga Persona</h1>
                    <button type="button" class="btn-close" data-bs-toggle="modal" data-bs-target="#modalPropietarios"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body ">
                    <form class="form-group row d-flex justify-content-center align-items-top" autocomplete="off" @submit.prevent="handleSubmit">
                        <div class="col-md-7 row d-flex justify-content-center">
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">Nombre</label>
                                <input type="text" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Nombre" v-model="nombre">
                            </div>
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">Apellido</label>
                                <input type="text" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Apellido" v-model="apellido">
                            </div>
                            <div class="form-group col-md-4  px-1 text-start">
                                <label for="" class="form-label">DNI</label>
                                <input type="Number" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="N° Documento" v-model="dni">
                            </div>
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">Fecha Nacimiento</label>
                                <input type="date" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Fecha Nacimiento" v-model="fecha_nacimiento">
                            </div>
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">Calle</label>
                                <input type="text" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Calle" v-model="calle">

                            </div>
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">N°</label>
                                <input type="number" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="N°" v-model="numero_calle">
                            </div>
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">Piso</label>
                                <input type="text" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Piso" v-model="piso">
                            </div>
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">Ciudad</label>
                                <input type="text" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Departamento" v-model="ciudad">
                            </div>
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">Provincia</label>
                                <input type="text" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Provincia" v-model="provincia">
                            </div>
                            <div class="form-group col-md-12 row px-1 text-start">
                                <div class="col-md-12">
                                    <label for="" class="form-label">Comentarios</label>
                                
                                    <textarea class="form-control form-control-sm" id="input-propietarios"
                                        placeholder="Observaciones" v-model="comentarios"></textarea>
                                </div>
                            </div>


                        </div>
                        <div class="col-md-5 ">
                            <div class="row g-1">
                                <div class="col-md-12">
                                    <div id="telefonos">
                                        <div class="telefono d-flex gap-2">
                                            <div class="mb-2 w-50">
                                                <label for="" class="form-label">Teléfono</label>
                                                <input class="form-control" type="text"
                                                    name="telefonos[0][phone_number]" placeholder="Teléfono" required v-model="telefono">
                                            </div>
                                            <div class="mb-2 w-50">
                                                <label for="" class="form-label">Notas</label>
                                                <input class="form-control" type="text" name="telefonos[0][notes]"
                                                    placeholder="Notas" v-model="notas">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-end mt-2">
                                        <button class="btn btn-primary" type="button" @click="agregarTelefono">Agregar
                                            Teléfono</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-12 row mt-4 d-flex justify-content-center">
                           <button type="submit" class="btn btn-primary w-50" :disabled="isSubmitting">
                                {{ isSubmitting ? 'Cargando...' : 'Cargar Propietario' }}
                            </button>    
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { cargarPadron } from '../../../Services/api/Atcl/AtclApi.js'
import { getUser } from '../../../Services/api/Usuario/userApi.js'
export default {
    async mounted() {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const { data } = await getUser(token)
            this.usuario_id = data?.id ?? data?.user?.id ?? ''
        } catch (error) {
            console.error('Error al obtener usuario:', error)
        }
    },
    data() {
       

        return {
            contador: 1,
            nombre: '',
            apellido: '',
            dni:'',
            fecha_nacimiento:'',
            calle:'',
            numero_calle:'',
            piso:'',
            ciudad:'',
            provincia:'',
            comentarios:'',
            telefono: '',
            notasInput: '',
            telefonos:[],
            notas:[],
            usuario_id: '',
        }
    },
    methods: {
        
        async handleSubmit() {
            const formDataToSend = new FormData()
            
            // Agregar campos básicos
            formDataToSend.append('nombre', this.nombre)
            formDataToSend.append('apellido', this.apellido)
            formDataToSend.append('dni', this.dni)
            formDataToSend.append('fecha_nacimiento', this.fecha_nacimiento)
            formDataToSend.append('calle', this.calle)
            formDataToSend.append('numero_calle', this.numero_calle)
            formDataToSend.append('piso', this.piso)
            formDataToSend.append('ciudad', this.ciudad)
            formDataToSend.append('provincia', this.provincia)
            formDataToSend.append('comentarios', this.comentarios)
            formDataToSend.append('usuario_id', this.usuario_id)

            const telefonos = []
            const container = document.getElementById('telefonos')
            if (container) {
                const phoneInputs = container.querySelectorAll('input[name^="telefonos"][name$="[phone_number]"]')
                phoneInputs.forEach((phoneInput) => {
                    const match = phoneInput.name.match(/telefonos\[(\d+)\]\[phone_number\]/)
                    const idx = match ? match[1] : null
                    const notesInput = idx !== null
                        ? container.querySelector(`input[name="telefonos[${idx}][notes]"]`)
                        : null

                    const phone = (phoneInput.value || '').trim()
                    const notes = (notesInput?.value || '').trim()

                    if (phone) {
                        telefonos.push({ phone_number: phone, notes })
                    }
                })
            }

            // Agregar teléfonos como JSON string
            formDataToSend.append('telefonos', JSON.stringify(telefonos))
            formDataToSend.append('notas', JSON.stringify(this.notasInput))
            
            try {
                await cargarPadron(formDataToSend)
                
                // Cerrar modal o mostrar éxito
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalCargaPersona'))
                modal.hide()
                
            } catch (error) {
                console.error('Error al cargar padron:', error)
            }
        },
        agregarTelefono() {
            const container = document.getElementById('telefonos');
            if (!container) return;

            const idx = this.contador;
            const div = document.createElement('div');
            div.classList.add('telefono');
            div.innerHTML = `
            <div class="telefono d-flex gap-2 pt-2">
            <input class="form-control" type="text" name="telefonos[${idx}][phone_number]" placeholder="Teléfono" required>
            <input class="form-control" type="text" name="telefonos[${idx}][notes]" placeholder="Notas">
            </div>
            `;
            container.appendChild(div);
            this.contador++;
        },
        
                

      
    }
}
</script>