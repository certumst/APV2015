var videos = [];
var projs = [];
var already_added = [];
var restant = [];

function get_all_videos_of_proj(proj_id){
    //renvoie une liste avec tous les ids des vidéos qui sont dans la proj.
    var a = site_jtx.filter(function(elmt){
        return (elmt.model == "videos.relation_proj" && elmt.fields.proj == proj_id);
    })
    var liste_vids = new Array(a.length)
    for(i=0;i<a.length;i++){
        liste_vids[a[i].fields.ordre-1]=a[i].fields.video
    }
    return liste_vids
}

function add_videos(liste_index, proj_index, promo, proj_name){
    for(i=0;i<liste_index.length;i++){
        v = site_jtx.find(function(elmt){
            return elmt.model == "videos.video" && elmt.pk == liste_index[i]
        })
        v.fields['proj'] = proj_index
        v.fields['id'] = v.pk
        v.fields['auteurs'] = get_auteurs(v.pk)
        v.fields['tags'] = get_tags(v.pk)
        v.fields['acteurs'] = ""
        v.fields['proj_name'] = proj_name
        v.fields['type'] = "video"
        v.fields['promo'] = promo
        already_added.push( v.fields['hd'].split('/videos/')[1])
        v.fields['hd'] = "../../Contenu/" + v.fields['hd'].split('/videos/')[1]
        v.fields['screenshot'] = "../../Contenu/" + v.fields['screenshot'].split('/videos/')[1]
        v.fields['subtitles'] = "../../Contenu/" + v.fields['subtitles'].split('/videos/')[1]
        videos.push(v.fields)
    }
}

function get_auteurs(video_id){
    rel = site_jtx.filter(e => e.model == "videos.relation_auteur_video" && e.fields.video == video_id)
    rep=""
    for(j=0;j<rel.length;j++){
        aut = site_jtx.filter(e => e.model =="videos.auteur" && e.pk == rel[j].fields.auteur)[0]
        rep+= aut.fields.firstname + " " + aut.fields.lastname
        if(j<(rel.length-1)){
            rep+=" - "
        }
    }
    return rep
}

function get_tags(video_id){
    rel = site_jtx.filter(e => e.model == "videos.relation_tag" && e.fields.video == video_id)
    rep=""
    for(j=0;j<rel.length;j++){
        aut = site_jtx.filter(e => e.model =="videos.tag" && e.pk == rel[j].fields.tag)[0]
        rep+= aut.fields.titre
        if(j<(rel.length-1)){
            rep+= " - "
        }
    }
    return rep
}

function add_proj(proj_id, true_date=0){
    liste_videos = get_all_videos_of_proj(proj_id)
    p = site_jtx.find(function(elmt){
        return elmt.model == "videos.proj" && elmt.pk == proj_id
    })
    console.log(p)
    p.fields['liste_videos'] = liste_videos
    p.fields['id'] = p.pk
    p.fields['type'] = "proj"
    p.fields['image'] = '../../Contenu/Affiches/'+p.fields['image'].split('/videos/')[1]
    if(true_date!=0){p.fields['date']=true_date.date}
    projs.push(p.fields)
    add_videos(liste_videos, proj_id, p.fields['promo'], p.fields['titre'])

    return "Ajout de la proj terminé : " + p.fields.titre
}

function search_proj_id(jtx_year){
    //renvoie une liste d'id pour les projs d'un jtx donne
    l = site_jtx.filter(function(elmt){
        return elmt.model == "videos.proj" && elmt.fields.promo == jtx_year
    })
    id_l = []
    for(i=0;i<l.length;i++){
        console.log(l[i].fields.promo.toString()+ ':' + l[i].fields.titre + ' - id '+ l[i].pk.toString())
        id_l.push( l[i].pk)
    }
    return id_l
}

function create_db(projs_ids, dates, total_db){
     
    
    for(k=0;k<projs_ids.length;k++){
        sear = dates.find(a=>a.id==projs_ids[k])
        console.log(sear)
        if(sear){
            add_proj(projs_ids[k], sear)
        }
        else{
            add_proj(projs_ids[k])
        }
        
        console.log('adding proj '+ k.toString())
    }

    compare_to_total(total_db);
    
}

