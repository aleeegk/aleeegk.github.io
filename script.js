/* ================================================================
   ESCALA DEL TIEMPO — script.js v4
   ================================================================ */

const CURRENT_YEAR = new Date().getFullYear();

// Puntos de quiebre de la escala
const SCALE_BREAKPOINTS = [
  { t: 0.00, year: CURRENT_YEAR },
  { t: 0.08, year: 1900 },
  { t: 0.15, year: 1500 },
  { t: 0.22, year: 1000 },
  { t: 0.30, year: 0 },
  { t: 0.36, year: -5000 },
  { t: 0.42, year: -10000 },
  { t: 0.48, year: -40000 },
  { t: 0.54, year: -100000 },
  { t: 0.60, year: -300000 },
  { t: 0.66, year: -1000000 },
  { t: 0.72, year: -2580000 },
  { t: 0.78, year: -23000000 },
  { t: 0.84, year: -66000000 },
  { t: 0.89, year: -145000000 },
  { t: 0.93, year: -252000000 },
  { t: 0.97, year: -541000000 },
  { t: 1.00, year: -4600000000 },
];

const MIN_YEAR = SCALE_BREAKPOINTS[SCALE_BREAKPOINTS.length - 1].year;
const MAX_YEAR = SCALE_BREAKPOINTS[0].year;

function tToYear(t) {
  t = clamp(t, 0, 1);
  for (let i = 0; i < SCALE_BREAKPOINTS.length - 1; i++) {
    const a = SCALE_BREAKPOINTS[i];
    const b = SCALE_BREAKPOINTS[i + 1];
    if (t >= a.t && t <= b.t) {
      const local = (t - a.t) / (b.t - a.t);
      return a.year + (b.year - a.year) * local;
    }
  }
  return MIN_YEAR;
}

