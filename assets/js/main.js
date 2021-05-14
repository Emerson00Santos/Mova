
$(document).ready(function () {

  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/all`));
  console.log(obj);
});


// global JavaScript variables
var list = new Array();
var pageList = new Array();
var currentPage = 1;
var numberPerPage = 1;
var numberOfPages = 1;


//consulta da api
function consulta(url) {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", url, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}

//verifica qual form vamos usar de acordo com seleção do select
const consultaForm = () => {

  let parametro = $(`#filtro`).val();
  console.log(parametro);
  $("#form-btn").removeClass('d-none');

  if (parametro == 'region') {

    $("#form-regiao").toggleClass('d-none');
    $("#form-capital").addClass('d-none');
    $("#form-lingua").addClass('d-none');
    $("#form-pais").addClass('d-none');
    $("#form-codigo").addClass('d-none');

  } else
    if (parametro == 'capital') {

      $("#form-capital").toggleClass('d-none');
      $("#form-regiao").addClass('d-none');
      $("#form-lingua").addClass('d-none');
      $("#form-pais").addClass('d-none');
      $("#form-codigo").addClass('d-none');


      consultaCapitais();
    }
    else
      if (parametro == 'lang') {

        $("#form-lingua").toggleClass('d-none');
        $("#form-capital").addClass('d-none');
        $("#form-regiao").addClass('d-none');
        $("#form-pais").addClass('d-none');
        $("#form-codigo").addClass('d-none');
        consultaLinguas();
      }
      else
        if (parametro == 'name') {

          $("#form-pais").toggleClass('d-none');
          $("#form-lingua").addClass('d-none');
          $("#form-capital").addClass('d-none');
          $("#form-regiao").addClass('d-none');
          $("#form-codigo").addClass('d-none');
          consultaPaises();
        }
        else
          if (parametro == 'callingcode') {

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

  let conteudo = '<option  value="#" disabled selected>Escolha uma opção</option>';

  obj.forEach(element => {

    if (element.capital.trim() != '') {
      conteudo += `
      <option value="${element.capital}">${element.capital}</option>`
    }

  });

  $(`#capital`).html(conteudo);
}


//busca todas os paises disponiveis
const consultaPaises = () => {

  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/all`));

  let conteudo = '<option value="#" disabled selected>Escolha uma opção</option>';

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

  let conteudo = '<option value="#" disabled selected>Escolha uma opção</option>';

  // busca todas as linguas
  arrCodigos = [];
  obj.forEach(element => {

    element.callingCodes.forEach(element2 => {
      arrCodigos.push(element2)

    });
  });

  //remove as duplicatas do vetor de objetos
  const seen = new Set();
  const arrFinal = arrCodigos.filter(el => {
    const duplicate = seen.has(el);
    seen.add(el);
    return !duplicate;
  });

  arrFinal.sort();
  arrFinal.forEach(element => {
    if (element.trim() != '') {
      conteudo += `
    <option value="${element}">${element}</option>`
    }
  });

  $(`#codigo`).html(conteudo);
}

//consulta todas as linguas disponiveis
const consultaLinguas = () => {

  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/all`));

  let conteudo = '<option value="#" disabled selected>Escolha uma opção</option>';

  // busca todas as linguas
  arrLinguas = [];
  obj.forEach(element => {

    element.languages.forEach(element2 => {
      arrLinguas.push({ nome: element2.name, cod: element2.iso639_2 })

    });
  });

  //remove as duplicatas do vetor de objetos
  const seen = new Set();
  const arrFinal = arrLinguas.filter(el => {
    const duplicate = seen.has(el.cod);
    seen.add(el.cod);
    return !duplicate;
  });

  arrFinal.forEach(element => {

    conteudo += `
    <option value="${element.cod}">${element.nome}</option>`
  });

  $(`#lingua`).html(conteudo);

}

//consulta na api baseado no filtro
const consultaApi = () => {

  let valor;
  let tipo = $(`#filtro`).val();

  resetaPagination('paises')

  //verifica o tipo de consulta que sera realizada
  if (tipo == 'region')
    valor = $(`#regiao`).val();
  else if (tipo == 'capital')
    valor = $(`#capital`).val();
  else if (tipo == 'lang')
    valor = $(`#lingua`).val();
  else if (tipo == 'name')
    valor = $(`#pais`).val();
  else if (tipo == 'callingcode')
    valor = $(`#codigo`).val();


  // se o usuário não selecionar nenhuma opção, retornar uma mensagem de erro
  if (!valor){

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor selecione a opção desejada!'
    })
    return
  }
    
  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/${tipo}/${valor}`));
  let conteudo = '';

  // monta o conteudo para colocarmos na tela
  for (let i = 0; i < obj.length; i++) {

    conteudo += `
      <li onclick="consultaDetalhes('${obj[i].alpha3Code}')" class=" mt-4 col-xs-12 col-md-3 col-lg-3">
        <img alt="${i}" width="100%" height="100%" src="${obj[i].flag}">
      </li>
      `
  }

  $(`#paises`).html(conteudo);
  $('#paises').paginate({ 'perPage': 3 });
  $('#paises').paginate();

}

