<template>
    <div class="px-3 mt-4">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Visualizador</h5>
            </div>
            <div class="card-body">
                <div class="row g-3 d-flex justify-content-between align-items-center">
                    <div class="col-md-2 justify-content-end d-flex text-center">
                        <label for="tipoIdentificador" class="form-label">Tipo Identificador</label>
                    </div>
                    <div class="col-md-10">
                        <select name="tipoIdentificador" id="tipoIdentificador" class="form-control" v-model="tipoIdentificador">
                            <option value="FOLIO">FOLIO</option>
                            <option value="DNI">DNI</option>
                        </select>
                    </div>

                    <div class="col-md-2 justify-content-end d-flex">
                        <label for="numero" class="form-label">Número</label>
                    </div>
                    <div class="col-md-10">
                        <!-- Display del número -->
                        <div class="number-display">{{ currentNumber }}</div>

                        <!-- Teclado numérico -->
                        <div class="keypad-container mt-3">
                            <div class="numeric-keypad">
                                <div class="keypad-row">
                                    <button 
                                        type="button" 
                                        class="keypad-button" 
                                        @click="addNumber('1')"
                                        :class="{ 'pressed': pressedButton === '1' }">
                                        1
                                    </button>
                                    <button 
                                        type="button" 
                                        class="keypad-button" 
                                        @click="addNumber('2')"
                                        :class="{ 'pressed': pressedButton === '2' }">
                                        2
                                    </button>
                                    <button 
                                        type="button" 
                                        class="keypad-button" 
                                        @click="addNumber('3')"
                                        :class="{ 'pressed': pressedButton === '3' }">
                                        3
                                    </button>
                                </div>
                                <div class="keypad-row">
                                    <button 
                                        type="button" 
                                        class="keypad-button" 
                                        @click="addNumber('4')"
                                        :class="{ 'pressed': pressedButton === '4' }">
                                        4
                                    </button>
                                    <button 
                                        type="button" 
                                        class="keypad-button" 
                                        @click="addNumber('5')"
                                        :class="{ 'pressed': pressedButton === '5' }">
                                        5
                                    </button>
                                    <button 
                                        type="button" 
                                        class="keypad-button" 
                                        @click="addNumber('6')"
                                        :class="{ 'pressed': pressedButton === '6' }">
                                        6
                                    </button>
                                </div>
                                <div class="keypad-row">
                                    <button 
                                        type="button" 
                                        class="keypad-button" 
                                        @click="addNumber('7')"
                                        :class="{ 'pressed': pressedButton === '7' }">
                                        7
                                    </button>
                                    <button 
                                        type="button" 
                                        class="keypad-button" 
                                        @click="addNumber('8')"
                                        :class="{ 'pressed': pressedButton === '8' }">
                                        8
                                    </button>
                                    <button 
                                        type="button" 
                                        class="keypad-button" 
                                        @click="addNumber('9')"
                                        :class="{ 'pressed': pressedButton === '9' }">
                                        9
                                    </button>
                                </div>
                                <div class="keypad-row">
                                    <button 
                                        type="button" 
                                        class="keypad-button action-btn"
                                        @click="clearAll()"
                                        :class="{ 'pressed': pressedButton === 'C' }">
                                        C
                                    </button>
                                    <button 
                                        type="button" 
                                        class="keypad-button" 
                                        @click="addNumber('0')"
                                        :class="{ 'pressed': pressedButton === '0' }">
                                        0
                                    </button>
                                    <button 
                                        type="button" 
                                        class="keypad-button action-btn"
                                        @click="backspace()"
                                        :class="{ 'pressed': pressedButton === '←' }">
                                        ←
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-12 d-flex justify-content-center">
                        <button 
                            type="button" 
                            class="btn btn-primary w-50" 
                            @click="asignar()">
                            Asignar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Variables reactivas
const currentNumber = ref('0')
const tipoIdentificador = ref('FOLIO')
const pressedButton = ref(null)

// Agregar número
const addNumber = (num) => {
    if (currentNumber.value === '0') {
        currentNumber.value = num
    } else if (currentNumber.value.length < 15) {
        currentNumber.value += num
    }
    
    // Efecto visual para el botón presionado
    highlightButton(num)
}