function yearToT(year) {
  year = clamp(year, MIN_YEAR, MAX_YEAR);
  for (let i = 0; i < SCALE_BREAKPOINTS.length - 1; i++) {
    const a = SCALE_BREAKPOINTS[i];
    const b = SCALE_BREAKPOINTS[i + 1];
    if (year <= a.year && year >= b.year) {
      const local = (a.year - year) / (a.year - b.year);
      return a.t + (b.t - a.t) * local;
    }
  }
  return 1;
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function formatYear(year) {
  year = Math.round(year);
  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'es';
  const bc = lang === 'en' ? ' BC' : ' a.C.';
  const locale = lang === 'en' ? 'en-US' : 'es-ES';
  if (year < 0) {
    const abs = Math.abs(year);
    if (abs >= 1000000000) return (abs / 1000000000).toFixed(abs % 1000000000 === 0 ? 0 : 2) + (lang === 'en' ? ' B' : ' mil M') + bc;
    if (abs >= 1000000) return (abs / 1000000).toFixed(abs % 1000000 === 0 ? 0 : 1) + ' M' + bc;
    if (abs >= 1000) return abs.toLocaleString(locale) + bc;
    return abs + bc;
  }
  if (year === 0) return lang === 'en' ? 'Year 0' : 'Año 0';
  return year.toLocaleString(locale);
}

/* ================================================================
   DATOS: EVENTOS DE LA LÍNEA DE TIEMPO
   Categorías: historia, biologia, prehistoria, geologia
   ================================================================ */
const EVENTS_ES = [
  // --- Siglo XXI ---
  { year: 2024, evento: 'Auge de la IA generativa', datoCurioso: 'ChatGPT alcanzó 100 millones de usuarios en solo 2 meses.', cat: 'historia' },
  { year: 2020, evento: 'Pandemia de COVID-19', datoCurioso: 'La OMS la declaró pandemia global el 11 de marzo de 2020.', cat: 'biologia' },
  { year: 2012, evento: 'Descubrimiento del bosón de Higgs', datoCurioso: 'Peter Higgs predijo su existencia en 1964, casi 50 años antes de confirmarse.', cat: 'historia' },
  { year: 2007, evento: 'Se presenta el iPhone', datoCurioso: 'Steve Jobs lo describió como "un iPod, un teléfono e Internet".', cat: 'historia' },
  { year: 2001, evento: 'Atentados del 11 de septiembre', datoCurioso: 'Las Torres Gemelas tardaron 7 años en construirse y 102 minutos en caer.', cat: 'historia' },

  // --- Siglo XX ---
  { year: 1991, evento: 'Disolución de la Unión Soviética', datoCurioso: 'La URSS se disolvió oficialmente el día de Navidad de 1991.', cat: 'historia' },
  { year: 1989, evento: 'Caída del Muro de Berlín', datoCurioso: 'Cayó por un error de comunicación en una rueda de prensa.', cat: 'historia' },
  { year: 1986, evento: 'Desastre de Chernóbil', datoCurioso: 'La zona de exclusión de 30 km sigue deshabitada y se ha convertido en refugio de fauna silvestre.', cat: 'historia' },
  { year: 1977, evento: 'Se lanza la sonda Voyager 1', datoCurioso: 'Sigue enviando datos desde el espacio interestelar a más de 24.000 millones de km.', cat: 'geologia' },
  { year: 1969, evento: 'Llegada a la Luna', datoCurioso: 'El ordenador del Apolo 11 tenía menos potencia que una calculadora actual.', cat: 'geologia' },
  { year: 1961, evento: 'Yuri Gagarin en el espacio', datoCurioso: 'El vuelo duró solo 108 minutos y dio una sola órbita a la Tierra.', cat: 'historia' },
  { year: 1953, evento: 'Estructura del ADN', datoCurioso: 'La foto clave (Foto 51) fue tomada por Rosalind Franklin.', cat: 'biologia' },
  { year: 1945, evento: 'Fin de la Segunda Guerra Mundial', datoCurioso: 'Ese mismo año se fundó la ONU, con 51 países miembros.', cat: 'historia' },
  { year: 1939, evento: 'Inicio Segunda Guerra Mundial', datoCurioso: 'El conflicto más mortífero de la historia: entre 70 y 85 millones de muertos.', cat: 'historia' },
  { year: 1928, evento: 'Descubrimiento de la penicilina', datoCurioso: 'Alexander Fleming lo encontró por accidente en un cultivo olvidado.', cat: 'biologia' },
  { year: 1914, evento: 'Inicio Primera Guerra Mundial', datoCurioso: 'El asesinato de un archiduque desencadenó un conflicto entre 30 naciones.', cat: 'historia' },
  { year: 1903, evento: 'Primer vuelo (hermanos Wright)', datoCurioso: 'Duró solo 12 segundos y recorrió 37 metros.', cat: 'historia' },

  // --- Siglo XIX ---
  { year: 1889, evento: 'Torre Eiffel', datoCurioso: 'Se construyó como entrada temporal para la Exposición Universal de París.', cat: 'historia' },
  { year: 1876, evento: 'Teléfono', datoCurioso: 'Elisha Gray presentó una patente similar el mismo día, solo unas horas después.', cat: 'historia' },
  { year: 1869, evento: 'Tabla periódica de Mendeléyev', datoCurioso: 'Predijo la existencia de elementos aún no descubiertos y acertó.', cat: 'historia' },
  { year: 1859, evento: 'Publicación de "El origen de las especies"', datoCurioso: 'Se agotó el primer día de venta.', cat: 'biologia' },
  { year: 1804, evento: 'Napoleón emperador', datoCurioso: 'Se coronó a sí mismo, quitando la corona de las manos del Papa.', cat: 'historia' },

  // --- Siglos XVI a XVIII ---
  { year: 1789, evento: 'Revolución Francesa', datoCurioso: 'El calendario revolucionario llegó a tener semanas de 10 días.', cat: 'historia' },
  { year: 1776, evento: 'Independencia de EEUU', datoCurioso: 'Jefferson tardó 17 días en escribir la Declaración.', cat: 'historia' },
  { year: 1687, evento: 'Leyes de Newton', datoCurioso: 'En "Principia" formula la ley de la gravitación universal.', cat: 'geologia' },
  { year: 1608, evento: 'Telescopio', datoCurioso: 'Galileo lo mejoró un año después y lo apuntó al cielo.', cat: 'historia' },
  { year: 1543, evento: 'Revolución Copernicana', datoCurioso: 'El libro afirmando que la Tierra gira alrededor del Sol se publicó el año de su muerte.', cat: 'geologia' },
  { year: 1492, evento: 'Llegada a América', datoCurioso: 'Colón murió convencido de que había llegado a Asia.', cat: 'historia' },
  { year: 1440, evento: 'Imprenta (Gutenberg)', datoCurioso: 'Su primera gran obra fue la Biblia de 42 líneas.', cat: 'historia' },

  // --- Edad Media ---
  { year: 1347, evento: 'Peste Negra', datoCurioso: 'Mató a un tercio de la población europea en apenas seis años.', cat: 'biologia' },
  { year: 1325, evento: 'Fundación de Tenochtitlán', datoCurioso: 'Los aztecas la fundaron sobre una isla en el lago Texcoco.', cat: 'historia' },
  { year: 1215, evento: 'Carta Magna', datoCurioso: 'Considerada una de las bases del constitucionalismo moderno.', cat: 'historia' },
  { year: 1088, evento: 'Primera universidad', datoCurioso: 'Bolonia nace como una agrupación de estudiantes, no de profesores.', cat: 'historia' },
  { year: 1066, evento: 'Batalla de Hastings', datoCurioso: 'Cambió el idioma y la cultura de Inglaterra para siempre.', cat: 'historia' },
  { year: 800, evento: 'Coronación de Carlomagno', datoCurioso: 'Fue coronado emperador el día de Navidad.', cat: 'historia' },
  { year: 622, evento: 'La Hégira', datoCurioso: 'Marca el inicio del calendario islámico.', cat: 'historia' },
  { year: 476, evento: 'Caída de Roma de Occidente', datoCurioso: 'El último emperador tenía apenas 16 años.', cat: 'historia' },

  // --- Antigüedad ---
  { year: 0, evento: 'Año 1 del calendario cristiano', datoCurioso: 'El "año 0" no existe: se pasa del 1 a.C. al 1 d.C.', cat: 'historia' },
  { year: -44, evento: 'Asesinato de Julio César', datoCurioso: 'Recibió 23 puñaladas en el Senado romano.', cat: 'historia' },
  { year: -221, evento: 'Unificación de China', datoCurioso: 'El primer emperador mandó construir un ejército de terracota para su tumba.', cat: 'historia' },
  { year: -331, evento: 'Alejandro Magno conquista Persia', datoCurioso: 'Construyó un imperio desde Grecia hasta la India.', cat: 'historia' },
  { year: -447, evento: 'Partenón', datoCurioso: 'Sus columnas se curvan levemente para parecer perfectamente rectas.', cat: 'historia' },
  { year: -509, evento: 'Nace la República Romana', datoCurioso: 'Duró casi 500 años antes de convertirse en un imperio.', cat: 'historia' },
  { year: -563, evento: 'Nacimiento de Buda', datoCurioso: 'Renunció a la vida de príncipe para buscar la iluminación.', cat: 'historia' },
  { year: -776, evento: 'Primeros Juegos Olímpicos', datoCurioso: 'Se celebraban en Olimpia y solo competían hombres, desnudos.', cat: 'historia' },
  { year: -1200, evento: 'Colapso de la Edad del Bronce', datoCurioso: 'Varias grandes civilizaciones del Mediterráneo cayeron casi a la vez.', cat: 'historia' },

  // --- Civilizaciones antiguas ---
  { year: -1750, evento: 'Código de Hammurabi', datoCurioso: 'Es uno de los primeros conjuntos de leyes escritas de la historia.', cat: 'historia' },
  { year: -2000, evento: 'Civilización minoica', datoCurioso: 'Construyeron Cnosos, con un laberinto que inspiró el mito del Minotauro.', cat: 'historia' },
  { year: -2560, evento: 'Gran Pirámide de Guiza', datoCurioso: 'Cuando se construyó, aún quedaban mamuts lanudos vivos en la Tierra.', cat: 'historia' },
  { year: -3200, evento: 'Primera escritura', datoCurioso: 'Nace en Sumeria: es el primer sistema de escritura cuneiforme conocido.', cat: 'historia' },
  { year: -3300, evento: 'Edad del Bronce', datoCurioso: 'El bronce permitió herramientas mucho más duras que la piedra.', cat: 'prehistoria' },
  { year: -4000, evento: 'Primeras ciudades (Uruk)', datoCurioso: 'Uruk llegó a tener hasta 80.000 habitantes, una metrópolis para su época.', cat: 'historia' },

  // --- Prehistoria reciente ---
  { year: -7000, evento: 'Primeras cerámicas', datoCurioso: 'Aparecen casi al mismo tiempo en varias regiones del mundo.', cat: 'prehistoria' },
  { year: -10000, evento: 'Inicio de la agricultura', datoCurioso: 'La Revolución Neolítica cambia a la humanidad de nómada a sedentaria.', cat: 'prehistoria' },
  { year: -12000, evento: 'Fin de la última glaciación', datoCurioso: 'El nivel del mar era unos 120 metros más bajo que hoy.', cat: 'geologia' },
  { year: -14000, evento: 'Domesticación del perro', datoCurioso: 'Es el primer animal domesticado por el ser humano.', cat: 'biologia' },
  { year: -30000, evento: 'Pinturas de Chauvet', datoCurioso: 'Son las más antiguas de Europa, con leones, rinocerontes y osos.', cat: 'prehistoria' },

  // --- Prehistoria profunda ---
  { year: -40000, evento: 'Primer arte figurativo', datoCurioso: 'Pinturas de animales en cuevas de Indonesia y Europa.', cat: 'prehistoria' },
  { year: -70000, evento: 'Cuello de botella genético', datoCurioso: 'Algunos estudios sugieren que la población humana bajó a unos pocos miles.', cat: 'biologia' },
  { year: -100000, evento: 'Homo sapiens fuera de África', datoCurioso: 'Las primeras migraciones ya llegaban hasta Oriente Próximo.', cat: 'prehistoria' },
  { year: -200000, evento: 'Neandertales en Europa', datoCurioso: 'Convivieron con Homo sapiens y se cruzaron genéticamente.', cat: 'prehistoria' },
  { year: -300000, evento: 'Aparición del Homo sapiens', datoCurioso: 'Los fósiles más antiguos conocidos son de Marruecos.', cat: 'biologia' },
  { year: -400000, evento: 'Uso controlado del fuego', datoCurioso: 'Hay evidencia de hogares usados de forma regular en esta época.', cat: 'prehistoria' },
  { year: -700000, evento: 'Antepasado común humano/neandertal', datoCurioso: 'Ambas especies convivieron y se cruzaron miles de años después.', cat: 'biologia' },
  { year: -1000000, evento: 'Horizonte de 1 millón de años', datoCurioso: 'El género Homo ya se había extendido por buena parte de África y Asia.', cat: 'prehistoria' },
  { year: -2000000, evento: 'Homo erectus', datoCurioso: 'Fue el primero en usar herramientas de piedra de forma sistemática.', cat: 'prehistoria' },
  { year: -3500000, evento: 'Australopithecus (Lucy)', datoCurioso: 'Su nombre viene de la canción de los Beatles que escuchaban los arqueólogos.', cat: 'biologia' },

  // --- Tiempo geológico profundo ---
  { year: -2580000, evento: 'Inicio del Cuaternario', datoCurioso: 'Empieza el periodo de glaciaciones repetidas en el que seguimos hoy.', cat: 'geologia' },
  { year: -6000000, evento: 'Separación humanos/chimpancés', datoCurioso: 'Es la estimación genética del último antepasado común.', cat: 'biologia' },
  { year: -23000000, evento: 'Inicio del Neógeno', datoCurioso: 'Los grandes simios se diversifican por Europa, Asia y África.', cat: 'biologia' },
  { year: -66000000, evento: 'Extinción de los dinosaurios', datoCurioso: 'Un asteroide de unos 10 km golpeó lo que hoy es México.', cat: 'geologia' },
  { year: -145000000, evento: 'Cretácico y primeras flores', datoCurioso: 'Aparecen las primeras plantas con flores en el planeta.', cat: 'biologia' },
  { year: -200000000, evento: 'Ruptura de Pangea', datoCurioso: 'El supercontinente se fragmentó en lo que hoy son los continentes actuales.', cat: 'geologia' },
  { year: -201000000, evento: 'Dominio de los dinosaurios', datoCurioso: 'Tras una extinción en el Triásico, los dinosaurios dominan la Tierra.', cat: 'biologia' },
  { year: -230000000, evento: 'Primeros dinosaurios', datoCurioso: 'Eran pequeños y bípedos, muy diferentes de los gigantes posteriores.', cat: 'biologia' },
  { year: -252000000, evento: 'La Gran Mortandad', datoCurioso: 'La mayor extinción masiva: murió cerca del 90% de las especies marinas.', cat: 'geologia' },
  { year: -375000000, evento: 'Vertebrados en tierra', datoCurioso: 'Peces con aletas robustas (como Tiktaalik) empiezan a salir del agua.', cat: 'biologia' },
  { year: -440000000, evento: 'Primeras plantas terrestres', datoCurioso: 'Musgos y hepáticas fueron los primeros en colonizar la tierra.', cat: 'biologia' },
  { year: -530000000, evento: 'Primeros peces', datoCurioso: 'Los primeros vertebrados aparecen en los mares del Cámbrico.', cat: 'biologia' },
  { year: -541000000, evento: 'Explosión Cámbrica', datoCurioso: 'En pocos millones de años surge la mayoría de los grandes grupos animales.', cat: 'biologia' },
  { year: -2500000000, evento: 'Gran Oxidación', datoCurioso: 'Las cianobacterias llenaron la atmósfera de oxígeno, cambiando la Tierra.', cat: 'geologia' },
  { year: -3700000000, evento: 'Primeros indicios de vida', datoCurioso: 'Son los rastros más antiguos de vida microbiana que se conocen.', cat: 'biologia' },
  { year: -4000000000, evento: 'Formación de los océanos', datoCurioso: 'El agua llegó a la Tierra mediante asteroides y cometas.', cat: 'geologia' },
  { year: -4600000000, evento: 'Formación de la Tierra', datoCurioso: 'Se formó a partir del disco de polvo y gas que rodeaba al joven Sol.', cat: 'geologia' },

  // --- Nuevos eventos (Evolución y prehistoria) ---
  { year: -2400000, evento: 'Aparece el género Homo', datoCurioso: 'Homo habilis es el primero en fabricar herramientas de piedra de forma sistemática.', cat: 'prehistoria' },
  { year: -1900000, evento: 'Homo erectus sale de África', datoCurioso: 'Fue la primera especie humana en controlar distancias tan largas, llegando hasta Asia.', cat: 'prehistoria' },
  { year: -430000, evento: 'Fósiles de neandertal en Atapuerca', datoCurioso: 'Se encontraron en Sima de los Huesos (España), un yacimiento único en el mundo.', cat: 'prehistoria' },
  { year: -170000, evento: '"Eva mitocondrial" estimada', datoCurioso: 'Es la antepasada común más reciente de la que descienden todos los humanos vivos por línea materna.', cat: 'biologia' },
  { year: -74000, evento: 'Erupción del supervolcán Toba', datoCurioso: 'Algunos estudios sugieren que redujo drásticamente la población humana mundial.', cat: 'geologia' },
  { year: -50000, evento: 'Primeros instrumentos musicales', datoCurioso: 'Flautas talladas en huesos de ave y marfil de mamut.', cat: 'prehistoria' },
  { year: -30000, evento: 'Última población de neandertales', datoCurioso: 'Se extinguieron poco después de convivir miles de años con el Homo sapiens.', cat: 'prehistoria' },
  { year: -20000, evento: 'Punto máximo de última glaciación', datoCurioso: 'Gran parte de Europa y Norteamérica estaba cubierta por gruesas capas de hielo.', cat: 'geologia' },
  { year: -17000, evento: 'Pinturas de Lascaux', datoCurioso: 'Se descubrieron por casualidad en 1940, gracias a un perro que cayó en la cueva.', cat: 'prehistoria' },
  { year: -9500, evento: 'Göbekli Tepe', datoCurioso: 'El templo monumental más antiguo conocido, construido antes de la agricultura.', cat: 'historia' },
  { year: -5500, evento: 'Invención de la rueda', datoCurioso: 'Se usó primero para alfarería, no para transporte.', cat: 'historia' },

  // --- Nuevos eventos (Civilizaciones antiguas y Edad Media) ---
  { year: -3000, evento: 'Civilización del valle del Indo', datoCurioso: 'Sus ciudades tenían sistemas de alcantarillado más avanzados que muchas ciudades medievales.', cat: 'historia' },
  { year: -1600, evento: 'Dinastía Shang en China', datoCurioso: 'Dejó los primeros textos escritos chinos, grabados en huesos oraculares.', cat: 'historia' },
  { year: -1200, evento: 'Civilización olmeca', datoCurioso: 'Es la "cultura madre" de Mesoamérica; talló enormes cabezas de piedra.', cat: 'historia' },
  { year: -563, evento: 'Nace Buda', datoCurioso: 'Su enseñanza dio origen a una de las religiones más practicadas del mundo.', cat: 'historia' },
  { year: -268, evento: 'Emperador Ashoka (India)', datoCurioso: 'Tras una guerra sangrienta, se convirtió al budismo y renunció a nuevas conquistas.', cat: 'historia' },
  { year: 100, evento: 'Auge de Teotihuacán', datoCurioso: 'Llegó a tener más de 100.000 habitantes, una de las mayores ciudades del mundo en su época.', cat: 'historia' },
  { year: 868, evento: 'Primer libro impreso conocido', datoCurioso: 'El Sutra del Diamante, impreso en China con bloques de madera.', cat: 'historia' },
  { year: 1206, evento: 'Genghis Kan funda el Imperio mongol', datoCurioso: 'Llegó a ser el imperio de territorio continuo más extenso de la historia.', cat: 'historia' },
  { year: 1324, evento: 'Peregrinación de Mansa Musa a La Meca', datoCurioso: 'Repartió tanto oro por el camino que devaluó su precio en Egipto durante años.', cat: 'historia' },

  // --- Nuevos eventos (Edad Moderna y Contemporánea) ---
  { year: 1521, evento: 'Caída del Imperio azteca', datoCurioso: 'Una alianza de fuerzas españolas e indígenas rivales de los aztecas selló la conquista.', cat: 'historia' },
  { year: 1804, evento: 'Independencia de Haití', datoCurioso: 'Es la primera república nacida de una revuelta de personas esclavizadas.', cat: 'historia' },
  { year: 1885, evento: 'Conferencia de Berlín', datoCurioso: 'Potencias europeas repartieron África en un mapa sin participación africana.', cat: 'historia' },
  { year: 1903, evento: 'Primer vuelo (hermanos Wright)', datoCurioso: 'Duró solo 12 segundos y recorrió menos que la longitud de un avión actual.', cat: 'historia' },
  { year: 1917, evento: 'Revolución Rusa', datoCurioso: 'Terminó con siglos de gobierno zarista en cuestión de meses.', cat: 'historia' },
  { year: 1947, evento: 'Independencia de la India', datoCurioso: 'Vino acompañada de una partición que desplazó a millones de personas.', cat: 'historia' },
  { year: 1957, evento: 'Lanzamiento del Sputnik', datoCurioso: 'Fue el primer objeto fabricado por humanos en orbitar la Tierra.', cat: 'historia' },
  { year: 1994, evento: 'Fin del apartheid en Sudáfrica', datoCurioso: 'Nelson Mandela, preso 27 años, fue elegido presidente ese mismo año.', cat: 'historia' },
].sort((a, b) => b.year - a.year);

const EVENTS_EN = [
  // --- 21st Century ---
  { year: 2024, evento: 'Rise of Generative AI', datoCurioso: 'ChatGPT reached 100 million users in just 2 months.', cat: 'historia' },
  { year: 2020, evento: 'COVID-19 Pandemic', datoCurioso: 'The WHO declared it a global pandemic on March 11, 2020.', cat: 'biologia' },
  { year: 2012, evento: 'Discovery of the Higgs boson', datoCurioso: 'Peter Higgs predicted its existence in 1964, almost 50 years before it was confirmed.', cat: 'historia' },
  { year: 2007, evento: 'iPhone presentation', datoCurioso: 'Steve Jobs described it as "an iPod, a phone, and an Internet communicator".', cat: 'historia' },
  { year: 2001, evento: 'September 11 attacks', datoCurioso: 'The Twin Towers took 7 years to build and 102 minutes to fall.', cat: 'historia' },

  // --- 20th Century ---
  { year: 1991, evento: 'Dissolution of the Soviet Union', datoCurioso: 'The USSR officially dissolved on Christmas Day 1991.', cat: 'historia' },
  { year: 1989, evento: 'Fall of the Berlin Wall', datoCurioso: 'It fell due to a miscommunication during a press conference.', cat: 'historia' },
  { year: 1986, evento: 'Chernobyl Disaster', datoCurioso: 'The 30 km exclusion zone remains uninhabited and has become a wildlife haven.', cat: 'historia' },
  { year: 1977, evento: 'Launch of Voyager 1 probe', datoCurioso: 'It continues sending data from interstellar space, over 24 billion km away.', cat: 'geologia' },
  { year: 1969, evento: 'Moon Landing', datoCurioso: 'The Apollo 11 computer had less processing power than a modern calculator.', cat: 'geologia' },
  { year: 1961, evento: 'Yuri Gagarin in space', datoCurioso: 'The flight lasted only 108 minutes and completed a single orbit around Earth.', cat: 'historia' },
  { year: 1953, evento: 'Structure of DNA', datoCurioso: 'The key photograph (Photo 51) was taken by Rosalind Franklin.', cat: 'biologia' },
  { year: 1945, evento: 'End of World War II', datoCurioso: 'The UN was founded that same year, with 51 member countries.', cat: 'historia' },
  { year: 1939, evento: 'Start of World War II', datoCurioso: 'The deadliest conflict in history: between 70 and 85 million deaths.', cat: 'historia' },
  { year: 1928, evento: 'Discovery of penicillin', datoCurioso: 'Alexander Fleming found it by accident in a forgotten petri dish.', cat: 'biologia' },
  { year: 1914, evento: 'Start of World War I', datoCurioso: 'The assassination of an archduke sparked a conflict between 30 nations.', cat: 'historia' },
  { year: 1903, evento: 'First flight (Wright brothers)', datoCurioso: 'It lasted only 12 seconds and covered 37 meters.', cat: 'historia' },

  // --- 19th Century ---
  { year: 1889, evento: 'Eiffel Tower', datoCurioso: 'It was built as a temporary entrance for the Paris World\'s Fair.', cat: 'historia' },
  { year: 1876, evento: 'Telephone', datoCurioso: 'Elisha Gray filed a similar patent on the same day, just a few hours later.', cat: 'historia' },
  { year: 1869, evento: 'Mendeleev\'s periodic table', datoCurioso: 'He predicted the existence of undiscovered elements and was right.', cat: 'historia' },
  { year: 1859, evento: 'Publication of "On the Origin of Species"', datoCurioso: 'It sold out on the first day of publication.', cat: 'biologia' },
  { year: 1804, evento: 'Napoleon becomes Emperor', datoCurioso: 'He crowned himself, taking the crown from the Pope\'s hands.', cat: 'historia' },

  // --- 16th to 18th Centuries ---
  { year: 1789, evento: 'French Revolution', datoCurioso: 'The revolutionary calendar had 10-day weeks.', cat: 'historia' },
  { year: 1776, evento: 'US Independence', datoCurioso: 'It took Jefferson 17 days to write the Declaration.', cat: 'historia' },
  { year: 1687, evento: 'Newton\'s Laws', datoCurioso: 'In "Principia" he formulates the law of universal gravitation.', cat: 'geologia' },
  { year: 1608, evento: 'Telescope', datoCurioso: 'Galileo improved it a year later and pointed it at the sky.', cat: 'historia' },
  { year: 1543, evento: 'Copernican Revolution', datoCurioso: 'The book claiming the Earth revolves around the Sun was published the year he died.', cat: 'geologia' },
  { year: 1492, evento: 'Arrival in the Americas', datoCurioso: 'Columbus died convinced he had reached Asia.', cat: 'historia' },
  { year: 1440, evento: 'Printing Press (Gutenberg)', datoCurioso: 'His first major work was the 42-line Bible.', cat: 'historia' },

  // --- Middle Ages ---
  { year: 1347, evento: 'Black Death', datoCurioso: 'It killed a third of Europe\'s population in just six years.', cat: 'biologia' },
  { year: 1325, evento: 'Founding of Tenochtitlan', datoCurioso: 'The Aztecs founded it on an island in Lake Texcoco.', cat: 'historia' },
  { year: 1215, evento: 'Magna Carta', datoCurioso: 'Considered one of the foundations of modern constitutionalism.', cat: 'historia' },
  { year: 1088, evento: 'First university', datoCurioso: 'Bologna was founded as a student guild, not by teachers.', cat: 'historia' },
  { year: 1066, evento: 'Battle of Hastings', datoCurioso: 'It changed the language and culture of England forever.', cat: 'historia' },
  { year: 800, evento: 'Coronation of Charlemagne', datoCurioso: 'He was crowned Emperor on Christmas Day.', cat: 'historia' },
  { year: 622, evento: 'The Hegira', datoCurioso: 'Marks the beginning of the Islamic calendar.', cat: 'historia' },
  { year: 476, evento: 'Fall of the Western Roman Empire', datoCurioso: 'The last emperor was only 16 years old.', cat: 'historia' },

  // --- Antiquity ---
  { year: 0, evento: 'Year 1 of the Christian calendar', datoCurioso: 'There is no "year 0": it goes straight from 1 BC to 1 AD.', cat: 'historia' },
  { year: -44, evento: 'Assassination of Julius Caesar', datoCurioso: 'He received 23 stab wounds in the Roman Senate.', cat: 'historia' },
  { year: -221, evento: 'Unification of China', datoCurioso: 'The first emperor ordered a terracotta army built for his tomb.', cat: 'historia' },
  { year: -331, evento: 'Alexander the Great conquers Persia', datoCurioso: 'He built an empire from Greece to India.', cat: 'historia' },
  { year: -447, evento: 'Parthenon', datoCurioso: 'Its columns curve slightly to appear perfectly straight.', cat: 'historia' },
  { year: -509, evento: 'Birth of the Roman Republic', datoCurioso: 'It lasted nearly 500 years before becoming an empire.', cat: 'historia' },
  { year: -563, evento: 'Birth of Buddha', datoCurioso: 'He renounced princely life to seek enlightenment.', cat: 'historia' },
  { year: -776, evento: 'First Olympic Games', datoCurioso: 'Held in Olympia; only men competed, and they did so naked.', cat: 'historia' },
  { year: -1200, evento: 'Bronze Age Collapse', datoCurioso: 'Several major Mediterranean civilizations fell almost simultaneously.', cat: 'historia' },

  // --- Ancient Civilizations ---
  { year: -1750, evento: 'Code of Hammurabi', datoCurioso: 'It is one of the first sets of written laws in history.', cat: 'historia' },
  { year: -2000, evento: 'Minoan civilization', datoCurioso: 'They built Knossos, featuring a labyrinth that inspired the Minotaur myth.', cat: 'historia' },
  { year: -2560, evento: 'Great Pyramid of Giza', datoCurioso: 'When it was built, woolly mammoths were still alive on Earth.', cat: 'historia' },
  { year: -3200, evento: 'First writing', datoCurioso: 'Born in Sumeria: the first known cuneiform writing system.', cat: 'historia' },
  { year: -3300, evento: 'Bronze Age', datoCurioso: 'Bronze allowed for much harder tools than stone.', cat: 'prehistoria' },
  { year: -4000, evento: 'First cities (Uruk)', datoCurioso: 'Uruk reached up to 80,000 inhabitants, a metropolis for its time.', cat: 'historia' },

  // --- Recent Prehistory ---
  { year: -7000, evento: 'First pottery', datoCurioso: 'It appears almost simultaneously in several regions of the world.', cat: 'prehistoria' },
  { year: -10000, evento: 'Dawn of agriculture', datoCurioso: 'The Neolithic Revolution shifted humanity from nomadic to sedentary.', cat: 'prehistoria' },
  { year: -12000, evento: 'End of the last glaciation', datoCurioso: 'The sea level was about 120 meters lower than today.', cat: 'geologia' },
  { year: -14000, evento: 'Domestication of the dog', datoCurioso: 'It is the first animal domesticated by humans.', cat: 'biologia' },
  { year: -30000, evento: 'Chauvet cave paintings', datoCurioso: 'The oldest in Europe, featuring lions, rhinos, and bears.', cat: 'prehistoria' },

  // --- Deep Prehistory ---
  { year: -40000, evento: 'First figurative art', datoCurioso: 'Paintings of animals in caves of Indonesia and Europe.', cat: 'prehistoria' },
  { year: -70000, evento: 'Genetic bottleneck', datoCurioso: 'Some studies suggest the human population dropped to a few thousand.', cat: 'biologia' },
  { year: -100000, evento: 'Homo sapiens outside Africa', datoCurioso: 'The first migrations reached the Middle East.', cat: 'prehistoria' },
  { year: -200000, evento: 'Neanderthals in Europe', datoCurioso: 'Coexisted with Homo sapiens and interbred genetically.', cat: 'prehistoria' },
  { year: -300000, evento: 'Emergence of Homo sapiens', datoCurioso: 'The oldest known fossils are from Morocco.', cat: 'biologia' },
  { year: -400000, evento: 'Controlled use of fire', datoCurioso: 'There is evidence of hearths used regularly during this time.', cat: 'prehistoria' },
  { year: -700000, evento: 'Human/Neanderthal common ancestor', datoCurioso: 'Both species coexisted and interbred thousands of years later.', cat: 'biologia' },
  { year: -1000000, evento: '1 million year horizon', datoCurioso: 'The genus Homo had already spread across much of Africa and Asia.', cat: 'prehistoria' },
  { year: -2000000, evento: 'Homo erectus', datoCurioso: 'The first to systematically use stone tools.', cat: 'prehistoria' },
  { year: -3500000, evento: 'Australopithecus (Lucy)', datoCurioso: 'Named after the Beatles song the archaeologists were listening to.', cat: 'biologia' },

  // --- Deep Geological Time ---
  { year: -2580000, evento: 'Start of the Quaternary', datoCurioso: 'Begins the period of repeated glaciations we are still in today.', cat: 'geologia' },
  { year: -6000000, evento: 'Human/chimpanzee divergence', datoCurioso: 'The genetic estimate for the last common ancestor.', cat: 'biologia' },
  { year: -23000000, evento: 'Start of the Neogene', datoCurioso: 'Great apes diversify across Europe, Asia, and Africa.', cat: 'biologia' },
  { year: -66000000, evento: 'Extinction of the dinosaurs', datoCurioso: 'An asteroid about 10 km wide struck what is now Mexico.', cat: 'geologia' },
  { year: -145000000, evento: 'Cretaceous and first flowers', datoCurioso: 'The first flowering plants appear on the planet.', cat: 'biologia' },
  { year: -200000000, evento: 'Breakup of Pangea', datoCurioso: 'The supercontinent fragmented into today\'s continents.', cat: 'geologia' },
  { year: -201000000, evento: 'Age of dinosaurs', datoCurioso: 'After an extinction in the Triassic, dinosaurs dominate Earth.', cat: 'biologia' },
  { year: -230000000, evento: 'First dinosaurs', datoCurioso: 'They were small and bipedal, very different from the later giants.', cat: 'biologia' },
  { year: -252000000, evento: 'The Great Dying', datoCurioso: 'The largest mass extinction: nearly 90% of marine species died.', cat: 'geologia' },
  { year: -375000000, evento: 'Vertebrates on land', datoCurioso: 'Lobe-finned fish (like Tiktaalik) begin moving onto land.', cat: 'biologia' },
  { year: -440000000, evento: 'First land plants', datoCurioso: 'Mosses and liverworts were the first to colonize land.', cat: 'biologia' },
  { year: -530000000, evento: 'First fish', datoCurioso: 'The first vertebrates appear in the Cambrian seas.', cat: 'biologia' },
  { year: -541000000, evento: 'Cambrian Explosion', datoCurioso: 'Most major animal groups emerge in just a few million years.', cat: 'biologia' },
  { year: -2500000000, evento: 'Great Oxidation Event', datoCurioso: 'Cyanobacteria filled the atmosphere with oxygen, changing Earth.', cat: 'geologia' },
  { year: -3700000000, evento: 'First signs of life', datoCurioso: 'These are the oldest known traces of microbial life.', cat: 'biologia' },
  { year: -4000000000, evento: 'Formation of the oceans', datoCurioso: 'Water arrived on Earth via asteroids and comets.', cat: 'geologia' },
  { year: -4600000000, evento: 'Formation of the Earth', datoCurioso: 'Formed from the disk of dust and gas surrounding the young Sun.', cat: 'geologia' },

  // --- New events (Evolution and prehistory) ---
  { year: -2400000, evento: 'Emergence of genus Homo', datoCurioso: 'Homo habilis is the first to systematically make stone tools.', cat: 'prehistoria' },
  { year: -1900000, evento: 'Homo erectus leaves Africa', datoCurioso: 'First human species to cross such vast distances, reaching Asia.', cat: 'prehistoria' },
  { year: -430000, evento: 'Neanderthal fossils in Atapuerca', datoCurioso: 'Found in the Sima de los Huesos (Spain), a globally unique site.', cat: 'prehistoria' },
  { year: -170000, evento: 'Estimated "Mitochondrial Eve"', datoCurioso: 'The most recent common ancestor of all living humans in the maternal line.', cat: 'biologia' },
  { year: -74000, evento: 'Toba supervolcano eruption', datoCurioso: 'Some studies suggest it drastically reduced the global human population.', cat: 'geologia' },
  { year: -50000, evento: 'First musical instruments', datoCurioso: 'Flutes carved from bird bones and mammoth ivory.', cat: 'prehistoria' },
  { year: -30000, evento: 'Last Neanderthal population', datoCurioso: 'They went extinct shortly after coexisting with Homo sapiens for millennia.', cat: 'prehistoria' },
  { year: -20000, evento: 'Last Glacial Maximum', datoCurioso: 'Much of Europe and North America was covered by thick ice sheets.', cat: 'geologia' },
  { year: -17000, evento: 'Lascaux cave paintings', datoCurioso: 'Discovered by accident in 1940, thanks to a dog that fell into the cave.', cat: 'prehistoria' },
  { year: -9500, evento: 'Göbekli Tepe', datoCurioso: 'The oldest known monumental temple, built before agriculture.', cat: 'historia' },
  { year: -5500, evento: 'Invention of the wheel', datoCurioso: 'First used for pottery making, not for transportation.', cat: 'historia' },

  // --- New events (Ancient Civilizations and Middle Ages) ---
  { year: -3000, evento: 'Indus Valley Civilization', datoCurioso: 'Its cities had sewage systems more advanced than many medieval cities.', cat: 'historia' },
  { year: -1600, evento: 'Shang Dynasty in China', datoCurioso: 'Left the first Chinese written texts, carved on oracle bones.', cat: 'historia' },
  { year: -1200, evento: 'Olmec civilization', datoCurioso: 'The "mother culture" of Mesoamerica; carved massive stone heads.', cat: 'historia' },
  { year: -563, evento: 'Birth of Buddha', datoCurioso: 'His teachings gave rise to one of the world\'s most practiced religions.', cat: 'historia' },
  { year: -268, evento: 'Emperor Ashoka (India)', datoCurioso: 'After a bloody war, he converted to Buddhism and renounced further conquests.', cat: 'historia' },
  { year: 100, evento: 'Rise of Teotihuacan', datoCurioso: 'Reached over 100,000 inhabitants, one of the largest cities in the world at the time.', cat: 'historia' },
  { year: 868, evento: 'First known printed book', datoCurioso: 'The Diamond Sutra, printed in China using wooden blocks.', cat: 'historia' },
  { year: 1206, evento: 'Genghis Khan founds the Mongol Empire', datoCurioso: 'It became the largest contiguous land empire in history.', cat: 'historia' },
  { year: 1324, evento: 'Mansa Musa\'s pilgrimage to Mecca', datoCurioso: 'Distributed so much gold along the way that he devalued its price in Egypt for years.', cat: 'historia' },

  // --- New events (Modern and Contemporary Eras) ---
  { year: 1521, evento: 'Fall of the Aztec Empire', datoCurioso: 'An alliance of Spanish forces and rival indigenous groups sealed the conquest.', cat: 'historia' },
  { year: 1804, evento: 'Haitian Independence', datoCurioso: 'The first republic born out of a rebellion by enslaved people.', cat: 'historia' },
  { year: 1885, evento: 'Berlin Conference', datoCurioso: 'European powers partitioned Africa on a map with no African participation.', cat: 'historia' },
  { year: 1903, evento: 'First flight (Wright brothers)', datoCurioso: 'Lasted only 12 seconds and covered less distance than the length of a modern plane.', cat: 'historia' },
  { year: 1917, evento: 'Russian Revolution', datoCurioso: 'Ended centuries of Tsarist rule in a matter of months.', cat: 'historia' },
  { year: 1947, evento: 'Independence of India', datoCurioso: 'Accompanied by a partition that displaced millions of people.', cat: 'historia' },
  { year: 1957, evento: 'Launch of Sputnik', datoCurioso: 'The first human-made object to orbit the Earth.', cat: 'historia' },
  { year: 1994, evento: 'End of apartheid in South Africa', datoCurioso: 'Nelson Mandela, imprisoned for 27 years, was elected president that same year.', cat: 'historia' },
].sort((a, b) => b.year - a.year);

let EVENTS = EVENTS_ES;

/* ================================================================
   DATOS: ERAS Y ETAPAS
   ================================================================ */
const ERAS_ES = [
  // Eras geológicas
  { nombre: 'Hádico', inicio: -4600000000, fin: -4000000000, tipo: 'geologica' },
  { nombre: 'Arcaico', inicio: -4000000000, fin: -2500000000, tipo: 'geologica' },
  { nombre: 'Proterozoico', inicio: -2500000000, fin: -541000000, tipo: 'geologica' },
  { nombre: 'Precámbrico', inicio: -4600000000, fin: -541000000, tipo: 'geologica' },
  { nombre: 'Paleozoico', inicio: -541000000, fin: -252000000, tipo: 'geologica' },
  { nombre: 'Cámbrico', inicio: -541000000, fin: -485000000, tipo: 'geologica' },
  { nombre: 'Ordovícico', inicio: -485000000, fin: -444000000, tipo: 'geologica' },
  { nombre: 'Silúrico', inicio: -444000000, fin: -419000000, tipo: 'geologica' },
  { nombre: 'Devónico', inicio: -419000000, fin: -359000000, tipo: 'geologica' },
  { nombre: 'Carbonífero', inicio: -359000000, fin: -299000000, tipo: 'geologica' },
  { nombre: 'Pérmico', inicio: -299000000, fin: -252000000, tipo: 'geologica' },
  { nombre: 'Mesozoico', inicio: -252000000, fin: -66000000, tipo: 'geologica' },
  { nombre: 'Triásico', inicio: -252000000, fin: -201000000, tipo: 'geologica' },
  { nombre: 'Jurásico', inicio: -201000000, fin: -145000000, tipo: 'geologica' },
  { nombre: 'Cretácico', inicio: -145000000, fin: -66000000, tipo: 'geologica' },
  { nombre: 'Cenozoico', inicio: -66000000, fin: CURRENT_YEAR, tipo: 'geologica' },
  { nombre: 'Paleógeno', inicio: -66000000, fin: -23000000, tipo: 'geologica' },
  { nombre: 'Paleoceno', inicio: -66000000, fin: -56000000, tipo: 'geologica' },
  { nombre: 'Eoceno', inicio: -56000000, fin: -33900000, tipo: 'geologica' },
  { nombre: 'Oligoceno', inicio: -33900000, fin: -23000000, tipo: 'geologica' },
  { nombre: 'Neógeno', inicio: -23000000, fin: -2580000, tipo: 'geologica' },
  { nombre: 'Mioceno', inicio: -23000000, fin: -5300000, tipo: 'geologica' },
  { nombre: 'Plioceno', inicio: -5300000, fin: -2580000, tipo: 'geologica' },
  { nombre: 'Cuaternario', inicio: -2580000, fin: CURRENT_YEAR, tipo: 'geologica' },
  { nombre: 'Pleistoceno', inicio: -2580000, fin: -11700, tipo: 'geologica' },
  { nombre: 'Holoceno', inicio: -11700, fin: CURRENT_YEAR, tipo: 'geologica' },
  // Edades históricas
  { nombre: 'Edad de Piedra', inicio: -3300000, fin: -3300, tipo: 'historica' },
  { nombre: 'Paleolítico', inicio: -3300000, fin: -10000, tipo: 'historica' },
  { nombre: 'Mesolítico', inicio: -10000, fin: -8000, tipo: 'historica' },
  { nombre: 'Neolítico', inicio: -8000, fin: -3300, tipo: 'historica' },
  { nombre: 'Edad de Bronce', inicio: -3300, fin: -1200, tipo: 'historica' },
  { nombre: 'Edad de Hierro', inicio: -1200, fin: -1, tipo: 'historica' },
  { nombre: 'Edad Antigua', inicio: -3000, fin: 476, tipo: 'historica' },
  { nombre: 'Edad Media', inicio: 476, fin: 1492, tipo: 'historica' },
  { nombre: 'Edad Moderna', inicio: 1492, fin: 1789, tipo: 'historica' },
  { nombre: 'Edad Contemporánea', inicio: 1789, fin: CURRENT_YEAR, tipo: 'historica' },
];

const ERAS_EN = [
  // Geological eras
  { nombre: 'Hadean', inicio: -4600000000, fin: -4000000000, tipo: 'geologica' },
  { nombre: 'Archean', inicio: -4000000000, fin: -2500000000, tipo: 'geologica' },
  { nombre: 'Proterozoic', inicio: -2500000000, fin: -541000000, tipo: 'geologica' },
  { nombre: 'Precambrian', inicio: -4600000000, fin: -541000000, tipo: 'geologica' },
  { nombre: 'Paleozoic', inicio: -541000000, fin: -252000000, tipo: 'geologica' },
  { nombre: 'Cambrian', inicio: -541000000, fin: -485000000, tipo: 'geologica' },
  { nombre: 'Ordovician', inicio: -485000000, fin: -444000000, tipo: 'geologica' },
  { nombre: 'Silurian', inicio: -444000000, fin: -419000000, tipo: 'geologica' },
  { nombre: 'Devonian', inicio: -419000000, fin: -359000000, tipo: 'geologica' },
  { nombre: 'Carboniferous', inicio: -359000000, fin: -299000000, tipo: 'geologica' },
  { nombre: 'Permian', inicio: -299000000, fin: -252000000, tipo: 'geologica' },
  { nombre: 'Mesozoic', inicio: -252000000, fin: -66000000, tipo: 'geologica' },
  { nombre: 'Triassic', inicio: -252000000, fin: -201000000, tipo: 'geologica' },
  { nombre: 'Jurassic', inicio: -201000000, fin: -145000000, tipo: 'geologica' },
  { nombre: 'Cretaceous', inicio: -145000000, fin: -66000000, tipo: 'geologica' },
  { nombre: 'Cenozoic', inicio: -66000000, fin: CURRENT_YEAR, tipo: 'geologica' },
  { nombre: 'Paleogene', inicio: -66000000, fin: -23000000, tipo: 'geologica' },
  { nombre: 'Paleocene', inicio: -66000000, fin: -56000000, tipo: 'geologica' },
  { nombre: 'Eocene', inicio: -56000000, fin: -33900000, tipo: 'geologica' },
  { nombre: 'Oligocene', inicio: -33900000, fin: -23000000, tipo: 'geologica' },
  { nombre: 'Neogene', inicio: -23000000, fin: -2580000, tipo: 'geologica' },
  { nombre: 'Miocene', inicio: -23000000, fin: -5300000, tipo: 'geologica' },
  { nombre: 'Pliocene', inicio: -5300000, fin: -2580000, tipo: 'geologica' },
  { nombre: 'Quaternary', inicio: -2580000, fin: CURRENT_YEAR, tipo: 'geologica' },
  { nombre: 'Pleistocene', inicio: -2580000, fin: -11700, tipo: 'geologica' },
  { nombre: 'Holocene', inicio: -11700, fin: CURRENT_YEAR, tipo: 'geologica' },
  // Historical ages
  { nombre: 'Stone Age', inicio: -3300000, fin: -3300, tipo: 'historica' },
  { nombre: 'Paleolithic', inicio: -3300000, fin: -10000, tipo: 'historica' },
  { nombre: 'Mesolithic', inicio: -10000, fin: -8000, tipo: 'historica' },
  { nombre: 'Neolithic', inicio: -8000, fin: -3300, tipo: 'historica' },
  { nombre: 'Bronze Age', inicio: -3300, fin: -1200, tipo: 'historica' },
  { nombre: 'Iron Age', inicio: -1200, fin: -1, tipo: 'historica' },
  { nombre: 'Ancient History', inicio: -3000, fin: 476, tipo: 'historica' },
  { nombre: 'Middle Ages', inicio: 476, fin: 1492, tipo: 'historica' },
  { nombre: 'Modern Era', inicio: 1492, fin: 1789, tipo: 'historica' },
  { nombre: 'Contemporary Era', inicio: 1789, fin: CURRENT_YEAR, tipo: 'historica' },
];

let ERAS = ERAS_ES;

function findEra(query) {
  const q = normalize(query);
  if (!q) return null;
  return ERAS.find(era => {
    const n = normalize(era.nombre);
    return n.includes(q) || q.includes(n);
  }) || null;
}

function findAllEras(query) {
  const q = normalize(query);
  if (!q) return [];
  return ERAS.filter(era => {
    const n = normalize(era.nombre);
    return n.includes(q) || q.includes(n);
  });
}

/* Búsqueda general: Busca en nombres de eventos y datos curiosos */
function findEventByText(query) {
  const q = normalize(query);
  if (!q) return null;
  return EVENTS.find(ev => {
    return normalize(ev.evento).includes(q) || normalize(ev.datoCurioso).includes(q);
  }) || null;
}

function findAllEventsByText(query) {
  const q = normalize(query);
  if (!q) return [];
  return EVENTS.filter(ev => {
    return normalize(ev.evento).includes(q) || normalize(ev.datoCurioso).includes(q);
  });
}

function levenshtein(a, b) {
  const m = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] = b[i - 1] === a[j - 1]
        ? m[i - 1][j - 1]
        : Math.min(m[i - 1][j - 1] + 1, m[i][j - 1] + 1, m[i - 1][j] + 1);
    }
  }
  return m[b.length][a.length];
}

