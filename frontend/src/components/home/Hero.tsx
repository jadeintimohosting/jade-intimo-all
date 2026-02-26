import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight,ArrowBigDownDash } from 'lucide-react';
import { useGender } from '@/context/GenderContext';

const domain=import.meta.env.VITE_CLOUDFLARE_DOMAIN

const heroWomen = `${domain}/hero-women.webp`
const heroMen=`${domain}/men.webp`

const Hero = () => {
  const { gender } = useGender();
  const heroImage = gender === 'women' ? heroWomen : heroMen;

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <motion.div
        key={gender}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
      >
        <img
          src={heroImage}
          alt={`${gender === 'women' ? 'Women' : 'Men'}'s collection hero`}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/20 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="container-custom relative flex h-full items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl"
        >
          <h1 className="font-heading text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            {gender === 'women' ? (
              <>
                Stilul Tău,
                <br />
                <span className="text-pink-accent">Încrederea Ta</span>
              </>
            ) : (
              <>
                Design Modern,
                <br />
                <span className="text-pink-accent">Calitate Pură</span>
              </>
            )}
          </h1>
          <p className="mt-6 text-base text-muted-foreground md:text-lg">
            {gender === 'women'
              ? 'Descoperă colecția noastră de lenjerie si îmbrăcăminte, creată special pentru a te face să te simți încrezătoare și frumoasă în fiecare zi.'
              : 'Piese esențiale premium, create pentru bărbatul modern. Unde confortul absolut întâlnește rafinamentul.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to={`/${gender}/noutati`} className="btn-primary inline-flex items-center gap-2">
              Descoperă Noutățile
              <ArrowRight size={16} />
            </Link>
            <Link to={`/${gender}`} className="btn-secondary">
              Explorează categoriile
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-xs uppercase tracking-widest font-bold">
            Scroll
          </span>
          <ArrowBigDownDash />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { ArrowRight, ArrowBigDownDash, AlertTriangle } from 'lucide-react';
// import { useGender } from '@/context/GenderContext';

// const domain = import.meta.env.VITE_CLOUDFLARE_DOMAIN;

// const heroWomen = `${domain}/hero-women.webp`;
// const heroMen = `${domain}/men.webp`;

// const Hero = () => {
//   const { gender } = useGender();
//   const heroImage = gender === 'women' ? heroWomen : heroMen;

//   return (
//     <section className="relative h-screen w-full overflow-hidden">
//       {/* Background Image */}
//       <motion.div
//         key={gender}
//         initial={{ opacity: 0, scale: 1.1 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.8 }}
//         className="absolute inset-0"
//       >
//         <img
//           src={heroImage}
//           alt={`${gender === 'women' ? 'Women' : 'Men'}'s collection hero`}
//           className="h-full w-full object-cover object-center"
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/20 to-transparent" />
//       </motion.div>

//       {/* Content */}
//       <div className="container-custom relative flex h-full items-center">
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//           className="max-w-xl"
//         >
//           <h1 className="font-heading text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
//             {gender === 'women' ? (
//               <>
//                 Stilul Tău,
//                 <br />
//                 <span className="text-pink-accent">Încrederea Ta</span>
//               </>
//             ) : (
//               <>
//                 Design Modern,
//                 <br />
//                 <span className="text-pink-accent">Calitate Pură</span>
//               </>
//             )}
//           </h1>
//           <p className="mt-6 text-base text-muted-foreground md:text-lg">
//             {gender === 'women'
//               ? 'Descoperă colecția noastră de lenjerie si îmbrăcăminte, creată special pentru a te face să te simți încrezătoare și frumoasă în fiecare zi.'
//               : 'Piese esențiale premium, create pentru bărbatul modern. Unde confortul absolut întâlnește rafinamentul.'}
//           </p>

//           {/* Development Warning Notice */}
//           <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-sm text-amber-900 backdrop-blur-sm dark:text-amber-200">
//             <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
//             <p>
//               <strong>Notă informativă:</strong> Acest site este încă în curs de dezvoltare. Orice comandă plasată în acest moment este strict pentru testare și <strong>nu va fi înregistrată sau procesată</strong>.
//             </p>
//           </div>

//           <div className="mt-8 flex flex-wrap gap-4">
//             <Link to={`/${gender}/noutati`} className="btn-primary inline-flex items-center gap-2">
//               Descoperă Noutățile
//               <ArrowRight size={16} />
//             </Link>
//             <Link to={`/${gender}`} className="btn-secondary">
//               Explorează categoriile
//             </Link>
//           </div>
//         </motion.div>
//       </div>

//       {/* Scroll Indicator */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 1 }}
//         className="absolute bottom-8 left-1/2 -translate-x-1/2"
//       >
//         <motion.div
//           animate={{ y: [0, 10, 0] }}
//           transition={{ repeat: Infinity, duration: 1.5 }}
//           className="flex flex-col items-center gap-1"
//         >
//           <span className="text-xs uppercase tracking-widest font-bold">
//             Scroll
//           </span>
//           <ArrowBigDownDash />
//         </motion.div>
//       </motion.div>
//     </section>
//   );
// };

// export default Hero;