function compare_to_total(liste_url){
    c=0;
    d=0;
    for(index=0;index<liste_url.length;index++){
        if(!liste_url[index].includes('.srt' )){
            d++;
            if(!already_added.includes(liste_url[index])){
                restant.push(liste_url[index])
            }
            else{
                c=c+1;
            }
        }
    }
    console.log(c,' videos reconnues sur ', d)
}


function get_json_for_timeline(){
	//Renvoie le JSON sous la bonne forme pour les evnts de la timeline
			// 	{
		
			// 	"start_date": {
			// 	  "month": "1",
			// 	  "day": "1",
			// 	  "year": "2016"
			// 	},
			// 	"text": {
			// 	  "headline": "PAD",
			// 	  "text": "At the age of 15 Houston was featured on Michael Zager's song, Life's a Party."
			// 	},
			// 	"unique_id":"1",
			//   },
	rep = []
	for(i=0;i<projs.length;i++){
		proj = projs[i]
		srep = {}
		datep = proj.date.split('-')
		srep['start_date'] = {
			"month": datep[1],
			"day": datep[2],
			"year": datep[0],
		}
		srep['text'] = {
			'headline':proj.titre
		}
		srep['unique_id'] = proj.id.toString()
		rep.push(srep)
	}
	return rep
}

 

//Utilisation du site https://jsonformatter.curiousconcept.com/
// ou https://codebeautify.org/jsonviewer

// 2016 : [317, 404, 405, 407, 409]
// 2016:Coupe de l'X 2017 - id 317
// 2016:Campagne Kès des 2016 - Pré-campagne (Révélation et débat) - id 404
// 2016:Campagne Kès des 2016 - Listes - id 405
// 2016:Campagne Kès des 2016 - Proj de mi-campagne - id 407
// 2016:Campagne Kès des 2016 - Résultats - id 409


// 2015 :  [111, 186, 187, 188, 204, 260, 261, 262, 263, 280, 318, 322, 334, 335, 399, 428, 435]
// 2015:Semaine internationale - Houlgate 2017 - id 111
//  2015:Campagne Kès des X2015 - Listes - id 186
//  2015:Campagne Kès des X2015 - Campagne - id 187
//  2015:Campagne Kès des X2015 - Résultats - id 188
//  2015:Amphi binets 2016 - id 204
//  2015:Incorpo X2017 - Sections - id 260
//  2015:Incorpo X2017 - Stages - id 261
//  2015:Incorpo X2017 - La Courtine - id 262
//  2015:Raid X-Areva - 2017 - id 263
//  2015:WEI X2016 - id 280
//  2015:Coupe de l'X 2016 - id 318
//  2015:TSGED 2017 - id 322
//  2015:JTX 2015 - Proj de mai - id 334
//  2015:JTX 2015 - Proj de février - id 335
//  2015:JTX 2015 - Proj de novembre - id 399
//  2015:Proj Suprémacie - Long-métrage JTX 2015 - id 428
//  2015:Proj Broadway 2015 : Aladdin - id 435

// 2014 : [182, 183, 184, 185, 203, 255, 256, 257, 258, 259, 264, 281, 314, 319, 323, 336, 337, 338, 410, 434]
// 2014:Campagne Kès des X2014 - Listes - id 182
// 2014:Campagne Kès des X2014 - Campagne - id 183
// 2014:Campagne Kès des X2014 - Résultats - id 184
// 2014:Campagne Kès des X2014 - Débat - id 185
// 2014:Amphi binets 2015 - id 203 
// 2014:Incorpo X2016 - Sections - id 255
// 2014:Incorpo X2016 - Stages - id 256
// 2014:Incorpo X2016 - Chasse au trésor - id 257
// 2014:Incorpo X2016 - La Courtine - id 258
// 2014:Incorpo X2016 - NOVA - id 259
// 2014:Raid X-Areva - 2016 - id 264
// 2014:WEI X2015 - id 281
// 2014:Campagne CA - X2015 - id 314
// 2014:Coupe de l'X 2015 - id 319
// 2014:TSGED 2016 - id 323
// 2014:JTX 2014 - Proj de novembre - id 336
// 2014:JTX 2014 - Proj de juin - id 337
// 2014:JTX 2014 - Proj de février - id 338
// 2014:Amphi de départ des 2014 - id 410
// 2014:Proj' des 25 ans - id 434

