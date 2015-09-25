domready(function () {

	var dictonary = [

		[
			'\\bhome\\b',
			['tuis']
		],
		[
			'\\bziekenhuis\\b',
			['takkedemies']
		],
		[
			'\\bcontact\\b',
			['ketak']
		],
		[
			'\\b(over)\\b',
			['ovâh']
		],
		[
			'\\b(koek|koeken)\\b',
			['scheerbak']
		],

		[
			'\\b(bericht)\\b',
			['berig']
		],
		[
			'\\b(expertise)\\b',
			['experties']
		],

		[
			'\\b(homo|homoseksueel|nicht|poot|relnicht|gay|homofiel)\\b',
			['gulpenruiker', 'klapbegonia', 'zadelsnuffelaar']
		],
		[
			'\\b(lijf|lichaam|romp)\\b',
			['lijer']
		],
		[
			'\\b(opschepper)\\b',
			['kanebraaier']
		],
		[
			'\\b(opscheppen)\\b',
			['kanebraaiú']
		],
		[
			'\\b(makkie|gemakkelijk|meevallertje|kinderwerk)\\b',
			['kasie']
		],
		[
			'\\b(kopje)\\b',
			['bakkie']
		],
		[
			'\\b(koffie)\\b',
			['pleur']
		],
		[
			'\\b(poepen|schijten|kakken)\\b',
			['kukke']
		],
		[
			'\\b(apart)\\b',
			['ampart']
		],
		[
			'\\b(adem)\\b',
			['asem']
		],
		[
			'\\b(hele handel|gehele handel)\\b',
			['avergasie']
		],
		[
			'\\b(advocaatje|advocaat)\\b',
			['avvekaatje']
		],
		[
			'\\b(met slagroom)\\b',
			['met een kuiffie']
		],
		[
			'\\b(politieagent|politie)\\b',
			['ballenjatter', 'pliesie', 'luis', 'kit']
		],
		[
			'\\b(meteen|gelijk|tegelijkertijd)\\b',
			['bedeen']
		],
		[
			'\\b(borsten|voetbal|kale kop|kaal hoofd|kale hoofd)\\b',
			['bledder']
		],
		[
			'\\b(bromfiets|scooter|brommer)\\b',
			['brommert']
		],
		[
			'\\b(servet|servetje)\\b',
			['broodluier']
		],
		[
			'\\b(dun)\\b',
			['deun']
		],
		[
			'\\b(drempel)\\b',
			['dorpel']
		],
		[
			'\\b(wollen trui)\\b',
			['drieoktobertrui']
		],
		[
			'\\b(driewieler)\\b',
			['driewielkarretje']
		],
		[
			'\\b(kont|anus|achterwerk)\\b',
			['fondement']
		],
		[
			'\\b(kameraad|maad)\\b',
			['gabber']
		],
		[
			'\\b(elke dag)\\b',
			['iederrestaag']
		],
		[
			'\\b(kapot|gebroken|versleten|stuk|gescheurd|kaduuk|defect|failliet)\\b',
			['gallemieze']
		],
		[
			'\\b(garenmarkt)\\b',
			['garemarkt']
		],
		[
			'\\b(gezicht)\\b',
			['gebbe']
		],
		[
			'\\b(geen eens|niet eens)\\b',
			['genees']
		],
		[
			'\\b(zakenman|accountmanager|manager)\\b',
			['gouwjas']
		],

		[
			'\\b(ondertussen)\\b',
			['dewèil']
		],

		[
			'nden\\b',
			['ndûh']
		],
		[
			'rden\\b',
			['rdûh']
		],
		[
			'den\\b',
			['jûh']
		],
		[
			'ken\\b',
			['kuh']
		],
		[
			'gen\\b',
			['guh']
		],
		[
			'ren\\b',
			['ru']
		],
		[
			'dse\\b',
			['se']
		],

		[
			'\\b(bijna)\\b',
			['bekant', 'temet']
		],

		[
			'\\b(enige)\\b',
			['enigste']
		],

		[
			'\\b(eten)\\b',
			['essen']
		],


		[
			'\\b(bril)\\b',
			['fok']
		],

		[
			'\\b(&euro;|uro|€)\\b',
			['uro']
		],

		[
			'\\b(familie)\\b',
			['famielje']
		],

		[
			'\\b(gek)\\b',
			['lèhperd|zottuhklos|halve zool']
		],
		[
			'\\b(gezicht)\\b',
			['porem', 'bekkie', 'raap']
		],
		[
			'\\b(gas)\\b',
			['gast']
		],
		[
			'\\b(geld)\\b',
			['groot']
		],
		[
			'\\b(gemerkt)\\b',
			['gemorreke']
		],
		[
			'\\b(goede)\\b',
			['goeie']
		],
		[
			'(gracht)\\b',
			['gurwacht']
		],
		[
			'\\b(grappig|geestig|geinig|komisch|lol|leuk)\\b',
			['lagguh juh']
		],
		[
			'\\b(gratis|kosten loos)\\b',
			['voor nop']
		],
		[
			'\\b(gynaecoloog)\\b',
			['kierekijker']
		],
		[
			'r\\b',
			['r', 'rr', 'rrr']
		],
		[
			'\\b(haarlemmerstraat)\\b',
			['haarmestraat']
		],
		[
			'\\b(hartinfarct)\\b',
			['hardvarkuh', 'hartinvaasie']
		],
		[
			'\\b(heeft)\\b',
			['heb']
		],
		[
			'\\b(haring)\\b',
			['katwijker']
		],
		[
			'\\b(heb je)\\b',
			['hebbie']
		],
		[
			'\\b(het)\\b',
			['ut']
		],
		[
			'\\b(dronken)\\b',
			['als een maleijer']
		],
		[
			'\\b(hoofd)\\b',
			['harsus', 'bledder', 'harsus']
		],

		[
			'\\b(hij zei)\\b',
			['hij zee']
		],

		[
			'\\b(je)\\b',
			['juh']
		],

		[
			'(moeder)\\b',
			['moer']
		],
		[
			'\\b(kan)\\b',
			['ken']
		],
		[
			'\\b(kun je)\\b',
			['kejje']
		],
		[
			'\\b(kan je)\\b',
			['kejje']
		],
		[
			'\\b(katwijker)\\b',
			['Kattuker']
		],
		[
			'\\b(katwijk)\\b',
			['Kattuk']
		],
		[
			'\\b(leids)\\b',
			['leis']
		],
		[
			'\\b(meer dan)\\b',
			['meer als']
		],
		[
			'\\b(groter dan)\\b',
			['groter als']
		],
		[
			'\\b(beter dan)\\b',
			['beter als']
		],

		[
			'\\b(vrouw|meid|meisje|dame)\\b',
			['meissie', 'meh', 'gleufdiertje']
		],

		[
			'\\b(mond)\\b',
			['meelkokûr']
		],

		[
			'\\b(komt dat)\\b',
			['komp ut']
		],
		[
			'\\b(nederlands)\\b',
			['nederlans']
		],

		[
			'\\b(omdat)\\b',
			['omda']
		],

		[
			'\\b(ongelofelijk)\\b',
			['niettefilleme']
		],


		[
			'\\b(slager)\\b',
			['knors']
		],

		[
			'\\b(spinazie)\\b',
			['glip']
		],
		[
			'\\b(de)\\b',
			['duh', 'de']
		],
		[
			'\\b(stelen)\\b',
			['rauzen', 'klauwen']
		],
		[
			'\\b(vallen)\\b',
			['pleuren', 'tiefen', 'teren']
		],
		[
			'\\b(vinder)\\b',
			['vindert']
		],
		[
			'(bureau)\\b',
			['buro']
		],
		[
			'\\b(kadeau)\\b',
			['kado']
		],
		['\\b(3 oktoberfeest|3 oktober)\\b', ['driektober']],
		['\\baan\\b', ['an']],
		['\\baanrecht\\b', ['rechtbank']],
		['\\baanstonds\\b', ['aas']],
		['\\bacht\\b', ['ach']],
		['\\bafvalbak\\b', ['kiepelton']],
		['\\bafvalcontainer\\b', ['vlikobak']],
		['\\bafvaljager\\b', ['sjappetouwer']],
		['\\bAkkefietje\\b', ['Attekfietje']],
		['\\bals je een rooie ziet zeggen we\\b', ['juh rooooie vreet je haare op dur komp een stierr an']],
		['\\bambulance\\b', ['stoffer en blik']],
		['\\bapart\\b', ['ampart']],
		['\\bbagagedrager\\b', ['lasdrager']],
		['\\bbangerik\\b', ['schrikkepuit', 'broekescheitert']],
		['\\bbehelpen\\b', ['beleie']],
		['\\bbiertje\\b', ['pijpie']],
		['\\bbieten\\b', ['kroten is niet specifiek Leids.']],
		['\\bbijna\\b', ['aanstenz', 'bekant', 'temet']],
		['\\bbinnenkort\\b', ['aas', 'termee']],
		['\\bBoisotkade\\b', ['Biesjotkade']],
		['\\bbosjes\\b', ['bossies']],
		['\\bbrancard\\b', ['brrandkar']],
		['\\bBril\\b', ['Fok']],
		['\\bBromfietscertificaat\\b', ['Bromfietsfertisikaat']],
		['\\bbrommer\\b', ['brommert']],
		['\\bbureaucratie\\b', ['bureaucreatie']],
		['\\bCaravan\\b', ['Kerneven']],
		['\\bcarpaccio\\b', ['carpatio']],
		['\\bClown\\b', ['Kloon']],
		['\\bcondom\\b', ['regen jasie']],
		['\\bcriminele\\b', ['crimmenele']],
		['\\bDashbordkastje\\b', ['Bordeskastje']],
		['\\bde Decima\\b', ['de Dees']],
		['\\bde groeten\\b', ['du groetuh']],
		['\\bDe markt\\b', ['De mart']],
		['\\bdementeert\\b', ['mediteert']],
		['\\bDie is overleden\\b', ['Die is een zandwinkel begonnuh']],
		['\\bdik persoon\\b', ['kadijer']],
		['\\bdik zijn\\b', ['as kannera']],
		['\\bdikke buik\\b', ['spierbuik']],
		['\\bdikke kin\\b', ['kanis']],
		['\\bdikke kop\\b', ['bledder']],
		['\\bdood\\b', ['met de pik omhoog liggen']],
		['\\bdood zijn\\b', ['met de pisser omhoog liggen']],
		['\\bdoods hoofd\\b', ['knijne kop']],
		['\\bdrinken\\b', ['zuipe']],
		['\\bdronken\\b', ['aan de lal zijn']],
		['\\bduif\\b', ['koekerroe', 'dakscheiter']],
		['\\bdwaas\\b', ['koekerroe']],
		['\\been jongen uit de wijk de kooi\\b', ['kooiboy']],
		['\\been klap\\b', ['een drijver']],
		['\\been klap\\b', ['bamzaaier']],
		['\\been naar persoon\\b', ['een etter', 'een etterbol', 'juh darruhm', 'klerenleijer']],
		['\\been raam ingooien\\b', ['ik teer je net in']],
		['\\beerlijk\\b', ['eeluk']],
		['\\beigenwijze veldworm\\b', ['darm']],
		['\\beikel\\b', ['darm']],
		['\\belke keer\\b', ['tellekes']],
		['\\benige\\b', ['enigste']],
		['\\bErker\\b', ['erkel']],
		['\\beten\\b', ['essen']],
		['\\beuro\\b', ['uro']],
		['\\bfabriek\\b', ['fambriek']],
		['\\bFamilie\\b', ['Famielje']],
		['\\bfeestneus\\b', ['bamboezuer']],
		['\\bGa weg!\\b', ['pleurttop juh! Teer op!']],
		['\\bgas\\b', ['gast']],
		['\\bgegooid\\b', ['gepleurd']],
		['\\bgehakt\\b', ['gehak']],
		['\\bgek\\b', ['lèhperd', 'zot', 'halve zool']],
		['\\bgek iemand\\b', ['zottuhklos']],
		['\\bgekke\\b', ['gare']],
		['\\bgekkigheid\\b', ['zottighèd']],
		['\\bgeld\\b', ['groot']],
		['\\bgemerkt\\b', ['gemorreke']],
		['\\bgezicht\\b', ['bekkie', 'porrum', 'porum', 'raap']],
		['\\bglas port\\b', ['glasie poort']],
		['\\bglibber\\b', ['glipper']],
		['\\bgluren\\b', ['neuzen']],
		['\\bgoede\\b', ['goeie']],
		['\\bgoedemorgen\\b', ['mogguh']],
		['\\bgozer\\b', ['gozert']],
		['\\bgroeten\\b', ['spreken']],
		['\\bgrof vuil\\b', ['de kraak']],
		['\\bgrote kin\\b', ['cente bak']],
		['\\bgutsen\\b', ['gonzen']],
		['\\bgutst\\b', ['gonst']],
		['\\bgynaecoloog\\b', ['kierekijker']],
		['\\bHaarlemmerstraat\\b', ['Haarmestraat']],
		['\\bHangsnor\\b', ['Lorresnor']],
		['\\bharing\\b', ['katwijker']],
		['\\bhartinfarct\\b', ['hardvarkuh']],
		['\\bhartinfarct\\b', ['hartinvaasie']],
		['\\bheb je\\b', ['hebbie']],
		['\\bheeft\\b', ['heb']],
		['\\bhet\\b', ['ut']],
		['\\bHet Lisser veerhuis\\b', ['Ut Lissa virhuiz']],
		['\\bhet stinkt\\b', ['\'t meurt']],
		['\\bhet ziekenfonds\\b', ['\'t fonkst', 'het ziekefondst']],
		['\\bhij is dood\\b', ['zijn gat is koud']],
		['\\bhij is dronken\\b', ['als een maleijer']],
		['\\bhij zei\\b', ['hij zee']],
		['\\bhoofd\\b', ['bledder', 'harsus', 'bakkus']],
		['\\bhou je mond dicht\\b', ['houtje kokurrrr']],
		['\\bhuilen\\b', ['janken']],
		['\\bik ga\\b', ['ik peert \'m']],
		['\\bIk heb met hem gezoend\\b', ['Ik ben met hem gegaan']],
		['\\bik hoop dat je\\b', ['mag lije dat je']],
		['\\bimperiaal\\b', ['imperium']],
		['\\bin coma zijn\\b', ['in croma leggen']],
		['\\bin de brand\\b', ['in de hens']],
		['\\bin het water\\b', ['in de maajem']],
		['\\bingeslikt\\b', ['ingeslokke']],
		['\\bintensive care\\b', ['intensieve karee']],
		['\\bje\\b', ['juh']],
		['\\bje moeder\\b', ['je ouwe moer']],
		['\\bje moet betale\\b', ['schuive ju']],
		['\\bjenever\\b', ['jainever']],
		['\\bjij\\b', ['juh']],
		['\\bjoh\\b', ['juh']],
		['\\bjuh\\b', ['jij']],
		['\\bkaal persoon\\b', ['Kaleneet']],
		['\\bkaal worden\\b', ['juh ! je binnenbal komt ur doorheen']],
		['\\bKale kop\\b', ['Bledder']],
		['\\bkale kop\\b', ['kane kop', 'schedel']],
		['\\bkan\\b', ['ken']],
		['\\bKan/ken of kun je\\b', ['Kejje']],
		['\\bkantine\\b', ['karremetiene']],
		['\\bkarper\\b', ['karreper']],
		['\\bkatholiek zijn\\b', ['Van \'t houtje zijn']],
		['\\bKatwijker\\b', ['Katteker']],
		['\\bkauwgom\\b', ['kàgun']],
		['\\bkermis\\b', ['kerremus']],
		['\\bkijk eens\\b', ['kijkteris']],
		['\\bkin\\b', ['klus']],
		['\\bkinderwagen\\b', ['larvenbak', 'larvenkar']],
		['\\bKlap in je gezicht\\b', ['n kuister op je kanis /op die dikke bledder van juh']],
		['\\bklap op je gezicht\\b', ['hijs op je treiter']],
		['\\bKlap voor je kop\\b', ['Slag vor juh aambeelts']],
		['\\bKledingkast\\b', ['Klerekast']],
		['\\bKleine visjes\\b', ['Speldaasies']],
		['\\bklootzak\\b', ['klerelijer']],
		['\\bknaapje van kleding\\b', ['klerehanger']],
		['\\bknikker/ vuistslag\\b', ['kuister']],
		['\\bkomt dat\\b', ['komp ut']],
		['\\bkoprol\\b', ['omduikeltje']],
		['\\bkorset\\b', ['korsjet']],
		['\\bKotsen\\b', ['over je zuiger']],
		['\\bkraslot\\b', ['krasloot']],
		['\\bKrij nu wat\\b', ['krijg het lazerus']],
		['\\bkrijg het heen en weer\\b', ['juh krijg een ballutjuh']],
		['\\bKroeg\\b', ['Keilewinkel']],
		['\\bkromme neus\\b', ['zinksnijer']],
		['\\bKun je dat wel missen\\b', ['Kejje dat lije dan']],
		['\\blangs\\b', ['langes']],
		['\\blastdrager\\b', ['lasdrager']],
		['\\blastpost\\b', ['parg']],
		['\\blederen bal\\b', ['Bledder']],
		['\\bLegitimatiebewijs\\b', ['Legemetatiebewijs']],
		['\\bleidenaar\\b', ['glibber']],
		['\\bLeids\\b', ['Leis']],
		['\\blelijk gezicht\\b', ['poffertjes porum']],
		['\\bleraren\\b', ['leraars']],
		['\\bleren voetbal\\b', ['bledder']],
		['\\bLeukerd\\b', ['Nar']],
		['\\blichaam\\b', ['lijer']],
		['\\bLije\\b', ['missen']],
		['\\bmaisonnette\\b', ['majorette']],
		['\\bMajorettemeisje\\b', ['Kooigirl']],
		['\\bmank lopen\\b', ['horrel']],
		['\\bMariahoeve\\b', ['Maria Ho Effe']],
		['\\bmarinade\\b', ['marmelade']],
		['\\bmasker\\b', ['mombakkus']],
		['\\bmeer dan\\b', ['meer als']],
		['\\bmeid\\b', ['mè, mèd', 'Mêh']],
		['\\bmeisje\\b', ['meissie']],
		['\\bmep\\b', ['zaaier']],
		['\\bmeteen\\b', ['bedeen']],
		['\\bmijn god\\b', ['jeezus kristus']],
		['\\bmoeilijk\\b', ['moeluk']],
		['\\bmoet\\b', ['mot']],
		['\\bmoeten\\b', ['motten']],
		['\\bmond\\b', ['meelkokûr']],
		['\\bnaar iemand\\b', ['tirringlijer']],
		['\\bnaar mijn idee wel\\b', ['voormeinpart welja']],
		['\\bnaar persoon\\b', ['longlijer']],
		['\\bNar\\b', ['Leukerd']],
		['\\bnederlandse\\b', ['nederlanse']],
		['\\bniet eens\\b', ['genees']],
		['\\bnuance\\b', ['nowenze']],
		['\\bochtendjas\\b', ['pingwaar']],
		['\\bomdat\\b', ['omda']],
		['\\bongelijk\\b', ['onkant']],
		['\\bongelofelijk\\b', ['niette filme']],
		['\\bop je gezicht gaan\\b', ['op je plaat gaan']],
		['\\bop rotten\\b', ['op teeruh']],
		['\\bopgeborgen\\b', ['opgeborrege']],
		['\\bopgemaakt meisje\\b', ['poppeka']],
		['\\boplichter\\b', ['laaienlichter']],
		['\\bopschepper\\b', ['begeur']],
		['\\bover een poosje\\b', ['metteraas']],
		['\\boverlijden\\b', ['De pijp uit gaan ( ook Amsterdam)']],
		['\\bparaplu\\b', ['plu', 'bledderdrooghouwer', 'bledderdrooghouer']],
		['\\bpardon\\b', ['hee juhh']],
		['\\bpassant\\b', ['pesant']],
		['\\bplaaggeest\\b', ['parg']],
		['\\bplastic\\b', ['plestikke']],
		['\\bpolitiebureau\\b', ['pliesiebro']],
		['\\bprofessor\\b', ['perfesser']],
		['\\bpsychiater\\b', ['spiegiater']],
		['\\bpsycholoog\\b', ['spycholoog']],
		['\\bpuistenkop\\b', ['tietuhbek']],
		['\\bput\\b', ['kolk']],
		['\\bput/putdeksel\\b', ['kolk']],
		['\\bputdeksel\\b', ['kolk']],
		['\\braam\\b', ['net']],
		['\\bramen\\b', ['nettuh']],
		['\\brare man/vrouw\\b', ['achteleke']],
		['\\brasechte Leidenaar\\b', ['Lèdse Glibber']],
		['\\bReanimatie\\b', ['Reamikasie']],
		['\\bregen\\b', ['bledder']],
		['\\brennen\\b', ['renne']],
		['\\breproductie\\b', ['reductie']],
		['\\brimpel hoofd\\b', ['krater kop']],
		['\\broodharige\\b', ['arebei']],
		['\\broofoverval\\b', ['rowowerwal', 'rowowerfwal', 'wroofowverwval']],
		['\\brot griet\\b', ['me vullus wijf']],
		['\\brot op\\b', ['tief op']],
		['\\brot op joh!\\b', ['teer op juh!']],
		['\\brotgriet\\b', ['me vulles leier']],
		['\\brotonde\\b', ['rontonde']],
		['\\brotzooi\\b', ['tinnefzooi']],
		['\\bschaamhaar\\b', ['spinnerag']],
		['\\bslager\\b', ['knors']],
		['\\bslechte jongen\\b', ['kruize duiker']],
		['\\bsloot\\b', ['maaium']],
		['\\bsloot\\b', ['plomp']],
		['\\bsnol\\b', ['stinkdeken']],
		['\\bspagettibandjes\\b', ['hemeseeltjes']],
		['\\bspinazie\\b', ['glip']],
		['\\bstaat\\b', ['stot']],
		['\\bstelen\\b', ['klauwen', 'rauzen']],
		['\\bstoel\\b', ['karpoo']],
		['\\bstrobreed\\b', ['strookbreed']],
		['\\bsuffert\\b', ['klootzak']],
		['\\btomos (bromfiets)\\b', ['tomas (brommert)']],
		['\\btongzoenen\\b', ['kopkluiven']],
		['\\btouwfabriek\\b', ['touwbaan']],
		['\\btumor\\b', ['timor']],
		['\\bTumor\\b', ['Tumor']],
		['\\btwee koffie twee koeken\\b', ['twee pluer twee scheerbakke']],
		['\\btwijfelen\\b', ['staan in de dreig']],
		['\\bUitdagen\\b', ['uitheilige']],
		['\\bvallen\\b', ['teren', 'pleuren', 'tiefen']],
		['\\bverader\\b', ['vuile keel']],
		['\\bverraden\\b', ['verraaie']],
		['\\bvervelend persoon\\b', ['darm', 'juh bloedpoepur !']],
		['\\bvicieuze cirkel\\b', ['visuele cirkel']],
		['\\bvideoband\\b', ['fidiofillum']],
		['\\bviezerik\\b', ['viezik', 'goorlap']],
		['\\bvinder\\b', ['vindert']],
		['\\bvoetbal\\b', ['bledder']],
		['\\bvoetballen\\b', ['voebelluh']],
		['\\bvogelkooi\\b', ['vogelekooi']],
		['\\bvuurpijlen\\b', ['fuupelle']],
		['\\bWat gaan we doen?/ Wat zijn de plannen?\\b', ['Wat is wat tân?!']],
		['\\bWat is dat/wat zijn dat\\b', ['Wah benne dattan']],
		['\\bwe kwamen er aan\\b', ['we kwamme dur an']],
		['\\bwe stonden\\b', ['we stinge']],
		['\\bwedstrijd\\b', ['metse']],
		['\\bWelja\\b', ['Beijaat']],
		['\\bwerk\\b', ['werrek']],
		['\\bwesp\\b', ['weps']],
		['\\bwestside story\\b', ['wedstrijdstorie']],
		['\\bzeuren\\b', ['zaikuh']],
		['\\bziekenfonds\\b', ['siekefonst']],
		['\\bziekte van Parkinson\\b', ['ziekte van Pakistan']],
		['\\bzijlpoort\\b', ['zellepaurt']],
		['\\bZo direct\\b', ['Aastons']],
		['\\bzo meteen\\b', ['aanst', 'zobedeen']],
		['\\bzweeg\\b', ['zwoog']],
		['\\bzwerver\\b', ['zwerrever']],

		['\\b(overzicht)\\b', ['overzig']],

		[
			'\\.\\b',
			['.', '.', '.', ', jûh.', ', jûh darm.', ', jûh kadijer.', ', jûh koekerroe.']
		]
	];


	var findIn = document.getElementsByTagName('body')[0];
	dictonary.forEach(function (item) {

		var reg = new RegExp(item[0], 'ig');

		findAndReplaceDOMText(findIn, {
			find: reg,
			replace: function (node) {
				if (!node.text.replace(/\W/, '')) return node.text;
				var replaceWith = item[1].length === 1 ? item[1][0] : item[1][Math.floor(Math.random() * item[1].length)];

				var first = node.text.substr(0, 1);
				if (first === first.toUpperCase()) {
					replaceWith = replaceWith.charAt(0).toUpperCase() + replaceWith.slice(1);
				}

				return replaceWith;
			}
		});

	});

});