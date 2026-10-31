/*
  My House: the pipe work and wiring budget.
  Prices are line totals in UGX, as written on the paper. Labour and transport are not included.
  Each item has a photo in images/wiring/<file>.webp and a 520 px copy in images/wiring/thumbs/.
  The photos are product shots from public listings, there to show what each item looks like.
  "check" marks a line that is hard to read on the paper; "options" are the readings it could be.
*/
window.WIRING = {
  paperTotal: 1875500,

  groups: [
    { id: 'fittings', label: 'Conduits, couplers, bends and fittings', short: 'Fittings',
      note: 'The pipe network that goes into the walls and slab before plaster, and the boxes and cups it ends in' },
    { id: 'wire',     label: 'Wire and cable', short: 'Wire',
      note: 'Everything that is pulled through the pipes once they are in: power, earth, TV and sound' }
  ],

  items: [
    // ---------------------------------------------------------------- fittings
    { no: 1, group: 'fittings', file: '01-conduit-25mm', name: 'Conduit 25mm', spec: 'Heavy gauge', qty: 20, unit: 'pcs', total: 120000, swatch: '#ecebe6',
      what: 'Rigid PVC pipe for the main runs through the slab and walls. Heavy gauge, so it survives the concrete pour.',
      src: 'amazon.com', page: 'https://www.amazon.com/s?k=High+Impact+White+PVC+Pipe+OD20MM+25+32' },
    { no: 2, group: 'fittings', file: '02-conduit-20mm', name: 'Conduit 20mm', spec: 'Heavy gauge', qty: 20, unit: 'pcs', total: 90000, swatch: '#e2e1db',
      what: 'The smaller pipe for branch runs down to switches and sockets.',
      src: 'amazon.com', page: 'https://www.amazon.com/s?k=MECCANIXITY+Industrial+PVC+Conduit+Pipe+20mm' },
    { no: 3, group: 'fittings', file: '03-coupler-25mm', name: 'Couplers 25mm', spec: 'Straight joint', qty: 20, unit: 'pcs', total: 20000, swatch: '#d8d7d1',
      what: 'Short sleeves that join two lengths of 25mm conduit end to end.',
      src: 'amazon.com', page: 'https://www.amazon.com/s?k=MECCANIXITY+PVC+Conduit+Coupler+Straight' },
    { no: 4, group: 'fittings', file: '04-coupler-20mm', name: 'Couplers 20mm', spec: 'Straight joint', qty: 20, unit: 'pcs', total: 20000, swatch: '#cfcec8',
      what: 'The same joint for the 20mm conduit.',
      src: 'amazon.com', page: 'https://www.amazon.com/s?k=PATIKIL+20mm+PVC+Pipe+Fitting+Coupling' },
    { no: 5, group: 'fittings', file: '05-bend-25mm', name: 'Bends 25mm', spec: '90° normal bend', qty: 50, unit: 'pcs', total: 100000, swatch: '#c5c4be',
      what: 'Smooth 90° turns for the 25mm runs, so the wire pulls through without snagging.',
      src: 'amazon.com', page: 'https://www.amazon.com/s?k=MECCANIXITY+PVC+Conduit+Coupler+Elbow+20mm' },
    { no: 6, group: 'fittings', file: '06-bend-20mm', name: 'Bends 20mm', spec: '90° bend', qty: 40, unit: 'pcs', total: 60000, swatch: '#bbbab4',
      what: 'Turns for the 20mm branch runs, at every corner and drop to a switch.',
      src: 'amazon.com', page: 'https://www.amazon.com/s?k=MECCANIXITY+12pcs+PVC+Conduit+20mm+Elbow' },
    { no: 7, group: 'fittings', file: '07-spot-light-cups', name: 'Spot light cups', spec: 'Recessed, GU10', qty: 25, unit: 'pcs', total: 125000, swatch: '#a9a8a3',
      what: 'The ceiling housings for the spotlights. See the ceiling ideas for where the 25 spots go.',
      link: { href: 'index.html#ceiling', text: 'Ceiling ideas' },
      src: 'amazon.com', page: 'https://www.amazon.com/s?k=PATIKIL+LED+Downlight+Fixture+Housing+GU10' },
    { no: 8, group: 'fittings', file: '08-conduit-32mm', name: 'Conduit 32mm', spec: 'Large pipe', qty: 2, unit: 'pcs', total: 24000, swatch: '#9a9993',
      what: 'The largest pipe, for the main feed where several circuits run together.',
      src: 'amazon.com', page: 'https://www.amazon.com/s?k=MECCANIXITY+PVC+Rigid+Tube+Round+Pipe' },
    { no: 9, group: 'fittings', file: '09-bend-32mm', name: 'Bends 32mm', spec: '90° bend', qty: 4, unit: 'pcs', total: 12000, swatch: '#8b8a85',
      what: 'Turns for the 32mm feed.',
      src: 'amazon.com', page: 'https://www.amazon.com/s?k=Electrical+PVC+Conduit+Elbow+90+Degree' },
    { no: 10, group: 'fittings', file: '10-mk-box-double', name: 'MK box, double', spec: '2-gang flush box', qty: 6, unit: 'pcs', total: 18000, swatch: '#7c7b76',
      what: 'Set into the wall behind each double switch or double socket.',
      src: 'smka.ae', page: 'https://www.smka.ae/product-category-PVC-Conduits-and-Accessories.aspx' },
    { no: 11, group: 'fittings', file: '11-mk-box-single', name: 'MK box, single', spec: '1-gang flush box', qty: 13, unit: 'pcs', total: 26000, swatch: '#6d6c68',
      what: 'Set into the wall behind each single switch or single socket.',
      src: 'abmdistributors.co.uk', page: 'https://abmdistributors.co.uk/mk-1-gang-32mm-pvc-box-k2181whi-3186/' },
    { no: 12, group: 'fittings', file: '12-roofing-nails', name: 'Roofing nails', spec: 'Umbrella head', qty: 3, unit: 'kg', total: 24000, swatch: '#5e5d59',
      what: 'Twisted umbrella-head nails, three kilograms.',
      src: 'fahariroofings.co.ke', page: 'https://fahariroofings.co.ke/product/roofing-nails/' },

    // ---------------------------------------------------------------- wire
    { no: 13, group: 'wire', file: '13-wire-1-5-red', name: 'Single wire 1.5 red', spec: '1.5 mm², live', qty: 2, unit: 'rolls', total: 160000, swatch: '#c7372a',
      what: 'Live conductor for the lighting circuits.',
      src: 'tescaglobal.com', page: 'https://www.tescaglobal.com/product/1.5mm-pvc-single-core--red-cables' },
    { no: 14, group: 'wire', file: '14-wire-1-5-black', name: 'Single wire 1.5 black', spec: '1.5 mm², neutral', qty: 2, unit: 'rolls', total: 160000, swatch: '#1d1e1c',
      what: 'Neutral for the lighting circuits.',
      src: 'numelecltd.com', page: 'https://numelecltd.com/product/single-core-1-5mm²-flexible-cables-roll-of-100m/' },
    { no: 15, group: 'wire', file: '15-wire-1-5-yellow', name: 'Single wire 1.5 yellow', spec: '1.5 mm², earth', qty: 2, unit: 'rolls', total: 130000, swatch: '#cfae1f',
      what: 'Earth for the lighting circuits. Earth wire is usually sold green and yellow.',
      src: 'made-in-china.com', page: 'https://gzsummao.en.made-in-china.com/product/vaRUWpGEaXhd/China-2-5mm2-10mm-PVC-Yellow-Green-Earth-Wire-Single-Core-Cable-Building-Wires.html' },
    { no: 16, group: 'wire', file: '16-wire-2-5-red', name: 'Single wire 2.5 red', spec: '2.5 mm², live', qty: 1, unit: 'roll', total: 130000, swatch: '#a8281d',
      what: 'Live conductor for the socket circuits. Thicker than the lighting wire because sockets carry more current.',
      src: 'indiamart.com', page: 'https://www.indiamart.com/proddetail/25-sqmm-red-flexible-single-core-cable-23680221155.html' },
    { no: 17, group: 'wire', file: '17-wire-2-5-black', name: 'Single wire 2.5 black', spec: '2.5 mm², neutral', qty: 1, unit: 'roll', total: 130000, swatch: '#353633',
      what: 'Neutral for the socket circuits.',
      src: 'macire.co.ke', page: 'https://macire.co.ke/product/6mm-single-core-cable-cable-connect-kenya-100m-electrical-wiring-roll/' },
    { no: 18, group: 'wire', file: '18-wire-2-5-yellow', name: 'Single wire 2.5 yellow', spec: '2.5 mm², earth', qty: 1, unit: 'roll', total: 252000, swatch: '#b0951a',
      what: 'Earth for the socket circuits.',
      check: 'Much higher than the other 2.5 mm rolls (130,000 each). It may be 25,200 or 25,000 for one roll, the quantity may be 2 rolls at 126,000, or 252,000 may be right.',
      options: [252000, 130000, 25200],
      src: 'mjselectricalsupplies.com.au', page: 'https://www.mjselectricalsupplies.com.au/2.5mm-building-wire-green-yellow-earth-100mtr-roll' },
    { no: 19, group: 'wire', file: '19-twin-wire-10mm', name: 'Twin wire 10mm', spec: '10 mm² flat twin', qty: 14, unit: 'm', total: 24000, swatch: '#d6d5cf',
      what: 'Heavy flat cable, usually the supply run from the meter to the distribution board.',
      check: 'The figure may be misread. At 2,000 a metre, 14 m would be 28,000, which is exactly the 4,000 the paper total is over.',
      options: [24000, 28000],
      src: 'vericable.com', page: 'https://vericable.com/twin-earth-cables/' },
    { no: 20, group: 'wire', file: '20-insulation-tape', name: 'Insulation tape', spec: 'PVC tape', qty: 8, unit: 'pcs', total: 24000, swatch: '#46473f',
      what: 'For joints in the boxes and for marking which wire is which.',
      src: 'sealsmartpackaging.com', page: 'https://www.sealsmartpackaging.com/product/pvc-electrical-tape' },
    { no: 21, group: 'wire', file: '21-coaxial-cable', name: 'Coaxial cable', spec: 'TV / satellite', qty: 35, unit: 'm', total: 87500, swatch: '#e4e3dd',
      what: 'Carries the aerial or dish signal to the TV points, including the TV wall in the living hall.',
      link: { href: 'index.html#tv-wall', text: 'TV wall' },
      src: 'walmart.com', page: 'https://www.walmart.com/ip/RG6-Quad-Shielded-Coax-Cable-Bulk-RG6-Coaxial-Cable-White-18-AWG-Solid-Core-Pullbox-1000-feet-Cablewholesale/34820501' },
    { no: 22, group: 'wire', file: '22-speaker-cable', name: 'Speaker cable', spec: 'Red and black pair', qty: 45, unit: 'm', total: 135000, swatch: 'repeating-linear-gradient(90deg,#c7372a 0 6px,#1d1e1c 6px 12px)',
      what: 'Runs to the flush ceiling speakers. Lay it before the ceiling is closed.',
      link: { href: 'index.html#ceiling', text: 'Ceiling speakers' },
      src: 'electrosmart.co.uk', page: 'https://electrosmart.co.uk/SC-12' }
  ]
};
