export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subCategory:string;
  gender: 'women' | 'men';
  description?: string;
  details?: string[];
  material?: string;
  soldPieces:number,
  bigSizes:boolean,
  image_list:string[]
}


export const womenCategories = [
  {
    name: 'Noutati',
    slug: 'noutati',
    description: 'Explorează cele mai noi tendințe și colecții proaspăt intrate în stoc. Descoperă stiluri moderne pentru garderoba ta.',
  },
  {
    name: 'Curvy Marimi Mari',
    slug: 'curvy-marimi-mari',
    description: 'Lenjerie elegantă și confortabilă, creată special pentru a pune în valoare formele generoase cu încredere și rafinament.',
    subcategories: [
      { name: 'Sutiene', slug: 'sutiene' },
      { name: 'Body si Corset', slug: 'body-si-corset' },
      { name: 'Chiloti', slug: 'chiloti' },
      { name: 'Costume de Baie', slug: 'costume-de-baie' },
    ],
  },
  {
    name: 'Sutiene',
    slug: 'sutiene',
    description: 'O selecție vastă de sutiene care combină susținerea perfectă cu designul sofisticat, pentru orice ocazie și siluetă.',
    subcategories: [
      { name: 'Toate', slug: 'toate' },
      { name: 'Push up si super push up', slug: 'push-up' },
      { name: 'Balconet', slug: 'balconet' },
      { name: 'Triunghi', slug: 'triunghi' },
      { name: 'Bralette si bustiera', slug: 'bralette-bustiera' },
      { name: 'Clasic cu cupa buretata', slug: 'clasic-cupa-buretata' },
      { name: 'Clasic neburetat cu sarma', slug: 'clasic-neburetat-sarma' },
      { name: 'Multifunctional', slug: 'multifunctional' },
      { name: 'Cu burete', slug: 'cu-burete' },
      { name: 'Fara burete', slug: 'fara-burete' },
      { name: 'Cu sarma', slug: 'cu-sarma' },
      { name: 'Fara sarma', slug: 'fara-sarma' },
    ],
  },
  {
    name: 'Chiloti',
    slug: 'chiloti',
    description: 'De la modele invizibile la croieli clasice sau braziliene, găsește perechea ideală realizată din materiale fine și delicate.',
    subcategories: [
      { name: 'Toti', slug: 'toti' },
      { name: 'Brazilian', slug: 'brazilian' },
      { name: 'Tanga', slug: 'tanga' },
      { name: 'Slip', slug: 'slip' },
      { name: 'Talie inalta', slug: 'talie-inalta' },
      { name: 'Modelator', slug: 'modelator' },
      { name: 'Invizibili si fara cusaturi', slug: 'invizibili-fara-cusaturi' },
    ],
  },
  {
    name: 'Lenjerie',
    slug: 'lenjerie',
    description: 'Piese seducătoare și accesorii de lux menite să celebreze feminitatea. Eleganță pură pentru momente deosebite.',
    subcategories: [
      { name: 'Toate', slug: 'toate' },
      { name: 'Body', slug: 'body' },
      { name: 'Corset', slug: 'corset' },
      { name: 'Portjartiera', slug: 'portjartiera' },
      { name: 'Halat', slug: 'halat' },
      { name: 'Babydoll', slug: 'babydoll' },
      { name: 'Top', slug: 'top' },
      { name: 'Maiou', slug: 'maiou' },
      { name: 'Accesorii', slug: 'accesorii' },
    ],
  },
  {
    name: 'Pijamale',
    slug: 'pijamale',
    description: 'Transformă timpul petrecut acasă în clipe de relaxare totală cu pijamale din materiale catifelate și croieli lejere.',
    subcategories: [
      { name: 'Toate', slug: 'toate' },
      { name: 'Maneca lunga pantalon lung', slug: 'maneca-lunga-pantalon-lung' },
      { name: 'Camasa de noapte', slug: 'camasa-de-noapte' },
      { name: 'Lenjerie de noapte', slug: 'lenjerie-de-noapte' },
      { name: 'Pijamale Premium', slug: 'pijamale-premium' },
      { name: 'Pijamale pentru copii', slug: 'pijamale-pentru-copii' },
    ],
  },
  {
    name: 'Imbracaminte',
    slug: 'imbracaminte',
    description: 'Articole esențiale pentru ținutele de zi cu zi sau momentele de lounge, create pentru un stil de viață activ și modern.',
    subcategories: [
      { name: 'Toate', slug: 'toate' },
      { name: 'Tricouri polo', slug: 'tricouri-polo' },
      { name: 'Treninguri', slug: 'treninguri' },
      { name: 'Tinute de casa', slug: 'tinute-de-casa' },
      { name: 'Maiouri', slug: 'maiouri' },
      { name: 'Sosete', slug: 'sosete' },
      { name: 'Dresuri', slug: 'dresuri' },
    ],
  },
  {
    name: 'Costume de Baie',
    slug: 'costume-de-baie',
    description: 'Pregătește-te pentru plajă cu costume de baie vibrante, modelatoare sau clasice, perfecte pentru o vară de neuitat.',
    subcategories: [
      { name: 'Toate', slug: 'toate' },
      { name: 'Costume intregi', slug: 'costume-intregi' },
      { name: 'Costume intregi modelatoare', slug: 'costume-intregi-modelatoare' },
      { name: 'Costume 2 piese', slug: 'costume-2-piese' },
      { name: 'Sutien de baie', slug: 'sutien-de-baie' },
      { name: 'Slip de baie', slug: 'slip-de-baie' },
      { name: 'Tankini', slug: 'tankini' },
      { name: 'Tinute de plaja', slug: 'tinute-de-plaja' },
      { name: 'Scuba', slug: 'scuba' },
      { name: 'Costume Push-UP', slug: 'costume-push-up' },
      { name: 'Costume cu chilot brazilian', slug: 'costume-chilot-brazilian' },
    ],
  },
];

