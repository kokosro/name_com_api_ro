# functional programming - pentru Name.com reseller api
## pentru node.js

#cum se foloseste?
```javascript
var api = require("name_com_api_ro")(username, api_token, true) //true e pentru DEV;
/*
 ceva_de_transmis_in_cerere - un obiect pe care-l transmite asa crud, fara procesare, API-ului
 ceva_ce_proceseaza_raspunsul - o functie care primeste ca parametru raspunsul
 nume_metoda: "/hello" sau "/domain/check" etc.
api({
	nume: nume_metoda,
	bagaj: ceva_de_transmis_in_cerere,
	raspuns: ceva_ce_proceseaza_raspunsul
});

*/

api({
	nume: "/account/get",
	raspuns: function(raspuns){
		console.log(raspuns);
	}
});
//done

```


###spor!
