
$(document).ready(function () {

  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/all`));
  console.log(obj)
});

//consulta da api
function consulta(url) {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", url, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}

//remove as duplicatas do vetor
function removeDuplicatas(data) {
  return data.filter((value, index) => data.indexOf(value) === index);
}

//verifica qual form vamos usar de acordo com seleção do select
const consultaForm = () => {

  let paramtro = $(`#filtro`).val();
  console.log(paramtro);

  if (paramtro == 1) {

    $("#form-regiao").toggleClass('d-none');
    $("#form-capital").addClass('d-none');
    $("#form-lingua").addClass('d-none');
    $("#form-pais").addClass('d-none');
    $("#form-codigo").addClass('d-none');



  } else
    if (paramtro == 2) {

      $("#form-capital").toggleClass('d-none');
      $("#form-regiao").addClass('d-none');
      $("#form-lingua").addClass('d-none');
      $("#form-pais").addClass('d-none');
      $("#form-codigo").addClass('d-none');


      consultaCapitais();
    }
    else
      if (paramtro == 3) {

        $("#form-lingua").toggleClass('d-none');
        $("#form-capital").addClass('d-none');
        $("#form-regiao").addClass('d-none');
        $("#form-pais").addClass('d-none');
        $("#form-codigo").addClass('d-none');
        consultaLinguas();
      }
      else
        if (paramtro == 4) {

          $("#form-pais").toggleClass('d-none');
          $("#form-lingua").addClass('d-none');
          $("#form-capital").addClass('d-none');
          $("#form-regiao").addClass('d-none');
          $("#form-codigo").addClass('d-none');
          consultaPaises();
        }
        else
          if (paramtro == 5) {

            $("#form-codigo").toggleClass('d-none');
            $("#form-pais").addClass('d-none');
            $("#form-lingua").addClass('d-none');
            $("#form-capital").addClass('d-none');
            $("#form-regiao").addClass('d-none');
            consultaCodigos();
          }

}

//busca todas as capitais disponiveis
const consultaCapitais = () => {

  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/all`));

  let conteudo = '<option disabled selected>Escolha uma opção</option>';

  obj.forEach(element => {

    conteudo += `
    <option value="${element.capital}">${element.capital}</option>`
  });

  $(`#capital`).html(conteudo);
}


//busca todas as capitais disponiveis
const consultaPaises = () => {

  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/all`));

  let conteudo = '<option disabled selected>Escolha uma opção</option>';

  obj.forEach(element => {

    conteudo += `
    <option value="${element.name}">${element.name}</option>`
  });

  $(`#pais`).html(conteudo);
}

//busca todos os codigos disponiveis
const consultaCodigos = () => {

  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/all`));
  let data;

  let conteudo = '<option disabled selected>Escolha uma opção</option>';

  // busca todas as linguas
  arrCodigos = [];
  obj.forEach(element => {

    element.callingCodes.forEach(element2 => {
      arrCodigos.push(element2)

    });
  });

  //remove as duplicatas
  arrCodigos = removeDuplicatas(arrCodigos);

  arrCodigos.forEach(element => {

    conteudo += `
    <option value="${element}">${element}</option>`
  });

  $(`#codigo`).html(conteudo);
}

//consulta todas as linguas disponiveis
const consultaLinguas = () => {

  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/all`));
  let data;

  let conteudo = '<option disabled selected>Escolha uma opção</option>';

  // busca todas as linguas
  arrLinguas = [];
  obj.forEach(element => {

    element.languages.forEach(element2 => {
      arrLinguas.push({ nome: element2.name, cod: element2.iso639_2 })

    });
  });

  //remove as duplicatas
  arrLinguas = removeDuplicatas(arrLinguas);

  arrLinguas.forEach(element => {

    conteudo += `
    <option value="${element.cod}">${element.nome}</option>`
  });

  $(`#lingua`).html(conteudo);

}

//consulta filtrando por regiao
const consultaApiRegiao = () => {

  let regiao = $(`#regiao`).val();
  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/region/${regiao}`));

  let conteudo = '';

  obj.forEach(element => {

    conteudo += `
    <div onclick="consultaDetalhes('${element.alpha3Code}')" class=" mt-4 col-xs-12 col-md-3 col-lg-3">
      <img  width="100%" height="100%" src="${element.flag}">
    </div>
    `
  });

  $(`#paises`).html(conteudo);
}

// consulta friltrando por capital
const consultaApiCapital = () => {

  let capital = $(`#capital`).val();
  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/capital/${capital}`));

  let conteudo = '';

  obj.forEach(element => {

    conteudo += `
    <div onclick="consultaDetalhes('${element.alpha3Code}')" class=" mt-4 col-xs-12 col-md-3 col-lg-3">
      <img  width="100%" height="100%" src="${element.flag}">
    </div>
    `
  });

  $(`#paises`).html(conteudo);
}

// consulta friltrando por capital
const consultaApiCodigo = () => {

  let code = $(`#codigo`).val();
  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/callingcode/${code}`));

  let conteudo = '';

  obj.forEach(element => {

    conteudo += `
    <div onclick="consultaDetalhes('${element.alpha3Code}')" class=" mt-4 col-xs-12 col-md-3 col-lg-3">
      <img  width="100%" height="100%" src="${element.flag}">
    </div>
    `
  });

  $(`#paises`).html(conteudo);
}

// consulta friltrando por capital
const consultaApiLingua = () => {

  let lingua = $(`#lingua`).val();
  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/lang/${lingua}`));

  let conteudo = '';

  obj.forEach(element => {

    conteudo += `
    <div onclick="consultaDetalhes('${element.alpha3Code}')" class=" mt-4 col-xs-12 col-md-3 col-lg-3">
      <img  width="100%" height="100%" src="${element.flag}">
    </div>
    `
  });

  $(`#paises`).html(conteudo);
}

// consulta friltrando por capital
const consultaApiPais = () => {

  let pais = $(`#pais`).val();
  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/name/${pais}`));
  console.log(obj);
  let conteudo = '';

  obj.forEach(element => {

    conteudo += `
    <div onclick="consultaDetalhes('${element.alpha3Code}')" class=" mt-4 col-xs-12 col-md-3 col-lg-3">
      <img  width="100%" height="100%" src="${element.flag}">
    </div>
    `
  });

  $(`#paises`).html(conteudo);
}

//volta na tela inicial a regiao selecionada
const consultaApiRegiaoParametro = (regiao) => {

  $(`#detalhes`).html('');

  $(`#sessao`).toggleClass('d-none');
  $(`#detalhes`).toggleClass('d-none');

  console.log(regiao)

  $(`#filtro`).val('1');
  $(`#regiao`).val(`${regiao.toLowerCase()}`);

  console.log($(`#regiao`).val());

  // $(`#paises`).html(conteudo);

}

//mostra os detalhes do pais selecionado
const consultaDetalhes = (code) => {

  let val = code.toLowerCase();
  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/alpha/${val}`));

  console.log(obj)

  let arrLinguas = obj.languages
  let linguas = '';

  // busca todas as linguas do país
  arrLinguas.forEach(element => {

    linguas += `${element.name}; `

  });

  let conteudo = `
    <div class=" mt-4 col-xs-12 col-md-3 col-lg-3">
      <img  width="100%" height="100%" src="${obj.flag}">
    </div>
    <div class=" mt-4 col-xs-12 col-md-3 col-lg-3">
      <label>Nome: ${obj.name}</label></br>
      <label>Capital: ${obj.capital}</label></br>  
      <label class="corTexto" onclick="consultaApiRegiaoParametro('${obj.region}')">Região: <b>${obj.region}</b></label>  </br>
      <label>Sub-região: ${obj.subregion}</label> </br>  
      <label>Línguas: ${linguas} </label>  
    </div>
    `

  $(`#detalhes`).html(conteudo);

  $(`#sessao`).toggleClass('d-none');
  $(`#detalhes`).toggleClass('d-none');

}