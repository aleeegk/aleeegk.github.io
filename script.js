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
  let bc = ' a.C.';
  let locale = 'es-ES';
  if (lang === 'en') { bc = ' BC'; locale = 'en-US'; }
  else if (lang === 'fr') { bc = ' av. J.-C.'; locale = 'fr-FR'; }
  else if (lang === 'it') { bc = ' a.C.'; locale = 'it-IT'; }
  else if (lang === 'ca') { bc = ' a.C.'; locale = 'ca-ES'; }

  if (year < 0) {
    const abs = Math.abs(year);
    if (abs >= 1000000000) {
      let unit = ' mil M';
      if (lang === 'en') unit = ' B';
      else if (lang === 'fr') unit = ' Mld';
      else if (lang === 'it') unit = ' mld';
      else if (lang === 'ca') unit = ' mil M';
      return (abs / 1000000000).toFixed(abs % 1000000000 === 0 ? 0 : 2) + unit + bc;
    }
    if (abs >= 1000000) return (abs / 1000000).toFixed(abs % 1000000 === 0 ? 0 : 1) + ' M' + bc;
    if (abs >= 1000) return abs.toLocaleString(locale) + bc;
    return abs + bc;
  }
  if (year === 0) {
    if (lang === 'en') return 'Year 0';
    if (lang === 'fr') return 'Année 0';
    if (lang === 'it') return 'Anno 0';
    if (lang === 'ca') return 'Any 0';
    return 'Año 0';
  }
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
  { year: 2012, evento: 'Descubrimiento del bosón de Higgs', datoCurioso: 'Peter Higgs predijo su existencia en 1964, casi 50 años antes de confirmarse.', cat: 'historia', contexto: 'Es una partícula subatómica que explica por qué las demás partículas tienen masa; sin ella, la materia tal como la conocemos no existiría.' },
  { year: 2007, evento: 'Se presenta el iPhone', datoCurioso: 'Steve Jobs lo describió como "un iPod, un teléfono e Internet".', cat: 'historia' },
  { year: 2001, evento: 'Atentados del 11 de septiembre', datoCurioso: 'Las Torres Gemelas tardaron 7 años en construirse y 102 minutos en caer.', cat: 'historia' },

  // --- Siglo XX ---
  { year: 1991, evento: 'Disolución de la Unión Soviética', datoCurioso: 'La URSS se disolvió oficialmente el día de Navidad de 1991.', cat: 'historia' },
  { year: 1989, evento: 'Caída del Muro de Berlín', datoCurioso: 'Cayó por un error de comunicación en una rueda de prensa.', cat: 'historia' },
  { year: 1986, evento: 'Desastre de Chernóbil', datoCurioso: 'La zona de exclusión de 30 km sigue deshabitada y se ha convertido en refugio de fauna silvestre.', cat: 'historia' },
  { year: 1977, evento: 'Se lanza la sonda Voyager 1', datoCurioso: 'Sigue enviando datos desde el espacio interestelar a más de 24.000 millones de km.', cat: 'geologia' },
  { year: 1969, evento: 'Llegada a la Luna', datoCurioso: 'El ordenador del Apolo 11 tenía menos potencia que una calculadora actual.', cat: 'geologia' },
  { year: 1961, evento: 'Yuri Gagarin en el espacio', datoCurioso: 'El vuelo duró solo 108 minutos y dio una sola órbita a la Tierra.', cat: 'historia' },
  { year: 1953, evento: 'Estructura del ADN', datoCurioso: 'La foto clave (Foto 51) fue tomada por Rosalind Franklin.', cat: 'biologia', contexto: 'Es la molécula que contiene las instrucciones genéticas necesarias para el desarrollo y funcionamiento de todos los seres vivos.' },
  { year: 1945, evento: 'Fin de la Segunda Guerra Mundial', datoCurioso: 'Ese mismo año se fundó la ONU, con 51 países miembros.', cat: 'historia' },
  { year: 1939, evento: 'Inicio Segunda Guerra Mundial', datoCurioso: 'El conflicto más mortífero de la historia: entre 70 y 85 millones de muertos.', cat: 'historia' },
  { year: 1928, evento: 'Descubrimiento de la penicilina', datoCurioso: 'Alexander Fleming lo encontró por accidente en un cultivo olvidado.', cat: 'biologia', contexto: 'Fue el primer antibiótico eficaz de la historia, capaz de curar infecciones bacterianas antes mortales.' },
  { year: 1914, evento: 'Inicio Primera Guerra Mundial', datoCurioso: 'El asesinato de un archiduque desencadenó un conflicto entre 30 naciones.', cat: 'historia' },
  { year: 1903, evento: 'Primer vuelo (hermanos Wright)', datoCurioso: 'Duró solo 12 segundos y recorrió 37 metros.', cat: 'historia' },

  // --- Siglo XIX ---
  { year: 1889, evento: 'Torre Eiffel', datoCurioso: 'Se construyó como entrada temporal para la Exposición Universal de París.', cat: 'historia' },
  { year: 1876, evento: 'Teléfono', datoCurioso: 'Elisha Gray presentó una patente similar el mismo día, solo unas horas después.', cat: 'historia' },
  { year: 1869, evento: 'Tabla periódica de Mendeléyev', datoCurioso: 'Predijo la existencia de elementos aún no descubiertos y acertó.', cat: 'historia', contexto: 'Es un sistema para clasificar y organizar todos los elementos químicos según sus propiedades y masa atómica.' },
  { year: 1859, evento: 'Publicación de "El origen de las especies"', datoCurioso: 'Se agotó el primer día de venta.', cat: 'biologia', contexto: 'Obra donde Darwin expuso la teoría de la evolución por selección natural de las especies.' },
  { year: 1804, evento: 'Napoleón emperador', datoCurioso: 'Se coronó a sí mismo, quitando la corona de las manos del Papa.', cat: 'historia' },

  // --- Siglos XVI a XVIII ---
  { year: 1789, evento: 'Revolución Francesa', datoCurioso: 'El calendario revolucionario llegó a tener semanas de 10 días.', cat: 'historia' },
  { year: 1776, evento: 'Independencia de EEUU', datoCurioso: 'Jefferson tardó 17 días en escribir la Declaración.', cat: 'historia' },
  { year: 1687, evento: 'Leyes de Newton', datoCurioso: 'En "Principia" formula la ley de la gravitación universal.', cat: 'geologia', contexto: 'Principios físicos que describen el movimiento de los objetos y la fuerza de gravedad que gobierna el universo.' },
  { year: 1608, evento: 'Telescopio', datoCurioso: 'Galileo lo mejoró un año después y lo apuntó al cielo.', cat: 'historia' },
  { year: 1543, evento: 'Revolución Copernicana', datoCurioso: 'El libro afirmando que la Tierra gira alrededor del Sol se publicó el año de su muerte.', cat: 'geologia', contexto: 'Demostró que la Tierra y los demás planetas giran alrededor del Sol y no al revés.' },
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

