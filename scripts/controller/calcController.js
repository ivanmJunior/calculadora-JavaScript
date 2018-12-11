class CalcController{
    
    //Metodo constutor da classe
    constructor(){
      //anderline significa que o atributo está privado. OBS.: Mesmo assim pode ser enchergado de fora.  
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._fristOperator = '';
        this._fristNumber = '';
        this._lastNumber = '';
        this.lastOperator = '';
        this._opration = [];
        this.locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvent();
        this.initKeyboard();
        this.copyToCplipBoard();
        
    }

    pasteFromClipBoard(){

        document.addEventListener('paste', e=>{

           let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

        });
        
    }
    
    copyToCplipBoard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand('Copy');

        input.remove();
    }
    
    //Metodo principal da classe
    initialize(){

        this.setDisplayDateTime();
        
        //Metodo para setar o intervalo de atualização da data e hora.
        setInterval(()=>{
            
            this.setDisplayDateTime();

        }, 1000);

        this.pasteFromClipBoard();
        
        document.querySelectorAll('.btn-ac').forEach(btn=>{

            btn.addEventListener('dblclick', e=>{

                this.taggleAudio();
            });
        });
    }

    taggleAudio(){

        this._audioOnOff = !this._audioOnOff;

    }

    playAudio(){

        if(this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyboard(){

        document.addEventListener('keyup', e=>{

            this.playAudio();

            console.log(e.key);
            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.cancelEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOparation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot('.');
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOparation(parseInt(e.key));
                    break;
                case 'c':
                case 'C':
                if(e.ctrlKey) this.copyToCplipBoard();
                
               
            }
        })
    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event =>{

            element.addEventListener(event, fn, false);
        });
    }

    //Método da tecla AC. Apaga toda operação e zera a calculadora
    clearAll(){
        this._opration = [];//Atribuindo um array vazio a operation
        this._lastOperator = '';
        this._lastNumber = '';
        this.setLastNumberToDisplay();
    }

    //Método da tecla CE para apagar a ultima entrada de dados no display.
    cancelEntry(){
        this._opration.pop();//Remove a ultima posição do array operation.
        this.setLastNumberToDisplay();
    }
    
    //Método pega ultima posição do array operation.
    getLastOparation(){
        return this._opration[this._opration.length-1];

    }

    //Método retorna true o false caso o valor passado no parâmetro seja um operador ou não.
    isOperator(valueOperator){
        //Verifica se o indice do array é maior que -1 e compara o sinal com o valueOperation;
        return (['+', '-', '/', '*', '%'].indexOf(valueOperator) > -1);

    }

    //Método insere itens na operação. Quando a quantidade de itens na operação form maior que 3 executa o 
    //método calc para calcular a operação.
    pushOparation(value){

        this._opration.push(value);

        if(this._opration.length > 3){

            this.calc();    
        }

    }

    /* Método retorna o ultimo item da operação. Um Número ou um Operador dependendo do parâmetro passado.
     * Sendo o parâmetro "vazio" retorna um Operador e sendo "false" retorna um numero.
     */
    getLastItem(isOperator = true){

        let lastItem;

        for(let i = this._opration.length-1; i >= 0; i--){

            if(this.isOperator(this._opration[i]) == isOperator){
                lastItem = this._opration[i];
                break;
            }
        }

        if(!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    /* Método retorna o primeiro item da operação. Um Número ou um Operador dependendo do parâmetro passado.
     * Sendo o parâmetro "vazio" retorna um Operador e sendo "false" retorna um número.
     */
    getFristItem(isOperator = true){

        let fristItem;

        for(let i = 0; i < this._opration.length; i++){

            if(this.isOperator(this._opration[i]) == isOperator){
                fristItem = this._opration[i];
                break;
            }
        }
        return fristItem;
    }

    //Método retorna o resultado do calculo do percentual.
    getResultPercent(){

        let resultPercent;

        this._fristNumber = this.getFristItem(false);//Atribui primeiro NÚMERO da operação ao atributo
        this._fristOperator = this.getFristItem();   //Atribui primeiro OPERADOR da operação ao atributo
        this._lastNumber = this.getLastItem(false);  //Atribui ULTIMO NÚMERO da operação ao atributo

        //calcula o percentual se o operador for diferente de multiplicação.
        if(this._fristOperator != '*'){
            
            let porceResult = (this._fristNumber*this._lastNumber)/100;//Calcula o valor percentual
            resultPercent = eval(`${this._fristNumber} ${this._fristOperator} ${porceResult}`);//calula o Resutado

        }else{

            resultPercent = this.getResult()/100;//Calcula percentual se o operador for igual a multiplicação.
        }
        return resultPercent;    
    }

    //Método retorna o resultado da operação executada.
    getResult(){

        try{
            return eval(this._opration.join(""));
        }catch(e){
            setTimeout(()=>{
                this.setErro();
            },1);
            
        }
    }

    addDot(){

        let lastOperaton  = this.getLastOparation();

        if(typeof lastOperaton === 'string' && lastOperaton.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperaton) || !lastOperaton){
            this.pushOparation('0.');
        
        }else{
            this.setLastOparation(lastOperaton.toString() + '.');
        }

        this.setLastNumberToDisplay();

    }

    calc(){

        let lastEntry = '';

        this._lastOperator = this.getLastItem();

        if(this._opration.length < 3){

            this._fristNumber = this.getFristItem(false);
            this._opration = [this._fristNumber, this._lastOperator, this._lastNumber];
        }

        if(this._opration.length > 3){
            
            lastEntry = this._opration.pop();
            this._lastNumber = this.getResult();
        
        }else if(this._opration.length == 3){

            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        if(lastEntry == '%'){

            result = this.getResultPercent();
            this._opration = [result];
        
        }else{

            this._opration = [result];
            if(lastEntry) this._opration.push(lastEntry);
        }

        this.setLastNumberToDisplay();
    }

    //Método mostra o ultimo numero ou "item" No display.
    setLastNumberToDisplay(){

        let lastOperaton = this._opration.join("");

        if(!lastOperaton) lastOperaton = 0;

        this.displayCalc = lastOperaton;
    }

    //Método sobre escreve a ultima operação
    setLastOparation(valueOperation){
        return this._opration[this._opration.length-1] = valueOperation;
    }

    //Método para adicionar a operação.
    addOparation(valueOperation){
        
        if(isNaN(this.getLastOparation())){
            
            if(this.isOperator(valueOperation)){

                this.setLastOparation(valueOperation);
            
            }else{

                this.pushOparation(valueOperation);
                this.setLastNumberToDisplay();
            }
        }else{

            if(this.isOperator(valueOperation)){

                this.pushOparation(valueOperation);
                this.setLastNumberToDisplay();

            }else{

                let newValueOparetion = this.getLastOparation().toString() + valueOperation.toString();
                this.setLastOparation(newValueOparetion);
                this.setLastNumberToDisplay();
            }
        }

        this.setLastNumberToDisplay();
    }

    setErro(){
        this.displayCalc = "Error";
    }

    //Método para executar a função de cada botão passando a tecla pressionada 
    execBtn(valueKey){

        this.playAudio();

        switch (valueKey) {
            case 'ac':
            this.clearAll();
                break;
            case 'ce':
                this.cancelEntry();
                break;
            case 'soma':
                this.addOparation('+');
                break;
            case 'subtracao':
            this.addOparation('-');
                break;
            case 'multiplicacao':
            this.addOparation('*');
                break;
            case 'divisao':
            this.addOparation('/');
                break;
            case 'porcento':
            this.addOparation('%');
                break;
            case 'igual':
           this.calc();
                break;
            case 'ponto':
            this.addDot('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOparation(parseInt(valueKey));
                break;
            case value:
                
                break;
          
            default:
                break;
        }
    }
    
    initButtonsEvent(){
     
        //variável recebe uma "lista" com as "class" dos botões 
        let buttons = document.querySelectorAll("#buttons > g, #parts g");

        //Percorredo a lista de botões e aplicando os eventos "click e drag" em cada button
        buttons.forEach((btn, index)=>{
            this.addEventListenerAll(btn, "click drag", e=>{

                //Separando o valor da tecla e atribuindo a textBtn apenas o texto da class do botão
                let textBtn = btn.className.baseVal.replace("btn-", ""); 
                this.execBtn(textBtn);
            });

            //Aplicando eventos sobre o ponteiro do mouse.
            this.addEventListenerAll(btn, "mouseover mouseup mousedow", e =>{

                btn.style.cursor = "pointer";
            })
        })
    }

   //Metodo para Setar data e hora nos atributos formatados.
    setDisplayDateTime(){

        this.displayDate = this.currentDate.toLocaleDateString(this.locale,{
            day: "2-digit", // Pegando o dia com 2 digitos
            month: "long", // Pegando o nome do mês
            year: "numeric" // Pegando o ano com 4 digitos
        });

        this.displayTime = this.currentDate.toLocaleTimeString(this.locale);
    }
    
    //Metodos getters and setters
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){

        if(value.toString().length > 10){
            this.setErro();
            return false;

        }
        this._displayCalcEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(dateValue){
        this._dateEl.innerHTML = dateValue;
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(timeValue){
        this._timeEl.innerHTML = timeValue;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(currentDateValue){
        this._currentDate = currentDateValue;
    }
}
