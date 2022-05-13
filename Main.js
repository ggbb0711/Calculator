let numbers=document.querySelectorAll('.input_number');
let operators=document.querySelectorAll('.input_operator');
let clear=document.querySelector('.input_clr');
let del=document.querySelector('.input_del');
let equal=document.querySelector('.eval');
let display_main=document.querySelector('.display_main');
let display_second=document.querySelector('.display_second');
//Plan:
//display number and operator onclick
//when the equal button is clicked
//turn the display into array
//filter out all the pluses and minuses
//check the operator to see which should do first
//prioritize division=>multiply=>subtraction=>addition
//display the result
class main{
  constructor(display_main,display_second){
    this.display_main=display_main;
    this.display_second=display_second;
    this.numbers=[];
    this.canPlaceDot=true;
  }
  add_number(number){
    if(this.canPlaceDot&&number==='.'){
      this.display_main.innerText=this.display_main.innerText.toString()+number.toString();
      if(this.display_second.innerText!=='')this.display_second.innerText='';
      this.canPlaceDot=false;
    }
    else if(!this.canPlaceDot&&number==='.'){
      this.display_second.innerText='Cannot place two dots in a number';
    }
    else{
     if(this.display_second.innerText!=='')this.display_second.innerText='';
     this.display_main.innerText=this.display_main.innerText.toString()+number.toString();
    }
  }
  add_operator(operator){
    if(this.display_second.innerText!=='')this.display_second.innerText='';
    if(this.display_main.innerText===''&&(operator==='+'||operator==='-')) this.display_main.innerText+=operator.toString();
    else if(this.display_main.innerText!==''){
      if(this.display_main.innerText[this.display_main.innerText.length-1].match(/[0-9]/g)&&(operator==='x'||operator==='/')){
        this.display_main.innerText+=operator.toString();
        this.canPlaceDot=true;
      }
      else if(operator==='+'||operator==='-'){
        this.display_main.innerText+=operator.toString();
        this.canPlaceDot=true;
      }
    }
  }
  eval(){
    if(!this.display_main.innerText[this.display_main.innerText.length-1].match(/[0-9]/g)) {
      this.display_second.innerText='Please enter enough numbers'
      return
    }
    this.numbers=this.Numbers_array(this.display_main.innerText);
    while(this.numbers.includes('/')){
      let index=this.numbers.indexOf('/');
      let pre_index=this.numbers.slice(0,index-1);
      let post_index=this.numbers.slice(index+2);
      pre_index.push(this.numbers[index-1]/this.numbers[index+1]);
      this.numbers=pre_index.concat(post_index);
    }
    while(this.numbers.includes('x')){
      let index=this.numbers.indexOf('x');
      let pre_index=this.numbers.slice(0,index-1);
      let post_index=this.numbers.slice(index+2);
      pre_index.push(this.numbers[index-1]*this.numbers[index+1]);
      this.numbers=pre_index.concat(post_index);
    }
    while(this.numbers.includes('-')){
      let index=this.numbers.indexOf('-');
      let pre_index=this.numbers.slice(0,index-1);
      let post_index=this.numbers.slice(index+2);
      pre_index.push(this.numbers[index-1]-this.numbers[index+1]);
      this.numbers=pre_index.concat(post_index);
    }
    while(this.numbers.includes('+')){
      let index=this.numbers.indexOf('+');
      let pre_index=this.numbers.slice(0,index-1);
      let post_index=this.numbers.slice(index+2);
      pre_index.push(this.numbers[index-1]+this.numbers[index+1]);
      this.numbers=pre_index.concat(post_index);
    }
    this.display_second.innerText=this.display_main.innerText;
    this.display_main.innerText=Math.round(this.numbers[0]*100)/100;
    this.curr_number=(Math.round(this.numbers[0]*100)/100).toString();
  }
  clear(){
    this.display_main.innerText='';
    this.display_second.innerText='';
    this.numbers=[];
  }
  Numbers_array(numbers){
    let arr=[];
    let curr_number='';
    let i=0;
    //skip through the firs few minuses and pluses
    while(numbers[i]==='+'||numbers[i]==='-'){
      curr_number+=numbers[i];
      i++;
    }
    for(;i<numbers.length;i++){
      if(!numbers[i].match(/[.\d]/g)){
        arr.push(curr_number);
        curr_number='';
        arr.push(numbers[i]);
        //skip through minuses and pluses
        if(!numbers[i+1].match(/[.\d]/g)){
          i++;
          while(numbers[i]==='+'||numbers[i]==='-'){
            curr_number+=numbers[i];
            i++;
          }
          //return back to the operator so the for loop will iterate to the next number
          i--;
        }
      }
      else{
        curr_number+=numbers[i];
      }
    }
    arr.push(curr_number);
    arr.forEach((number,index)=>{
      if((/[.\d]/g).test(number)){
        if(number.includes('-')){
          if(number.match(/-/g).length%2!==0) arr[index]=parseFloat('-'+number.slice(number.search(/[.\d]/g)));
          else arr[index]=parseFloat(number.slice(number.search(/[.\d]/g)));
        }
        else arr[index]=parseFloat(number.slice(number.search(/[.\d]/g)));
      }
    })
    console.log(arr);
    return arr;
  }
  del(){
    if(this.display_second.innerText!=='')this.display_second.innerText='';
    this.display_main.innerText=this.display_main.innerText.slice(0,-1);
  }
}
let calculator=new main(display_main,display_second);
numbers.forEach(number=>{
  number.addEventListener('click',()=>{
    calculator.add_number(number.innerText);
  })
})
operators.forEach(operator=>{
  operator.addEventListener('click',()=>{
    calculator.add_operator(operator.innerText);
  })
})
equal.addEventListener('click',()=>{
  calculator.eval();
})
clear.addEventListener('click',()=>{
  calculator.clear();
})
del.addEventListener('click',()=>{
  calculator.del();
})