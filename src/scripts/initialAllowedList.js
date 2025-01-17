const initialWhiteList = [
  "https://streeteasy.com/",
  "https://www.zillow.com/",
  "https://www.zumper.com/",
  "https://hotpads.com/",
  "https://www.costar.com/",
  "https://pro.realquest.com/",
  "https://zola.planning.nyc.gov/",
  "https://www.trulia.com/",
  "https://cre.moodysanalytics.com/",
  "http://www.loopnet.com/",
  "https://www.apartments.com/",
  "https://www.rent.com/",
  "http://www.forrent.com/",
  "https://www.apartmentguide.com/",
  "https://a836-pts-access.nyc.gov/",
  "https://a836-acris.nyc.gov/",
  "http://www.realtyrates.com/",
  "https://store.rerc.com/",
  "https://zoneomics.com/",
  "https://regrid.com/",
  "https://msc.fema.gov/portal/home",
  "https://mls.gsmls.com/member/login.do",
  "https://njactb.org/",
  "https://www.hgar.com",
  "https://www.bouldergroup.com/research.html",
  "https://netleaseadvisor.com/",
  "https://www.state.nj.us/treasury/taxation/lpt/chapter123.shtml",
  "https://compstak.com",
  "https://craigslist.org/",
  "https://www.crexi.com/properties?types%5B%5D=Retail",
  "http://lrv.nassaucountyny.gov",
  "http://suffolkcountyny.gov",
  "http://propertydata.orangecountygov.com",
  "https://pcny.maps.arcgis.com",
  "https://gis.dutchessny.gov",
  "http://imo.ulstercountyny.gov",
  "http://rensselaer.sdgnys.com",
  "http://miamidade.gov",
  "http://wro.westchesterclerk.com",
  "http://cotthosting.com",
  "http://uslandrecords.com",
  "http://searchiqs.com",
  "http://dutchessny.gov",
  "http://onlineservices.miami-dadeclerk.com/",
  "http://giswww.westchestergov.com",
  "http://geopower.jws.com",
  "http://ocgis.orangecountygov.com",
  "http://ulstercountyny.gov",
  "https://www.rensco.com/",
  "https://mdc.maps.arcgis.com/home/index.html",
  "https://gis2017-04-13t155717567z-sullconygiso.opendata.arcgis.com/",
  "http://sca-corp.com",
  "http://fiscaloffice.summitoh.net",
  "http://webapps.co.sullivan.ny.us",
  "http://esearch.kaufman-cad.org",
  "http://dallascad.org",
  "http://propaccess.trueautomation.com",
  "http://arcweb.hcad.org",
  "http://collincad.org",
  "http://arcgis.com",
  "https://property.phila.gov",
  "http://buckscountyboa.org",
  "http://propertyrecords.montcopa.org",
  "http://delcorealestate.co.delaware.pa.us",
  "http://arcweb.chesco.org",
  "http://lehighcounty.org",
  "http://gis.co.berks.pa.us",
  "http://lancasterpa.devnetwedge.com",
  "http://ao.lackawannacounty.org",
  "http://ncpub.org",
  "http://phila.gov",
  "http://buckscounty.org",
  "http://montcopa.org",
  "http://rodpublicaccess.co.delaware.pa.us",
  "http://chesterpa.countygovernmentrecords.com",
  "http://countyfusion4.kofiletech.us",
  "http://co.lancaster.pa.us",
  "http://luzernecounty.org",
  "http://atlas.phila.gov",
  "http://dataportal-bucksgis.opendata.arcgis.com",
  "http://delcopa.gov",
  "http://co.berks.pa.us",
  "http://gis.co.lancaster.pa.us",
  "http://gis.luzernecounty.org",
  "http://lackawannacounty.org",
  "http://property.co.trumbull.oh.us",
  "http://mcrealestate.org",
  "http://myplace.cuyahogacounty.us",
  "http://records.co.trumbull.oh.us",
  "http://public.mcrecorder.org",
  "http://recorder.cuyahogacounty.us",
  "http://mcohio.org",
  "http://summitmaps.summitoh.net",
  "http://treasurer.cuyahogacounty.us",
  "http://leepa.org",
  "http://qpublic.schneidercorp.com",
  "http://bcpa.net",
  "http://pbcgov.org",
  "http://collierappraiser.com",
  "http://sc-pa.com",
  "http://leonpa.org",
  "http://escpa.org",
  "http://or.leeclerk.org",
  "http://clerk-of-the-court.com",
  "http://officialrecords.broward.org",
  "http://apps.collierclerk.com",
  "http://sarasotaclerk.com",
  "http://cvweb.clerk.leon.fl.us",
  "http://escambiaclerk.com",
  "http://www8.miamidade.gov",
  "http://gissvr.leepa.org",
  "http://broward.org",
  "http://discover.pbcgov.org",
  "http://scgov.net",
  "http://tlcgis.org",
  "http://myescambia.com",
  "http://leetc.com",
  "http://broward.county-taxes.com",
  "http://pbctax.manatron.com",
  "http://colliertaxcollector.com",
  "http://sarasotataxcollector.com",
  "http://leontaxcollector.net",
  "http://escambiataxcollector.com",
  "http://qpublic.net",
  "http://actdatascout.com",
  "http://orleanscivilclerk.com",
  "http://caddoclerk.com",
  "http://property.nola.gov",
  "http://shreveport.maps.arcgis.com",
  "http://atlas.geoportalmaps.com",
  "http://nola.gov",
  "http://opso.net",
  "http://caddosheriff.go2gov.net",
  "http://stjohnassessor.org",
  "http://cookcountypropertyinfo.com",
  "http://gis.dupageco.org",
  "http://ccrecorder.org",
  "http://dupageco.org",
  "http://maps.cookcountyil.gov",
  "http://k3gis.com",
  "http://treasurer.k3county.net",
  "http://gisapps.chicago.gov",
  "http://jeffersonpva.ky.gov",
  "http://jeffersoncountyclerk.org",
  "http://lojic.org",
  "http://jcsoky.org",
  "http://sc-charleston.publicaccessnow.com",
  "http://charlestoncounty.org",
  "http://polaris3g.mecklenburgcountync.gov",
  "http://property.spatialest.com",
  "http://stlouis-mo.gov",
  "http://data-stlcogis.opendata.arcgis.com",
  "http://bsaonline.com",
  "http://kalcounty.com",
  "http://waynecountylandrecords.com",
  "http://pta.waynecounty.com",
  "http://acgov.org",
  "http://common1.mptsweb.com",
  "http://portal.assessor.lacounty.gov",
  "http://maps.conservation.ca.gov",
  "http://sfplanninggis.org",
  "http://sser.sjgov.org",
  "http://gis.acgov.org",
  "http://sjmap.org",
  "http://zimas.lacity.org",
  "http://maps.placer.ca.gov",
  "http://sdgis.sandag.org",
  "http://sjgov.org",
  "http://auditor.lacounty.gov",
  "http://iwr.sdttc.com",
  "http://dat.md.gov",
  "http://mdlandrec.net",
  "http://apps.montgomerycountymd.gov",
  "http://gisdata-pwcgov.opendata.arcgis.com",
  "http://pwc.publicaccessnow.com",
  "http://search.barnstabledeeds.org",
  "http://masslandrecords.com",
  "http://tauntondeeds.com",
  "http://search.lawrencedeeds.com",
  "http://salemdeeds.com",
  "http://search.hampdendeeds.com",
  "http://norfolkdeeds.org",
  "http://titleview.org",
  "http://cityofboston.gov",
  "http://everett.patriotproperties.com",
  "http://lynn.patriotproperties.com",
  "http://springfield-ma.gov",
  "http://gis.vgsi.com",
  "http://boston.maps.arcgis.com",
  "http://hosting.tighebond.com",
  "http://maps.massgis.state.ma.us",
  "http://peabodyma.mapgeo.io",
  "http://maps.springfield-ma.gov",
  "http://axisgis.com",
  "http://state.nj.us",
  "http://njactb.org",
  "http://njpropertyfax.com",
  "http://newjersey.maps.arcgis.com",
  "http://nj.gov",
  "http://brightmls.com",
  "http://mls.gsmls.com",
  "http://matrix.jerseyshoremls.net",
  "http://centraljerseymls.com",
  "http://capemay.fnismls.com",
  "http://hudson.clareityiam.net",
  "http://flexmls.com",
  "http://Newjerseymls.com",
  "http://press.co.burlington.nj.us",
  "http://press.essexregister.com",
  "http://acclaim.hcnj.us",
  "http://pip.mercercounty.org",
  "http://mcrecords.co.middlesex.nj.us",
  "http://oprs.co.monmouth.nj.us",
  "http://mcclerksng.co.morris.nj.us",
  "http://clerk.co.ocean.nj.us",
  "http://records.mercercounty.org",
  "http://ccsearch.co.somerset.nj.us",
  "http://sussex.landrecordsonline.com",
  "http://co.warren.nj.us",
  "http://generalcode.com",
  "http://hackensack.org",
  "http://clerkshq.com",
  "http://newarknj.gov",
  "http://ecode360.com",
  "http://njsea.com",
  "http://trentonnj.org",
  "http://manasquan-nj.gov",
  "http://matawanborough.com",
  "http://gis.oldbridge.com",
  "http://parsippany.maps.arcgis.com",
  "http://library.municode.com",
  "http://bridgewaternj.gov",
  "http://elizabethnj.org",
  "http://njdep.maps.arcgis.com",
  "http://bethel.ias-clt.com",
  "http://mapsonline.net",
  "http://propertyrecordcards.com",
  "http://greenwichct.gov",
  "http://newbritain.mapxpress.net",
  "http://westhaven.mapxpress.net",
  "http://assessedvalues2.com",
  "http://branford.mapxpress.net",
  "http://metrocog.mapxpress.net",
  "http://bristol.mapxpress.net",
  "http://easthaven.mapxpress.net",
  "http://gise3.glastonbury-ct.gov",
  "http://gis1.hartford.gov",
  "http://nhgis.newhavenct.gov",
  "http://host.cdmsmithgis.com",
  "http://norwichct.mapgeo.io",
  "http://torrington.mapxpress.net",
  "https://waterburyct.maps.arcgis.com",
  "https://westhartfordct.mapgeo.io",
  "https://westportma.mapgeo.io",
  "http://mytaxbill.org",
  "https://kcgis.maps.arcgis.com",
  "http://oregon.gov",
  "http://ormap.net",
  "https://agdonline.maps.arcgis.com",
  "http://fayettecounty.wv.gov",
  "http://docs.oklahomacounty.org",
  "https://kingcounty.gov",
  "http://atip.piercecountywa.gov",
  "https://snohomishcountywa.gov",
  "https://www.co.jefferson.wa.us/",
  "https://recordsearch.kingcounty.gov",
  "http://armsweb.co.pierce.wa.us/",
  "http://gisweb.jeffcowa.us",
  "https://payment.kingcounty.gov/",
  "https://mrsc.org"
];
