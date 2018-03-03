# APV 2015

Bienvenue sur le repo de l'APV 2015. Ce document explique comment le code est conçu et comment il s'articule avec le merveilleux site du JTX et sa très précieuse base de données. 

## Récupération de la BDD et selection des données utiles

La BDD du site peut être récupérée au format JSON (voir avec le respo web du JTX) grâce à une simple commande Django. Ensuite, ce fichier est à ouvrir avec un éditeur de texte, il faut le transformer en fichier `.js` : pour cela rien de plus simple, il suffit de rajouter au début du fichier `var site_jtx =` et de l'enregistrer sous un nom de fichier avec l'extension  `.js`. 
