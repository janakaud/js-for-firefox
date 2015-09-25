// ==UserScript==
// @name		Shiply
// @namespace	shiply
// @include		http://www.shiply.com/*
// @version		1
// @grant		none
// ==/UserScript==

//accepted ZIP codes
var zips = ['AL1','AL10','AL2','AL3','AL4','AL5','AL6','AL7','AL8','AL9','B1','B10','B11','B12','B13',
	'B14','B15','B16','B17','B18','B19','B2','B20','B21','B23','B24','B25','B26','B27','B28',
	'B29','B3','B30','B31','B32','B33','B34','B35','B36','B37','B38','B4','B40','B42','B43','B44',
	'B45','B46','B47','B48','B49','B5','B50','B6','B60','B61','B62','B63','B64','B65','B66','B67',
	'B68','B69','B7','B70','B71','B72','B73','B74','B75','B76','B77','B78','B79','B8','B80','B9',
	'B90','B91','B92','B93','B94','B95','B96','B97','B98','BA1','BA10','BA11','BA12','BA13','BA14',
	'BA15','BA16','BA2','BA20','BA21','BA22','BA3','BA4','BA5','BA6','BA7','BA8','BA9','BB1',
	'BB10','BB11','BB12','BB2','BB3','BB4','BB5','BB6','BD1','BD10','BD11','BD12','BD13','BD14',
	'BD15','BD16','BD17','BD18','BD19','BD2','BD20','BD21','BD22','BD3','BD4','BD5','BD6','BD7',
	'BD8','BD9','BH1','BH10','BH11','BH12','BH13','BH14','BH15','BH16','BH17','BH18','BH2','BH21',
	'BH22','BH23','BH24','BH3','BH31','BH4','BH5','BH6','BH7','BH8','BH9','BL0','BL1','BL2','BL3',
	'BL4','BL5','BL6','BL7','BL8','BL9','BR1','BR2','BR3','BR4','BR5','BR6','BR7','BR8','BS1',
	'BS10','BS11','BS13','BS14','BS15','BS16','BS2','BS20','BS21','BS22','BS23','BS24','BS25',
	'BS26','BS27','BS28','BS29','BS3','BS30','BS31','BS32','BS34','BS35','BS36','BS37','BS39','BS4',
	'BS40','BS41','BS48','BS49','BS5','BS6','BS7','BS8','BS9','BS99','CB1','CB10','CB11','CB2',
	'CB3','CB4','CB5','CB8','CB9','CF10','CF11','CF14','CF15','CF23','CF24','CF3','CF34','CF35',
	'CF37','CF38','CF39','CF5','CF62','CF63','CF64','CF71','CF72','CF82','CF83','CH1','CH2','CH3',
	'CH4','CH41','CH42','CH43','CH44','CH45','CH46','CH47','CH48','CH49','CH5','CH6','CH60','CH61',
	'CH62','CH63','CH64','CH65','CH66','CM1','CM11','CM12','CM13','CM14','CM15','CM16','CM17',
	'CM18','CM19','CM2','CM20','CM21','CM22','CM23','CM24','CM3','CM4','CM5','CM6','CM7','CM8',
	'CM9','CO1','CO10','CO11','CO2','CO3','CO4','CO5','CO6','CO7','CO8','CO9','CR0','CR2','CR3',
	'CR4','CR5','CR6','CR7','CR8','CV1','CV10','CV11','CV12','CV13','CV2','CV21','CV22','CV23',
	'CV3','CV31','CV32','CV33','CV34','CV35','CV36','CV37','CV4','CV47','CV5','CV6','CV7','CV8',
	'CV9','CW1','CW10','CW11','CW12','CW2','CW3','CW4','CW5','CW6','CW7','CW8','CW9','DA1','DA10',
	'DA11','DA12','DA13','DA14','DA15','DA16','DA17','DA18','DA2','DA3','DA4','DA5','DA6','DA7',
	'DA8','DA9','DE1','DE11','DE12','DE13','DE14','DE15','DE21','DE22','DE23','DE24','DE3','DE4',
	'DE45','DE5','DE55','DE56','DE6','DE65','DE7','DE72','DE73','DE74','DE75','DN1','DN10','DN11',
	'DN12','DN14','DN2','DN3','DN4','DN5','DN6','DN7','DN8','DN9','DY1','DY10','DY11','DY12',
	'DY13','DY14','DY2','DY3','DY4','DY5','DY6','DY7','DY8','DY9','E1','E10','E11','E12','E13',
	'E14','E15','E16','E17','E18','E1W','E2','E3','E4','E5','E6','E7','E8','E9','EC1','EC1A',
	'EC1M','EC1N','EC1R','EC1V','EC1Y','EC2','EC2A','EC2M','EC2N','EC2R','EC2V','EC2Y','EC3','EC3A',
	'EC3M','EC3N','EC3P','EC3R','EC3V','EC4','EC4A','EC4M','EC4N','EC4R','EC4V','EC4Y','EN1','EN10',
	'EN11','EN2','EN3','EN4','EN5','EN6','EN7','EN8','EN9','FY1','FY2','FY3','FY4','FY5','FY6',
	'FY7','FY8','GL1','GL10','GL11','GL12','GL13','GL14','GL15','GL16','GL17','GL18','GL19','GL2',
	'GL20','GL3','GL4','GL5','GL50','GL51','GL52','GL53','GL54','GL55','GL56','GL6','GL7','GL8',
	'GL9','GU1','GU10','GU11','GU12','GU13','GU14','GU15','GU16','GU17','GU18','GU19','GU2','GU20',
	'GU21','GU22','GU23','GU24','GU25','GU26','GU3','GU4','GU46','GU47','GU5','GU51','GU52','GU6',
	'GU7','GU8','GU9','HA0','HA1','HA2','HA3','HA4','HA5','HA6','HA7','HA8','HA9','HD1','HD2',
	'HD3','HD4','HD5','HD6','HD7','HD8','HD9','HG1','HG2','HG3','HG4','HG5','HP1','HP10','HP11',
	'HP12','HP13','HP14','HP15','HP16','HP17','HP18','HP19','HP2','HP20','HP21','HP22','HP23',
	'HP27','HP3','HP4','HP5','HP6','HP7','HP8','HP9','HR1','HR2','HR3','HR4','HR5','HR6','HR7',
	'HR8','HR9','HX1','HX2','HX3','HX4','HX5','HX6','HX7','IG1','IG10','IG11','IG2','IG3','IG4',
	'IG5','IG6','IG7','IG8','IG9','IP1','IP10','IP14','IP2','IP3','IP30','IP31','IP32','IP33',
	'IP4','IP5','IP6','IP7','IP8','IP9','KT1','KT10','KT11','KT12','KT13','KT14','KT15','KT16',
	'KT17','KT18','KT19','KT2','KT20','KT21','KT22','KT23','KT24','KT3','KT4','KT5','KT6','KT7',
	'KT8','KT9','L1','L10','L11','L12','L13','L14','L15','L16','L17','L18','L19','L2','L20','L21',
	'L22','L23','L24','L25','L26','L27','L28','L29','L3','L30','L31','L32','L33','L34','L35',
	'L36','L37','L38','L39','L4','L40','L5','L6','L69','L7','L70','L8','L9','LE1','LE10','LE11',
	'LE12','LE13','LE14','LE15','LE16','LE17','LE18','LE2','LE3','LE4','LE5','LE6','LE65','LE67',
	'LE7','LE8','LE9','LS1','LS10','LS11','LS12','LS13','LS14','LS15','LS16','LS17','LS18','LS19',
	'LS2','LS20','LS21','LS22','LS23','LS24','LS25','LS26','LS27','LS28','LS29','LS3','LS4','LS5',
	'LS6','LS7','LS8','LS9','LU1','LU2','LU3','LU4','LU5','LU6','LU7','M1','M11','M12','M13',
	'M14','M15','M16','M17','M18','M19','M2','M20','M21','M22','M23','M24','M25','M26','M27',
	'M28','M29','M3','M30','M31','M32','M33','M34','M35','M38','M4','M40','M41','M43','M44','M45',
	'M46','M5','M6','M60','M7','M8','M9','M90','ME1','ME14','ME15','ME16','ME17','ME18','ME19',
	'ME2','ME20','ME3','ME4','ME5','ME6','MK1','MK10','MK11','MK12','MK13','MK14','MK15','MK16',
	'MK17','MK18','MK19','MK2','MK3','MK4','MK40','MK41','MK42','MK43','MK44','MK45','MK46','MK5',
	'MK6','MK7','MK8','MK9','N1','N10','N11','N12','N13','N14','N15','N16','N17','N18','N19','N2',
	'N20','N21','N22','N3','N4','N5','N6','N7','N8','N9','NG1','NG10','NG11','NG12','NG13','NG14',
	'NG15','NG16','NG17','NG18','NG19','NG2','NG20','NG21','NG22','NG23','NG24','NG25','NG3','NG4',
	'NG5','NG6','NG7','NG8','NG9','NN1','NN10','NN11','NN12','NN13','NN14','NN15','NN16','NN17',
	'NN18','NN2','NN29','NN3','NN4','NN5','NN6','NN7','NN8','NN9','NP10','NP11','NP15','NP16',
	'NP18','NP19','NP20','NP25','NP26','NP4','NP44','NP7','NW1','NW10','NW11','NW2','NW3','NW4',
	'NW5','NW6','NW7','NW8','NW9','OL1','OL10','OL11','OL12','OL13','OL14','OL15','OL16','OL2',
	'OL3','OL4','OL5','OL6','OL7','OL8','OL9','OX1','OX10','OX11','OX12','OX13','OX14','OX15',
	'OX16','OX17','OX18','OX2','OX20','OX25','OX26','OX27','OX28','OX29','OX3','OX33','OX39','OX4',
	'OX44','OX49','OX5','OX6','OX7','OX8','OX9','PE1','PE13','PE14','PE15','PE16','PE19','PE2',
	'PE26','PE27','PE28','PE29','PE3','PE4','PE5','PE6','PE7','PE8','PE9','PR1','PR2','PR25',
	'PR26','PR3','PR4','PR5','PR6','PR7','PR8','PR9','RG1','RG10','RG12','RG14','RG17','RG18',
	'RG19','RG2','RG20','RG21','RG22','RG23','RG24','RG25','RG26','RG27','RG28','RG29','RG30',
	'RG31','RG4','RG40','RG41','RG42','RG45','RG5','RG6','RG7','RG8','RG9','RH1','RH2','RH3','RH4',
	'RH5','RH6','RH7','RH8','RH9','RM1','RM10','RM11','RM12','RM13','RM14','RM15','RM16','RM17',
	'RM18','RM19','RM2','RM20','RM3','RM4','RM5','RM6','RM7','RM8','RM9','S1','S10','S11','S12',
	'S13','S14','S17','S18','S2','S20','S21','S25','S26','S3','S32','S33','S35','S36','S4','S40',
	'S41','S42','S43','S44','S45','S5','S6','S60','S61','S62','S63','S64','S65','S66','S7','S70',
	'S71','S72','S73','S74','S75','S8','S80','S81','S9','SE1','SE10','SE11','SE12','SE13','SE14',
	'SE15','SE16','SE17','SE18','SE19','SE2','SE20','SE21','SE22','SE23','SE24','SE25','SE26',
	'SE27','SE28','SE3','SE4','SE5','SE6','SE7','SE8','SE9','SG1','SG10','SG11','SG12','SG13',
	'SG14','SG15','SG16','SG17','SG18','SG19','SG2','SG3','SG4','SG5','SG6','SG7','SG8','SG9',
	'SK1','SK10','SK11','SK12','SK13','SK14','SK15','SK16','SK17','SK2','SK22','SK23','SK3','SK4',
	'SK5','SK6','SK7','SK8','SK9','SL0','SL1','SL2','SL3','SL4','SL5','SL6','SL7','SL8','SL9',
	'SM1','SM2','SM3','SM4','SM5','SM6','SM7','SN1','SN10','SN11','SN12','SN13','SN14','SN15',
	'SN16','SN2','SN25','SN26','SN3','SN4','SN5','SN6','SN7','SN8','SN9','SO14','SO15','SO16',
	'SO17','SO18','SO19','SO20','SO21','SO22','SO23','SO30','SO31','SO32','SO40','SO43','SO45',
	'SO50','SO51','SO52','SO53','SP1','SP10','SP11','SP2','SP3','SP4','SP5','SP6','SP7','SP8',
	'SP9','SR1','SR2','SR3','SR4','SR5','SR6','SR7','SR8','SR9','SS11','SS12','SS13','SS14','SS15',
	'SS16','SS17','SS5','SS6','SS7','SS8','ST1','ST10','ST11','ST12','ST13','ST14','ST15','ST16',
	'ST17','ST18','ST19','ST2','ST20','ST21','ST3','ST4','ST5','ST6','ST7','ST8','ST9','SW1',
	'SW10','SW11','SW12','SW13','SW14','SW15','SW16','SW17','SW18','SW19','SW1A','SW1E','SW1H',
	'SW1P','SW1V','SW1W','SW1X','SW1Y','SW2','SW20','SW3','SW4','SW5','SW6','SW7','SW8','SW9',
	'SY1','SY10','SY11','SY12','SY13','SY14','SY2','SY3','SY4','SY5','SY6','SY7','SY8','SY9','TA1',
	'TA10','TA11','TA12','TA15','TA19','TA2','TA3','TA4','TA5','TA6','TA7','TA8','TA9','TF1',
	'TF10','TF11','TF12','TF13','TF2','TF3','TF4','TF5','TF6','TF7','TF8','TF9','TN10','TN11',
	'TN12','TN13','TN14','TN15','TN16','TN8','TN9','TW1','TW10','TW11','TW12','TW13','TW14','TW15',
	'TW16','TW17','TW18','TW19','TW2','TW20','TW3','TW4','TW5','TW6','TW7','TW8','TW9','UB1',
	'UB10','UB11','UB2','UB3','UB4','UB5','UB6','UB7','UB8','UB9','W1','W10','W11','W12','W13',
	'W14','W1B','W1C','W1D','W1F','W1G','W1H','W1J','W1K','W1M','W1S','W1T','W1U','W1W','W2','W3',
	'W4','W5','W6','W7','W8','W9','WA1','WA10','WA11','WA12','WA13','WA14','WA15','WA16','WA2',
	'WA3','WA4','WA5','WA6','WA7','WA8','WA9','WC1','WC1A','WC1B','WC1E','WC1H','WC1N','WC1R',
	'WC1V','WC1X','WC2','WC2A','WC2B','WC2E','WC2H','WC2N','WC2R','WD1','WD17','WD18','WD19','WD2',
	'WD23','WD24','WD25','WD3','WD4','WD5','WD6','WD7','WF1','WF10','WF11','WF12','WF13','WF14',
	'WF15','WF16','WF17','WF2','WF3','WF4','WF5','WF6','WF7','WF8','WF9','WN1','WN2','WN3','WN4',
	'WN5','WN6','WN7','WN8','WR1','WR10','WR11','WR12','WR13','WR14','WR15','WR2','WR3','WR4',
	'WR5','WR6','WR7','WR8','WR9','WS1','WS10','WS11','WS12','WS13','WS14','WS15','WS2','WS3',
	'WS4','WS5','WS6','WS7','WS8','WS9','WV1','WV10','WV11','WV12','WV13','WV14','WV15','WV16',
	'WV2','WV3','WV4','WV5','WV6','WV7','WV8','WV9','YO1','YO10','YO19','YO23','YO24','YO26',
	'YO30','YO31','YO32','YO41','YO42','YO43','YO51','YO60','YO61','YO62','YO7','YO8'];
