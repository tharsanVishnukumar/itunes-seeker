# iTunes Seeker

Application mobile React Native (Expo) qui permet d'explorer l'immense base de données d'iTunes via leur API publique. Les utilisateurs peuvent rechercher des musiques par artiste ou par titre, consulter les détails d'un morceau, écouter un aperçu audio de 30 secondes, ajouter des titres à une collection personnelle persistée en local et leur attribuer une note de 1 à 5 étoiles.

Projet réalisé dans le cadre de la Licence 3 Informatique.

---

## Fonctionnalités

- **Recherche iTunes** par artiste (`artistTerm`) ou par titre (`songTerm`), avec debounce de 400 ms.
- **Filtrage côté client** pour pallier les approximations de l'API iTunes (`attribute` parfois ignoré côté serveur).
- **Écran détail** : jaquette HD (600×600), métadonnées (genre, durée, année, prix, pays).
- **Lecture audio** du `previewUrl` (30 s) avec contrôles play / pause.
- **Favoris** : ajout/retrait d'un morceau à la collection, persistance via AsyncStorage.
- **Notes** : attribution d'une note 1–5 étoiles par morceau, également persistée.
- **Annulation de requêtes** via `AbortController` quand la saisie change.
- **États vides et états d'erreur** dédiés avec messages clairs et bouton "Réessayer".
- **Skeletons** animés pendant les chargements.
- **Accessibilité** : `accessibilityRole`, `accessibilityLabel`, `accessibilityState`, hitSlop sur les petits boutons.
- **Icônes vectorielles** (Ionicons) pour un rendu cohérent iOS / Android.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Runtime | Expo SDK 54, React Native 0.81, React 19 |
| Langage | TypeScript (mode `strict`) |
| Navigation | `@react-navigation/native`, `bottom-tabs`, `native-stack` |
| Stockage | `@react-native-async-storage/async-storage` |
| Audio | `expo-av` |
| Icônes | `@expo/vector-icons` (Ionicons) |

---

## Démarrage

### Prérequis

- Node.js ≥ 18
- npm
- Application **Expo Go** sur ton téléphone (iOS App Store / Google Play) **ou** un simulateur iOS / un émulateur Android

### Installation

```bash
npm install
```

### Lancer l'application

```bash
npm start
```

Puis :
- Scanne le QR code avec l'app **Expo Go** (Android) ou avec l'appareil photo (iOS).
- Ou tape `i` dans la console pour ouvrir le simulateur iOS, `a` pour l'émulateur Android, `w` pour le web.

### Scripts disponibles

| Commande | Description |
|---|---|
| `npm start` | Démarre le serveur Expo Metro |
| `npm run ios` | Démarre + ouvre le simulateur iOS |
| `npm run android` | Démarre + ouvre l'émulateur Android |
| `npm run web` | Démarre la version web |

### Vérifier la compilation TypeScript

```bash
npx tsc --noEmit
```

---

## Architecture du projet

```
src/
├── App.tsx                       Point d'entrée : SafeArea + LibraryProvider + NavigationContainer
├── api/
│   ├── itunesApi.ts              fetchITunesTracks + AbortController + filtrage client
│   ├── mappers.ts                DTO iTunes → modèle Track
│   └── index.ts
├── components/
│   ├── SearchBar.tsx             TextInput + segmented control Artiste/Titre
│   ├── TrackListItem.tsx         Ligne de résultat (jaquette + meta + étoiles + cœur)
│   ├── TrackListItemSkeleton.tsx Skeleton animé pour le loading
│   ├── StarRating.tsx            Étoiles 1–5 (lecture seule ou interactif)
│   ├── FavoriteButton.tsx        Bouton cœur (Ionicons)
│   ├── AudioPlayerButton.tsx     Gros bouton play/pause + état loading
│   ├── EmptyState.tsx            État vide générique (icône + titre + description + action)
│   └── index.ts
├── context/
│   └── LibraryContext.tsx        Provider : favoris + notes + hydratation AsyncStorage
├── hooks/
│   ├── useDebouncedValue.ts      Debounce générique
│   └── useAudioPreview.ts        Wrapper expo-av (play/pause/cleanup)
├── navigation/
│   └── RootNavigator.tsx         Tabs (Recherche, Favoris) imbriqués dans NativeStack (+ TrackDetail)
├── screens/
│   ├── SearchScreen.tsx          Recherche + liste de résultats
│   ├── FavoritesScreen.tsx       Liste des favoris triée par addedAt desc
│   └── TrackDetailScreen.tsx     Hero artwork + meta + audio + note + favori
├── storage/
│   ├── keys.ts                   Constantes des clés AsyncStorage
│   ├── favoritesStorage.ts       loadFavorites / saveFavorites
│   ├── ratingsStorage.ts         loadRatings / saveRatings
│   └── index.ts
├── theme/
│   └── colors.ts                 Palette de couleurs
└── types/
    ├── track.ts                  Modèle Track
    ├── api.ts                    Types API iTunes (DTO, params)
    ├── favorites.ts              FavoriteTrack, FavoritesRecord
    ├── ratings.ts                RatingValue, TrackRating, RatingsRecord
    ├── navigation.ts             Param lists React Navigation
    └── index.ts
```