function findClosestMatch(query) {
  const qWords = normalize(query).split(/\s+/);
  if (qWords.length === 0) return null;

  let bestMatch = null;
  let bestDist = 3; 

  const checkText = (text, item, type) => {
    const words = normalize(text).split(/\s+/);
    for (const qw of qWords) {
      if (qw.length < 4) continue;
      for (const w of words) {
        if (Math.abs(qw.length - w.length) > 2) continue;
        const d = levenshtein(qw, w);
        if (d <= 2 && d < bestDist) {
          bestDist = d;
          bestMatch = { type, data: item };
        }
      }
    }
  };

  for (const era of ERAS) checkText(era.nombre, era, 'era');
  for (const ev of EVENTS) {
    checkText(ev.evento, ev, 'event');
    checkText(ev.datoCurioso, ev, 'event');
  }

  return bestMatch;
}

/* ================================================================
   ESTADO
   ================================================================ */
const TRACK_SIZE = 16000;
const SLIDER_EDGE_INSET = 7;
let currentT = 0;
let activeEraName = null;
let orientation = 'vertical';
let isPresenterMode = false;

function tToSliderPercent(t) {
  return SLIDER_EDGE_INSET + t * (100 - 2 * SLIDER_EDGE_INSET);
}

/* ================================================================
   REFERENCIAS AL DOM
   ================================================================ */