//minimum bid
var ourMin = 50;
//our username
var ourName = 'Tesla_Couriers';
//message
var msg = "Hi. We're happy to assist you regarding this JOB. PRICE INCLUDES 1 or 2 MAN CREW & LARGE \
LWB LUTON VAN (3.5 TONNE) Friendly and reliable with experience in furniture removal from single item \
to relocation. We offer experienced teams with highly skilled removal men, fully equipped vehicles for \
safety and reliability and professional all around service. Our feedback speaks for itself. This quote \
includes VAT and there are no hidden costs for listed job. Please do not hesitate to contact me regarding \
the quote or for any queries. We can negotiate everything, JUST ASK !!! Before booking please check if we \
are still available, as our circumstances change every 30 mins. With hope of future collaborations we wish \
you all the best! Daniel";

//getElementById() shortcut
function id(n) {
	return document.getElementById(n);
}

//getElementsByClassName() shortcut
function c(o, n) {
	return o.getElementsByClassName(n);
}

//getElementsByClassName()[0] shortcut
function c0(o, n) {
	return c(o, n)[0];
}

//ZIP code check
function go(s) {
	var zip = s.substring(s.lastIndexOf(",") + 1).trim();
	var split = zip.indexOf(' ');
	if (split > 0)
		zip = zip.substring(0, split);
	return zips.indexOf(zip) > -1;
}

