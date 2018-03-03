var G_evenements_ids = {
    '.K' : 8,
    'Campagne Kès': 14,
    "Sport":11,
    'Courtine':15,
    'WEI':16,
}

function create_json_evnt(){
    for(k in G_evenements_ids){
        sous = G_projs_json.filter(proj => proj.category == G_evenements_ids[k])
        console.log(k)
        console.log(sous)
    }
}

var G_liste_evenements = [
    {
        titre: 'WEI',
        collapse_id: 'collapse_WEI',
        evnt_image : "../img/logo 2015.jpg",
        content:[
            {
                annee:"2015",
                projs:[
                    {
                        titre:"WEI 2015",
                        proj_id:455666,
                    },
                ],
            },
            {
                annee:"2016",
                projs:[
                    {
                        titre:"WEI 2016",
                        proj_id:455666,
                    },
                ],
            },
            {
                annee:"2017",
                projs:[
                    {
                        titre:"WEI 2017",
                        proj_id:455666,
                    },
                ],
            }
            
        ]
       
    },

    {
        titre: 'Inkhorpo',
        collapse_id: 'collapse_INC',
        evnt_image : "../img/logo 2015.jpg",
        content:[
            {
                annee:"2015",
                projs:[
                    {
                        titre:"Inkhorpo 2015",
                        proj_id:455666,
                    },
                    {
                        titre:"Courtine 2015",
                        proj_id:455666,
                    },
                ],
            },
            {
                annee:"2016",
                projs:[
                    {
                        titre:"WEI 2016",
                        proj_id:455666,
                    },
                ],
            },
            {
                annee:"2017",
                projs:[
                    {
                        titre:"WEI 2017",
                        proj_id:455666,
                    },
                ],
            }
            
        ]
       
    },

    {
        titre: 'Inkhorzzzpo',
        collapse_id: 'collapse_INCz',
        evnt_image : "../img/logo 2015.jpg",
        content:[
            {
                annee:"2015",
                projs:[
                    {
                        titre:"Inkhorpo 2015",
                        proj_id:455666,
                    },
                    {
                        titre:"Courtine 2015",
                        proj_id:455666,
                    },
                ],
            },
           
            
        ]
       
    },
]

