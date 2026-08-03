const botaoEnvioLink = document.querySelector('.botaoEnvioLink')
const inputLink = document.querySelector('.inputLink')

const erroTexto = document.querySelector('.erroTexto');
const exibicaoErro = document.querySelector('.exibicaoErro');

const resultadosCitacao = document.querySelector('.resultadosCitacao')

const botaoReport = document.getElementById('reportButton')


function exibirErro(mensagem){
    erroTexto.textContent = mensagem;
    exibicaoErro.style.display = 'flex';
    exibicaoErro.scrollIntoView({behavior: 'smooth'})
};

//Garante que o botão só estará habilitado caso o inputLink esteja preenchido.
inputLink.addEventListener('input', function(){
    botaoEnvioLink.disabled = inputLink.value.trim().length === 0;
    if (inputLink.value.trim().length === 0){
        botaoEnvioLink.style.cursor = 'not-allowed'
    } else {
        botaoEnvioLink.style.cursor = 'pointer'
    }
})

const citacaoInLineTexto = document.querySelector('.citacaoInLineTexto')
const citacaoRefTexto = document.querySelector('.citacaoRefTexto')

var linkValue = ''

botaoEnvioLink.addEventListener('click', async function(){

    linkValue = inputLink.value.trim();

    if (!linkValue){
        exibirErro("Insira um link antes de enviar.")
        return;
    }

    resultadosCitacao.style.display = 'none'
    exibicaoErro.style.display = 'none'
    
    botaoEnvioLink.disabled = true
    botaoEnvioLink.style.cursor = 'not-allowed'
    inputLink.readonly = true


    document.querySelector('.loadingScreen').style.display = 'flex'

    try{
        
        
        const resposta = await fetch("https://geradorabntpy-demo.onrender.com/citar-link", {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({link: linkValue})
        })

        if (!resposta.ok){
            console.error(resposta.status);
            
            if (resposta.status == 400){
                exibirErro(
                    traduzirManualmente("geradorabntdemo.errorScreen.errors.urlNotAllowed", 
                        "A url enviada não é autorizada."))
            }
            else if (resposta.status == 422){
                exibirErro(
                    traduzirManualmente("geradorabntdemo.errorScreen.errors.citationGeneration", 
                        "Não foi possível gerar a citação."))
            }
            else if (resposta.status == 413){
                exibirErro(
                    traduzirManualmente("geradorabntdemo.errorScreen.errors.contentTooLarge", 
                        "O conteúdo do site é grande demais."))
            }
            else if (resposta.status == 429){
                exibirErro(
                    traduzirManualmente("geradorabntdemo.errorScreen.errors.tooManyRequests", 
                        "Muitas solicitações. Aguarde um pouco para enviar a próxima."))
            }
            else if (resposta.status == 415){
                exibirErro(
                    traduzirManualmente("geradorabntdemo.errorScreen.errors.contentType", 
                        "O tipo de arquivo presente no site é inválido."))
            }
            else if (resposta.status == 502){
                exibirErro(
                    traduzirManualmente("geradorabntdemo.errorScreen.errors.inacessibleSite", 
                        "Houve problemas ao acessar o site solicitado."))
            }
            return;
        }


        const resultados = await resposta.json()

        const citacaoInLine = resultados.citacaoInLine
        const citacaoRef = resultados.citacaoRef

        citacaoInLineTexto.textContent = citacaoInLine
        citacaoRefTexto.textContent = citacaoRef

        resultadosCitacao.style.display = 'grid'
        resultadosCitacao.scrollIntoView({behavior: 'smooth'})


    }
    catch (erro){
        
        exibirErro(
            traduzirManualmente("geradorabntdemo.errorScreen.errors.unexpectedError", 
                "Um erro não esperado ocorreu."))

    }
    finally {
        document.querySelector('.loadingScreen').style.display = 'none'

        botaoEnvioLink.disabled = false
        botaoEnvioLink.style.cursor = 'pointer'

        inputLink.readonly = false

        botaoReport.disabled = false
        botaoReport.style.cursor = 'pointer'
    }

})

function copiarTexto(botao, classTexto){
    const textoACopiar = document.querySelector(classTexto).textContent

    const spanTextoBotao = botao.querySelector('.textoBotaoCopiar')
    const textoOriginalBotao = spanTextoBotao.textContent

    navigator.clipboard.writeText(textoACopiar).then(() => {
        spanTextoBotao.textContent = traduzirManualmente("geradorabntdemo.results.copiedButton","Copiado!")

        setTimeout(() => {
            spanTextoBotao.textContent = textoOriginalBotao;
        }, 2000);
    });
    
    
}

async function enviarReporte(comentarioOpcional = ''){

    await fetch('https://formspree.io/f/mgoggwpb', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({
            "urlOriginal" : linkValue,
            "citacao" : citacaoInLineTexto.textContent,
            "referencia": citacaoRefTexto.textContent,
            "comentario" : comentarioOpcional,
            "idiomaPagina" : document.documentElement.lang
        })
    })

    botaoReport.disabled = true
    botaoReport.textContent = traduzirManualmente("geradorabntdemo.report.submitted", "Reporte enviado! Agradeço!")
    botaoReport.style.cursor = 'not-allowed'
}

document.getElementById('openReportButton').addEventListener('click', function(){
    document.getElementById('formReport').style.display = 'grid'
})