const htmlEl = document.documentElement;
const timelineTrack = document.getElementById('timelineTrack');
const factCard = document.getElementById('factCard');
const factYearEl = document.getElementById('factYear');
const factTitleEl = document.getElementById('factTitle');
const factTextEl = document.getElementById('factText');
const factCardClose = document.getElementById('factCardClose');

const sliderTrack = document.getElementById('sliderTrack');
const sliderThumb = document.getElementById('sliderThumb');
const sliderTicks = document.getElementById('sliderTicks');
const sliderFill = document.getElementById('sliderFill');
const thumbYearEl = document.getElementById('thumbYear');

const yearInput = document.getElementById('yearInput');
const yearJumpForm = document.getElementById('yearJumpForm');
const yearClearBtn = document.getElementById('yearClearBtn');
const arrowUp = document.getElementById('arrowUp');
const arrowDown = document.getElementById('arrowDown');

// Control the visibility of the clear button
yearInput.addEventListener('input', () => {
  yearClearBtn.hidden = yearInput.value.length === 0;
});
yearClearBtn.addEventListener('click', () => {
  yearInput.value = '';
  yearClearBtn.hidden = true;
  yearInput.focus();
});

const erasPanel = document.getElementById('erasPanel');
const erasToggle = document.getElementById('erasToggle');
const erasPanelClose = document.getElementById('erasPanelClose');
const eraChipsGeo = document.getElementById('eraChipsGeo');
const eraChipsHist = document.getElementById('eraChipsHist');
const eraClearBtn = document.getElementById('eraClearBtn');