var base = 'http://www.shiply.com/';
var ls = window.localStorage;

function goNext() {
	var pages = JSON.parse(ls.items);
	if (pages) {
		pages = pages.splice(1);
console.log(pages.length + ' pages');
		if (pages.length == 0) {	//end
console.log('end');
			delete ls.items;
		} else {
console.log('nextpage');
			ls.items = JSON.stringify(pages);
			document.location.href = pages[0];
		}
	}
}

//time-based expiry; valid for only 5 minutes
var d = new Date().getTime();
if (d - ls.last > 300000) {
	delete ls.items;
	delete ls.automatic;
console.log('deleted');
}
ls.last = d;


setTimeout(function() {
	var endpoint = document.location.href.replace(base, '');

	if (endpoint.startsWith('bids/user')) {
		//redirect to /search
		if (confirm('Do you want the bidding script to take over control?')) {
			ls.automatic = true;
			document.location.href = base + 'search';
		} else {
			delete ls.automatic;
		}

	} else if (endpoint.startsWith('search') || endpoint.startsWith('listings/search')) {
		//quit if manual
		if (!ls.automatic) {
			return;
		}

		//check all delivery items
		var list = c(document, 'search-cell-box-content');
		var pages = [];
	
		for (var i = 0; i < list.length; i++) {
			var from = c0(c0(list[i], 'mobile-from-address'), 'search-cell-box-content-address').innerHTML;
			var to = c0(c0(list[i], 'mobile-to-address'), 'search-cell-box-content-address').innerHTML;
			if (go(from) && go(to)) {	//ZIP code match
				pages.push(c0(list[i], 'search-cell-box-content-link').href);
			}
		}
console.log(pages.length + ' pages');

		//add next search page URL, if pagination not over
		var toPg = id('paginateResultsTo').innerHTML.replace(",", "");
console.log('to ' + toPg);
console.log('total ' + id('paginateResultsTotal').innerHTML);
		if (parseInt(toPg) < parseInt(id('paginateResultsTotal').innerHTML.replace(",", ""))) {
			pages.push(base + 'listings/search/' + toPg);
console.log('nextsearch ' + toPg);
		}

		ls.items = JSON.stringify(pages);	//save URLs
		if (pages.length > 0) {
			document.location.href = pages[0];	//open first
		}

	} else if (endpoint.startsWith('transport/')) {
console.log('transport');
		//quit if manual
		if (!ls.automatic) {
			return;
		}

		//if no other bids, or if we have already submitted, ignore and proceed
console.log('bidders');
		var bidders = c(document, 'tp-profile-anchor');
		var skip = false;
		if (bidders.length == 0) {	//no bids?
console.log('nobids');
			skip = true;
		}

		var oldBid = false;
		var oldBidValue = Number.POSITIVE_INFINITY;
		//each listing has 2 nodes with tp-profile-anchor class
		for (var i = 0; !skip && i < bidders.length; i += 2) {
			if (ourName == bidders[i].innerHTML) {
				oldBid = true;
				var value = parseFloat(c0(bidders[i].parentElement.parentElement.parentElement, 'net-quote-amount-text').innerHTML.match(/\d+/g))
				if (oldBidValue > value) {	//pick lowest of old bids
					oldBidValue = value;
				}
console.log('oldbid ' + oldBidValue);
			}
		}

		//remove current URL, go to next
		if (skip) {
			goNext();
			return;
		}

		//pick min price among others
console.log('quote');
		var others = c(document, 'net-quote-amount-text');
		var min = Number.POSITIVE_INFINITY;
		for (var i = 0; i < others.length; i++) {
			var price = parseFloat(others[i].innerHTML.match(/\d+/g));
			if (price < min) {
				min = price;
			}
		}
		min -= 1;

		//wrap to our min price
		if (min == Number.POSITIVE_INFINITY || min < ourMin) {
			min = ourMin;
		}
console.log('min ' + min);

		//if we have an old bid, make sure min is < 95% of old bid
		if (oldBid && min >= oldBidValue * 0.95) {
			goNext();
			return;
		}

		//submit
		id('formBidAdditional').value = msg;
		id('formBidAmount').value = min;
		if (id('formBidVehicleId').value == "") {
console.log('vehiclepick');
			alert("Missing vehicle! Please select one and submit the form to continue.")
		} else {
console.log('submit');
//			id('form-place-bid').submit();
		}
	}
}, 1000);