export const menCategories = [
  {
    name: 'Noutati',
    slug: 'noutati',
    description: 'Descoperă ultimele noutăți în moda masculină. Piese noi, stiluri proaspete și materiale de înaltă calitate.',
  },
  {
    name: 'Chiloti',
    slug: 'chiloti',
    description: 'Boxeri și chiloți clasici care oferă suportul necesar și confort pe tot parcursul zilei, indiferent de activitate.',
    subcategories: [
      { name: 'Toti', slug: 'toti' },
      { name: 'Clasici', slug: 'clasici' },
      { name: 'Boxeri', slug: 'boxeri' },
      { name: 'Tanga', slug: 'tanga' },
    ],
  },
  {
    name: 'Pijamale',
    slug: 'pijamale',
    description: 'Seturi de noapte confortabile din bumbac și materiale premium pentru un somn odihnitor și seri relaxante.',
    subcategories: [
      { name: 'Pijamale pentru barbati', slug: 'pijamale-pentru-barbati' },
      { name: 'Pijamale pentru copii', slug: 'pijamale-pentru-copii' },
    ],
  },
  {
    name: 'Imbracaminte',
    slug: 'imbracaminte',
    description: 'Tricouri, treninguri și articole casual care îmbină funcționalitatea cu un aspect modern și îngrijit.',
    subcategories: [
      { name: 'Toate', slug: 'toate' },
      { name: 'Treninguri', slug: 'treninguri' },
      { name: 'Tricouri', slug: 'tricouri' },
      { name: 'Maiouri', slug: 'maiouri' },
    ],
  },
  {
    name: 'Costume de Baie',
    slug: 'costume-de-baie',
    description: 'Șorturi și slipuri de baie cu uscare rapidă și design contemporan, ideale pentru vacanță sau piscină.',
    subcategories: [
      { name: 'Toate', slug: 'toate' },
      { name: 'Short-uri', slug: 'short-uri' },
      { name: 'Boxeri', slug: 'boxeri' },
      { name: 'Slipuri', slug: 'slipuri' },
    ],
  },
  {
    name: 'Sosete',
    slug: 'sosete',
    description: 'Șosete rezistente și confortabile pentru orice tip de încălțăminte, de la variante sport până la cele office.',
  },
];