const orientationToggle = document.getElementById('orientationToggle');
const projectorToggle = document.getElementById('projectorToggle');
const bgVignette = document.getElementById('bgVignette');

const eraBand = document.createElement('div');
eraBand.className = 'era-band';
eraBand.innerHTML = '<span class="era-band__label"></span>';
timelineTrack.appendChild(eraBand);
const eraBandLabel = eraBand.querySelector('.era-band__label');

/* ================================================================
   RENDER
   ================================================================ */
function renderEventNodes() {
  const existing = timelineTrack.querySelectorAll('.event-node');
  existing.forEach(n => n.remove());

  const isHoriz = orientation === 'horizontal';
  let lastXRight = -9999;
  let lastXLeft = -9999;
  const MIN_DIST = 140;

  EVENTS.forEach((ev, i) => {
    const t = yearToT(ev.year);
    const node = document.createElement('div');
    const catClass = ev.cat ? `event-node--${ev.cat}` : '';
    const isRight = i % 2 === 0;
    const sideClass = isRight ? 'event-node--right' : 'event-node--left';
    
    node.className = `event-node ${sideClass} ${catClass}`;

    if (isHoriz) {
      const xPos = t * TRACK_SIZE;
      let pushDist = 0;
      if (isRight) {
        if (Math.abs(xPos - lastXRight) < MIN_DIST) pushDist = 44;
        lastXRight = xPos;
        node.style.transform = `translate(-50%, ${14 + pushDist}px)`;
      } else {
        if (Math.abs(xPos - lastXLeft) < MIN_DIST) pushDist = 44;
        lastXLeft = xPos;
        node.style.transform = `translate(-50%, calc(-100% - ${14 + pushDist}px))`;
      }
      node.style.left = xPos + 'px';
      node.style.top = '0';
    } else {
      node.style.top = (t * TRACK_SIZE) + 'px';
      node.style.left = '0';
      node.style.transform = '';
    }

    node.dataset.t = t;
    node.dataset.index = i;
    node.innerHTML = `
      <span class="event-node__dot"></span>
      <span class="event-node__label">${formatYear(ev.year)} · ${ev.evento}</span>
    `;
    node.addEventListener('click', () => { if (wasDraggingViewport) return; clearEraBand(); setT(t, true); });
    node.addEventListener('mouseenter', () => showFact(ev));
    node.addEventListener('mouseleave', () => updateActiveNodeAndFact());
    timelineTrack.appendChild(node);
  });
}

