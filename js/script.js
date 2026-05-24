document.addEventListener('DOMContentLoaded', function() {
    console.log('Site carregado!\n');
});

document.querySelector('.botao_repositorio').addEventListener('click', function() {
    window.location.href = 'https://github.com/acms2345/acms2345.github.io';
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