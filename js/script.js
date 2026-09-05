document.addEventListener('DOMContentLoaded', function() {
    console.log('Site carregado!\n');
    
    //Parte para o menu
    
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');

    if (menuBtn && navMenu){
    
        //Ao clicar no menu
        menuBtn.addEventListener('click', function(){
            const botaoAtivo = menuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');

            menuBtn.setAttribute('aria-expanded', botaoAtivo)
        });
        
        document.querySelectorAll('.navMenu a').forEach(link => {
        link.addEventListener('click', function(){
            menuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');

            menuBtn.setAttribute('aria-expanded', "false")


        })});
        
        //Fechar ao clicar fora
        document.addEventListener('click', function(e) {
            if (!e.target.closest('nav')) {
                menuBtn.classList.remove('active');
                navMenu.classList.remove('active');

                 menuBtn.setAttribute('aria-expanded', "false")
            }
        });
    }
    

    loadLanguage();

});


const botaoRepositorio = document.querySelector('.botao_repositorio')

if (botaoRepositorio){
    document.querySelector('.botao_repositorio').addEventListener('click', function() {
        window.location.href = 'https://github.com/acms2345/acms2345.github.io';
    });
}






// Highlight do menu ao scrollar
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    if (navLinks){
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }
});

/*Essa função coleta os dados do JSON, e os adiciona no HTML */
async function loadVersionInfo() {
    const dadosJson = await fetch(resolveAsset('version.json'), {cache: 'no-store'});
    //Coleta os dados do JSON
    if (!dadosJson.ok) return;
    //Se não conseguir coletar os dados, encerra a função.
    const verificacao = await dadosJson.json();
    
    const linkCommit = document.querySelector('.commitURL');
    linkCommit.href = verificacao.commitURL;
    document.querySelector('.commitHash').textContent = verificacao.shortSha;
    
}

document.addEventListener('DOMContentLoaded', loadVersionInfo);

function getSiteBaseUrl() {
    const script = Array.from(document.scripts).find(s => s.src.includes('/js/script.js'));
    if (!script) return window.location.href;
    return new URL('../', script.src).href;
}

function resolveAsset(path) {
    return new URL(path, getSiteBaseUrl());
}

let dicionarioAtual = {};

async function setLanguage(linguagem) {
    try {
        const resposta = await fetch(resolveAsset(`translation/${linguagem}.json`), {cache: 'no-store'});
        //Coleta os dados do JSON
        if (!resposta.ok) return;
        //Se não conseguir coletar os dados, encerra a função.
        const dicio = await resposta.json();
        dicionarioAtual = dicio

        // Aplicar em elementos com o atributo 'data-translation'
        document.querySelectorAll('[data-translation]').forEach(el => {
            const key = el.dataset.translation;
            if (dicio[key]) {
                el.textContent = dicio[key];
            }
        });

        // Aplicar em elementos com data-translation-attr (atributos)
        document.querySelectorAll('[data-translation-attr]').forEach(el => {
            const [attrName, key] = el.dataset.translationAttr.split(':');
            if (dicio[key]) {
                el.setAttribute(attrName, dicio[key]);
            }
        });

        document.querySelectorAll('button[data-lang]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`button[data-lang="${linguagem}"]`).classList.add('active');

        

        document.documentElement.lang = linguagem;

    } catch (error){
        console.error('Erro ao carregar idioma: ', error);
    }
}

async function loadLanguage() {
    
    const browserLang = (navigator.language || '').toLowerCase();
    const defaultLang = browserLang.startsWith('pt') ? 'pt' 
    : browserLang.startsWith('en') ? 'en' : 'en';
    setLanguage(defaultLang);
}

function traduzirManualmente(idTexto, textoFallback = ''){
    return dicionarioAtual[idTexto] || textoFallback
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            setLanguage(lang);
        });
    });
});

//O código a seguir faz a mudança de tema (claro/escuro)

const HTMLbody = document.body
const themeChangeButton = document.querySelector('.theme-change_button')
const img_Hackatime_stats = document.querySelector('.img_Hackatime_stats')
const img_Hackatime_statslinkLight = "https://github-readme-stats.hackclub.dev/api/wakatime?username=24102&api_domain=hackatime.hackclub.com&theme=default&custom_title=Programming+Stats&layout=compact&cache_seconds=0&langs_count=8&title_color=667eea&bg_color=f4f4f4&text_color=333&border_color=667eea"
const img_Hackatime_statslinkDark = "https://github-readme-stats.hackclub.dev/api/wakatime?username=24102&api_domain=hackatime.hackclub.com&theme=default&custom_title=Programming+Stats&layout=compact&cache_seconds=0&langs_count=8&title_color=667eea&bg_color=1E293B&text_color=FCFAFA&border_color=667eea"

const temaSalvo = localStorage.getItem('theme')
const prefereModoEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;

if(temaSalvo === 'dark' || (!temaSalvo && prefereModoEscuro)){
    HTMLbody.classList.add('darkmode')
    themeChangeButton.classList.add('black');
    themeChangeButton.classList.remove('white');
    if (img_Hackatime_stats){
        img_Hackatime_stats.src = img_Hackatime_statslinkDark
    }

    
} else {
    themeChangeButton.classList.add('white');
    if (img_Hackatime_stats) {
        img_Hackatime_stats.src = img_Hackatime_statslinkLight
    }
}

themeChangeButton.addEventListener('click', function() {
    const modoEscuroAtivado = HTMLbody.classList.toggle('darkmode');
    if (!modoEscuroAtivado){
        HTMLbody.classList.remove('darkmode')
        
        themeChangeButton.classList.toggle('white');
        themeChangeButton.classList.remove('black');
        if (img_Hackatime_stats){
            img_Hackatime_stats.src = img_Hackatime_statslinkLight
        }
        
        localStorage.setItem('theme', 'light')
    } else {
        HTMLbody.classList.add('darkmode')
        
        themeChangeButton.classList.remove('white');
        themeChangeButton.classList.toggle('black');
        if (img_Hackatime_stats){
            img_Hackatime_stats.src = img_Hackatime_statslinkDark
        }

        localStorage.setItem('theme', 'dark')
    }
})

const video = document.querySelector('.video')
const videoToggle = document.querySelector('.video-toggle')

if (video && videoToggle){
    videoToggle.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            videoToggle.setAttribute('aria-label', 'Pausar vídeo');
            videoToggle.setAttribute('aria-pressed', 'false');
            videoToggle.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            videoToggle.setAttribute('aria-label', 'Reproduzir vídeo');
            videoToggle.setAttribute('aria-pressed', 'true');
            videoToggle.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
}