function renderSliderTicks() {
  sliderTicks.innerHTML = '';
  const MAIN_TICKS = [CURRENT_YEAR, 1000, 0, -10000, -100000, -1000000, -66000000, -541000000, -4600000000];
  SCALE_BREAKPOINTS
    .filter(bp => MAIN_TICKS.includes(bp.year))
    .forEach(bp => {
      const tick = document.createElement('div');
      tick.className = 'tick';
      tick.style.setProperty('--tick-pos', tToSliderPercent(bp.t) + '%');
      tick.innerHTML = `<span>${formatYear(bp.year)}</span>`;
      sliderTicks.appendChild(tick);
    });
}

function renderEraChips() {
  eraChipsGeo.innerHTML = '';
  eraChipsHist.innerHTML = '';

  ERAS.forEach(era => {
    const chip = document.createElement('button');
    chip.className = 'era-chip';
    chip.textContent = era.nombre;
    chip.addEventListener('click', () => {
      jumpToEra(era);
      closeErasPanel();
    });
    if (era.tipo === 'geologica') eraChipsGeo.appendChild(chip);
    else eraChipsHist.appendChild(chip);
  });
}

/* ================================================================
   ACTUALIZACIÓN DE POSICIÓN Y FONDO DINÁMICO
   ================================================================ */
// Paleta dinámica de colores de fondo según t
function updateBackgroundGlow(t) {
  // Presente (0) -> Azul Cyan
  // Edad Media/Antigüedad (~0.22 a 0.35) -> Oro/Bronce
  // Dinosaurios/Paleozoico (~0.85 a 0.95) -> Verde profundo
  // Origen de la Tierra (1) -> Rojo/Ámbar
  let rA, gA, bA, rB, gB, bB;

  if (t < 0.25) {
    // Transición Cyan -> Oro
    const p = t / 0.25;
    rA = 127 + p * (251 - 127); gA = 216 + p * (191 - 216); bA = 255 + p * (36 - 255);
  } else if (t < 0.8) {
    // Transición Oro -> Verde oscuro
    const p = (t - 0.25) / 0.55;
    rA = 251 + p * (16 - 251); gA = 191 + p * (185 - 191); bA = 36 + p * (129 - 36);
  } else {
    // Transición Verde oscuro -> Rojo/Ámbar volcánico
    const p = (t - 0.8) / 0.2;
    rA = 16 + p * (220 - 16); gA = 185 + p * (38 - 185); bA = 129 + p * (38 - 129);
  }
  
  htmlEl.style.setProperty('--vignette-a', `rgba(${Math.round(rA)}, ${Math.round(gA)}, ${Math.round(bA)}, 0.12)`);
  htmlEl.style.setProperty('--vignette-b', `rgba(${Math.round(rA)}, ${Math.round(gA)}, ${Math.round(bA)}, 0.05)`);
}

