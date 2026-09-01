import { ref } from 'vue'

export function useFiltroMesAnio() {
  const mes = ref(new Date().getMonth() + 1)
  const anio = ref(new Date().getFullYear())

  const obtenerAñoMenos3 = () => {
    let años = []
    for (let i = 0; i < 3; i++) {
      años.push(new Date().getFullYear() - i)
    }
    return años
  }

  return {
    mes,
    anio,
    obtenerAñoMenos3
  }
}