const EVENTS_FR = [
  // --- XXIe siècle ---
  { year: 2024, evento: 'Essor de l\'IA générative', datoCurioso: 'ChatGPT a atteint 100 millions d\'utilisateurs en seulement 2 mois.', cat: 'historia' },
  { year: 2020, evento: 'Pandémie de COVID-19', datoCurioso: 'L\'OMS l\'a déclarée pandémie mondiale le 11 mars 2020.', cat: 'biologia' },
  { year: 2012, evento: 'Découverte du boson de Higgs', datoCurioso: 'Peter Higgs avait prédit son existence en 1964, près de 50 ans avant sa confirmation.', cat: 'historia' },
  { year: 2007, evento: 'Présentation de l\'iPhone', datoCurioso: 'Steve Jobs l\'a décrit comme « un iPod, un téléphone et Internet ».', cat: 'historia' },
  { year: 2001, evento: 'Attentats du 11 septembre', datoCurioso: 'Les tours jumelles ont mis 7 ans à être construites et 102 minutes à s\'effondrer.', cat: 'historia' },
  // --- XXe siècle ---
  { year: 1991, evento: 'Dissolution de l\'Union soviétique', datoCurioso: 'L\'URSS s\'est officiellement dissoute le jour de Noël 1991.', cat: 'historia' },
  { year: 1989, evento: 'Chute du mur de Berlin', datoCurioso: 'Il est tombé à cause d\'une erreur de communication lors d\'une conférence de presse.', cat: 'historia' },
  { year: 1986, evento: 'Catastrophe de Tchernobyl', datoCurioso: 'La zone d\'exclusion de 30 km reste inhabitée et est devenue un refuge pour la faune.', cat: 'historia' },
  { year: 1977, evento: 'Lancement de la sonde Voyager 1', datoCurioso: 'Elle continue d\'envoyer des données depuis l\'espace interstellaire, à plus de 24 milliards de km.', cat: 'geologia' },
  { year: 1969, evento: 'Alunissage', datoCurioso: 'L\'ordinateur d\'Apollo 11 avait moins de puissance qu\'une calculatrice moderne.', cat: 'geologia' },
  { year: 1961, evento: 'Youri Gagarine dans l\'espace', datoCurioso: 'Le vol n\'a duré que 108 minutes et a effectué une seule orbite autour de la Terre.', cat: 'historia' },
  { year: 1953, evento: 'Structure de l\'ADN', datoCurioso: 'La photo clé (Photo 51) a été prise par Rosalind Franklin.', cat: 'biologia' },
  { year: 1945, evento: 'Fin de la Seconde Guerre mondiale', datoCurioso: 'L\'ONU a été fondée la même année, avec 51 pays membres.', cat: 'historia' },
  { year: 1939, evento: 'Début de la Seconde Guerre mondiale', datoCurioso: 'Le conflit le plus meurtrier de l\'histoire : entre 70 et 85 millions de morts.', cat: 'historia' },
  { year: 1928, evento: 'Découverte de la pénicilline', datoCurioso: 'Alexander Fleming l\'a trouvée par accident dans une culture oubliée.', cat: 'biologia' },
  { year: 1914, evento: 'Début de la Première Guerre mondiale', datoCurioso: 'L\'assassinat d\'un archiduc a déclenché un conflit entre 30 nations.', cat: 'historia' },
  { year: 1903, evento: 'Premier vol (frères Wright)', datoCurioso: 'Il n\'a duré que 12 secondes et a couvert 37 mètres.', cat: 'historia' },
  // --- XIXe siècle ---
  { year: 1889, evento: 'Tour Eiffel', datoCurioso: 'Construite comme entrée temporaire pour l\'Exposition universelle de Paris.', cat: 'historia' },
  { year: 1876, evento: 'Téléphone', datoCurioso: 'Elisha Gray a déposé un brevet similaire le même jour, quelques heures plus tard.', cat: 'historia' },
  { year: 1869, evento: 'Tableau périodique de Mendeleïev', datoCurioso: 'Il a prédit l\'existence d\'éléments non encore découverts et avait raison.', cat: 'historia' },
  { year: 1859, evento: 'Publication de « L\'Origine des espèces »', datoCurioso: 'Épuisé dès le premier jour de vente.', cat: 'biologia' },
  { year: 1804, evento: 'Napoléon empereur', datoCurioso: 'Il s\'est couronné lui-même, prenant la couronne des mains du pape.', cat: 'historia' },
  // --- XVIe au XVIIIe siècle ---
  { year: 1789, evento: 'Révolution française', datoCurioso: 'Le calendrier révolutionnaire comportait des semaines de 10 jours.', cat: 'historia' },
  { year: 1776, evento: 'Indépendance des États-Unis', datoCurioso: 'Jefferson a mis 17 jours pour écrire la Déclaration.', cat: 'historia' },
  { year: 1687, evento: 'Lois de Newton', datoCurioso: 'Dans les « Principia », il formule la loi de la gravitation universelle.', cat: 'geologia' },
  { year: 1608, evento: 'Télescope', datoCurioso: 'Galilée l\'a amélioré un an plus tard et l\'a pointé vers le ciel.', cat: 'historia' },
  { year: 1543, evento: 'Révolution copernicienne', datoCurioso: 'Le livre affirmant que la Terre tourne autour du Soleil a été publié l\'année de sa mort.', cat: 'geologia' },
  { year: 1492, evento: 'Arrivée en Amérique', datoCurioso: 'Colomb est mort convaincu d\'avoir atteint l\'Asie.', cat: 'historia' },
  { year: 1440, evento: 'Imprimerie (Gutenberg)', datoCurioso: 'Sa première grande œuvre fut la Bible à 42 lignes.', cat: 'historia' },
  // --- Moyen Âge ---
  { year: 1347, evento: 'Peste noire', datoCurioso: 'Elle a tué un tiers de la population européenne en à peine six ans.', cat: 'biologia' },
  { year: 1325, evento: 'Fondation de Tenochtitlan', datoCurioso: 'Les Aztèques l\'ont fondée sur une île du lac Texcoco.', cat: 'historia' },
  { year: 1215, evento: 'Magna Carta', datoCurioso: 'Considérée comme l\'une des bases du constitutionnalisme moderne.', cat: 'historia' },
  { year: 1088, evento: 'Première université', datoCurioso: 'Bologne est née comme une association d\'étudiants, pas de professeurs.', cat: 'historia' },
  { year: 1066, evento: 'Bataille de Hastings', datoCurioso: 'Elle a changé la langue et la culture de l\'Angleterre à jamais.', cat: 'historia' },
  { year: 800, evento: 'Couronnement de Charlemagne', datoCurioso: 'Il a été couronné empereur le jour de Noël.', cat: 'historia' },
  { year: 622, evento: 'L\'Hégire', datoCurioso: 'Marque le début du calendrier islamique.', cat: 'historia' },
  { year: 476, evento: 'Chute de l\'Empire romain d\'Occident', datoCurioso: 'Le dernier empereur n\'avait que 16 ans.', cat: 'historia' },
  // --- Antiquité ---
  { year: 0, evento: 'An 1 du calendrier chrétien', datoCurioso: 'L\'« an 0 » n\'existe pas : on passe de l\'an 1 av. J.-C. à l\'an 1 apr. J.-C.', cat: 'historia' },
  { year: -44, evento: 'Assassinat de Jules César', datoCurioso: 'Il a reçu 23 coups de poignard au Sénat romain.', cat: 'historia' },
  { year: -221, evento: 'Unification de la Chine', datoCurioso: 'Le premier empereur a fait construire une armée de terre cuite pour sa tombe.', cat: 'historia' },
  { year: -331, evento: 'Alexandre le Grand conquiert la Perse', datoCurioso: 'Il a bâti un empire de la Grèce jusqu\'à l\'Inde.', cat: 'historia' },
  { year: -447, evento: 'Parthénon', datoCurioso: 'Ses colonnes sont légèrement courbées pour paraître parfaitement droites.', cat: 'historia' },
  { year: -509, evento: 'Naissance de la République romaine', datoCurioso: 'Elle a duré près de 500 ans avant de devenir un empire.', cat: 'historia' },
  { year: -563, evento: 'Naissance de Bouddha', datoCurioso: 'Il a renoncé à la vie de prince pour chercher l\'illumination.', cat: 'historia' },
  { year: -776, evento: 'Premiers Jeux olympiques', datoCurioso: 'Organisés à Olympie ; seuls les hommes concouraient, nus.', cat: 'historia' },
  { year: -1200, evento: 'Effondrement de l\'âge du bronze', datoCurioso: 'Plusieurs grandes civilisations méditerranéennes se sont effondrées presque simultanément.', cat: 'historia' },
  // --- Civilisations anciennes ---
  { year: -1750, evento: 'Code de Hammurabi', datoCurioso: 'C\'est l\'un des premiers ensembles de lois écrites de l\'histoire.', cat: 'historia' },
  { year: -2000, evento: 'Civilisation minoenne', datoCurioso: 'Ils ont construit Cnossos, avec un labyrinthe qui a inspiré le mythe du Minotaure.', cat: 'historia' },
  { year: -2560, evento: 'Grande Pyramide de Gizeh', datoCurioso: 'Quand elle a été construite, des mammouths laineux vivaient encore sur Terre.', cat: 'historia' },
  { year: -3200, evento: 'Première écriture', datoCurioso: 'Née en Sumèrie : le premier système d\'écriture cunéiforme connu.', cat: 'historia' },
  { year: -3300, evento: 'Âge du bronze', datoCurioso: 'Le bronze a permis des outils bien plus durs que la pierre.', cat: 'prehistoria' },
  { year: -4000, evento: 'Premières villes (Uruk)', datoCurioso: 'Uruk a compté jusqu\'à 80 000 habitants, une métropole pour son époque.', cat: 'historia' },
  // --- Préhistoire récente ---
  { year: -7000, evento: 'Premières poteries', datoCurioso: 'Elles apparaissent presque simultanément dans plusieurs régions du monde.', cat: 'prehistoria' },
  { year: -10000, evento: 'Début de l\'agriculture', datoCurioso: 'La Révolution néolithique fait passer l\'humanité du nomadisme à la sédentarité.', cat: 'prehistoria' },
  { year: -12000, evento: 'Fin de la dernière glaciation', datoCurioso: 'Le niveau de la mer était environ 120 mètres plus bas qu\'aujourd\'hui.', cat: 'geologia' },
  { year: -14000, evento: 'Domestication du chien', datoCurioso: 'C\'est le premier animal domestiqué par l\'être humain.', cat: 'biologia' },
  { year: -30000, evento: 'Peintures de Chauvet', datoCurioso: 'Les plus anciennes d\'Europe, avec des lions, rhinocéros et ours.', cat: 'prehistoria' },
  // --- Préhistoire profonde ---
  { year: -40000, evento: 'Premier art figuratif', datoCurioso: 'Peintures d\'animaux dans des grottes d\'Indonésie et d\'Europe.', cat: 'prehistoria' },
  { year: -70000, evento: 'Goulot d\'étranglement génétique', datoCurioso: 'Certaines études suggèrent que la population humaine est tombée à quelques milliers.', cat: 'biologia' },
  { year: -100000, evento: 'Homo sapiens hors d\'Afrique', datoCurioso: 'Les premières migrations atteignaient déjà le Proche-Orient.', cat: 'prehistoria' },
  { year: -200000, evento: 'Néandertaliens en Europe', datoCurioso: 'Ils ont coexisté avec Homo sapiens et se sont croisés génétiquement.', cat: 'prehistoria' },
  { year: -300000, evento: 'Apparition d\'Homo sapiens', datoCurioso: 'Les fossiles les plus anciens connus sont du Maroc.', cat: 'biologia' },
  { year: -400000, evento: 'Usage contrôlé du feu', datoCurioso: 'Il existe des preuves de foyers utilisés régulièrement à cette époque.', cat: 'prehistoria' },
  { year: -700000, evento: 'Ancêtre commun humain/néandertalien', datoCurioso: 'Les deux espèces ont coexisté et se sont croisées des milliers d\'années plus tard.', cat: 'biologia' },
  { year: -1000000, evento: 'Horizon d\'un million d\'années', datoCurioso: 'Le genre Homo s\'était déjà répandu dans une grande partie de l\'Afrique et de l\'Asie.', cat: 'prehistoria' },
  { year: -2000000, evento: 'Homo erectus', datoCurioso: 'Le premier à utiliser des outils en pierre de manière systématique.', cat: 'prehistoria' },
  { year: -3500000, evento: 'Australopithèque (Lucy)', datoCurioso: 'Son nom vient de la chanson des Beatles qu\'écoutaient les archéologues.', cat: 'biologia' },
  // --- Temps géologique profond ---
  { year: -2580000, evento: 'Début du Quaternaire', datoCurioso: 'Commence la période de glaciations répétées dans laquelle nous vivons encore.', cat: 'geologia' },
  { year: -6000000, evento: 'Séparation humains/chimpanzés', datoCurioso: 'C\'est l\'estimation génétique du dernier ancêtre commun.', cat: 'biologia' },
  { year: -23000000, evento: 'Début du Néogène', datoCurioso: 'Les grands singes se diversifient en Europe, en Asie et en Afrique.', cat: 'biologia' },
  { year: -66000000, evento: 'Extinction des dinosaures', datoCurioso: 'Un astéroïde d\'environ 10 km a frappé ce qui est aujourd\'hui le Mexique.', cat: 'geologia' },
  { year: -145000000, evento: 'Crétacé et premières fleurs', datoCurioso: 'Les premières plantes à fleurs apparaissent sur la planète.', cat: 'biologia' },
  { year: -200000000, evento: 'Rupture de la Pangée', datoCurioso: 'Le supercontinent s\'est fragmenté en ce qui constitue les continents actuels.', cat: 'geologia' },
  { year: -201000000, evento: 'Domination des dinosaures', datoCurioso: 'Après une extinction au Trias, les dinosaures dominent la Terre.', cat: 'biologia' },
  { year: -230000000, evento: 'Premiers dinosaures', datoCurioso: 'Ils étaient petits et bipèdes, très différents des géants ultérieurs.', cat: 'biologia' },
  { year: -252000000, evento: 'La Grande Extinction', datoCurioso: 'La plus grande extinction massive : près de 90 % des espèces marines ont disparu.', cat: 'geologia' },
  { year: -375000000, evento: 'Vertébrés sur terre', datoCurioso: 'Des poissons à nageoires lobées (comme Tiktaalik) commencent à sortir de l\'eau.', cat: 'biologia' },
  { year: -440000000, evento: 'Premières plantes terrestres', datoCurioso: 'Mousses et hépatiques ont été les premières à coloniser la terre.', cat: 'biologia' },
  { year: -530000000, evento: 'Premiers poissons', datoCurioso: 'Les premiers vertébrés apparaissent dans les mers du Cambrien.', cat: 'biologia' },
  { year: -541000000, evento: 'Explosion cambrienne', datoCurioso: 'En quelques millions d\'années, la plupart des grands groupes animaux émergent.', cat: 'biologia' },
  { year: -2500000000, evento: 'Grande Oxydation', datoCurioso: 'Les cyanobactéries ont rempli l\'atmosphère d\'oxygène, changeant la Terre.', cat: 'geologia' },
  { year: -3700000000, evento: 'Premiers indices de vie', datoCurioso: 'Ce sont les traces les plus anciennes de vie microbienne connues.', cat: 'biologia' },
  { year: -4000000000, evento: 'Formation des océans', datoCurioso: 'L\'eau est arrivée sur Terre par des astéroïdes et des comètes.', cat: 'geologia' },
  { year: -4600000000, evento: 'Formation de la Terre', datoCurioso: 'Elle s\'est formée à partir du disque de poussière et de gaz entourant le jeune Soleil.', cat: 'geologia' },
  // --- Nouveaux événements ---
  { year: -2400000, evento: 'Apparition du genre Homo', datoCurioso: 'Homo habilis est le premier à fabriquer systématiquement des outils en pierre.', cat: 'prehistoria' },
  { year: -1900000, evento: 'Homo erectus sort d\'Afrique', datoCurioso: 'Première espèce humaine à parcourir de si longues distances, atteignant l\'Asie.', cat: 'prehistoria' },
  { year: -430000, evento: 'Fossiles de Néandertal à Atapuerca', datoCurioso: 'Trouvés dans la Sima de los Huesos (Espagne), un site unique au monde.', cat: 'prehistoria' },
  { year: -170000, evento: '« Ève mitochondriale » estimée', datoCurioso: 'L\'ancêtre commune la plus récente de tous les humains vivants en ligne maternelle.', cat: 'biologia' },
  { year: -74000, evento: 'Éruption du supervolcan Toba', datoCurioso: 'Certaines études suggèrent qu\'elle a réduit drastiquement la population humaine mondiale.', cat: 'geologia' },
  { year: -50000, evento: 'Premiers instruments de musique', datoCurioso: 'Flûtes sculptées dans des os d\'oiseaux et de l\'ivoire de mammouth.', cat: 'prehistoria' },
  { year: -30000, evento: 'Dernière population néandertalienne', datoCurioso: 'Ils se sont éteints peu après avoir coexisté des milliers d\'années avec Homo sapiens.', cat: 'prehistoria' },
  { year: -20000, evento: 'Maximum glaciaire', datoCurioso: 'Une grande partie de l\'Europe et de l\'Amérique du Nord était couverte d\'épaisses couches de glace.', cat: 'geologia' },
  { year: -17000, evento: 'Peintures de Lascaux', datoCurioso: 'Découvertes par hasard en 1940, grâce à un chien tombé dans la grotte.', cat: 'prehistoria' },
  { year: -9500, evento: 'Göbekli Tepe', datoCurioso: 'Le plus ancien temple monumental connu, construit avant l\'agriculture.', cat: 'historia' },
  { year: -5500, evento: 'Invention de la roue', datoCurioso: 'D\'abord utilisée pour la poterie, pas pour le transport.', cat: 'historia' },
  // --- Civilisations et Moyen Âge ---
  { year: -3000, evento: 'Civilisation de la vallée de l\'Indus', datoCurioso: 'Ses villes avaient des systèmes d\'égouts plus avancés que beaucoup de villes médiévales.', cat: 'historia' },
  { year: -1600, evento: 'Dynastie Shang en Chine', datoCurioso: 'Elle a laissé les premiers textes chinois écrits, gravés sur des os d\'oracle.', cat: 'historia' },
  { year: -1200, evento: 'Civilisation olmèque', datoCurioso: 'La « culture mère » de la Mésoamérique ; elle a sculpté d\'énormes têtes de pierre.', cat: 'historia' },
  { year: -563, evento: 'Naissance de Bouddha', datoCurioso: 'Son enseignement a donné naissance à l\'une des religions les plus pratiquées au monde.', cat: 'historia' },
  { year: -268, evento: 'Empereur Ashoka (Inde)', datoCurioso: 'Après une guerre sanglante, il s\'est converti au bouddhisme et a renoncé aux conquêtes.', cat: 'historia' },
  { year: 100, evento: 'Apogée de Teotihuacan', datoCurioso: 'Elle a compté plus de 100 000 habitants, l\'une des plus grandes villes du monde de son époque.', cat: 'historia' },
  { year: 868, evento: 'Premier livre imprimé connu', datoCurioso: 'Le Sūtra du Diamant, imprimé en Chine avec des blocs de bois.', cat: 'historia' },
  { year: 1206, evento: 'Gengis Khan fonde l\'Empire mongol', datoCurioso: 'Il est devenu le plus grand empire terrestre contigu de l\'histoire.', cat: 'historia' },
  { year: 1324, evento: 'Pèlerinage de Mansa Moussa à La Mecque', datoCurioso: 'Il a distribué tant d\'or en chemin qu\'il en a fait baisser le cours en Égypte pendant des années.', cat: 'historia' },
  // --- Époque moderne et contemporaine ---
  { year: 1521, evento: 'Chute de l\'Empire aztèque', datoCurioso: 'Une alliance de forces espagnoles et de peuples indigènes rivaux a scellé la conquête.', cat: 'historia' },
  { year: 1804, evento: 'Indépendance d\'Haïti', datoCurioso: 'La première république née d\'une révolte de personnes réduites en esclavage.', cat: 'historia' },
  { year: 1885, evento: 'Conférence de Berlin', datoCurioso: 'Les puissances européennes se sont partagé l\'Afrique sur une carte sans participation africaine.', cat: 'historia' },
  { year: 1903, evento: 'Premier vol (frères Wright)', datoCurioso: 'Il n\'a duré que 12 secondes et a couvert moins que la longueur d\'un avion moderne.', cat: 'historia' },
  { year: 1917, evento: 'Révolution russe', datoCurioso: 'Elle a mis fin à des siècles de pouvoir tsariste en quelques mois.', cat: 'historia' },
  { year: 1947, evento: 'Indépendance de l\'Inde', datoCurioso: 'Accompagnée d\'une partition qui a déplacé des millions de personnes.', cat: 'historia' },
  { year: 1957, evento: 'Lancement du Spoutnik', datoCurioso: 'Le premier objet fabriqué par l\'homme à orbiter autour de la Terre.', cat: 'historia' },
  { year: 1994, evento: 'Fin de l\'apartheid en Afrique du Sud', datoCurioso: 'Nelson Mandela, emprisonné 27 ans, a été élu président la même année.', cat: 'historia' },
].sort((a, b) => b.year - a.year);

