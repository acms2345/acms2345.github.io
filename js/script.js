document.addEventListener('DOMContentLoaded', function() {
    console.log('Site carregado!');
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