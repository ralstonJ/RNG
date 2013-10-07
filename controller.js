(function ( exports ) {
	var nextId = 1;

  var NameListModel = function() {
    this.names = {};
    this.listeners = [];
  }

  NameListModel.prototype.addName = function(text) {
    var id = nextId++;
    this.names[id]={'id': id, 'text': text};
    this.notifyListeners('added', id);
  }

  NameListModel.prototype.clearImmediate = function() {
      if(nextId == 0) return;
      this.names[nextId] = null;
      nextId--;
      this.notifyListeners('clearOne', nextId);
  }
  NameListModel.prototype.randomNames = function() {
    this.notifyListeners('randomAll', nextId);
  }

	NameListModel.prototype.addListener = function(listener) {
    this.listeners.push(listener);
  }

  NameListModel.prototype.notifyListeners = function(change, param) {
    var this_ = this;
    this.listeners.forEach(function(listener) {
      listener(this_, change, param);
    });
  }
  exports.NameListModel = NameListModel;

})(window);


window.addEventListener('DOMContentLoaded',function(){

  var model = new NameListModel();
  var form = document.querySelector('form');
  var nameCounter = document.querySelector('#name-counter');
  var unassignedList = document.getElementById('list-Unassigned');
  var headnlist = document.getElementById('list-Header');
  var txtNumGrp = document.querySelector('#txtNumGrp');
  var txtNumMem = document.querySelector('#txtNumMem');
  var btnRandom = document.querySelector('#btnRandom');
  var namelistTemplate = document.querySelector('#template-nameList > [data-name="list"]');
  var headerlistTemp = document.querySelector('#template-headerList > [data-name="list-WRTHeader"]');
  var gwTemp = document.querySelector('#template-groupWise > [data-name="list-Group"]');
  var nameWRTGroupTemp = document.querySelector('#template-nameWRTGroup > [data-name="list-WRTGroup"]'); 
  var nameUnGroupTemp = document.querySelector('#template-nameUnGroup > [data-name="list-UnGroup"]');

form.addEventListener ('submit',function(e){

	    var textEl = e.target.querySelector('input[type="text"]');
	    if(textEl.value == ""  ) {

        return;
      }
      model.addName(textEl.value);
	    textEl.value=null;
      var valNameCtr = parseInt(nameCounter.innerText);
       nameCounter.innerText = '';
      nameCounter.innerText = valNameCtr + 1 ; 

});

document.getElementById('btnClr').onclick = function() {
      model.clearImmediate();
        
}
document.getElementById('btnNext').onclick = function() {
      txtNumGrp.style.display = "";
      txtNumMem.style.display = "";
      btnRandom.style.display = "";

}
document.getElementById('btnRandom').onclick = function() {
      model.randomNames();
}

model.addListener(function(model, changeType, param) {
      if ( changeType === 'added' ) {
        drawNameList(model.names[param]);
      } 
      else if ( changeType === 'randomAll' ) {
      
        randomNameList(param,headnlist,model);
      }
      else if ( changeType === 'clearOne') {
      var valNameCtr = nameCounter.innerText;

        if (valNameCtr == 0) return;

      var ele =   document.querySelector('#list-Header > [data-id="' + param  +  '"]');
      if(ele){
      ele.parentNode.removeChild(ele);   
      }   
      var valNameCtr = parseInt(nameCounter.innerText);
         
           nameCounter.innerText = '';
          nameCounter.innerText = valNameCtr - 1 ; 
              
      }
});


var drawNameList = function(nameObj) {
    var el = namelistTemplate.cloneNode(true);
    el.setAttribute('data-id', nameObj.id);
    unassignedList.appendChild(el);	
    updateNameList(nameObj);
};
var updateNameList = function(model) {
    var todoElement = headnlist.querySelector('li[data-id="'+model.id+'"]');
    if (todoElement) {
      var desc = todoElement.querySelector('span');
      desc.innerText = model.text;
    }
};	
var randomNameList = function(param,container,model) {
    container.innerHTML = '';
    unassignedList.innerHTML = '';
    var listarray = new Array();
    for (var i=0;i<param - 1;i++){
        listarray[i] = randomList(param,listarray);
     }
      var k =0;
      var i= 1;


      // get number of group
      var nGrp = 1;
      console.log("nGrp : " + txtNumGrp.value);
      if(txtNumGrp.value) {
        nGrp = parseInt(txtNumGrp.value);
      }
      //get member limit 
      var nMem = param;
      if(txtNumMem.value) {
        nMem = parseInt(txtNumMem.value);
      }


     
      // find remaining unassigned names 
      var  tMem = nGrp*nMem

         if (tMem < param) {
          var delUnGrp = 1;
          while(delUnGrp < tMem) {
            var eleUnGrp =   document.querySelector('#list-Unassigned > [data-id="' + delUnGrp  +  '"]');
            if(eleUnGrp)
              eleUnGrp.parentNode.removeChild(eleUnGrp);
              delUnGrp++;  
          }
         while (tMem < param-1) {
          createUnGroup(tMem,listarray,model);
             tMem++;
          }
        }



     while (i<=nGrp) {
      createHeadName(i,container);
      createUL(i,container);

      while(k < i*nMem){
        console.log (k);
        createNameList(i,k,listarray,container,model);
        k++;
       }
      i++;
    }
    
   };

var createUnGroup = function(tMem,listarray,model){
  var uaElement = nameUnGroupTemp.cloneNode(true);
  uaElement.setAttribute('data-id',tMem);
  unassignedList.appendChild(uaElement);
 console.log(model.names[listarray[tMem]].text);

  var el = document.querySelector('#list-Unassigned > li[data-id="' + tMem + '"');  
  if(el) {
      console.log( el);
    var desc = el.querySelector('span');
      desc.innerText = model.names[listarray[tMem]].text;
  }
};

var createHeadName = function(headCounter, container){
  var headElement = headerlistTemp.cloneNode(true);
  headElement.setAttribute('data-id',headCounter);
  container.appendChild(headElement);
  updateHeadnameList(headCounter);
  
};  

var createNameList = function(headCounter,nameId,listarray,container,model) {
   
    var el = nameWRTGroupTemp.cloneNode(true);
    el.setAttribute('data-id', nameId);

    var parentUL =   container.querySelector('ul[data-id="'+headCounter+'"]');
    parentUL.appendChild(el);
    var todoElement = parentUL.querySelector('li[data-id="'+nameId+'"]');

    if (todoElement) {
      var desc = todoElement.querySelector('span');
      desc.innerText = model.names[listarray[nameId]].text;
    }
    
};
var createUL = function(headCounter,container) {
  var ulElement = gwTemp.cloneNode(true);
  ulElement.setAttribute('data-id',headCounter);
  container.appendChild(ulElement);

};


var updateHeadnameList = function(headCounter){

  var el = document.querySelector('#list-Header > li[data-id="'+headCounter+'"]');
  if(el) {
      console.log( el);
    var desc = el.querySelector('h2');
      desc.innerHTML = "Group #" + headCounter;
  }

}; 


var randomList = function(param,listarray){
      var actual = Math.floor((Math.random()*param -1) +1);
      var j = 0;
      listarray.forEach(function(entry){
      if (  entry == null || actual == entry || actual == 0 ) {

        j = 1;
      }});
      if (actual == 0 || j == 1) {

        return randomList(param,listarray); 
      }

      return actual;
};

});