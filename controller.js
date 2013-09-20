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

  NameListModel.prototype.clearName = function() {
    this.notifyListeners('clearAll', nextId);
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
  var list = document.getElementById('alist');
  var seperator = document.querySelector('#templates');
  var namelistTemplate = document.querySelector('#templates > [data-name="list"]');
  var nameheadTemplate = document.querySelector('#templates > [data-name="heading"]');
  var nameulistTemplate = document.querySelector('#templates > [data-name="ulist"]');
  var headnlist = document.getElementById('headnlist');


form.addEventListener ('submit',function(e){
	    var textEl = e.target.querySelector('input[type="text"]');
	    model.addName(textEl.value);
	    textEl.value=null;
});

document.getElementById('btnClr').onclick = function() {
      list.innerHTML='';  
}
document.getElementById('btnRandom').onclick = function() {
      model.clearName();
}

model.addListener(function(model, changeType, param) {
      if ( changeType === 'added' ) {
        drawNameList(model.names[param], list);
      } 
      else if ( changeType === 'clearAll' ) {
        clearNameList(param);
      }
});
var drawHeadList = function(param,container,k,i,listarray) {

      var el = nameheadTemplate.cloneNode(true);
      el.setAttribute('data-id',param);
      container.appendChild(el);
      var todoElement = headnlist.querySelector('h2[data-id="'+param+'"]');
          if (todoElement) {
          var desc = todoElement.querySelector('span');
          desc.innerText = param;
      }
      var eluList = nameulistTemplate.cloneNode(true);     
      eluList.setAttribute('data-id',param);
      container.appendChild(eluList);
      var addElement = headnlist.querySelector('ul[data-id="'+param+'"]'); 
      if (addElement) {


        for (var j = k; j<= i*2 ; j++) {
        var elList = namelistTemplate.cloneNode(true);
        elList.setAttribute('data-id', j);
       
        eluList.appendChild(elList);
         updateNameList(model.names[listarray[j]]); 
      }

    }
};

var drawNameList = function(nameObj, container) {
  console.log('className drawNameList ' + nameObj.id);
    var el = namelistTemplate.cloneNode(true);
    el.setAttribute('data-id', nameObj.id);
    container.appendChild(el);
    updateNameList(nameObj);
};
	
var clearNameList = function(param) {
    list.innerHTML = '';
    var listarray = new Array();
    for (var i=0;i<param - 1;i++){
          listarray[i] = randomlist(param,listarray);
    }

var k = 0;
    for ( var i = 1; i<= 2;i++) {
          drawHeadList(i,headnlist,k,i,listarray);
/*      for (var j = k; j<= i*2 ; j++) {
          drawNameList(model.names[listarray[j]], list);  
          k++;  
      }
*/

    }


};

var randomlist = function(param,listarray){
      var actual = Math.floor((Math.random()*param -1) +1);
      var j = 0;
      listarray.forEach(function(entry){
      if (  entry == null || actual == entry || actual == 0 ) {
//        console.log("Reason to Random again actual : " + actual + " entry : " + entry );
        j = 1;
      }});
      if (actual == 0 || j == 1) {
//       console.log("Reason to Random again actual : " + actual );
        return randomlist(param,listarray); 
      }
//    console.log("No duplicate go ahead : " + actual );
      return actual;
};

var updateNameList = function(model) {
    var todoElement = headnlist.querySelector('li[data-id="'+model.id+'"]');
    if (todoElement) {
      var desc = todoElement.querySelector('span');
      desc.innerText = model.text;
      desc.className = "done-"+model.isDone;
    }
};


});