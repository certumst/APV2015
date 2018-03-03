$('#recherche_input').on('focus', function(){
    $('#recherche_results').collapse('show')
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
        'proj'
    ],
    page: 10,
    pagination: true
};


var userList = new List('users', options, G_videos_json);
userList.on('searchStart', prepare_search);
// userList.on('searchComplete',add_class);
userList.on('searchComplete', explain_search);

userList.add(G_projs_json.map(modify_projs))
console.log('done')


function modify_projs(currval, index){
    var nex =  Object.assign({}, currval);
    nex['proj'] = nex['id']
    nex['id'] = ""
    return nex
}

function add_class(){
    children = document.getElementById('pag').children;
    for(i=0;i<children.length;i++){
        children[i].classList.add('page-item')
        children[i].children[0].classList.add('page-link')
    }
}

function explain_search(){
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
    div_elmt.appendChild(new_div)
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