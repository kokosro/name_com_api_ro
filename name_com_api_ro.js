/*

  Name.com api story,
  Written by Robert Doroftei
  for node.js

*/
var request = require("request");

function name_com(account, api_token){
  var magic=this;
  var _numarul_de_cereri_de_pana_acum = 0;
  var _s_a_facut_cerere_de_intrare_in_paine = false;
  var _coada = {};
  var _cuvantul_magic = {
      username: account,
      api_token: api_token
  }
  var s_token = "";
  var _default_headers = {
    "Content-type": "application/json"
  };
  var url_name_com = "https://api.name.com/api";
  if(arguments[2]){
      url_name_com = "https://api.dev.name.com/api"
  }
  var debug = true;
  function log(spune){
    if(debug){
      console.log(spune);
    }
    return spune;
  }

  function default_headers(){
    if(arguments[0]){
      _default_headers = {
        "Content-type": "application/json",
        "Api-Session-Token": arguments[0],
      };
    }
    return _default_headers;
  }
  function session_token(){
    if(arguments[0]){
      s_token = arguments[0];
      default_headers(s_token);
      _s_a_facut_cerere_de_intrare_in_paine = false;
    }
    return s_token;
  }

  function nimic(){
    return null;
  };
  function am_intrat_in_paine(){
    facem_coada(_coada);
  }
  function proceseaza_raspuns(impreuna_cu){
    return function(err, resp, body){
      log(err);
      log("procesam raspuns");
      var raspuns = JSON.parse(body);
      log(body);
      if(raspuns.session_token){
        session_token(raspuns.session_token);
        am_intrat_in_paine();
      }
      impreuna_cu?impreuna_cu(raspuns):nimic();
    }

  }
  function cerere_fara_bagaj(cerere){
    return function(){
      log(default_headers());
      log("doing the request GET "+cerere.nume);
      request({
        url: url_name_com+cerere.nume,
        method: "GET",
        headers: default_headers(),
        strictSSL: false
      },proceseaza_raspuns(cerere.raspuns));
    }
  }
  function cerere_cu_bagaj(cerere){

    return function(){
      log("doing the request POST "+cerere.nume);
            log(default_headers());
      request({
        url: url_name_com+cerere.nume,
        method: "POST",
        headers: default_headers(),
        body: JSON.stringify(cerere.bagaj),
                strictSSL: false
      },proceseaza_raspuns(cerere.raspuns));
    }
  }
  function creaza(cerere){
    return cerere.bagaj?
      ( cerere_cu_bagaj(cerere)):
      ( cerere_fara_bagaj(cerere));
  }
  function adauga_la(numar, cat){
    return (numar+cat);
  }
  function etichetam(cerere){
    var eticheta = (_numarul_de_cereri_de_pana_acum = adauga_la(_numarul_de_cereri_de_pana_acum, 1));
    return function(vreau){
      return vreau?
        (vreau=="eticheta"?
          eticheta:
          nimic()):
         cerere;
    }
  }
  function punem_in_coada(cerere){
    _coada[cerere("eticheta")] = cerere();
    return _coada;
  }
  function intra_in_paine(){
    facem_coada(punem_in_coada(etichetam(preluam_cererea({
      nume: "/login",
      bagaj: _cuvantul_magic,
      raspuns: nimic,
      de_la_presedinte: true
    }))));
  }
  function trimite_cerere_de_intrare_in_paine(){
    _s_a_facut_cerere_de_intrare_in_paine = true;
    intra_in_paine();
    return false;
  }
  function intram_in_paine(){
    return _s_a_facut_cerere_de_intrare_in_paine?
       false:
       trimite_cerere_de_intrare_in_paine();
  }
  function suntem_in_paine(){
    if(s_token != ""){
      return true;
    }
    return intram_in_paine();
  }
  function se_poate_face(cerere){
    return cerere("de_la_presedinte")||suntem_in_paine();
  }
  function elibereaza_coada(eticheta){
    _coada[eticheta] = null;
    delete _coada[eticheta];
  }
  function facem(eticheta){
    _coada[eticheta]()();

    setTimeout(elibereaza_coada, 100, eticheta);
  }
  function asteptam(eticheta){
    log("asteptam: "+eticheta);
  }
  function facem_coada(coada){
    log("facem coada");
    for(var eticheta in coada){
      log("incercam "+eticheta);
      se_poate_face(coada[eticheta])?
        facem(eticheta):
        asteptam(eticheta);
    }
  }
  function preluam_cererea(cerere){
    log("preluam cererea");
    return function(vreau){
      return vreau?
        (cerere[vreau]?
         (cerere[vreau]):
         nimic()):
        (creaza(cerere));
    }
  }
/*
  facem_coada(punem_in_coada(etichetam(preluam_cererea({
    nume: "/hello",
    raspuns: function(raspuns){
      log(raspuns);
    }
  }))));

  */

  return function(o_cerere){
      facem_coada(punem_in_coada(etichetam(preluam_cererea(o_cerere))));
  }

}


module.exports = name_com;