---

## Modèle de données

### Recherche → résultats

`SearchTracksParams` (term + attribute `artistTerm` | `songTerm`) →
`Track` (`trackId`, `trackName`, `artistName`, `collectionName`, `artworkUrl100`, `previewUrl`, `trackTimeMillis`, `primaryGenreName`, `releaseDate`, `country`, `currency`, `trackPrice`).

### Persistance locale (AsyncStorage)

| Clé | Contenu |
|---|---|
| `@itunes-seeker:favorites` | `Record<trackIdString, { track, addedAt }>` |
| `@itunes-seeker:ratings` | `Record<trackIdString, { trackId, rating: 1..5, updatedAt }>` |

Aucune base SQL : la sérialisation JSON via AsyncStorage est suffisante pour le volume manipulé.

---

## API iTunes

URL utilisée :

```
https://itunes.apple.com/search?term={term}&media=music&entity=song&attribute={artistTerm|songTerm}&limit=25
```

**Particularité** : pour des termes ambigus (ex. `dua` matche à la fois l'artiste et apparaît dans des champs liés), l'API renvoie souvent les mêmes résultats peu importe `attribute`. On filtre donc aussi **côté client** dans `fetchITunesTracks` (`src/api/itunesApi.ts`) :

- Mode **Artiste** : on ne garde que les tracks dont `artistName` contient le terme.
- Mode **Titre** : on ne garde que les tracks dont `trackName` contient le terme.

L'`attribute` reste envoyé au serveur pour bénéficier de son ranking.

---

## Parcours utilisateur

1. **Recherche** : ouvre l'app → onglet *Recherche*, tape un terme, choisis *Artiste* ou *Titre*.
2. **Détail** : tape sur un résultat → écran détail avec gros artwork + métadonnées.
3. **Aperçu audio** : appuie sur ▶ pour lancer la prévisualisation 30 s, ⏸ pour pauser.
4. **Note** : touche les étoiles pour attribuer 1 à 5 étoiles.
5. **Favori** : touche le cœur pour ajouter à la collection.
6. **Favoris** : onglet *Favoris* → liste de tous les morceaux sauvegardés, triés du plus récent au plus ancien. La note attribuée s'affiche sur chaque ligne.
7. **Persistance** : ferme et relance l'app → favoris et notes toujours présents.

---

## Notes de développement

- **Strict TypeScript** : aucun `any`, validation runtime des DTO iTunes via type guards.
- **AbortController** : annule la requête réseau quand le terme change avant la fin du fetch.
- **Single Provider** (`LibraryContext`) regroupe favoris + notes pour éviter la prop drilling et limiter les re-renders.
- **`React.memo`** sur les composants de liste, callbacks stabilisés via `useCallback`.
- **Hot reload** : Metro + Expo Go suffit pour le développement quotidien.

---

## Dépannage

- **Popup macOS `hermesc` bloqué** au lancement d'`expo export` : Apple bloque le compilateur Hermes. Clique sur *Terminé* (ne pas mettre à la corbeille), puis autorise dans *Réglages Système → Confidentialité et sécurité → Autoriser quand même*. Pas nécessaire pour le dev (`npm start`).
- **Tabs sans icônes après update** : reload Expo Go (secoue l'appareil → *Reload*), les polices Ionicons sont bundlées par Expo.
- **AsyncStorage ne persiste pas en web** : c'est attendu sur Expo Web (utilise `localStorage`) — testez plutôt sur iOS / Android.

---

