class Joystick {

    constructor() {
        this.axes = []; // eixos
        this.buttons = [];
        this.lastSentState = null; // Armazenar o último estado enviado
        this.deadzone = 0.15;
        this.isSending = false; // Flag para controlar o envio em espera
        this.cooldownTime = 300; // Tempo mínimo de espera em milissegundos entre envios de eixos
    }
  
    // Método para iniciar a leitura do joystick, utiliza a API Gamepad
    init() {
      if ("getGamepads" in navigator) {
        window.addEventListener("gamepadconnected", (e) => {
            // Joystick conectado com sucesso, inicar leitura
          console.log("Joystick conectado!");
          this.loopGamepadState();
        });
  
        window.addEventListener("gamepaddisconnected", (e) => {
            // Joystick desconectado
          console.log("Joystick desconectado!");
        });
      } else {
        console.log("Seu navegador não suporta a API Gamepad.");
      }
    }
    
    // Loop que captura alterações no estado do joystick
    loopGamepadState() {
        requestAnimationFrame(() => this.loopGamepadState());
    
        var gamepads = navigator.getGamepads();
    
        if (gamepads[0]) {
          var joystick = gamepads[0];
          this.axes = joystick.axes;
          this.buttons = joystick.buttons;
    
        // Verifica se o estado atual é relevante para envio
        if (this.isStateRelevant(this.axes, this.buttons)) {
            
            // Envia a mensagem apenas se o tempo mínimo de espera não tiver sido atingido para os eixos
            if (!this.sendCooldown || this.isButtonStateRelevant(this.buttons)) {
                this.makeJSON();

                // Atualiza o último estado enviado com o estado atual completo
                // O ultimo estado enviado é usado para verificar se a proxima alteração será relevante
                this.lastSentState = {
                    manche: {
                    velX: this.axes[0],
                    velY: this.axes[1],
                    },
                    las: this.buttons[10].pressed,
                    trig: this.buttons[11].pressed,
                };

                // Inicia o tempo mínimo de espera apenas para os eixos
                if (!this.isButtonStateRelevant(this.buttons)) {
                    this.sendCooldown = true;
                    setTimeout(() => {
                        this.sendCooldown = false;
                    }, this.cooldownTime); // Tempo mínimo de espera em milissegundos (1000 ms = 1 segundo)
                    }
                }
            }
        }
    }
    
    /**
     * Compara o estado atual do joystick com o ultimo que foi enviado,
     * verificando se as alterações no eixo superam o valor da deadzone, compara os botoes pressionados.
     * 
     * @returns (bool) true: alteração de estado é relevante e deve ser enviada ou false (caso contrario)
     */
    isStateRelevant(newAxes, newButtons) {
        // Se ainda não houver um estado enviado anteriormente, consideramos relevante o envio
        if (!this.lastSentState) {
            return true
        }
    
        // Compara os eixos
        if (Math.abs(newAxes[0] - this.lastSentState.manche.velX) > this.deadzone ||
            Math.abs(newAxes[1] - this.lastSentState.manche.velY) > this.deadzone) {
            return true; // alterações relevantes
        }
    
        // Compara os botões LAS e TRIG
        if (newButtons[10].pressed !== this.lastSentState.las || newButtons[11].pressed !== this.lastSentState.trig) {
            return true; // alterações relevantes
        }
    
        return false; // Não houve alterações relevantes
    }

    /**
     * Testa se o estado dos botões é igual ao ultimo enviado, para nao enviar dados redundantes
     * @param {*} newButtons 
     * @returns 
     */
    isButtonStateRelevant(newButtons) {
        if (!this.lastSentState) {
            return true;
        }
    
        // Compara os botões LAS e TRIG
        if (newButtons[10].pressed !== this.lastSentState.las || newButtons[11].pressed !== this.lastSentState.trig) {
            return true;
        }
    
        return false; // Não houve alterações relevantes nos botões
    }
    
    /**
     * Monta o JSON para ser enviado a API, imprime o JSON no terminal
     */
    makeJSON() {
        // Monta o objeto JSON com as informações alteradas para enviar à API
        const changes = {};
    
        if (this.lastSentState) {
            // Compara o estado atual com o último estado enviado
            if (Math.abs(this.axes[0] - this.lastSentState.manche.velX) > this.deadzone) {

                changes.manche = {
                    velX: Math.round(this.axes[0] * 100),
                };

                if (Math.abs(changes.manche.velX) <= this.deadzone * 100) {changes.manche.velX = 0}
            }
            if (Math.abs(this.axes[1] - this.lastSentState.manche.velY) > this.deadzone) {
                
                changes.manche = {
                ...changes.manche,
                velY: Math.round(this.axes[1] * 100),
                };

                if (Math.abs(changes.manche.velY) <= this.deadzone * 100) {changes.manche.velY = 0}
            }
            if (this.buttons[10].pressed !== this.lastSentState.las) {
                changes.las = this.buttons[10].pressed;
            }
            if (this.buttons[11].pressed !== this.lastSentState.trig) {
                changes.trig = this.buttons[11].pressed;
            }
        } else {
            // Se não houver um estado anterior, envie o estado atual completo
            changes.manche = {
                velX: Math.round(this.axes[0] * 100),
                velY: Math.round(this.axes[1] * 100),
            };
            changes.las = this.buttons[10].pressed;
            changes.trig = this.buttons[11].pressed;
        }
    
        if (JSON.stringify(changes) !== "{}") {
            // Imprime o JSON no terminal
            console.log("JSON a ser enviado: ", JSON.stringify(changes));
            sendStateToAPI(changes);
        }
    }

    /**
     * Aqui já temos o JSON pronto para ser enviado
     * TO-DO: Conectar com a AWS e enviar o JSON para um tópico
     */
    sendStateToAPI(JSON){
        
    }
}