function setT(t, animate) {
  currentT = clamp(t, 0, 1);

  const isHoriz = orientation === 'horizontal';
  const trackTransition = animate ? 'transform .6s cubic-bezier(.22,.61,.36,1)' : 'none';
  const posTransition = animate ? (isHoriz ? 'left .6s cubic-bezier(.22,.61,.36,1)' : 'top .6s cubic-bezier(.22,.61,.36,1)') : (isHoriz ? 'left 0s' : 'top 0s');

  timelineTrack.style.transition = trackTransition;
  if (isHoriz) {
    timelineTrack.style.transform = `translate(${-currentT * TRACK_SIZE}px, -50%)`;
  } else {
    timelineTrack.style.transform = `translate(-50%, ${-currentT * TRACK_SIZE}px)`;
  }

  sliderThumb.style.transition = `${posTransition}, width .25s ease`;
  sliderFill.style.transition = posTransition;
  const percent = tToSliderPercent(currentT);
  
  if (isHoriz) {
    sliderThumb.style.top = '50%';
    sliderThumb.style.left = percent + '%';
    sliderFill.style.bottom = '4px';
    sliderFill.style.right = (100 - percent) + '%';
  } else {
    sliderThumb.style.left = '50%';
    sliderThumb.style.top = percent + '%';
    sliderFill.style.right = '4px';
    sliderFill.style.bottom = (100 - percent) + '%';
  }

  const year = tToYear(currentT);
  thumbYearEl.textContent = formatYear(year);
  if (document.activeElement !== yearInput) {
    yearInput.value = ''; // Limpiamos para no confundir si la vista se mueve
  }

  updateBackgroundGlow(currentT);
  updateActiveNodeAndFact();
}

const ACTIVE_THRESHOLD_T = 0.006;
function updateActiveNodeAndFact() {
  if (activeEraName) return;

  const nodes = timelineTrack.querySelectorAll('.event-node');
  let closestIndex = -1;
  let closestDist = Infinity;

  nodes.forEach(node => {
    const t = parseFloat(node.dataset.t);
    const dist = Math.abs(t - currentT);
    node.classList.toggle('is-active', dist < ACTIVE_THRESHOLD_T);
    if (dist < closestDist) { closestDist = dist; closestIndex = parseInt(node.dataset.index, 10); }
  });

  if (closestIndex !== -1 && closestDist < ACTIVE_THRESHOLD_T) {
    showFact(EVENTS[closestIndex]);
  } else {
    hideFact();
  }
}

function showFact(ev) {
  factYearEl.textContent = formatYear(ev.year);
  factTitleEl.textContent = ev.evento;
  factTextEl.textContent = ev.datoCurioso;
  factCard.hidden = false;
}
function hideFact() {
  factCard.hidden = true;
}

/* ================================================================
   ERAS BANDS
   ================================================================ */
function showEraBand(era) {
  const tInicio = yearToT(era.inicio);
  const tFin = yearToT(era.fin);

  if (orientation === 'vertical') {
    const top = Math.min(tInicio, tFin) * TRACK_SIZE;
    const height = Math.abs(tInicio - tFin) * TRACK_SIZE;
    eraBand.style.top = top + 'px';
    eraBand.style.height = Math.max(height, 2) + 'px';
    eraBand.style.left = '50%';
    eraBand.style.width = '3px';
  } else {
    const left = Math.min(tInicio, tFin) * TRACK_SIZE;
    const width = Math.abs(tInicio - tFin) * TRACK_SIZE;
    eraBand.style.left = left + 'px';
    eraBand.style.width = Math.max(width, 2) + 'px';
    eraBand.style.top = '50%';
    eraBand.style.height = '3px';
  }

  eraBand.classList.add('is-visible');
  eraBandLabel.textContent = era.nombre;
  activeEraName = era.nombre;

  factYearEl.textContent = 'Etapa Histórica/Geológica';
  factTitleEl.textContent = era.nombre;
  factTextEl.textContent = `Empieza aprox. en ${formatYear(era.inicio)} y termina en ${era.fin === CURRENT_YEAR ? 'la actualidad' : formatYear(era.fin)}.`;
  factCard.hidden = false;
  eraClearBtn.hidden = false;

  document.querySelectorAll('.era-chip').forEach(chip => {
    chip.classList.toggle('is-active', normalize(chip.textContent) === normalize(era.nombre));
  });
}

function clearEraBand() {
  activeEraName = null;
  eraBand.classList.remove('is-visible');
  eraClearBtn.hidden = true;
  document.querySelectorAll('.era-chip.is-active').forEach(c => c.classList.remove('is-active'));
}

function jumpToEra(era) {
  setT(yearToT(era.inicio), true);
  showEraBand(era);
}

eraClearBtn.addEventListener('click', () => { clearEraBand(); hideFact(); });
factCardClose.addEventListener('click', () => { hideFact(); clearEraBand(); });

/* ================================================================
   PANELES Y TOGGLES
   ================================================================ */
function toggleErasPanel() { erasPanel.classList.toggle('is-open'); }
function closeErasPanel() { erasPanel.classList.remove('is-open'); }
erasToggle.addEventListener('click', toggleErasPanel);
erasPanelClose.addEventListener('click', closeErasPanel);

function setOrientation(o) {
  orientation = o;
  htmlEl.setAttribute('data-orientation', o);
  localStorage.setItem('escala-tiempo-orientation', o);
  renderEventNodes();
  setT(currentT, false);
  clearEraBand();
  hideFact();
}
orientationToggle.addEventListener('click', () => {
  setOrientation(orientation === 'vertical' ? 'horizontal' : 'vertical');
});

projectorToggle.addEventListener('click', () => {
  isPresenterMode = !isPresenterMode;
  document.body.classList.toggle('is-presenter-mode', isPresenterMode);
  projectorToggle.classList.toggle('is-active', isPresenterMode);
});

/* ================================================================
   INTERACCIÓN BÁSICA (Deslizar con el dedo/ratón en Viewport, Slider y Rueda)
   ================================================================ */
let wasDraggingViewport = false;
let isViewportDragging = false;
let startPointerPos = { x: 0, y: 0 };
let lastPointerPos = { x: 0, y: 0 };
let lastPointerTime = 0;
let velocityT = 0;
let startT = 0;
let inertiaAnimFrame = null;

const timelineViewport = document.getElementById('timelineViewport');

function stopInertia() {
  if (inertiaAnimFrame) {
    cancelAnimationFrame(inertiaAnimFrame);
    inertiaAnimFrame = null;
  }
}

function onViewportPointerDown(e) {
  // Ignorar si se toca dentro de controles interactivos (botones, inputs, paneles, tarjetas)
  if (e.target.closest('button, input, select, textarea, a, .fact-card, .eras-panel, .side-control, .app-header')) {
    return;
  }

  stopInertia();
  isViewportDragging = true;
  wasDraggingViewport = false;
  startPointerPos = { x: e.clientX, y: e.clientY };
  lastPointerPos = { x: e.clientX, y: e.clientY };
  lastPointerTime = performance.now();
  startT = currentT;
  velocityT = 0;

  try {
    timelineViewport.setPointerCapture(e.pointerId);
  } catch (err) {}
}

function onViewportPointerMove(e) {
  if (!isViewportDragging) return;

  const dx = e.clientX - startPointerPos.x;
  const dy = e.clientY - startPointerPos.y;
  const totalDist = Math.hypot(dx, dy);

  if (totalDist > 6) {
    wasDraggingViewport = true;
  }

  const isHoriz = orientation === 'horizontal';
  // En vertical: arrastrar hacia arriba (startPointerPos.y > clientY) avanza la línea de tiempo hacia abajo (t aumenta)
  // En horizontal: arrastrar hacia la izquierda (startPointerPos.x > clientX) avanza la línea de tiempo a la derecha (t aumenta)
  const deltaPixels = isHoriz ? (startPointerPos.x - e.clientX) : (startPointerPos.y - e.clientY);
  const deltaT = deltaPixels / TRACK_SIZE;

  clearEraBand();
  setT(startT + deltaT, false);

  const now = performance.now();
  const dt = now - lastPointerTime;
  if (dt > 8) {
    const currentPos = isHoriz ? e.clientX : e.clientY;
    const prevPos = isHoriz ? lastPointerPos.x : lastPointerPos.y;
    const pDelta = prevPos - currentPos;
    const instVelocity = (pDelta / TRACK_SIZE) / (dt / 1000);
    velocityT = velocityT * 0.3 + instVelocity * 0.7;
    lastPointerPos = { x: e.clientX, y: e.clientY };
    lastPointerTime = now;
  }
}

function onViewportPointerUp(e) {
  if (!isViewportDragging) return;
  isViewportDragging = false;

  try {
    timelineViewport.releasePointerCapture(e.pointerId);
  } catch (err) {}

  if (wasDraggingViewport) {
    setTimeout(() => { wasDraggingViewport = false; }, 50);
  }

  // Inercia (deslizamiento fluido al soltar con impulso)
  if (Math.abs(velocityT) > 0.005) {
    let lastFrameTime = performance.now();
    function stepInertia(now) {
      const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
      lastFrameTime = now;
      velocityT *= Math.pow(0.90, dt * 60);

      if (Math.abs(velocityT) < 0.0002 || currentT <= 0 || currentT >= 1) {
        velocityT = 0;
        return;
      }
      setT(currentT + velocityT * dt, false);
      inertiaAnimFrame = requestAnimationFrame(stepInertia);
    }
    inertiaAnimFrame = requestAnimationFrame(stepInertia);
  }
}

