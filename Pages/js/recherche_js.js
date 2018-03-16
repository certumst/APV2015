

$('#recherche_input').on('focus', function(){
    // $('#recherche_results').collapse('show')
});

$( "body" ).mouseup(function( e ) {
    var container = $("#recherche_results");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0 && e.target!=document.getElementById('recherche_input')) 
    {
        container.collapse('hide');
    }
});

$('#recherche_input').on('keyup', function(){
   userList.search(document.getElementById('recherche_input').value)
   if(document.getElementById('recherche_input').value==""){
        $("#recherche_results").collapse('hide');
    }
    else{
        $("#recherche_results").collapse('show');
    }
});

//underscore.js

var options = {
    valueNames:[
        'titre',
        'promo',
        'auteurs',
        'date',
        'tags',
        'acteurs',
        'id',
        'proj',
        'type',
        'proj_name',
        {name:'screenshot',attr:'src'},
        {name:'image',attr:'src'},
    ],
    page: 10,
    pagination: true
};


var userList = new List('users', options, G_videos_json.map(modify_videos));
add_class_to_proj()
userList.on('searchStart', prepare_search);
userList.on('searchComplete', explain_search);
userList.on('searchComplete',add_class);
userList.add(G_projs_json.map(modify_projs))
console.log('done')

function modify_videos(currval,index){
    var nex =  Object.assign({}, currval);
    if(nex.proj!=0){
        nex['proj_name'] = G_projs_json.find(p=>p.id==nex['proj']).titre
    }
    else{
        nex['proj_name'] = ""
    }
    return nex
}

function modify_projs(currval, index){
    var nex =  Object.assign({}, currval);
    nex['proj'] = nex['id']
    nex['id'] = ""
    return nex
}

function add_class(){
    console.log('adding_class')
    children = document.getElementById('pag').children;
    for(i=0;i<children.length;i++){
        children[i].classList.add('page-item')
        children[i].children[0].classList.add('page-link')
    }
}

function explain_search(){
    
    add_class_to_proj();
    userList.sort('type', { order: "asc" });
    prop_search = ['titre','auteurs','date','tags','acteurs',]
    console.log('explain')
    //Affiche des informations sous les vidéos pour expliquer pourquoi elles sortent dans la recherche
    var pattern = document.getElementById('recherche_input').value.toLowerCase()
    if(pattern){
        for(var index in userList.matchingItems){
            search_result = userList.matchingItems[index]
            for(pi=0;pi<prop_search.length;pi++){
                proprety = prop_search[pi]
                if(search_result._values[proprety]){
                    value = search_result._values[proprety].toString()
                    value_l = value.toLowerCase()
                    if(value_l.includes(pattern) ){//|| value.toLowerCase().contains(pattern)
                    add_footer(search_result.elm,proprety,value);
                    }
                }
            }
        }
    }
    add_class()
}

function add_footer(div_elmt, prop, val){
    var new_div = document.createElement("DIV");    
    new_div.classList.add("card-footer");
    new_div.classList.add("p-2");
    new_div.classList.add("font-weight-light");
    var sm = document.createElement("small");
    // sm.innerHTML = `<img class="card-img-top" src="../img/svg/person.svg" alt="Card image cap" style="width:20px;margin-right:5px;" >`;
    sm.innerHTML = '<span class="font-weight-bold">'+prop +'</span>'+ " : " + val;
    sm.classList.add("text-muted")
    sm.classList.add("text-capitalize")
    
    new_div.appendChild(sm)
    if(div_elmt){
        div_elmt.appendChild(new_div)
    }
}

function delete_all_footers(div_elmt){
    
    //Cherche les enfants du premier enfant de l'élement donné en paramètre et supprime tous ceux qui contiennent la classe card-footer
    
    
    if(div_elmt){
        liste = div_elmt.children
    
        a_deleter=[]
        for(i=0;i<liste.length;i++){
            if(liste[i].classList.contains('card-footer')){
                a_deleter.push(i)
                //On ne supprime pas les footer sur place à cause du problème de la taille variable de la liste que ça entraînerait.
            }
        }

        
        for(i=0;i<a_deleter.length;i++){
            
            div_elmt.removeChild(div_elmt.children[a_deleter[a_deleter.length-1-i]])
            //Il faut parcourir la liste à l'envers car en supprimant des éléments on la rend plus courte.
        }

    }
   
}

function prepare_search(){
    console.log('delete')
    for(index=0; index<userList.items.length;index++){
        search_result = userList.items[index].elm
        delete_all_footers(search_result)
    }
}

function go_to(proj_id,video_id){
    if(video_id!=""){
        window.location = '../page_contenu/contenu.html#proj='+proj_id+'&video='+video_id
    }
    else{
        window.location = '../page_contenu/contenu.html#proj='+proj_id
    }
    $("#recherche_results").collapse('hide')
}

function add_class_to_proj(){
    li = userList.visibleItems;
    for(k=0;k<li.length;k++){
        if(li[k].elm.children[2].innerHTML == 'proj'){
            li[k].elm.children[4].children[1].classList.remove('badge-warning')
            li[k].elm.children[4].children[1].classList.add('badge-success')
            li[k].elm.children[4].children[1].innerHTML = "Proj"
            
        }
    }
}

window.addEventListener('keypress', function(e){
    if(e.which == 32 && document.activeElement.id!="recherche_input"){
        if(document.getElementById('video')){
            if(document.getElementById('video').paused){
                document.getElementById('video').play()
            }
            else{
                document.getElementById('video').pause()
            }
        }
    }
    else{
        document.getElementById('recherche_input').focus()
    }
});

var previous_state;
userList.on('updated', function(e){
    // add_class();
    add_class_to_proj();
    console.log("Updating...")
    if(previous_state){
        if(previous_state.i!=e.i){
            // on a changé de page
            console.log("previous:", previous_state.i, " - new : ", e.i)
            previous_state = Object.assign({}, e);
            prepare_search();
            explain_search();
        }
    }
    add_class()
    previous_state = Object.assign({}, e);
});

userList.on('searchComplete', add_class)