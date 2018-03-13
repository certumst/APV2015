# APV 2015

Bienvenue sur le repo de l'APV 2015. Ce document explique comment le code est conçu et comment il s'articule avec le merveilleux site du JTX et sa très précieuse base de données. 

## Récupération de la BDD et selection des données utiles

La BDD du site peut être récupérée au format JSON (voir avec le respo web du JTX) grâce à une simple commande Django. Ensuite, ce fichier est à ouvrir avec un éditeur de texte, il faut le transformer en fichier `.js` : pour cela rien de plus simple, il suffit de rajouter au début du fichier `var site_jtx =` et de l'enregistrer sous un nom de fichier avec l'extension  `bdd_site_jtx.js`. 

### Création des premiers fichiers

J'ai codé une page HTML qui facilite l'extraction de données du site du jtx pour ne sélectionner que les projs qui nous intéressent. Cette page est nommée `0_traitement.hmtl`. Elle fait appel au fichier `bdd_site_traitement.js` qui contient les fonctions utiles au parcours du JSON du site. Cette page HTML comprend un premier input qui doit être un string au format JSON lui aussi du type  `{"value":[317, 404,...]}`, avec les ids des projs voulues pour l'APV, tels qu'ils sont définis par le site du JTX. Pour avoir ces ids il suffit de faire des recherche avec le site et de regarder l'url !

Le deuxième input est un input de modification de dates. En effet le site ayant été lancé en novembre 2017, après de longs mois (LOL) de travaux avec Thibault Dardinier, les vieilles projs (ie antérieures à novembre 2017) ont toutes la même date d'ajout. Ce petit élément est fâcheux si l'on veut faire une belle frise temporelle telle qu'elle existe sur cet APV2015. Le JSON à donner ici est de la forme  `[{"id":186, "date":"2016-11-13"},...]` avec, pour chaque élément de la liste l'id de la proj et la date au format AAAA-MM-JJ. Attention au virgules en fin de listes, il me semble qu'elles posent problème s'il n'y a pas d'éléments après. 

Il suffit alors de cliquer sur générer, d'attendre un peu (<10s) et tadaaaa ! Trois beaux JSON tous beaux tous neufs. Il suffit de les copier directement dans les fichier respectifs : `projs_json_true.js`, `videos_json_true.js` et `json_timeline.js` à l'aide des gentils boutons. 

Le dernier input est utile pour faire des recherches sur la bdd du site, ça m'a servi pour établir plus facilement la correspondance id-nom de proj. 

### Ajout d'autres projs ou vidéos

J'ai codé assez salement des fonctions d'ajout et de comparaison avec une liste voulue de lien dans le fichier `restant.js`. Le tout est que les projs et les videos ajoutées soient ajoutées à `added_projs.js` et `added_videos.js`. 

## Structure de l'interface

### Page du Menu

La page du menu fait appel à quelques dépendances : les quatres fichiers de base de données, les plugins externes, du CSS, et un fichier de structuration qui permet de remplir automatiquement la page : `navigation_page_json.js`. La page utilise les modules `List.js` (http://listjs.com/api/) pour la recherche et `Underscore.js` pour le templating (http://underscorejs.org/#template).