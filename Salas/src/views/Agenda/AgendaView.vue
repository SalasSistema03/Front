<template>
  <div>
    <NavComponent />
    <div class="px-3 form-group">
      <div class="row">
        <div class="col-md-2 agenda_barra_lateral ">
          <div>
            <input class="form-control" type="date" v-model="fechaSeleccionada">
          </div>
          <div class=" row d-flex justify-content-center align-items-center mt-3">
            <div v-for="sector in sectores" :key="sector.id" class="col-12 m-1">
              <button class="btn btn-primary btn-sm w-100" type="button" @click="seleccionarSector(sector)">
                {{ sector.nombre }}
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-10 mb-2 agenda_tabla">
          <div v-if="cargaAgenda" class="d-flex justify-content-center align-items-center h-100">
            <div role="status">
              <div class="spinner-border spinner-border-light" role="status"></div>
              <p>Seleccione un sector</p>
            </div>
          </div>

          <div v-else class="tabla-scroll-container">
            <table class="table table-striped table-hover table-sm">
              <thead>
                <tr>
                  <th>HORA</th>
                  <th v-for="username in usernames" :key="username.usuario_id">{{ username.nombre }}</th>

                </tr>
              </thead>
              <tbody>
                <tr v-for="hora in horas" :key="hora">
                  <td class="agenda_ancho_tabla_hora">{{ hora }}</td>
                  <td v-for="username in usernames" :key="username.usuario_id" class="p-1">
                    <button type="button" :class="[
                      'mt-0 p-0 w-100 d-flex flex-column justify-content-center align-items-center',
                      notaEnCelda(username, hora) ? 'agenda-seleccionada' : 'agenda-noseleccionada'
                    ]" style="border-color: transparent;" @click="cargarAgenda(username, hora)">

                      <div v-if="textoCelda(username, hora)"
                        class="mt-0 texto-agenda row d-flex align-items-center justify-content-center">
                        <div class="col-12 bi bi-geo-alt"></div>
                        <div class="col-12 texto-agenda-content">
                          {{ textoCelda(username, hora) }}
                        </div>
                      </div>
                      <div v-else class="texto-agenda-logo">
                        <div v-if="notaEnCelda(username, hora)?.descripcion" class="bi bi-calendar4-week">
                        </div>
                      </div>

                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalAgenda :show="showModalAgenda" :username="selectedUsername" :hora="selectedHora" :sector="selectedSector"
    :fecha="fechaSeleccionada" :nota="selectedNota" @close="showModalAgenda = false" @nota-guardada="recargarSector" @nota-borrada="recargarSector" />
</template>
<script>
import NavComponent from '../../components/NavComponent.vue'
import ModalAgenda from '../../components/Agenda/ModalAgenda.vue'
import { getSectores } from '../../Services/api/Agenda/AgendaApi'
import { getUsuarioSector } from '../../Services/api/Agenda/AgendaApi'


export default {
  components: {
    NavComponent,
    ModalAgenda
  },
  watch: {
    async fechaSeleccionada() {
      // Al cambiar la fecha mantenemos el sector seleccionado y recargamos su agenda.
      // Solo limpiamos el estado del modal para evitar inconsistencias.
      this.showModalAgenda = false
      this.selectedUsername = null
      this.selectedHora = null
      this.selectedSector = null
      this.selectedNota = null

      if (this.sectorSeleccionado && this.sectorSeleccionado.id) {
        await this.seleccionarSector(this.sectorSeleccionado)
      } else {
        this.usernames = []
        this.sectoresCargados = false
        this.cargaAgenda = true
      }
    }
  },
  data() {
    return {
      sectores: [],
      usernames: [],
      cargaAgenda: false,
      horas: [],
      sectoresCargados: false,
      sectorSeleccionado: '',
      fechaSeleccionada: new Date().toISOString().split('T')[0],

      showModalAgenda: false,
      selectedUsername: null,
      selectedHora: null,
      selectedSector: null,
      selectedNota: null
    }
  },
  async mounted() {
    try {
      const response = await getSectores()
      this.sectores = response.data
      this.generarHoras()
      this.cargaAgenda = true
    } catch (error) {
      console.error('Error al cargar sectores:', error)
    }
  },
  methods: {
    generarHoras() {
      this.horas = []
      let hora = 7 // 7:00 AM
      let minuto = 0

      while (hora < 21 || (hora === 20 && minuto === 45)) {
        const horaFormateada = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`
        this.horas.push(horaFormateada)

        minuto += 15
        if (minuto === 60) {
          minuto = 0
          hora++
        }
      }
    },
    async seleccionarSector(sector) {
      this.cargaAgenda = true
      try {
        const response = await getUsuarioSector(sector.id, this.fechaSeleccionada)
        this.sectorSeleccionado = sector
        this.usernames = response.data
        //console.log(this.usernames)
        this.sectoresCargados = true
      } catch (error) {
        console.error('Error al cargar usuarios:', error)
      } finally {
        this.cargaAgenda = false
      }
    },
    async recargarSector() {
      if (!this.sectorSeleccionado) return
      this.cargaAgenda = true
      try {
        const response = await getUsuarioSector(this.sectorSeleccionado.id, this.fechaSeleccionada)
        this.usernames = response.data
      } catch (error) {
        console.error('Error al recargar usuarios del sector:', error)
      } finally {
        this.cargaAgenda = false
      }
    },
    //quiero pasarle los datos username y hora al modalAgenda
    cargarAgenda(username, hora) {
      // 1. Buscamos la nota primero
      const notaEncontrada = this.notaEnCelda(username, hora);

      // 2. Asignamos los valores
      this.selectedUsername = username;
      this.selectedSector = this.sectorSeleccionado;
      this.selectedNota = notaEncontrada;

      // 3. Si hay una nota, la hora para el modal debería ser la de inicio de esa nota
      // de lo contrario, usamos la hora de la celda (para una nota nueva)
      this.selectedHora = notaEncontrada ? notaEncontrada.hora_inicio : hora;

      // 4. Abrimos el modal
      this.$nextTick(() => {
        this.showModalAgenda = true;
      });
    },
    normalizarHora(hora) {
      if (!hora) return ''
      return String(hora).slice(0, 5)
    },
    notaEnCelda(username, hora) {
      const horaFila = this.normalizarHora(hora); // ej: "07:15"
      const notas = Array.isArray(username?.nota) ? username.nota : [];

      return notas.find(n => {
        const inicio = this.normalizarHora(n?.hora_inicio);
        const fin = this.normalizarHora(n?.hora_fin);

        // Retorna true si la hora de la fila está dentro del rango [inicio, fin)
        return horaFila >= inicio && horaFila < fin;
      }) || null;
    },
    textoCelda(username, hora) {
      //console.log(hora)
      const nota = this.notaEnCelda(username, hora)
      //console.log('acaa', nota)

      return nota?.propiedad_calle ? nota.propiedad_calle + ' ' + nota?.propiedad_numero_calle : ''
    }
  }
}
</script>