const EVENTS_IT = [
  // --- XXI secolo ---
  { year: 2024, evento: 'Ascesa dell\'IA generativa', datoCurioso: 'ChatGPT ha raggiunto 100 milioni di utenti in soli 2 mesi.', cat: 'historia' },
  { year: 2020, evento: 'Pandemia di COVID-19', datoCurioso: 'L\'OMS l\'ha dichiarata pandemia globale l\'11 marzo 2020.', cat: 'biologia' },
  { year: 2012, evento: 'Scoperta del bosone di Higgs', datoCurioso: 'Peter Higgs ne aveva predetto l\'esistenza nel 1964, quasi 50 anni prima della conferma.', cat: 'historia' },
  { year: 2007, evento: 'Presentazione dell\'iPhone', datoCurioso: 'Steve Jobs lo descrisse come «un iPod, un telefono e Internet».', cat: 'historia' },
  { year: 2001, evento: 'Attentati dell\'11 settembre', datoCurioso: 'Le Torri Gemelle hanno richiesto 7 anni per essere costruite e 102 minuti per crollare.', cat: 'historia' },
  // --- XX secolo ---
  { year: 1991, evento: 'Dissoluzione dell\'Unione Sovietica', datoCurioso: 'L\'URSS si è ufficialmente dissolta il giorno di Natale del 1991.', cat: 'historia' },
  { year: 1989, evento: 'Caduta del Muro di Berlino', datoCurioso: 'È caduto a causa di un errore di comunicazione durante una conferenza stampa.', cat: 'historia' },
  { year: 1986, evento: 'Disastro di Chernobyl', datoCurioso: 'La zona di esclusione di 30 km resta disabitata ed è diventata un rifugio per la fauna selvatica.', cat: 'historia' },
  { year: 1977, evento: 'Lancio della sonda Voyager 1', datoCurioso: 'Continua a inviare dati dallo spazio interstellare, a oltre 24 miliardi di km.', cat: 'geologia' },
  { year: 1969, evento: 'Allunaggio', datoCurioso: 'Il computer dell\'Apollo 11 aveva meno potenza di una calcolatrice moderna.', cat: 'geologia' },
  { year: 1961, evento: 'Jurij Gagarin nello spazio', datoCurioso: 'Il volo è durato solo 108 minuti e ha completato una singola orbita intorno alla Terra.', cat: 'historia' },
  { year: 1953, evento: 'Struttura del DNA', datoCurioso: 'La foto chiave (Foto 51) fu scattata da Rosalind Franklin.', cat: 'biologia' },
  { year: 1945, evento: 'Fine della Seconda guerra mondiale', datoCurioso: 'Quello stesso anno fu fondata l\'ONU, con 51 paesi membri.', cat: 'historia' },
  { year: 1939, evento: 'Inizio della Seconda guerra mondiale', datoCurioso: 'Il conflitto più letale della storia: tra 70 e 85 milioni di morti.', cat: 'historia' },
  { year: 1928, evento: 'Scoperta della penicillina', datoCurioso: 'Alexander Fleming la trovò per caso in una coltura dimenticata.', cat: 'biologia' },
  { year: 1914, evento: 'Inizio della Prima guerra mondiale', datoCurioso: 'L\'assassinio di un arciduca scatenò un conflitto tra 30 nazioni.', cat: 'historia' },
  { year: 1903, evento: 'Primo volo (fratelli Wright)', datoCurioso: 'Durò solo 12 secondi e coprì 37 metri.', cat: 'historia' },
  // --- XIX secolo ---
  { year: 1889, evento: 'Torre Eiffel', datoCurioso: 'Costruita come ingresso temporaneo per l\'Esposizione universale di Parigi.', cat: 'historia' },
  { year: 1876, evento: 'Telefono', datoCurioso: 'Elisha Gray presentò un brevetto simile lo stesso giorno, poche ore dopo.', cat: 'historia' },
  { year: 1869, evento: 'Tavola periodica di Mendeleev', datoCurioso: 'Predisse l\'esistenza di elementi non ancora scoperti e ci azzeccò.', cat: 'historia' },
  { year: 1859, evento: 'Pubblicazione de «L\'origine delle specie»', datoCurioso: 'Esaurito il primo giorno di vendita.', cat: 'biologia' },
  { year: 1804, evento: 'Napoleone imperatore', datoCurioso: 'Si incoronò da solo, togliendo la corona dalle mani del papa.', cat: 'historia' },
  // --- XVI-XVIII secolo ---
  { year: 1789, evento: 'Rivoluzione francese', datoCurioso: 'Il calendario rivoluzionario aveva settimane di 10 giorni.', cat: 'historia' },
  { year: 1776, evento: 'Indipendenza degli Stati Uniti', datoCurioso: 'Jefferson impiegò 17 giorni per scrivere la Dichiarazione.', cat: 'historia' },
  { year: 1687, evento: 'Leggi di Newton', datoCurioso: 'Nei «Principia» formula la legge della gravitazione universale.', cat: 'geologia' },
  { year: 1608, evento: 'Telescopio', datoCurioso: 'Galileo lo migliorò un anno dopo e lo puntò verso il cielo.', cat: 'historia' },
  { year: 1543, evento: 'Rivoluzione copernicana', datoCurioso: 'Il libro che affermava che la Terra ruota intorno al Sole fu pubblicato l\'anno della sua morte.', cat: 'geologia' },
  { year: 1492, evento: 'Arrivo in America', datoCurioso: 'Colombo morì convinto di aver raggiunto l\'Asia.', cat: 'historia' },
  { year: 1440, evento: 'Stampa (Gutenberg)', datoCurioso: 'La sua prima grande opera fu la Bibbia a 42 righe.', cat: 'historia' },
  // --- Medioevo ---
  { year: 1347, evento: 'Peste nera', datoCurioso: 'Uccise un terzo della popolazione europea in appena sei anni.', cat: 'biologia' },
  { year: 1325, evento: 'Fondazione di Tenochtitlan', datoCurioso: 'Gli Aztechi la fondarono su un\'isola nel lago Texcoco.', cat: 'historia' },
  { year: 1215, evento: 'Magna Carta', datoCurioso: 'Considerata una delle basi del costituzionalismo moderno.', cat: 'historia' },
  { year: 1088, evento: 'Prima università', datoCurioso: 'Bologna nacque come un\'associazione di studenti, non di professori.', cat: 'historia' },
  { year: 1066, evento: 'Battaglia di Hastings', datoCurioso: 'Cambiò la lingua e la cultura dell\'Inghilterra per sempre.', cat: 'historia' },
  { year: 800, evento: 'Incoronazione di Carlo Magno', datoCurioso: 'Fu incoronato imperatore il giorno di Natale.', cat: 'historia' },
  { year: 622, evento: 'L\'Egira', datoCurioso: 'Segna l\'inizio del calendario islamico.', cat: 'historia' },
  { year: 476, evento: 'Caduta dell\'Impero romano d\'Occidente', datoCurioso: 'L\'ultimo imperatore aveva solo 16 anni.', cat: 'historia' },
  // --- Antichità ---
  { year: 0, evento: 'Anno 1 del calendario cristiano', datoCurioso: 'L\'«anno 0» non esiste: si passa dall\'1 a.C. all\'1 d.C.', cat: 'historia' },
  { year: -44, evento: 'Assassinio di Giulio Cesare', datoCurioso: 'Ricevette 23 pugnalate nel Senato romano.', cat: 'historia' },
  { year: -221, evento: 'Unificazione della Cina', datoCurioso: 'Il primo imperatore fece costruire un esercito di terracotta per la sua tomba.', cat: 'historia' },
  { year: -331, evento: 'Alessandro Magno conquista la Persia', datoCurioso: 'Costruì un impero dalla Grecia all\'India.', cat: 'historia' },
  { year: -447, evento: 'Partenone', datoCurioso: 'Le sue colonne sono leggermente curve per apparire perfettamente dritte.', cat: 'historia' },
  { year: -509, evento: 'Nascita della Repubblica romana', datoCurioso: 'Durò quasi 500 anni prima di diventare un impero.', cat: 'historia' },
  { year: -563, evento: 'Nascita di Buddha', datoCurioso: 'Rinunciò alla vita da principe per cercare l\'illuminazione.', cat: 'historia' },
  { year: -776, evento: 'Primi Giochi olimpici', datoCurioso: 'Si svolgevano a Olimpia; gareggiavano solo uomini, nudi.', cat: 'historia' },
  { year: -1200, evento: 'Crollo dell\'età del bronzo', datoCurioso: 'Diverse grandi civiltà del Mediterraneo crollarono quasi contemporaneamente.', cat: 'historia' },
  // --- Civiltà antiche ---
  { year: -1750, evento: 'Codice di Hammurabi', datoCurioso: 'È uno dei primi insiemi di leggi scritte della storia.', cat: 'historia' },
  { year: -2000, evento: 'Civiltà minoica', datoCurioso: 'Costruirono Cnosso, con un labirinto che ispirò il mito del Minotauro.', cat: 'historia' },
  { year: -2560, evento: 'Grande Piramide di Giza', datoCurioso: 'Quando fu costruita, i mammut lanosi vivevano ancora sulla Terra.', cat: 'historia' },
  { year: -3200, evento: 'Prima scrittura', datoCurioso: 'Nata in Sumeria: il primo sistema di scrittura cuneiforme conosciuto.', cat: 'historia' },
  { year: -3300, evento: 'Età del bronzo', datoCurioso: 'Il bronzo ha permesso strumenti molto più duri della pietra.', cat: 'prehistoria' },
  { year: -4000, evento: 'Prime città (Uruk)', datoCurioso: 'Uruk arrivò a contare 80.000 abitanti, una metropoli per la sua epoca.', cat: 'historia' },
  // --- Preistoria recente ---
  { year: -7000, evento: 'Prime ceramiche', datoCurioso: 'Appaiono quasi simultaneamente in diverse regioni del mondo.', cat: 'prehistoria' },
  { year: -10000, evento: 'Inizio dell\'agricoltura', datoCurioso: 'La Rivoluzione neolitica segna il passaggio dell\'umanità da nomade a sedentaria.', cat: 'prehistoria' },
  { year: -12000, evento: 'Fine dell\'ultima glaciazione', datoCurioso: 'Il livello del mare era circa 120 metri più basso di oggi.', cat: 'geologia' },
  { year: -14000, evento: 'Addomesticamento del cane', datoCurioso: 'È il primo animale addomesticato dall\'essere umano.', cat: 'biologia' },
  { year: -30000, evento: 'Pitture di Chauvet', datoCurioso: 'Le più antiche d\'Europa, con leoni, rinoceronti e orsi.', cat: 'prehistoria' },
  // --- Preistoria profonda ---
  { year: -40000, evento: 'Prima arte figurativa', datoCurioso: 'Pitture di animali nelle grotte dell\'Indonesia e dell\'Europa.', cat: 'prehistoria' },
  { year: -70000, evento: 'Collo di bottiglia genetico', datoCurioso: 'Alcuni studi suggeriscono che la popolazione umana si ridusse a poche migliaia.', cat: 'biologia' },
  { year: -100000, evento: 'Homo sapiens fuori dall\'Africa', datoCurioso: 'Le prime migrazioni raggiungevano già il Vicino Oriente.', cat: 'prehistoria' },
  { year: -200000, evento: 'Neanderthal in Europa', datoCurioso: 'Coesistettero con Homo sapiens e si incrociarono geneticamente.', cat: 'prehistoria' },
  { year: -300000, evento: 'Comparsa di Homo sapiens', datoCurioso: 'I fossili più antichi conosciuti sono del Marocco.', cat: 'biologia' },
  { year: -400000, evento: 'Uso controllato del fuoco', datoCurioso: 'Esistono prove di focolari usati regolarmente in questo periodo.', cat: 'prehistoria' },
  { year: -700000, evento: 'Antenato comune umano/neanderthal', datoCurioso: 'Entrambe le specie coesistettero e si incrociarono migliaia di anni dopo.', cat: 'biologia' },
  { year: -1000000, evento: 'Orizzonte di un milione di anni', datoCurioso: 'Il genere Homo si era già diffuso in gran parte dell\'Africa e dell\'Asia.', cat: 'prehistoria' },
  { year: -2000000, evento: 'Homo erectus', datoCurioso: 'Il primo a utilizzare sistematicamente strumenti in pietra.', cat: 'prehistoria' },
  { year: -3500000, evento: 'Australopiteco (Lucy)', datoCurioso: 'Il suo nome viene dalla canzone dei Beatles che ascoltavano gli archeologi.', cat: 'biologia' },
  // --- Tempo geologico profondo ---
  { year: -2580000, evento: 'Inizio del Quaternario', datoCurioso: 'Inizia il periodo di glaciazioni ripetute in cui viviamo ancora oggi.', cat: 'geologia' },
  { year: -6000000, evento: 'Separazione umani/scimpanzé', datoCurioso: 'È la stima genetica dell\'ultimo antenato comune.', cat: 'biologia' },
  { year: -23000000, evento: 'Inizio del Neogene', datoCurioso: 'Le grandi scimmie si diversificano in Europa, Asia e Africa.', cat: 'biologia' },
  { year: -66000000, evento: 'Estinzione dei dinosauri', datoCurioso: 'Un asteroide di circa 10 km ha colpito quello che oggi è il Messico.', cat: 'geologia' },
  { year: -145000000, evento: 'Cretaceo e primi fiori', datoCurioso: 'Le prime piante con fiori compaiono sul pianeta.', cat: 'biologia' },
  { year: -200000000, evento: 'Rottura della Pangea', datoCurioso: 'Il supercontinente si è frammentato in quelli che oggi sono i continenti attuali.', cat: 'geologia' },
  { year: -201000000, evento: 'Dominio dei dinosauri', datoCurioso: 'Dopo un\'estinzione nel Triassico, i dinosauri dominano la Terra.', cat: 'biologia' },
  { year: -230000000, evento: 'Primi dinosauri', datoCurioso: 'Erano piccoli e bipedi, molto diversi dai giganti successivi.', cat: 'biologia' },
  { year: -252000000, evento: 'La Grande Moria', datoCurioso: 'La più grande estinzione di massa: morì circa il 90% delle specie marine.', cat: 'geologia' },
  { year: -375000000, evento: 'Vertebrati sulla terraferma', datoCurioso: 'Pesci con pinne robuste (come Tiktaalik) cominciano a uscire dall\'acqua.', cat: 'biologia' },
  { year: -440000000, evento: 'Prime piante terrestri', datoCurioso: 'Muschi e epatiche furono i primi a colonizzare la terraferma.', cat: 'biologia' },
  { year: -530000000, evento: 'Primi pesci', datoCurioso: 'I primi vertebrati compaiono nei mari del Cambriano.', cat: 'biologia' },
  { year: -541000000, evento: 'Esplosione cambriana', datoCurioso: 'In pochi milioni di anni emergono la maggior parte dei grandi gruppi animali.', cat: 'biologia' },
  { year: -2500000000, evento: 'Grande Ossidazione', datoCurioso: 'I cianobatteri riempirono l\'atmosfera di ossigeno, cambiando la Terra.', cat: 'geologia' },
  { year: -3700000000, evento: 'Primi indizi di vita', datoCurioso: 'Sono le tracce più antiche di vita microbica conosciute.', cat: 'biologia' },
  { year: -4000000000, evento: 'Formazione degli oceani', datoCurioso: 'L\'acqua è arrivata sulla Terra attraverso asteroidi e comete.', cat: 'geologia' },
  { year: -4600000000, evento: 'Formazione della Terra', datoCurioso: 'Si è formata dal disco di polvere e gas che circondava il giovane Sole.', cat: 'geologia' },
  // --- Nuovi eventi ---
  { year: -2400000, evento: 'Comparsa del genere Homo', datoCurioso: 'Homo habilis è il primo a fabbricare sistematicamente strumenti in pietra.', cat: 'prehistoria' },
  { year: -1900000, evento: 'Homo erectus esce dall\'Africa', datoCurioso: 'Prima specie umana a percorrere distanze così grandi, raggiungendo l\'Asia.', cat: 'prehistoria' },
  { year: -430000, evento: 'Fossili di Neanderthal ad Atapuerca', datoCurioso: 'Trovati nella Sima de los Huesos (Spagna), un sito unico al mondo.', cat: 'prehistoria' },
  { year: -170000, evento: '«Eva mitocondriale» stimata', datoCurioso: 'L\'antenata comune più recente di tutti gli esseri umani viventi per linea materna.', cat: 'biologia' },
  { year: -74000, evento: 'Eruzione del supervulcano Toba', datoCurioso: 'Alcuni studi suggeriscono che ha ridotto drasticamente la popolazione umana mondiale.', cat: 'geologia' },
  { year: -50000, evento: 'Primi strumenti musicali', datoCurioso: 'Flauti intagliati in ossa di uccello e avorio di mammut.', cat: 'prehistoria' },
  { year: -30000, evento: 'Ultima popolazione neanderthaliana', datoCurioso: 'Si estinsero poco dopo aver coesistito per millenni con l\'Homo sapiens.', cat: 'prehistoria' },
  { year: -20000, evento: 'Massimo glaciale', datoCurioso: 'Gran parte dell\'Europa e del Nord America era coperta da spesse coltri di ghiaccio.', cat: 'geologia' },
  { year: -17000, evento: 'Pitture di Lascaux', datoCurioso: 'Scoperte per caso nel 1940, grazie a un cane caduto nella grotta.', cat: 'prehistoria' },
  { year: -9500, evento: 'Göbekli Tepe', datoCurioso: 'Il tempio monumentale più antico conosciuto, costruito prima dell\'agricoltura.', cat: 'historia' },
  { year: -5500, evento: 'Invenzione della ruota', datoCurioso: 'Usata per la prima volta per la ceramica, non per il trasporto.', cat: 'historia' },
  // --- Civiltà e Medioevo ---
  { year: -3000, evento: 'Civiltà della valle dell\'Indo', datoCurioso: 'Le sue città avevano sistemi fognari più avanzati di molte città medievali.', cat: 'historia' },
  { year: -1600, evento: 'Dinastia Shang in Cina', datoCurioso: 'Ha lasciato i primi testi scritti cinesi, incisi su ossa oracolari.', cat: 'historia' },
  { year: -1200, evento: 'Civiltà olmeca', datoCurioso: 'La «cultura madre» della Mesoamerica; scolpì enormi teste di pietra.', cat: 'historia' },
  { year: -563, evento: 'Nascita di Buddha', datoCurioso: 'Il suo insegnamento ha dato origine a una delle religioni più praticate al mondo.', cat: 'historia' },
  { year: -268, evento: 'Imperatore Ashoka (India)', datoCurioso: 'Dopo una guerra sanguinosa, si convertì al buddhismo e rinunciò a nuove conquiste.', cat: 'historia' },
  { year: 100, evento: 'Apogeo di Teotihuacan', datoCurioso: 'Raggiunse oltre 100.000 abitanti, una delle città più grandi del mondo dell\'epoca.', cat: 'historia' },
  { year: 868, evento: 'Primo libro stampato conosciuto', datoCurioso: 'Il Sutra del Diamante, stampato in Cina con blocchi di legno.', cat: 'historia' },
  { year: 1206, evento: 'Gengis Khan fonda l\'Impero mongolo', datoCurioso: 'Divenne il più grande impero terrestre contiguo della storia.', cat: 'historia' },
  { year: 1324, evento: 'Pellegrinaggio di Mansa Musa alla Mecca', datoCurioso: 'Distribuì tanto oro lungo il cammino da svalutarne il prezzo in Egitto per anni.', cat: 'historia' },
  // --- Epoca moderna e contemporanea ---
  { year: 1521, evento: 'Caduta dell\'Impero azteco', datoCurioso: 'Un\'alleanza di forze spagnole e popoli indigeni rivali ha sancito la conquista.', cat: 'historia' },
  { year: 1804, evento: 'Indipendenza di Haiti', datoCurioso: 'La prima repubblica nata da una rivolta di persone schiavizzate.', cat: 'historia' },
  { year: 1885, evento: 'Conferenza di Berlino', datoCurioso: 'Le potenze europee si sono spartite l\'Africa su una mappa senza partecipazione africana.', cat: 'historia' },
  { year: 1903, evento: 'Primo volo (fratelli Wright)', datoCurioso: 'Durò solo 12 secondi e coprì meno della lunghezza di un aereo moderno.', cat: 'historia' },
  { year: 1917, evento: 'Rivoluzione russa', datoCurioso: 'Pose fine a secoli di governo zarista in pochi mesi.', cat: 'historia' },
  { year: 1947, evento: 'Indipendenza dell\'India', datoCurioso: 'Accompagnata da una partizione che ha sfollato milioni di persone.', cat: 'historia' },
  { year: 1957, evento: 'Lancio dello Sputnik', datoCurioso: 'Il primo oggetto fabbricato dall\'uomo a orbitare intorno alla Terra.', cat: 'historia' },
  { year: 1994, evento: 'Fine dell\'apartheid in Sudafrica', datoCurioso: 'Nelson Mandela, imprigionato per 27 anni, fu eletto presidente quello stesso anno.', cat: 'historia' },
].sort((a, b) => b.year - a.year);

