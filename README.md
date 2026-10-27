# Ligne A — prochains bus Oléane

Petit site statique en HTML/CSS/JavaScript, prévu pour GitHub Pages. Aucun serveur ni installation n'est nécessaire.

## Mise en ligne avec GitHub (dans le navigateur)

1. Téléchargez et décompressez `oleane-ligne-a-site.zip` sur votre ordinateur.
2. Connectez-vous sur [GitHub](https://github.com/) et cliquez sur **+** en haut à droite, puis **New repository**.
3. Nommez le dépôt `oleane-ligne-a`, choisissez **Public**, puis cliquez **Create repository**.
4. Dans le dépôt, cliquez **Add file** → **Upload files**.
5. Ouvrez le dossier décompressé sur votre PC et faites glisser **tout le contenu** dans la zone d'envoi : `index.html`, `style.css`, `app.js`, `favicon.svg`, et les dossiers `data` et `documents`. Il faut que `index.html` soit à la racine du dépôt, pas dans un sous-dossier.
6. Cliquez **Commit changes**.
7. Dans le dépôt, ouvrez **Settings** → **Pages**.
8. Sous **Build and deployment**, choisissez **Deploy from a branch**. Branche : `main`; dossier : `/(root)`. Cliquez **Save**.
9. Attendez une minute ou deux, puis revenez dans **Settings → Pages**. GitHub affichera l'adresse publique du site, normalement `https://VOTRE-PSEUDO.github.io/oleane-ligne-a/`.

## Fonctionnement

- Le site utilise les horaires théoriques extraits du PDF fourni et inclus dans `data/schedules.json`.
- Les réglages d'arrêt, de direction et de marche sont conservés dans le navigateur uniquement.
- Le site ne détecte pas les retards ou la position GPS du bus.
- Les horaires du dimanche en juillet/août sont présents dans les pages 6–7 du PDF, mais ne sont pas intégrés dans cette première version. Le site l'indique au lieu d'inventer des horaires.
- Le PDF source est disponible depuis le site dans `documents/fiche-horaire-ligne-a-1.pdf`.

## Modifier le site

Dans GitHub, ouvrez le fichier à modifier, cliquez sur le crayon, faites vos changements et cliquez **Commit changes**. GitHub Pages republie le site automatiquement.