//volta na tela inicial a regiao selecionada
const consultaApiRegiaoParametro = (regiao) => {

  $(`#detalhes`).html('');

  $(`#sessao`).removeClass('d-none');
  $(`#detalhes`).toggleClass('d-none');
  $(`#paisesVizinhos`).toggleClass('d-none');

  console.log(regiao)

  $(`#filtro`).val('region');
  $(`#regiao`).val(`${regiao.toLowerCase()}`);

  $("#form-regiao").removeClass('d-none');
  $("#form-capital").addClass('d-none');
  $("#form-lingua").addClass('d-none');
  $("#form-pais").addClass('d-none');
  $("#form-codigo").addClass('d-none');


  $(`#paisesVizinhos`).html('');
  resetaPagination('paisesVizinhos');
  
  $(`#paises`).html('');
  resetaPagination('paises');


}

const resetaPagination = (id) => {

  //reseta a paginação, caso já exista
  if ($(`#${id}`).data('paginate'))
    $(`#${id}`).data('paginate').kill()

}

//mostra os detalhes do pais selecionado
const consultaDetalhes = (code) => {

  resetaPagination('paisesVizinhos');
  $(`#paisesVizinhos`).html('');
  $(`#detalhes`).html('');

  console.log('here')
  let val = code.toLowerCase();
  let obj = JSON.parse(consulta(`https://restcountries.eu/rest/v2/alpha/${val}`));
  let todosPaises = JSON.parse(consulta(`https://restcountries.eu/rest/v2/all`));

  console.log(obj)

  let arrLinguas = obj.languages
  let linguas = '';
  let paisesVisinhos = obj.borders
  let arrPaises = [];
  // busca todas as linguas do país
  arrLinguas.forEach(element => {

    linguas += `${element.name}; `

  });

  // busca o codigo de todos os paises vizinhos
  paisesVisinhos.forEach(element => {
    arrPaises.push(element)
  });

  //busca o resto das informações dos paises vizinhos
  arrResultadoPaisesVisinhos = []
  todosPaises.forEach(pais => {

    arrPaises.forEach(vizinhos => {
      if (pais.alpha3Code == vizinhos)
        arrResultadoPaisesVisinhos.push(pais);
    });

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
  $(`#sessao`).addClass('d-none');
  $(`#detalhes`).removeClass('d-none');


  //  ----------------- paises vizinhos ----------------- // 

  if (arrResultadoPaisesVisinhos.length > 0) {

    let conteudoVizinhos = '<h4>Países Vizinhos</h4></br>';

    // monta o conteudo para colocarmos na tela
    for (let i = 0; i < arrResultadoPaisesVisinhos.length; i++) {

      conteudoVizinhos += `
      <li onclick="consultaDetalhes('${arrResultadoPaisesVisinhos[i].alpha3Code}')" class=" mt-4 col-xs-12 col-md-3 col-lg-3">
        <img alt="${i}" width="100%" height="100%" src="${arrResultadoPaisesVisinhos[i].flag}">
      </li>
      `
    }

    $(`#paisesVizinhos`).html(conteudoVizinhos);
    $('#paisesVizinhos').paginate({ 'perPage': 4 });
    $('#paisesVizinhos').paginate();

  }

}