// Limpiar todo
const clearAll = () => {
    currentNumber.value = '0'
    highlightActionButton('C')
}

// Borrar último dígito
const backspace = () => {
    if (currentNumber.value.length > 1) {
        currentNumber.value = currentNumber.value.substring(0, currentNumber.value.length - 1)
    } else {
        currentNumber.value = '0'
    }
    highlightActionButton('←')
}

// Función para asignar
const asignar = () => {
    const numero = currentNumber.value
    
    // Mostrar alerta (puedes cambiar esto por una notificación Vue)
    alert('Tipo: ' + tipoIdentificador.value + '\nNúmero: ' + numero)
    
    // Aquí puedes agregar la lógica para enviar los datos
    console.log('Tipo Identificador:', tipoIdentificador.value)
    console.log('Número:', numero)
}

// Efecto visual para botones numéricos
const highlightButton = (num) => {
    pressedButton.value = num
    setTimeout(() => {
        pressedButton.value = null
    }, 150)
}

// Efecto visual para botones de acción
const highlightActionButton = (text) => {
    pressedButton.value = text
    setTimeout(() => {
        pressedButton.value = null
    }, 150)
}

// Soporte para teclado físico
const handleKeyDown = (event) => {
    const key = event.keyCode || event.which
    
    // Números 0-9
    if (key >= 48 && key <= 57) {
        const num = String.fromCharCode(key)
        addNumber(num)
    }
    // Números del teclado numérico
    else if (key >= 96 && key <= 105) {
        const num = (key - 96).toString()
        addNumber(num)
    }
    // Backspace
    else if (key === 8) {
        event.preventDefault()
        backspace()
    }
    // Delete o Escape
    else if (key === 46 || key === 27) {
        clearAll()
    }
    // Enter
    else if (key === 13) {
        asignar()
    }
}

// Montar y desmontar eventos de teclado
onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
})
</script>
 <style scoped>
.numeric-keypad {
    max-width: 350px;
    margin: 10px auto;
    height: 320px;
}

.keypad-button {
    width: 70px;
    height: 70px;
    font-size: 22px;
    font-weight: bold;
    margin: 3px;
    border: 2px solid #007bff;
    background-color: #f8f9fa;
    color: #007bff;
    border-radius: 12px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    transition: all 0.15s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.keypad-button:hover,
.keypad-button:active,
.keypad-button.pressed {
    background-color: #007bff;
    color: white;
    transform: scale(0.95);
}

.keypad-button.action-btn {
    background-color: #dc3545;
    border-color: #dc3545;
    color: white;
}

.keypad-button.action-btn:hover,
.keypad-button.action-btn:active,
.keypad-button.action-btn.pressed {
    background-color: #c82333;
    border-color: #bd2130;
    transform: scale(0.95);
}

.number-display {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    background-color: #f8f9fa;
    border: 2px solid #dee2e6;
    border-radius: 12px;
    padding: 20px;
    min-height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 2px;
    font-family: 'Courier New', monospace;
}

.keypad-container {
    border: 1px solid #dee2e6;
    border-radius: 15px;
    padding: 20px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.keypad-row {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
    gap: 8px;
}

/* Optimizaciones para iPad */
@media (max-width: 768px) {
    .numeric-keypad {
        max-width: 320px;
        height: 300px;
    }
    
    .keypad-button {
        width: 65px;
        height: 65px;
        font-size: 20px;
    }
    
    .number-display {
        font-size: 24px;
        min-height: 60px;
        padding: 15px;
    }
    
    .keypad-container {
        padding: 15px;
    }
}

@media (max-width: 480px) {
    .numeric-keypad {
        max-width: 300px;
        height: 280px;
    }
    
    .keypad-button {
        width: 60px;
        height: 60px;
        font-size: 18px;
        margin: 2px;
    }
    
    .number-display {
        font-size: 22px;
        min-height: 55px;
        padding: 12px;
    }
}

/* Prevenir zoom en iPad */
input, textarea, select {
    font-size: 16px;
}

/* Mejoras para accesibilidad */
.keypad-button:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}

.keypad-button.action-btn:focus {
    outline-color: #dc3545;
}
</style>
