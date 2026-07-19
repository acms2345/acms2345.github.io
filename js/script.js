document.addEventListener('DOMContentLoaded', function() {
    console.log('Site carregado!\n');
    
    //Parte para o menu
    
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    
    //Ao clicar no menu
    menuBtn.addEventListener('click', function(){
      menuBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.navMenu a').forEach(link => {
      link.addEventListener('click', function(){
        menuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
    })
    
    //Fechar ao clicar fora
    document.addEventListener('click', function(e) {
    if (!e.target.closest('nav')) {
        menuBtn.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    });

    loadLanguage();

});



document.querySelector('.botao_repositorio').addEventListener('click', function() {
    window.location.href = 'https://github.com/acms2345/acms2345.github.io';
});

document.querySelector('.botaoEmail').addEventListener('click', function() {
    window.location.href = 'mailto:acmsme@duck.com';
});


document.querySelector('.botao_perfilGithub').addEventListener('click', function() {
    window.location.href = 'https://github.com/acms2345';
});



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
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

/*Essa função coleta os dados do JSON, e os adiciona no HTML */
async function loadVersionInfo() {
    const dadosJson = await fetch('../version.json', {cache: 'no-store'});
    //Coleta os dados do JSON
    if (!dadosJson.ok) return;
    //Se não conseguir coletar os dados, encerra a função.
    const verificacao = await dadosJson.json();

    document.querySelector('.commitNumber').textContent = `Build ${verificacao.buildNumber}`;
    
    const linkCommit = document.querySelector('.commitURL');
    linkCommit.href = verificacao.commitURL;
    document.querySelector('.commitHash').textContent = verificacao.shortSha;
    
}

document.addEventListener('DOMContentLoaded', loadVersionInfo);

async function setLanguage(linguagem) {
    try {
        const resposta = await fetch(`i18n/${linguagem}.json`, {cache: 'no-store'});
        //Coleta os dados do JSON
        if (!resposta.ok) return;
        //Se não conseguir coletar os dados, encerra a função.
        const dicio = await resposta.json();

        // Aplicar em elementos com data-i18n (texto)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (dicio[key]) {
                el.textContent = dicio[key];
            }
        });

        // Aplicar em elementos com data-i18n-attr (atributos)
        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            const [attrName, key] = el.dataset.i18nAttr.split(':');
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
    img_Hackatime_stats.src = img_Hackatime_statslinkDark

    
} else {
    themeChangeButton.classList.add('white');
    img_Hackatime_stats.src = img_Hackatime_statslinkLight
}

themeChangeButton.addEventListener('click', function() {
    const modoEscuroAtivado = HTMLbody.classList.toggle('darkmode');
    if (!modoEscuroAtivado){
        HTMLbody.classList.remove('darkmode')
        
        themeChangeButton.classList.toggle('white');
        themeChangeButton.classList.remove('black');
        img_Hackatime_stats.src = img_Hackatime_statslinkLight
        
        localStorage.setItem('theme') = 'light'
    } else {
        HTMLbody.classList.add('darkmode')
        
        themeChangeButton.classList.remove('white');
        themeChangeButton.classList.toggle('black');
        img_Hackatime_stats.src = img_Hackatime_statslinkDark

        localStorage.setItem('theme') = 'dark'
    }
})


