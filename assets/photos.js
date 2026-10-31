/*
  My House: the photo list.
  Every image on the gallery comes from this one file. To add a photo:
    1. put the full image in images/<group>/<nn-name>.webp and a 760 px copy in images/<group>/thumbs/
    2. add one line below.
  "firstIdea" points to the first, exaggerated version in images/first-ideas/, when one exists.
*/
window.HOUSE = {
  groups: [
    { id: 'outside',      label: 'Outside',      note: 'The front, the garden, the back and the house at night' },
    { id: 'ground-floor', label: 'Ground floor', note: 'Living hall, stair, kitchen and the bedroom wing' },
    { id: 'kitchen',      label: 'Kitchen',      note: 'Seven finish directions for the same kitchen footprint and camera' },
    { id: 'upper-floor',  label: 'Upper floor',  note: 'Gallery, open lounge, master suite and home office' },
    { id: 'tv-wall',      label: 'TV wall',      note: 'Six designs for the living hall TV wall, same room, same camera' },
    { id: 'ceiling',      label: 'Ceiling',      note: 'Six side-view ceiling concepts with the crystal chandelier and black details' }
  ],

  photos: [
    // ---------------------------------------------------------------- outside
    { group: 'outside', file: '01-front', w: 1536, h: 1024, firstIdea: 'outside-01-front',
      title: 'Front', desc: 'Grey plinth and steps, full width veranda, balcony with black vertical bars, flat roof and water tank',
      alt: 'White two storey house with a grey base, broad grey steps, a full width balcony with black vertical railings and a black gate' },
    { group: 'outside', file: '02-front-from-the-garden', w: 1536, h: 1024, firstIdea: 'outside-02-front-from-the-garden',
      title: 'Front, from the garden', desc: 'The same front seen from the garden corner, showing the side wall',
      alt: 'The white house seen from the front corner of the garden, with lawn, paved drive and full width balcony' },
    { group: 'outside', file: '03-rear', w: 1536, h: 1024,
      title: 'Back of the house', desc: 'High windows of the living hall and the black water tank on the roof',
      alt: 'Back of the white house with a row of high windows, a back door, a lawn and a black water tank on the roof' },
    { group: 'outside', file: '04-front-at-night', w: 1536, h: 1024,
      title: 'Front at night', desc: 'Warm windows, wall lights on, the same front after dark',
      alt: 'The white house at night with glowing windows, wall lights, balcony, boundary wall and gate' },

    // ---------------------------------------------------------------- ground floor
    { group: 'ground-floor', file: '01-living-hall', w: 1536, h: 1024, firstIdea: 'ground-floor-01-living-hall',
      title: 'Double height living hall', desc: 'Grey sofa facing the TV, the L shaped gallery above, the turning stair and the dining area',
      alt: 'White double height living room with a grey sofa, black ring light, black railings on the gallery and high windows' },
    { group: 'ground-floor', file: '02-living-hall-stair-and-gallery', w: 1536, h: 1024, firstIdea: 'ground-floor-02-living-hall-stair-and-gallery',
      title: 'Living hall, stair and gallery', desc: 'The compact stair rising in the corner to the single gallery',
      alt: 'View across the living hall toward the TV wall, a stair with black railing and the upstairs gallery' },
    { group: 'ground-floor', file: '03-kitchen', w: 1536, h: 1024, firstIdea: 'ground-floor-03-kitchen',
      title: 'Kitchen', desc: 'Black units, white worktops, a small island and the half height wall to the hall',
      alt: 'Compact kitchen with black cabinets, white worktops, a black island with two grey stools and a half height wall' },
    { group: 'ground-floor', file: '04-bedroom-2', w: 1536, h: 1024,
      title: 'Bedroom 2', desc: 'Black bed and wardrobe, white bedding, grey throw',
      alt: 'Bedroom with a black bed and tall black wardrobe, white bedding, a grey throw and a large window' },
    { group: 'ground-floor', file: '05-bedroom-3', w: 1536, h: 1024,
      title: 'Bedroom 3', desc: 'The second bedroom off the corridor, same palette',
      alt: 'Bedroom with a black bed, white bedding, a grey throw, framed prints and a window' },
    { group: 'ground-floor', file: '06-guest-bedroom', w: 1536, h: 1024,
      title: 'Guest bedroom', desc: 'At the end of the corridor, for visiting family',
      alt: 'Guest bedroom with a black bed and wardrobe, white bedding and grey accents' },
    { group: 'ground-floor', file: '07-room-4', w: 1536, h: 1024,
      title: 'Room 4, self contained', desc: 'Its own door straight onto the covered veranda',
      alt: 'Bedroom with a black bed and wardrobe and an open black door leading onto the veranda' },

    // ---------------------------------------------------------------- kitchen directions
    { group: 'kitchen', file: '01-graphite-base-white-wall', w: 1672, h: 941,
      title: 'Kitchen 1: Graphite base, white wall', desc: 'Charcoal lower cabinets and island balance white uppers and a pale grey backsplash',
      alt: 'Compact L-shaped kitchen with charcoal base cabinets, white upper cabinets, a white island top and two grey stools' },
    { group: 'kitchen', file: '02-white-envelope-black-reveals', w: 1672, h: 941,
      title: 'Kitchen 2: White envelope, black reveals', desc: 'White cabinets with crisp black gaps, handles and a single dark island',
      alt: 'Bright white kitchen with fine black cabinet reveals, a black island and pale grey backsplash' },
    { group: 'kitchen', file: '03-black-pantry-anchor', w: 1672, h: 941,
      title: 'Kitchen 3: Black pantry anchor', desc: 'A tall charcoal pantry and fridge bank anchor mostly white cabinets',
      alt: 'White L-shaped kitchen anchored by a tall black pantry and refrigerator, with a black island and white worktop' },
    { group: 'kitchen', file: '04-tuxedo-l-run', w: 1672, h: 941,
      title: 'Kitchen 4: Tuxedo L-run', desc: 'White wall cabinets over a black L-shaped base with a bright island top',
      alt: 'Two-tone kitchen with white upper cabinets, matte black lower cabinets, a white island top and black appliances' },
    { group: 'kitchen', file: '05-reeded-black-island', w: 1672, h: 941,
      title: 'Kitchen 5: Reeded black island', desc: 'Vertical black fluting gives the island a tactile centrepiece against white cabinetry',
      alt: 'White kitchen with a black vertically reeded island front, white counter and two grey stools' },
    { group: 'kitchen', file: '06-soft-grey-black-frame', w: 1672, h: 941,
      title: 'Kitchen 6: Soft grey, black frame', desc: 'Light grey cabinets and slim black edges make a softer two-tone scheme',
      alt: 'Light grey kitchen cabinets with black frame details, a charcoal island, white counters and black appliances' },
    { group: 'kitchen', file: '07-all-black-kitchen', w: 1672, h: 941,
      title: 'Kitchen 7: All black', desc: 'Matte black cabinets and island set against a bright white counter and pale grey backsplash',
      alt: 'Same L-shaped kitchen with matte black upper and lower cabinets, white counters, pale grey backsplash and two grey stools' },

    // ---------------------------------------------------------------- upper floor
    { group: 'upper-floor', file: '01-gallery-and-open-lounge', w: 1536, h: 1024, firstIdea: 'upper-floor-01-gallery-and-open-lounge',
      title: 'Gallery and open lounge', desc: 'The open lounge over the kitchen, beside the gallery railing and the balcony door',
      alt: 'Upstairs landing with a grey sofa, black shelves and a black railing looking down into the living hall' },
    { group: 'upper-floor', file: '02-master-bedroom', w: 1536, h: 1024, firstIdea: 'upper-floor-02-master-bedroom',
      title: 'Master bedroom', desc: 'Grey feature wall, black headboard, doors to the en suite and the office',
      alt: 'Master bedroom with a black headboard, white bedding, a grey wall and doors on both sides' },
    { group: 'upper-floor', file: '03-en-suite-bathroom', w: 1536, h: 1024,
      title: 'En suite bathroom', desc: 'White bath, grey tiles, black framed shower and black vanity',
      alt: 'Bathroom with grey tiles, a white bath, a black framed glass shower and a black vanity' },
    { group: 'upper-floor', file: '04-home-office', w: 1536, h: 1024, firstIdea: 'upper-floor-04-home-office',
      title: 'Home office', desc: 'Black desk and shelves, glass door straight onto the front balcony',
      alt: 'Home office with a black desk and black shelves beside a glass door onto a balcony with vertical railings' },

    // ---------------------------------------------------------------- TV wall options
    { group: 'tv-wall', file: '01-twin-pilasters', w: 1672, h: 941,
      title: 'TV wall 1: Twin pilasters', desc: 'Classic white pilasters with nested frames above the TV',
      alt: 'Living hall TV wall with two white pilasters, picture frame mouldings and a black console' },
    { group: 'tv-wall', file: '02-panel-ladder', w: 1672, h: 941,
      title: 'TV wall 2: Panel ladder', desc: 'Slim rails with stacked frames and a charcoal TV panel',
      alt: 'Living hall TV wall with slim white mouldings, stacked frames and the TV in a charcoal panel' },
    { group: 'tv-wall', file: '03-fluted-bands', w: 1672, h: 941,
      title: 'TV wall 3: Fluted bands', desc: 'White reeded bands with a black shadow line and warm light',
      alt: 'Living hall TV wall with two white fluted bands, a warm light wash and a long black bench' },
    { group: 'tv-wall', file: '04-arched-niche', w: 1672, h: 941,
      title: 'TV wall 4: Tall arched niche', desc: 'A charcoal niche inside a white arched surround',
      alt: 'Living hall TV wall with a tall white arch around a charcoal niche and a black cabinet' },
    { group: 'tv-wall', file: '05-shadow-line-pilasters', w: 1672, h: 941,
      title: 'TV wall 5: Quiet twin pilasters', desc: 'Plain white pilasters with fine black inlays and a blank wall above the screen',
      alt: 'Minimal white twin pilasters frame a black TV and floating console; no lights, frames or objects above the screen' },
    { group: 'tv-wall', file: '06-grey-slab-and-fluted-columns', w: 1672, h: 941,
      title: 'TV wall 6: Grey slab and fluted columns', desc: 'A blank pale grey bay between fluted white columns, with a low black bench',
      alt: 'A black TV on a plain pale grey panel between white fluted columns, with no decor above the screen' },

    // ---------------------------------------------------------------- ceiling options
    { group: 'ceiling', file: '01-corner-cove-ring', w: 1672, h: 940,
      title: 'Ceiling 1: Black perimeter reveal', desc: 'A fine black perimeter line ties together black flush speakers and spot trims around the crystal chandelier',
      alt: 'Side view of a white ceiling with a bold black perimeter reveal, black speaker grilles, black-trim spotlights and a large crystal chandelier' },
    { group: 'ceiling', file: '02-corner-trays-linear', w: 1672, h: 941,
      title: 'Ceiling 2: Corner trays and black speaker slots', desc: 'Separate corner trays carry discreet black speakers, black spot trims and short reveal lines',
      alt: 'Side view of white ceiling corner trays with black speaker slots, black-trim recessed lights and a crystal chandelier' },
    { group: 'ceiling', file: '03-l-corner-coves', w: 1672, h: 941,
      title: 'Ceiling 3: L-corners with black reveals', desc: 'Four separated L-shaped corner coves carry black lines and flush black speakers',
      alt: 'Side view of a white ceiling with four separated L-shaped coves, black lines, black flush speaker grilles and a crystal chandelier' },
    { group: 'ceiling', file: '04-double-edge-bands', w: 1672, h: 941,
      title: 'Ceiling 4: Graphic corner plates', desc: 'Four oversized white corner plates hold black square speakers inside sharp black outlines',
      alt: 'Side view of a ceiling with four large white corner plates, bold black angular outlines, flush black square speakers and a crystal chandelier' },
    { group: 'ceiling', file: '05-corner-returns-oval', w: 1672, h: 941,
      title: 'Ceiling 5: Corner brackets', desc: 'Stepped corner brackets bring together a black underside reveal, speaker grille and spot trim',
      alt: 'Side view of a white ceiling with stepped corner brackets, fine black details, black speakers and a crystal chandelier' },
    { group: 'ceiling', file: '06-soft-corner-clouds', w: 1672, h: 941,
      title: 'Ceiling 6: Curved corner pockets', desc: 'Soft corner curves meet black speaker grilles and a fine black outline around the white centre',
      alt: 'Side view of a white ceiling with curved corner pockets outlined in black, black flush speakers and a crystal chandelier' }
  ]
};