const EVENTS_CA = [
  // --- Segle XXI ---
  { year: 2024, evento: 'Auge de la IA generativa', datoCurioso: 'ChatGPT va assolir 100 milions d\'usuaris en només 2 mesos.', cat: 'historia' },
  { year: 2020, evento: 'Pandèmia de COVID-19', datoCurioso: 'L\'OMS la va declarar pandèmia global l\'11 de març de 2020.', cat: 'biologia' },
  { year: 2012, evento: 'Descobriment del bosó de Higgs', datoCurioso: 'Peter Higgs en va predir l\'existència el 1964, gairebé 50 anys abans de confirmar-se.', cat: 'historia' },
  { year: 2007, evento: 'Es presenta l\'iPhone', datoCurioso: 'Steve Jobs el va descriure com «un iPod, un telèfon i Internet».', cat: 'historia' },
  { year: 2001, evento: 'Atemptats de l\'11 de setembre', datoCurioso: 'Les Torres Bessones van trigar 7 anys a construir-se i 102 minuts a caure.', cat: 'historia' },
  // --- Segle XX ---
  { year: 1991, evento: 'Dissolució de la Unió Soviètica', datoCurioso: 'L\'URSS es va dissoldre oficialment el dia de Nadal de 1991.', cat: 'historia' },
  { year: 1989, evento: 'Caiguda del Mur de Berlín', datoCurioso: 'Va caure per un error de comunicació en una roda de premsa.', cat: 'historia' },
  { year: 1986, evento: 'Desastre de Txernòbil', datoCurioso: 'La zona d\'exclusió de 30 km segueix deshabitada i s\'ha convertit en refugi de fauna silvestre.', cat: 'historia' },
  { year: 1977, evento: 'Es llança la sonda Voyager 1', datoCurioso: 'Continua enviant dades des de l\'espai interestelar a més de 24.000 milions de km.', cat: 'geologia' },
  { year: 1969, evento: 'Arribada a la Lluna', datoCurioso: 'L\'ordinador de l\'Apol·lo 11 tenia menys potència que una calculadora actual.', cat: 'geologia' },
  { year: 1961, evento: 'Iuri Gagarin a l\'espai', datoCurioso: 'El vol va durar només 108 minuts i va fer una sola òrbita a la Terra.', cat: 'historia' },
  { year: 1953, evento: 'Estructura de l\'ADN', datoCurioso: 'La foto clau (Foto 51) va ser feta per Rosalind Franklin.', cat: 'biologia' },
  { year: 1945, evento: 'Fi de la Segona Guerra Mundial', datoCurioso: 'Aquell mateix any es va fundar l\'ONU, amb 51 països membres.', cat: 'historia' },
  { year: 1939, evento: 'Inici de la Segona Guerra Mundial', datoCurioso: 'El conflicte més mortífer de la història: entre 70 i 85 milions de morts.', cat: 'historia' },
  { year: 1928, evento: 'Descobriment de la penicil·lina', datoCurioso: 'Alexander Fleming la va trobar per accident en un cultiu oblidat.', cat: 'biologia' },
  { year: 1914, evento: 'Inici de la Primera Guerra Mundial', datoCurioso: 'L\'assassinat d\'un arxiduc va desencadenar un conflicte entre 30 nacions.', cat: 'historia' },
  { year: 1903, evento: 'Primer vol (germans Wright)', datoCurioso: 'Va durar només 12 segons i va recórrer 37 metres.', cat: 'historia' },
  // --- Segle XIX ---
  { year: 1889, evento: 'Torre Eiffel', datoCurioso: 'Es va construir com a entrada temporal per a l\'Exposició Universal de París.', cat: 'historia' },
  { year: 1876, evento: 'Telèfon', datoCurioso: 'Elisha Gray va presentar una patent similar el mateix dia, només unes hores després.', cat: 'historia' },
  { year: 1869, evento: 'Taula periòdica de Mendeléiev', datoCurioso: 'Va predir l\'existència d\'elements encara no descoberts i va encertar.', cat: 'historia' },
  { year: 1859, evento: 'Publicació de «L\'origen de les espècies»', datoCurioso: 'Es va esgotar el primer dia de venda.', cat: 'biologia' },
  { year: 1804, evento: 'Napoleó emperador', datoCurioso: 'Es va coronar a si mateix, prenent la corona de les mans del papa.', cat: 'historia' },
  // --- Segles XVI a XVIII ---
  { year: 1789, evento: 'Revolució Francesa', datoCurioso: 'El calendari revolucionari va arribar a tenir setmanes de 10 dies.', cat: 'historia' },
  { year: 1776, evento: 'Independència dels EUA', datoCurioso: 'Jefferson va trigar 17 dies a escriure la Declaració.', cat: 'historia' },
  { year: 1687, evento: 'Lleis de Newton', datoCurioso: 'Als «Principia» formula la llei de la gravitació universal.', cat: 'geologia' },
  { year: 1608, evento: 'Telescopi', datoCurioso: 'Galileu el va millorar un any després i el va apuntar al cel.', cat: 'historia' },
  { year: 1543, evento: 'Revolució Copernicana', datoCurioso: 'El llibre que afirmava que la Terra gira al voltant del Sol es va publicar l\'any de la seva mort.', cat: 'geologia' },
  { year: 1492, evento: 'Arribada a Amèrica', datoCurioso: 'Colom va morir convençut que havia arribat a Àsia.', cat: 'historia' },
  { year: 1440, evento: 'Impremta (Gutenberg)', datoCurioso: 'La seva primera gran obra va ser la Bíblia de 42 línies.', cat: 'historia' },
  // --- Edat Mitjana ---
  { year: 1347, evento: 'Pesta Negra', datoCurioso: 'Va matar un terç de la població europea en tot just sis anys.', cat: 'biologia' },
  { year: 1325, evento: 'Fundació de Tenochtitlan', datoCurioso: 'Els asteques la van fundar sobre una illa al llac Texcoco.', cat: 'historia' },
  { year: 1215, evento: 'Carta Magna', datoCurioso: 'Considerada una de les bases del constitucionalisme modern.', cat: 'historia' },
  { year: 1088, evento: 'Primera universitat', datoCurioso: 'Bolonya neix com una agrupació d\'estudiants, no de professors.', cat: 'historia' },
  { year: 1066, evento: 'Batalla de Hastings', datoCurioso: 'Va canviar l\'idioma i la cultura d\'Anglaterra per sempre.', cat: 'historia' },
  { year: 800, evento: 'Coronació de Carlemany', datoCurioso: 'Va ser coronat emperador el dia de Nadal.', cat: 'historia' },
  { year: 622, evento: 'L\'Hègira', datoCurioso: 'Marca l\'inici del calendari islàmic.', cat: 'historia' },
  { year: 476, evento: 'Caiguda de Roma d\'Occident', datoCurioso: 'L\'últim emperador tenia apenas 16 anys.', cat: 'historia' },
  // --- Antiguitat ---
  { year: 0, evento: 'Any 1 del calendari cristià', datoCurioso: 'L\'«any 0» no existeix: es passa de l\'1 aC a l\'1 dC.', cat: 'historia' },
  { year: -44, evento: 'Assassinat de Juli Cèsar', datoCurioso: 'Va rebre 23 punyalades al Senat romà.', cat: 'historia' },
  { year: -221, evento: 'Unificació de la Xina', datoCurioso: 'El primer emperador va manar construir un exèrcit de terracota per a la seva tomba.', cat: 'historia' },
  { year: -331, evento: 'Alexandre el Gran conquesta Pèrsia', datoCurioso: 'Va construir un imperi des de Grècia fins a l\'Índia.', cat: 'historia' },
  { year: -447, evento: 'Partenó', datoCurioso: 'Les seves columnes es corben lleugerament per semblar perfectament rectes.', cat: 'historia' },
  { year: -509, evento: 'Neix la República Romana', datoCurioso: 'Va durar gairebé 500 anys abans de convertir-se en un imperi.', cat: 'historia' },
  { year: -563, evento: 'Naixement de Buda', datoCurioso: 'Va renunciar a la vida de príncep per buscar la il·luminació.', cat: 'historia' },
  { year: -776, evento: 'Primers Jocs Olímpics', datoCurioso: 'Se celebraven a Olímpia i només competien homes, nus.', cat: 'historia' },
  { year: -1200, evento: 'Col·lapse de l\'Edat del Bronze', datoCurioso: 'Diverses grans civilitzacions del Mediterrani van caure gairebé alhora.', cat: 'historia' },
  // --- Civilitzacions antigues ---
  { year: -1750, evento: 'Codi d\'Hammurabi', datoCurioso: 'És un dels primers conjunts de lleis escrites de la història.', cat: 'historia' },
  { year: -2000, evento: 'Civilització minoica', datoCurioso: 'Van construir Cnossos, amb un laberint que va inspirar el mite del Minotaure.', cat: 'historia' },
  { year: -2560, evento: 'Gran Piràmide de Guiza', datoCurioso: 'Quan es va construir, encara quedaven mamuts llanuts vius a la Terra.', cat: 'historia' },
  { year: -3200, evento: 'Primera escriptura', datoCurioso: 'Neix a Sumèria: és el primer sistema d\'escriptura cuneïforme conegut.', cat: 'historia' },
  { year: -3300, evento: 'Edat del Bronze', datoCurioso: 'El bronze va permetre eines molt més dures que la pedra.', cat: 'prehistoria' },
  { year: -4000, evento: 'Primeres ciutats (Uruk)', datoCurioso: 'Uruk va arribar a tenir fins a 80.000 habitants, una metròpoli per a la seva època.', cat: 'historia' },
  // --- Prehistòria recent ---
  { year: -7000, evento: 'Primeres ceràmiques', datoCurioso: 'Apareixen gairebé al mateix temps en diverses regions del món.', cat: 'prehistoria' },
  { year: -10000, evento: 'Inici de l\'agricultura', datoCurioso: 'La Revolució Neolítica canvia la humanitat de nòmada a sedentària.', cat: 'prehistoria' },
  { year: -12000, evento: 'Fi de l\'última glaciació', datoCurioso: 'El nivell del mar era uns 120 metres més baix que avui.', cat: 'geologia' },
  { year: -14000, evento: 'Domesticació del gos', datoCurioso: 'És el primer animal domesticat per l\'ésser humà.', cat: 'biologia' },
  { year: -30000, evento: 'Pintures de Chauvet', datoCurioso: 'Són les més antigues d\'Europa, amb lleons, rinoceronts i ossos.', cat: 'prehistoria' },
  // --- Prehistòria profunda ---
  { year: -40000, evento: 'Primer art figuratiu', datoCurioso: 'Pintures d\'animals en coves d\'Indonèsia i Europa.', cat: 'prehistoria' },
  { year: -70000, evento: 'Coll d\'ampolla genètic', datoCurioso: 'Alguns estudis suggereixen que la població humana va baixar a uns pocs milers.', cat: 'biologia' },
  { year: -100000, evento: 'Homo sapiens fora d\'Àfrica', datoCurioso: 'Les primeres migracions ja arribaven fins a l\'Orient Pròxim.', cat: 'prehistoria' },
  { year: -200000, evento: 'Neandertals a Europa', datoCurioso: 'Van conviure amb Homo sapiens i es van creuar genèticament.', cat: 'prehistoria' },
  { year: -300000, evento: 'Aparició de l\'Homo sapiens', datoCurioso: 'Els fòssils més antics coneguts són del Marroc.', cat: 'biologia' },
  { year: -400000, evento: 'Ús controlat del foc', datoCurioso: 'Hi ha evidència de llars usades de forma regular en aquesta època.', cat: 'prehistoria' },
  { year: -700000, evento: 'Avantpassat comú humà/neandertal', datoCurioso: 'Ambdues espècies van conviure i es van creuar milers d\'anys després.', cat: 'biologia' },
  { year: -1000000, evento: 'Horitzó d\'un milió d\'anys', datoCurioso: 'El gènere Homo ja s\'havia estès per bona part d\'Àfrica i Àsia.', cat: 'prehistoria' },
  { year: -2000000, evento: 'Homo erectus', datoCurioso: 'Va ser el primer a utilitzar eines de pedra de forma sistemàtica.', cat: 'prehistoria' },
  { year: -3500000, evento: 'Australopithecus (Lucy)', datoCurioso: 'El seu nom ve de la cançó dels Beatles que escoltaven els arqueòlegs.', cat: 'biologia' },
  // --- Temps geològic profund ---
  { year: -2580000, evento: 'Inici del Quaternari', datoCurioso: 'Comença el període de glaciacions repetides en què encara ens trobem avui.', cat: 'geologia' },
  { year: -6000000, evento: 'Separació humans/ximpanzés', datoCurioso: 'És l\'estimació genètica de l\'últim avantpassat comú.', cat: 'biologia' },
  { year: -23000000, evento: 'Inici del Neogen', datoCurioso: 'Els grans simis es diversifiquen per Europa, Àsia i Àfrica.', cat: 'biologia' },
  { year: -66000000, evento: 'Extinció dels dinosaures', datoCurioso: 'Un asteroide d\'uns 10 km va colpejar el que avui és Mèxic.', cat: 'geologia' },
  { year: -145000000, evento: 'Cretaci i primeres flors', datoCurioso: 'Apareixen les primeres plantes amb flors al planeta.', cat: 'biologia' },
  { year: -200000000, evento: 'Ruptura de Pangea', datoCurioso: 'El supercontinent es va fragmentar en el que avui són els continents actuals.', cat: 'geologia' },
  { year: -201000000, evento: 'Domini dels dinosaures', datoCurioso: 'Després d\'una extinció al Triàsic, els dinosaures dominen la Terra.', cat: 'biologia' },
  { year: -230000000, evento: 'Primers dinosaures', datoCurioso: 'Eren petits i bípedes, molt diferents dels gegants posteriors.', cat: 'biologia' },
  { year: -252000000, evento: 'La Gran Mortandat', datoCurioso: 'La major extinció massiva: va morir prop del 90% de les espècies marines.', cat: 'geologia' },
  { year: -375000000, evento: 'Vertebrats a terra', datoCurioso: 'Peixos amb aletes robustes (com Tiktaalik) comencen a sortir de l\'aigua.', cat: 'biologia' },
  { year: -440000000, evento: 'Primeres plantes terrestres', datoCurioso: 'Molses i hepàtiques van ser les primeres a colonitzar la terra.', cat: 'biologia' },
  { year: -530000000, evento: 'Primers peixos', datoCurioso: 'Els primers vertebrats apareixen als mars del Cambrià.', cat: 'biologia' },
  { year: -541000000, evento: 'Explosió Cambriana', datoCurioso: 'En pocs milions d\'anys sorgeix la majoria dels grans grups animals.', cat: 'biologia' },
  { year: -2500000000, evento: 'Gran Oxidació', datoCurioso: 'Els cianobacteris van omplir l\'atmosfera d\'oxigen, canviant la Terra.', cat: 'geologia' },
  { year: -3700000000, evento: 'Primers indicis de vida', datoCurioso: 'Són els rastres més antics de vida microbiana que es coneixen.', cat: 'biologia' },
  { year: -4000000000, evento: 'Formació dels oceans', datoCurioso: 'L\'aigua va arribar a la Terra mitjançant asteroides i cometes.', cat: 'geologia' },
  { year: -4600000000, evento: 'Formació de la Terra', datoCurioso: 'Es va formar a partir del disc de pols i gas que envoltava el jove Sol.', cat: 'geologia' },
  // --- Nous esdeveniments ---
  { year: -2400000, evento: 'Apareix el gènere Homo', datoCurioso: 'Homo habilis és el primer a fabricar eines de pedra de forma sistemàtica.', cat: 'prehistoria' },
  { year: -1900000, evento: 'Homo erectus surt d\'Àfrica', datoCurioso: 'Va ser la primera espècie humana a recórrer distàncies tan llargues, arribant fins a Àsia.', cat: 'prehistoria' },
  { year: -430000, evento: 'Fòssils de neandertal a Atapuerca', datoCurioso: 'Es van trobar a la Sima de los Huesos (Espanya), un jaciment únic al món.', cat: 'prehistoria' },
  { year: -170000, evento: '«Eva mitocondrial» estimada', datoCurioso: 'És l\'avantpassada comuna més recent de la qual descendeixen tots els humans vius per línia materna.', cat: 'biologia' },
  { year: -74000, evento: 'Erupció del supervolcà Toba', datoCurioso: 'Alguns estudis suggereixen que va reduir dràsticament la població humana mundial.', cat: 'geologia' },
  { year: -50000, evento: 'Primers instruments musicals', datoCurioso: 'Flautes tallades en ossos d\'au i ivori de mamut.', cat: 'prehistoria' },
  { year: -30000, evento: 'Última població de neandertals', datoCurioso: 'Es van extingir poc després de conviure milers d\'anys amb l\'Homo sapiens.', cat: 'prehistoria' },
  { year: -20000, evento: 'Punt màxim de l\'última glaciació', datoCurioso: 'Gran part d\'Europa i Nord-amèrica estava coberta per gruixudes capes de gel.', cat: 'geologia' },
  { year: -17000, evento: 'Pintures de Lascaux', datoCurioso: 'Es van descobrir per casualitat el 1940, gràcies a un gos que va caure a la cova.', cat: 'prehistoria' },
  { year: -9500, evento: 'Göbekli Tepe', datoCurioso: 'El temple monumental més antic conegut, construït abans de l\'agricultura.', cat: 'historia' },
  { year: -5500, evento: 'Invenció de la roda', datoCurioso: 'Es va fer servir primer per a la ceràmica, no per al transport.', cat: 'historia' },
  // --- Civilitzacions i Edat Mitjana ---
  { year: -3000, evento: 'Civilització de la vall de l\'Indus', datoCurioso: 'Les seves ciutats tenien sistemes de clavegueram més avançats que moltes ciutats medievals.', cat: 'historia' },
  { year: -1600, evento: 'Dinastia Shang a la Xina', datoCurioso: 'Va deixar els primers textos escrits xinesos, gravats en ossos oraculars.', cat: 'historia' },
  { year: -1200, evento: 'Civilització olmeca', datoCurioso: 'És la «cultura mare» de Mesoamèrica; va tallar enormes caps de pedra.', cat: 'historia' },
  { year: -563, evento: 'Neix Buda', datoCurioso: 'El seu ensenyament va donar origen a una de les religions més practicades del món.', cat: 'historia' },
  { year: -268, evento: 'Emperador Ashoka (Índia)', datoCurioso: 'Després d\'una guerra sagnant, es va convertir al budisme i va renunciar a noves conquestes.', cat: 'historia' },
  { year: 100, evento: 'Auge de Teotihuacan', datoCurioso: 'Va arribar a tenir més de 100.000 habitants, una de les ciutats més grans del món en la seva època.', cat: 'historia' },
  { year: 868, evento: 'Primer llibre imprès conegut', datoCurioso: 'El Sutra del Diamant, imprès a la Xina amb blocs de fusta.', cat: 'historia' },
  { year: 1206, evento: 'Genguis Khan funda l\'Imperi mongol', datoCurioso: 'Va arribar a ser l\'imperi de territori continu més extens de la història.', cat: 'historia' },
  { year: 1324, evento: 'Pelegrinatge de Mansa Musa a la Meca', datoCurioso: 'Va repartir tant d\'or pel camí que en va devaluar el preu a Egipte durant anys.', cat: 'historia' },
  // --- Edat Moderna i Contemporània ---
  { year: 1521, evento: 'Caiguda de l\'Imperi asteca', datoCurioso: 'Una aliança de forces espanyoles i indígenes rivals dels asteques va segellar la conquesta.', cat: 'historia' },
  { year: 1804, evento: 'Independència d\'Haití', datoCurioso: 'La primera república nascuda d\'una revolta de persones esclavitzades.', cat: 'historia' },
  { year: 1885, evento: 'Conferència de Berlín', datoCurioso: 'Potències europees van repartir Àfrica en un mapa sense participació africana.', cat: 'historia' },
  { year: 1903, evento: 'Primer vol (germans Wright)', datoCurioso: 'Va durar només 12 segons i va recórrer menys que la llargada d\'un avió actual.', cat: 'historia' },
  { year: 1917, evento: 'Revolució Russa', datoCurioso: 'Va acabar amb segles de govern tsarista en qüestió de mesos.', cat: 'historia' },
  { year: 1947, evento: 'Independència de l\'Índia', datoCurioso: 'Va venir acompanyada d\'una partició que va desplaçar milions de persones.', cat: 'historia' },
  { year: 1957, evento: 'Llançament de l\'Sputnik', datoCurioso: 'Va ser el primer objecte fabricat per humans a orbitar la Terra.', cat: 'historia' },
  { year: 1994, evento: 'Fi de l\'apartheid a Sud-àfrica', datoCurioso: 'Nelson Mandela, pres 27 anys, va ser elegit president aquell mateix any.', cat: 'historia' },
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

const ERAS_FR = [
  // Ères géologiques
  { nombre: 'Hadéen', inicio: -4600000000, fin: -4000000000, tipo: 'geologica' },
  { nombre: 'Archéen', inicio: -4000000000, fin: -2500000000, tipo: 'geologica' },
  { nombre: 'Protérozoïque', inicio: -2500000000, fin: -541000000, tipo: 'geologica' },
  { nombre: 'Précambrien', inicio: -4600000000, fin: -541000000, tipo: 'geologica' },
  { nombre: 'Paléozoïque', inicio: -541000000, fin: -252000000, tipo: 'geologica' },
  { nombre: 'Cambrien', inicio: -541000000, fin: -485000000, tipo: 'geologica' },
  { nombre: 'Ordovicien', inicio: -485000000, fin: -444000000, tipo: 'geologica' },
  { nombre: 'Silurien', inicio: -444000000, fin: -419000000, tipo: 'geologica' },
  { nombre: 'Dévonien', inicio: -419000000, fin: -359000000, tipo: 'geologica' },
  { nombre: 'Carbonifère', inicio: -359000000, fin: -299000000, tipo: 'geologica' },
  { nombre: 'Permien', inicio: -299000000, fin: -252000000, tipo: 'geologica' },
  { nombre: 'Mésozoïque', inicio: -252000000, fin: -66000000, tipo: 'geologica' },
  { nombre: 'Trias', inicio: -252000000, fin: -201000000, tipo: 'geologica' },
  { nombre: 'Jurassique', inicio: -201000000, fin: -145000000, tipo: 'geologica' },
  { nombre: 'Crétacé', inicio: -145000000, fin: -66000000, tipo: 'geologica' },
  { nombre: 'Cénozoïque', inicio: -66000000, fin: CURRENT_YEAR, tipo: 'geologica' },
  { nombre: 'Paléogène', inicio: -66000000, fin: -23000000, tipo: 'geologica' },
  { nombre: 'Paléocène', inicio: -66000000, fin: -56000000, tipo: 'geologica' },
  { nombre: 'Éocène', inicio: -56000000, fin: -33900000, tipo: 'geologica' },
  { nombre: 'Oligocène', inicio: -33900000, fin: -23000000, tipo: 'geologica' },
  { nombre: 'Néogène', inicio: -23000000, fin: -2580000, tipo: 'geologica' },
  { nombre: 'Miocène', inicio: -23000000, fin: -5300000, tipo: 'geologica' },
  { nombre: 'Pliocène', inicio: -5300000, fin: -2580000, tipo: 'geologica' },
  { nombre: 'Quaternaire', inicio: -2580000, fin: CURRENT_YEAR, tipo: 'geologica' },
  { nombre: 'Pléistocène', inicio: -2580000, fin: -11700, tipo: 'geologica' },
  { nombre: 'Holocène', inicio: -11700, fin: CURRENT_YEAR, tipo: 'geologica' },
  // Âges historiques
  { nombre: 'Âge de la pierre', inicio: -3300000, fin: -3300, tipo: 'historica' },
  { nombre: 'Paléolithique', inicio: -3300000, fin: -10000, tipo: 'historica' },
  { nombre: 'Mésolithique', inicio: -10000, fin: -8000, tipo: 'historica' },
  { nombre: 'Néolithique', inicio: -8000, fin: -3300, tipo: 'historica' },
  { nombre: 'Âge du bronze', inicio: -3300, fin: -1200, tipo: 'historica' },
  { nombre: 'Âge du fer', inicio: -1200, fin: -1, tipo: 'historica' },
  { nombre: 'Antiquité', inicio: -3000, fin: 476, tipo: 'historica' },
  { nombre: 'Moyen Âge', inicio: 476, fin: 1492, tipo: 'historica' },
  { nombre: 'Époque moderne', inicio: 1492, fin: 1789, tipo: 'historica' },
  { nombre: 'Époque contemporaine', inicio: 1789, fin: CURRENT_YEAR, tipo: 'historica' },
];

const ERAS_IT = [
  // Ere geologiche
  { nombre: 'Adeano', inicio: -4600000000, fin: -4000000000, tipo: 'geologica' },
  { nombre: 'Archeano', inicio: -4000000000, fin: -2500000000, tipo: 'geologica' },
  { nombre: 'Proterozoico', inicio: -2500000000, fin: -541000000, tipo: 'geologica' },
  { nombre: 'Precambriano', inicio: -4600000000, fin: -541000000, tipo: 'geologica' },
  { nombre: 'Paleozoico', inicio: -541000000, fin: -252000000, tipo: 'geologica' },
  { nombre: 'Cambriano', inicio: -541000000, fin: -485000000, tipo: 'geologica' },
  { nombre: 'Ordoviciano', inicio: -485000000, fin: -444000000, tipo: 'geologica' },
  { nombre: 'Siluriano', inicio: -444000000, fin: -419000000, tipo: 'geologica' },
  { nombre: 'Devoniano', inicio: -419000000, fin: -359000000, tipo: 'geologica' },
  { nombre: 'Carbonifero', inicio: -359000000, fin: -299000000, tipo: 'geologica' },
  { nombre: 'Permiano', inicio: -299000000, fin: -252000000, tipo: 'geologica' },
  { nombre: 'Mesozoico', inicio: -252000000, fin: -66000000, tipo: 'geologica' },
  { nombre: 'Triassico', inicio: -252000000, fin: -201000000, tipo: 'geologica' },
  { nombre: 'Giurassico', inicio: -201000000, fin: -145000000, tipo: 'geologica' },
  { nombre: 'Cretaceo', inicio: -145000000, fin: -66000000, tipo: 'geologica' },
  { nombre: 'Cenozoico', inicio: -66000000, fin: CURRENT_YEAR, tipo: 'geologica' },
  { nombre: 'Paleogene', inicio: -66000000, fin: -23000000, tipo: 'geologica' },
  { nombre: 'Paleocene', inicio: -66000000, fin: -56000000, tipo: 'geologica' },
  { nombre: 'Eocene', inicio: -56000000, fin: -33900000, tipo: 'geologica' },
  { nombre: 'Oligocene', inicio: -33900000, fin: -23000000, tipo: 'geologica' },
  { nombre: 'Neogene', inicio: -23000000, fin: -2580000, tipo: 'geologica' },
  { nombre: 'Miocene', inicio: -23000000, fin: -5300000, tipo: 'geologica' },
  { nombre: 'Pliocene', inicio: -5300000, fin: -2580000, tipo: 'geologica' },
  { nombre: 'Quaternario', inicio: -2580000, fin: CURRENT_YEAR, tipo: 'geologica' },
  { nombre: 'Pleistocene', inicio: -2580000, fin: -11700, tipo: 'geologica' },
  { nombre: 'Olocene', inicio: -11700, fin: CURRENT_YEAR, tipo: 'geologica' },
  // Età storiche
  { nombre: 'Età della pietra', inicio: -3300000, fin: -3300, tipo: 'historica' },
  { nombre: 'Paleolitico', inicio: -3300000, fin: -10000, tipo: 'historica' },
  { nombre: 'Mesolitico', inicio: -10000, fin: -8000, tipo: 'historica' },
  { nombre: 'Neolitico', inicio: -8000, fin: -3300, tipo: 'historica' },
  { nombre: 'Età del bronzo', inicio: -3300, fin: -1200, tipo: 'historica' },
  { nombre: 'Età del ferro', inicio: -1200, fin: -1, tipo: 'historica' },
  { nombre: 'Età antica', inicio: -3000, fin: 476, tipo: 'historica' },
  { nombre: 'Medioevo', inicio: 476, fin: 1492, tipo: 'historica' },
  { nombre: 'Età moderna', inicio: 1492, fin: 1789, tipo: 'historica' },
  { nombre: 'Età contemporanea', inicio: 1789, fin: CURRENT_YEAR, tipo: 'historica' },
];

const ERAS_CA = [
  // Eres geològiques
  { nombre: 'Hàdic', inicio: -4600000000, fin: -4000000000, tipo: 'geologica' },
  { nombre: 'Arcaic', inicio: -4000000000, fin: -2500000000, tipo: 'geologica' },
  { nombre: 'Proterozoic', inicio: -2500000000, fin: -541000000, tipo: 'geologica' },
  { nombre: 'Precambrià', inicio: -4600000000, fin: -541000000, tipo: 'geologica' },
  { nombre: 'Paleozoic', inicio: -541000000, fin: -252000000, tipo: 'geologica' },
  { nombre: 'Cambrià', inicio: -541000000, fin: -485000000, tipo: 'geologica' },
  { nombre: 'Ordovicià', inicio: -485000000, fin: -444000000, tipo: 'geologica' },
  { nombre: 'Silurià', inicio: -444000000, fin: -419000000, tipo: 'geologica' },
  { nombre: 'Devonià', inicio: -419000000, fin: -359000000, tipo: 'geologica' },
  { nombre: 'Carbonífer', inicio: -359000000, fin: -299000000, tipo: 'geologica' },
  { nombre: 'Permià', inicio: -299000000, fin: -252000000, tipo: 'geologica' },
  { nombre: 'Mesozoic', inicio: -252000000, fin: -66000000, tipo: 'geologica' },
  { nombre: 'Triàsic', inicio: -252000000, fin: -201000000, tipo: 'geologica' },
  { nombre: 'Juràssic', inicio: -201000000, fin: -145000000, tipo: 'geologica' },
  { nombre: 'Cretaci', inicio: -145000000, fin: -66000000, tipo: 'geologica' },
  { nombre: 'Cenozoic', inicio: -66000000, fin: CURRENT_YEAR, tipo: 'geologica' },
  { nombre: 'Paleogen', inicio: -66000000, fin: -23000000, tipo: 'geologica' },
  { nombre: 'Paleocè', inicio: -66000000, fin: -56000000, tipo: 'geologica' },
  { nombre: 'Eocè', inicio: -56000000, fin: -33900000, tipo: 'geologica' },
  { nombre: 'Oligocè', inicio: -33900000, fin: -23000000, tipo: 'geologica' },
  { nombre: 'Neogen', inicio: -23000000, fin: -2580000, tipo: 'geologica' },
  { nombre: 'Miocè', inicio: -23000000, fin: -5300000, tipo: 'geologica' },
  { nombre: 'Pliocè', inicio: -5300000, fin: -2580000, tipo: 'geologica' },
  { nombre: 'Quaternari', inicio: -2580000, fin: CURRENT_YEAR, tipo: 'geologica' },
  { nombre: 'Pleistocè', inicio: -2580000, fin: -11700, tipo: 'geologica' },
  { nombre: 'Holocè', inicio: -11700, fin: CURRENT_YEAR, tipo: 'geologica' },
  // Edats històriques
  { nombre: 'Edat de Pedra', inicio: -3300000, fin: -3300, tipo: 'historica' },
  { nombre: 'Paleolític', inicio: -3300000, fin: -10000, tipo: 'historica' },
  { nombre: 'Mesolític', inicio: -10000, fin: -8000, tipo: 'historica' },
  { nombre: 'Neolític', inicio: -8000, fin: -3300, tipo: 'historica' },
  { nombre: 'Edat del Bronze', inicio: -3300, fin: -1200, tipo: 'historica' },
  { nombre: 'Edat del Ferro', inicio: -1200, fin: -1, tipo: 'historica' },
  { nombre: 'Edat Antiga', inicio: -3000, fin: 476, tipo: 'historica' },
  { nombre: 'Edat Mitjana', inicio: 476, fin: 1492, tipo: 'historica' },
  { nombre: 'Edat Moderna', inicio: 1492, fin: 1789, tipo: 'historica' },
  { nombre: 'Edat Contemporània', inicio: 1789, fin: CURRENT_YEAR, tipo: 'historica' },
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

const factContextEl = document.getElementById('factContext');

function showFact(ev) {
  factYearEl.textContent = formatYear(ev.year);
  factTitleEl.textContent = ev.evento;
  factTextEl.textContent = ev.datoCurioso;

  if (ev && ev.contexto) {
    const labels = {
      es: 'En pocas palabras:',
      en: 'In simple terms:',
      fr: 'En résumé :',
      it: 'In poche parole:',
      ca: 'En poques paraules:'
    };
    const label = labels[currentLang] || labels.es;
    factContextEl.innerHTML = `<span class="fact-card__context-label">${label}</span>${ev.contexto}`;
    factContextEl.hidden = false;
  } else {
    factContextEl.hidden = true;
  }

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

  const stageTitles = {
    es: 'Etapa Histórica/Geológica',
    en: 'Historical/Geological Stage',
    fr: 'Étape Historique/Géologique',
    it: 'Tappa Storica/Geologica',
    ca: 'Etapa Històrica/Geològica'
  };
  const presentText = {
    es: 'la actualidad',
    en: 'the present',
    fr: 'le présent',
    it: 'il presente',
    ca: "l'actualitat"
  };
  const startText = {
    es: 'Empieza aprox. en',
    en: 'Begins approx. in',
    fr: 'Commence environ en',
    it: 'Inizia circa nel',
    ca: 'Comença aprox. el'
  };
  const endText = {
    es: 'y termina en',
    en: 'and ends in',
    fr: 'et se termine en',
    it: 'e termina nel',
    ca: 'i acaba el'
  };

  const lang = currentLang || 'es';
  const header = stageTitles[lang] || stageTitles.es;
  const start = startText[lang] || startText.es;
  const end = endText[lang] || endText.es;
  const present = presentText[lang] || presentText.es;

  factYearEl.textContent = header;
  factTitleEl.textContent = era.nombre;
  factTextEl.textContent = `${start} ${formatYear(era.inicio)} ${end} ${era.fin === CURRENT_YEAR ? present : formatYear(era.fin)}.`;
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
   INTERACCIÓN BÁSICA (Deslizar con el dedo en Móvil/Tablet y Ratón en PC)
   ================================================================ */
let wasDraggingViewport = false;
let isViewportDragging = false;
let activeDragPointerId = null;
let startTouchPos = { x: 0, y: 0 };
let lastTouchPos = { x: 0, y: 0 };
let lastTouchTime = 0;
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

function getEventClientCoords(e) {
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  if (e.changedTouches && e.changedTouches.length > 0) {
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
}

function handleDragStart(e) {
  // Ignorar si se toca en botones, inputs, enlaces, dentro del panel de eras o la barra lateral
  if (e.target.closest('button, input, select, textarea, a, #erasPanel, #settingsPanel, #searchResultsModal, #sideControl, .fact-card__close')) {
    return;
  }

  stopInertia();
  isViewportDragging = true;
  wasDraggingViewport = false;

  const coords = getEventClientCoords(e);
  startTouchPos = { x: coords.x, y: coords.y };
  lastTouchPos = { x: coords.x, y: coords.y };
  lastTouchTime = performance.now();
  startT = currentT;
  velocityT = 0;

  if (e.type === 'pointerdown') {
    activeDragPointerId = e.pointerId;
    try { timelineViewport.setPointerCapture(e.pointerId); } catch (err) {}
  }
}

function handleDragMove(e) {
  if (!isViewportDragging) return;

  // Crucial para móvil y tablet: prevenir el scroll por defecto del navegador
  if (e.cancelable) {
    e.preventDefault();
  }

  const coords = getEventClientCoords(e);
  const dx = coords.x - startTouchPos.x;
  const dy = coords.y - startTouchPos.y;
  const totalDist = Math.hypot(dx, dy);

  if (totalDist > 6) {
    wasDraggingViewport = true;
  }

  const isHoriz = orientation === 'horizontal';
  const deltaPixels = isHoriz ? (startTouchPos.x - coords.x) : (startTouchPos.y - coords.y);
  const deltaT = deltaPixels / TRACK_SIZE;

  clearEraBand();
  setT(startT + deltaT, false);

  const now = performance.now();
  const dt = now - lastTouchTime;
  if (dt > 8) {
    const currentPos = isHoriz ? coords.x : coords.y;
    const prevPos = isHoriz ? lastTouchPos.x : lastTouchPos.y;
    const pDelta = prevPos - currentPos;
    const instVelocity = (pDelta / TRACK_SIZE) / (dt / 1000);
    velocityT = velocityT * 0.3 + instVelocity * 0.7;
    lastTouchPos = { x: coords.x, y: coords.y };
    lastTouchTime = now;
  }
}

function handleDragEnd(e) {
  if (!isViewportDragging) return;

  if (e.type === 'pointerup' || e.type === 'pointercancel') {
    if (activeDragPointerId !== null) {
      try { timelineViewport.releasePointerCapture(activeDragPointerId); } catch (err) {}
      activeDragPointerId = null;
    }
  }

  isViewportDragging = false;

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

// Escuchadores de eventos Pointer (Ratón / Pen)
timelineViewport.addEventListener('pointerdown', handleDragStart);
timelineViewport.addEventListener('pointermove', handleDragMove);
timelineViewport.addEventListener('pointerup', handleDragEnd);

// Escuchadores de eventos Touch Nativos (Móvil y Tablet iOS / Android)
timelineViewport.addEventListener('touchstart', handleDragStart, { passive: true });
timelineViewport.addEventListener('touchmove', handleDragMove, { passive: false });
timelineViewport.addEventListener('touchend', handleDragEnd, { passive: true });
timelineViewport.addEventListener('touchcancel', handleDragEnd, { passive: true });

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
    
    let desc = formatYear(res.data.year);
    if (isEra) {
      const eraTypeLabels = {
        es: { geologica: 'Era geológica', historica: 'Edad histórica' },
        en: { geologica: 'Geological era', historica: 'Historical age' },
        fr: { geologica: 'Ère géologique', historica: 'Âge historique' },
        it: { geologica: 'Era geologica', historica: 'Età storica' },
        ca: { geologica: 'Era geològica', historica: 'Edat històrica' }
      };
      const l = eraTypeLabels[currentLang] || eraTypeLabels.es;
      desc = l[res.data.tipo] || `Era ${res.data.tipo}`;
    }
    
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
const themeToggles = document.querySelectorAll('#themeToggle, #landingThemeToggle');
function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  themeToggles.forEach(toggle => {
    if (toggle) {
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
  });
}
const savedTheme = localStorage.getItem('escala-tiempo-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
applyTheme(savedTheme);
themeToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('escala-tiempo-theme', next);
  });
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

const landingLangToggle = document.getElementById('landingLangToggle');
const landingLangDropdown = document.getElementById('landingLangDropdown');

if (landingLangToggle && landingLangDropdown) {
  landingLangToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    landingLangDropdown.hidden = !landingLangDropdown.hidden;
  });

  document.querySelectorAll('.floating-lang-opt').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      setLanguage(opt.dataset.lang);
      landingLangDropdown.hidden = true;
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#landingLangWrapper')) {
      landingLangDropdown.hidden = true;
    }
  });
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('escala-tiempo-lang', lang);
  htmlEl.lang = lang;

  if (lang === 'en') {
    EVENTS = EVENTS_EN;
    ERAS = ERAS_EN;
  } else if (lang === 'fr') {
    EVENTS = EVENTS_FR;
    ERAS = ERAS_FR;
  } else if (lang === 'it') {
    EVENTS = EVENTS_IT;
    ERAS = ERAS_IT;
  } else if (lang === 'ca') {
    EVENTS = EVENTS_CA;
    ERAS = ERAS_CA;
  } else {
    EVENTS = EVENTS_ES;
    ERAS = ERAS_ES;
  }

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

  // Actualizar botones de idioma en Ajustes
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
  });

  // Actualizar selector flotante de idioma en la landing
  const landingLangCode = document.getElementById('landingLangCode');
  if (landingLangCode) {
    landingLangCode.textContent = lang.toUpperCase();
  }
  document.querySelectorAll('.floating-lang-opt').forEach(opt => {
    opt.classList.toggle('is-active', opt.dataset.lang === lang);
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

/* ================================================================
   MODO QUIZ
   ================================================================ */
const quizModal = document.getElementById('quizModal');
const quizToggle = document.getElementById('quizToggle');
const quizModalClose = document.getElementById('quizModalClose');
const quizModalCloseBackdrop = document.getElementById('quizModalCloseBackdrop');
const quizScoreCount = document.getElementById('quizScoreCount');
const quizQuestionText = document.getElementById('quizQuestionText');
const quizOptionsGrid = document.getElementById('quizOptionsGrid');
const quizExplanationBox = document.getElementById('quizExplanationBox');
const quizResultBadge = document.getElementById('quizResultBadge');
const quizExplanationText = document.getElementById('quizExplanationText');
const quizNextBtn = document.getElementById('quizNextBtn');

let quizScore = { correct: 0, total: 0 };
let currentQuizEvent = null;
let quizHasAnswered = false;

function openQuizModal() {
  quizScore = { correct: 0, total: 0 };
  updateQuizScore();
  loadNextQuizQuestion();
  quizModal.hidden = false;
}

function closeQuizModal() {
  quizModal.hidden = true;
}

function updateQuizScore() {
  if (quizScoreCount) {
    quizScoreCount.textContent = `${quizScore.correct}/${quizScore.total}`;
  }
}

function loadNextQuizQuestion() {
  quizHasAnswered = false;
  if (quizExplanationBox) quizExplanationBox.hidden = true;
  if (quizNextBtn) quizNextBtn.hidden = true;
  if (quizOptionsGrid) quizOptionsGrid.innerHTML = '';

  const activeEvents = EVENTS.filter(e => e.evento && typeof e.year === 'number');
  if (activeEvents.length < 4) return;

  currentQuizEvent = activeEvents[Math.floor(Math.random() * activeEvents.length)];

  const questionPrompts = {
    es: `¿En qué año ocurrió: "${currentQuizEvent.evento}"?`,
    en: `In which year did "${currentQuizEvent.evento}" occur?`,
    fr: `En quelle année a eu lieu : "${currentQuizEvent.evento}" ?`,
    it: `In quale anno è avvenuto: "${currentQuizEvent.evento}"?`,
    ca: `En quin any va ocórrer: "${currentQuizEvent.evento}"?`
  };

  if (quizQuestionText) {
    quizQuestionText.textContent = questionPrompts[currentLang] || questionPrompts.es;
  }

  // Obtener distractores de otros eventos
  const otherYears = Array.from(new Set(activeEvents.map(e => e.year)))
    .filter(y => y !== currentQuizEvent.year);

  // Mezclar distractores
  otherYears.sort(() => Math.random() - 0.5);
  const distractors = otherYears.slice(0, 3);
  const options = [currentQuizEvent.year, ...distractors];
  options.sort(() => Math.random() - 0.5);

  options.forEach(year => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.textContent = formatYear(year);
    btn.addEventListener('click', () => handleQuizAnswer(year, btn, currentQuizEvent.year));
    quizOptionsGrid.appendChild(btn);
  });
}

function handleQuizAnswer(selectedYear, selectedBtn, correctYear) {
  if (quizHasAnswered) return;
  quizHasAnswered = true;
  quizScore.total++;

  const isCorrect = selectedYear === correctYear;
  if (isCorrect) quizScore.correct++;
  updateQuizScore();

  document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === formatYear(correctYear)) {
      btn.classList.add('is-correct');
    }
  });

  if (!isCorrect) {
    selectedBtn.classList.add('is-wrong');
  }

  const badgeLabels = {
    es: { correct: '¡Correcto!', wrong: 'Incorrecto' },
    en: { correct: 'Correct!', wrong: 'Incorrect' },
    fr: { correct: 'Correct !', wrong: 'Incorrect' },
    it: { correct: 'Corretto!', wrong: 'Errato' },
    ca: { correct: 'Correcte!', wrong: 'Incorrecte' }
  };
  const b = badgeLabels[currentLang] || badgeLabels.es;

  if (quizResultBadge) {
    quizResultBadge.textContent = isCorrect ? b.correct : b.wrong;
    quizResultBadge.className = `quiz-explanation__badge ${isCorrect ? 'is-correct' : 'is-wrong'}`;
  }
  if (quizExplanationText) {
    quizExplanationText.textContent = currentQuizEvent.datoCurioso;
  }
  if (quizExplanationBox) quizExplanationBox.hidden = false;
  if (quizNextBtn) quizNextBtn.hidden = false;
}

