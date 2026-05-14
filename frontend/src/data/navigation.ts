export interface SubCategory {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  slug: string;
  subcategories?: SubCategory[];
}

export interface NavigationData {
  women: Category[];
  men: Category[];
}

export const navigationData: NavigationData = {
  women: [
    {
      name: 'Noutati',
      slug: 'noutati',
    },
    // {
    //   name: 'Curvy Marimi Mari',
    //   slug: 'curvy-marimi-mari',
    //   subcategories: [
    //     { name: 'Sutiene', slug: 'sutiene' },
    //     { name: 'Body si Corset', slug: 'body-si-corset' },
    //     { name: 'Chiloti', slug: 'chiloti' },
    //     { name: 'Costume de Baie', slug: 'costume-de-baie' },
    //   ],
    // },
    {
      name: 'Sutiene',
      slug: 'sutiene',
      subcategories: [
        { name: 'Toate', slug: '' },
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
      subcategories: [
        { name: 'Toate', slug: '' },
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
      subcategories: [
        { name: 'Toate', slug: '' },
        { name: 'Maneca lunga pantalon lung', slug: 'maneca-lunga-pantalon-lung' },
        { name: 'Maneca scurta pantalon scurt', slug: 'maneca-scurta-pantalon-scurt' },
        { name: 'Maneca scurta pantalon lung', slug: 'maneca-scurta-pantalon-lung' },
        { name: 'Maneca lunga pantalon scurt', slug: 'maneca-lunga-pantalon-scurt' },
        { name: 'Camasa de noapte', slug: 'camasa-de-noapte' },
        { name: 'Lenjerie de noapte', slug: 'lenjerie-de-noapte' },
        { name: 'Pijamale Premium', slug: 'pijamale-premium' },
        { name: 'Pijamale pentru copii', slug: 'pijamale-pentru-copii' },
      ],
    },
    {
      name: 'Imbracaminte',
      slug: 'imbracaminte',
      subcategories: [
        { name: 'Toate', slug: '' },
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
      subcategories: [
        { name: 'Toate', slug: '' },
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
  ],
  men: [
    {
      name: 'Noutati',
      slug: 'noutati',
    },
    {
      name: 'Chiloti',
      slug: 'chiloti',
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
      subcategories: [
        { name: 'Toate', slug: '' },
        { name: 'Pijamale pentru barbati', slug: 'pijamale-pentru-barbati' },
        { name: 'Maneca lunga pantalon lung', slug: 'maneca-lunga-pantalon-lung' },
        { name: 'Maneca scurta pantalon scurt', slug: 'maneca-scurta-pantalon-scurt' },
        { name: 'Maneca scurta pantalon lung', slug: 'maneca-scurta-pantalon-lung' },
        { name: 'Maneca lunga pantalon scurt', slug: 'maneca-lunga-pantalon-scurt' },
        { name: 'Pijamale pentru copii', slug: 'pijamale-pentru-copii' },
      ],
    },
    {
      name: 'Imbracaminte',
      slug: 'imbracaminte',
      subcategories: [
        { name: 'Toate', slug: '' },
        { name: 'Treninguri', slug: 'treninguri' },
        { name: 'Tricouri', slug: 'tricouri' },
        { name: 'Maiouri', slug: 'maiouri' },
      ],
    },
    {
      name: 'Costume de Baie',
      slug: 'costume-de-baie',
      subcategories: [
        { name: 'Toate', slug: '' },
        { name: 'Short-uri', slug: 'short-uri' },
        { name: 'Boxeri', slug: 'boxeri' },
        { name: 'Slipuri', slug: 'slipuri' },
      ],
    },
    {
      name: 'Sosete',
      slug: 'sosete',
    },
  ],
};