timelineViewport.addEventListener('pointerdown', onViewportPointerDown);
timelineViewport.addEventListener('pointermove', onViewportPointerMove);
timelineViewport.addEventListener('pointerup', onViewportPointerUp);
timelineViewport.addEventListener('pointercancel', onViewportPointerUp);

// Slider lateral glass
let dragging = false;
function pointerToT(clientX, clientY) {
  const rect = sliderTrack.getBoundingClientRect();
  const isHoriz = orientation === 'horizontal';
  const raw = isHoriz ? (clientX - rect.left) / rect.width : (clientY - rect.top) / rect.height;
  const insetFraction = SLIDER_EDGE_INSET / 100;
  return clamp((raw - insetFraction) / (1 - 2 * insetFraction), 0, 1);
}
function onPointerDown(e) { stopInertia(); dragging = true; clearEraBand(); sliderTrack.setPointerCapture(e.pointerId); setT(pointerToT(e.clientX, e.clientY), false); }
function onPointerMove(e) { if (!dragging) return; setT(pointerToT(e.clientX, e.clientY), false); }
function onPointerUp(e) { dragging = false; try { sliderTrack.releasePointerCapture(e.pointerId); } catch (err) {} }
sliderTrack.addEventListener('pointerdown', onPointerDown);
sliderTrack.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerup', onPointerUp);
window.addEventListener('pointercancel', onPointerUp);

timelineViewport.addEventListener('wheel', (e) => {
  stopInertia();
  e.preventDefault();
  clearEraBand();
  setT(currentT + (e.deltaY * 0.00025), false);
}, { passive: false });

/* ================================================================
   INTERACCIÓN: Flechas y Teclado
   ================================================================ */
function jumpToAdjacentEvent(direction) {
  clearEraBand();
  const years = EVENTS.map(e => e.year).sort((a, b) => b - a);
  const currentYear = tToYear(currentT);
  let target;
  if (direction === 1) target = years.filter(y => y > currentYear + 0.5).pop();
  else target = years.find(y => y < currentYear - 0.5);
  if (target === undefined) target = direction === 1 ? years[0] : years[years.length - 1];
  setT(yearToT(target), true);
}
arrowUp.addEventListener('click', () => jumpToAdjacentEvent(1));
arrowDown.addEventListener('click', () => jumpToAdjacentEvent(-1));

document.addEventListener('keydown', (e) => {
  if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
  if (document.getElementById('appView').hidden) return;
  
  const isHoriz = orientation === 'horizontal';
  
  if (e.key === 'ArrowUp' || (isHoriz && e.key === 'ArrowLeft')) { e.preventDefault(); jumpToAdjacentEvent(1); }
  else if (e.key === 'ArrowDown' || (isHoriz && e.key === 'ArrowRight')) { e.preventDefault(); jumpToAdjacentEvent(-1); }
  else if (e.key === 'Escape') {
    e.preventDefault();
    if (erasPanel.classList.contains('is-open')) closeErasPanel();
    else if (activeEraName) { clearEraBand(); hideFact(); }
    else hideFact();
  }
});

/* ================================================================
   BUSCADOR GLOBAL (Año, Era o Texto)
   ================================================================ */
const searchResultsModal = document.getElementById('searchResultsModal');
const searchResultsClose = document.getElementById('searchResultsClose');
const searchResultsList = document.getElementById('searchResultsList');

function openSearchResultsModal() { searchResultsModal.hidden = false; }
function closeSearchResultsModal() { searchResultsModal.hidden = true; }
searchResultsClose.addEventListener('click', closeSearchResultsModal);

function renderSearchResults(results) {
  searchResultsList.innerHTML = '';
  results.forEach(res => {
    const btn = document.createElement('button');
    btn.className = 'search-result-btn';
    
    const isEra = res.type === 'era';
    const title = isEra ? res.data.nombre : res.data.evento;
    const desc = isEra ? `Era ${res.data.tipo}` : formatYear(res.data.year);
    
    btn.innerHTML = `<strong>${title}</strong><span>${desc}</span>`;
    
    btn.addEventListener('click', () => {
      if (isEra) {
        setT(yearToT(res.data.inicio), true);
        showEraBand(res.data);
      } else {
        clearEraBand();
        setT(yearToT(res.data.year), true);
      }
      yearInput.value = title;
      yearClearBtn.hidden = false;
      closeSearchResultsModal();
    });
    
    searchResultsList.appendChild(btn);
  });
  openSearchResultsModal();
}

yearJumpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const raw = yearInput.value.trim();
  if (raw === '') return;

  const year = parseInt(raw, 10);
  const isPlainNumber = !Number.isNaN(year) && /^-?\d+$/.test(raw);

  if (isPlainNumber) {
    // 1. Es un número exacto
    clearEraBand();
    setT(yearToT(year), true);
  } else {
    // 2. Búsqueda exacta múltiple
    const eras = findAllEras(raw).map(era => ({ type: 'era', data: era }));
    const events = findAllEventsByText(raw).map(ev => ({ type: 'event', data: ev }));
    const combined = [...eras, ...events];

    if (combined.length === 1) {
      // Un solo resultado
      const res = combined[0];
      if (res.type === 'era') {
        setT(yearToT(res.data.inicio), true);
        showEraBand(res.data);
        yearInput.value = res.data.nombre;
      } else {
        clearEraBand();
        setT(yearToT(res.data.year), true);
        yearInput.value = res.data.evento;
      }
      yearClearBtn.hidden = false;
    } else if (combined.length > 1) {
      // Múltiples resultados -> Mostrar modal
      renderSearchResults(combined);
    } else {
      // 3. Búsqueda difusa (Levenshtein) si no hay resultados exactos
      const fuzzy = findClosestMatch(raw);
      if (fuzzy) {
        if (fuzzy.type === 'era') {
          setT(yearToT(fuzzy.data.inicio), true);
          showEraBand(fuzzy.data);
        } else {
          clearEraBand();
          setT(yearToT(fuzzy.data.year), true);
        }
        yearInput.value = fuzzy.type === 'era' ? fuzzy.data.nombre : fuzzy.data.evento;
        yearClearBtn.hidden = false;
      } else {
        // Definitivamente no hay nada
        yearInput.classList.add('year-jump__input--error');
        setTimeout(() => yearInput.classList.remove('year-jump__input--error'), 420);
        return;
      }
    }
  }
  yearInput.blur();
});

/* ================================================================
   LANDING PAGE: WIDGET, QUICK STARTS y TEMAS
   ================================================================ */
const landingView = document.getElementById('landingView');
const appView = document.getElementById('appView');

function enterApp() {
  appView.hidden = false;
  requestAnimationFrame(() => {
    landingView.classList.add('is-hidden');
    appView.style.opacity = '1';
  });
}
document.getElementById('enterAppBtn').addEventListener('click', enterApp);
document.getElementById('backToLandingBtn').addEventListener('click', () => {
  landingView.classList.remove('is-hidden');
  appView.hidden = true;
  closeErasPanel();
});

// Quick Starts
document.querySelectorAll('.quick-starts__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const jumpTarget = btn.dataset.jump;
    
    // Simular que el usuario escribió eso en el buscador y lo envió
    yearInput.value = jumpTarget;
    yearJumpForm.dispatchEvent(new Event('submit'));
    enterApp();
  });
});

// Widget Interactivo en Landing
const scaleWidgetBtns = document.querySelectorAll('.scale-widget__btn');
const scaleWidgetFill = document.getElementById('scaleWidgetFill');
scaleWidgetBtns.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    scaleWidgetBtns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    scaleWidgetFill.style.width = btn.dataset.scale + '%';
  });
});

// Tema Oscuro/Claro
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}
const savedTheme = localStorage.getItem('escala-tiempo-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
applyTheme(savedTheme);
themeToggle.addEventListener('click', () => {
  const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('escala-tiempo-theme', next);
});

/* ================================================================
   AJUSTES Y MULTI-IDIOMA (i18n)
   ================================================================ */
const settingsPanel = document.getElementById('settingsPanel');
const appSettingsToggle = document.getElementById('appSettingsToggle');
const settingsPanelClose = document.getElementById('settingsPanelClose');

function openSettingsPanel() { settingsPanel.hidden = false; }
function closeSettingsPanel() { settingsPanel.hidden = true; }

appSettingsToggle.addEventListener('click', openSettingsPanel);
settingsPanelClose.addEventListener('click', closeSettingsPanel);

let currentLang = localStorage.getItem('escala-tiempo-lang') || 'es';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('escala-tiempo-lang', lang);
  htmlEl.lang = lang;

  EVENTS = lang === 'en' ? EVENTS_EN : EVENTS_ES;
  ERAS = lang === 'en' ? ERAS_EN : ERAS_ES;

  // Actualizar textos HTML estáticos
  document.querySelectorAll(`[data-i18n-${lang}]`).forEach(el => {
    el.innerHTML = el.getAttribute(`data-i18n-${lang}`);
  });
  document.querySelectorAll(`[data-i18n-${lang}-placeholder]`).forEach(el => {
    el.placeholder = el.getAttribute(`data-i18n-${lang}-placeholder`);
  });

  if (window.lucide) {
    lucide.createIcons();
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
  });

  // Re-renderizar todo
  renderEventNodes();
  renderEraChips();
  renderSliderTicks();
  setT(currentT, true);
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

/* ================================================================
   INICIALIZACIÓN
   ================================================================ */
setLanguage(currentLang);
const savedOrientation = localStorage.getItem('escala-tiempo-orientation');
if (savedOrientation) { orientation = savedOrientation; htmlEl.setAttribute('data-orientation', orientation); }

renderEventNodes();
// --- ARRANQUE ---
renderSliderTicks();
renderEraChips();
setT(0, false);
setTimeout(() => document.body.classList.add('is-ready'), 50);

if (window.lucide) {
  lucide.createIcons();
}