if (quizToggle) quizToggle.addEventListener('click', openQuizModal);
if (quizModalClose) quizModalClose.addEventListener('click', closeQuizModal);
if (quizModalCloseBackdrop) quizModalCloseBackdrop.addEventListener('click', closeQuizModal);
if (quizNextBtn) quizNextBtn.addEventListener('click', loadNextQuizQuestion);

/* ================================================================
   REGISTRO PWA SERVICE WORKER Y BOTÓN DE DESCARGA
   ================================================================ */
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(err => {
      console.log('Error registrando ServiceWorker:', err);
    });
  });
}

const downloadAppBtn = document.getElementById('downloadAppBtn');
const downloadBtnText = document.getElementById('downloadBtnText');

if (downloadAppBtn) {
  downloadAppBtn.addEventListener('click', async () => {
    // 1. Si el navegador ofrece el prompt nativo de instalación, activarlo
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        deferredInstallPrompt = null;
      }
    }

    // 2. Guardar explícitamente en caché la aplicación completa
    if ('caches' in window) {
      try {
        const cache = await caches.open('escala-tiempo-v1');
        await cache.addAll([
          './',
          './index.html',
          './styles.css',
          './script.js',
          './manifest.json',
          './icon-192.png',
          './icon-512.png'
        ]);
      } catch (err) {
        console.log('Caché guardada parcialmente:', err);
      }
    }

    // 3. Feedback visual
    const downloadedText = {
      es: '✓ Página guardada para uso sin conexión',
      en: '✓ Page saved for offline use',
      fr: '✓ Page enregistrée hors-ligne',
      it: '✓ Pagina salvata per uso offline',
      ca: '✓ Pàgina desada per a ús offline'
    };
    if (downloadBtnText) {
      downloadBtnText.textContent = downloadedText[currentLang] || downloadedText.es;
    }
    downloadAppBtn.classList.add('is-downloaded');
  });
}

