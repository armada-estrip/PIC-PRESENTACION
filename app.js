// Application data
const appData = {
  "institucion": {
    "nombre": "ARMADA DEL ECUADOR",
    "escuela": "ESCUELA DE PERFECCIONAMIENTO DE TRIPULANTES",
    "alias": "SUBP. GERARDO RAYMUNDO RAMÍREZ",
    "ubicacion": "GUAYAQUIL",
    "curso": "CBOP A SGOS",
    "promocion": "70/71"
  },
  "proyecto": {
    "titulo": "DIAGNÓSTICO Y MEJORAMIENTO INTEGRAL DEL PARQUEADERO DE LA ESCUELA DE PERFECCIONAMIENTO DE TRIPULANTES: ENFOQUE EN INFRAESTRUCTURA, SEGURIDAD Y FUNCIONALIDAD",
    "area_parqueadero": "7,500 m²",
    "capacidad_nominal": 100,
    "capacidad_real": 75,
    "capacidad_optimizada": 140,
    "tiempo_maniobra_actual": "5 minutos",
    "tiempo_maniobra_objetivo": "menos de 3 minutos"
  }
};

// Global variables
let currentSection = 'inicio';
let visitedSections = new Set(['inicio']);
let charts = {};

// Sections order for navigation
const sectionsOrder = [
  'inicio', 'resumen', 'introduccion', 'infraestructura', 
  'seguridad', 'funcionalidad', 'normativa', 'mejoramiento', 
  'conclusiones', 'referencias'
];

// Section names mapping
const sectionNames = {
  'inicio': 'Inicio',
  'resumen': 'Resumen Ejecutivo',
  'introduccion': 'Introducción',
  'infraestructura': 'Infraestructura Física',
  'seguridad': 'Seguridad',
  'funcionalidad': 'Funcionalidad',
  'normativa': 'Aplicación de Normativa',
  'mejoramiento': 'Plan de Mejoramiento',
  'conclusiones': 'Conclusiones',
  'referencias': 'Referencias'
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  createCharts();
  setupEventListeners();
  updateProgress();
});

// Initialize application
function initializeApp() {
  // Set initial active states
  const initialNavItem = document.querySelector('[data-section="inicio"]');
  if (initialNavItem) {
    initialNavItem.classList.add('active');
  }
  
  const initialSection = document.getElementById('inicio');
  if (initialSection) {
    initialSection.classList.add('active');
  }
}

// Setup event listeners
function setupEventListeners() {
  // Navigation items (main menu)
  const navItems = document.querySelectorAll('.nav-item:not(.expandable)');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.dataset.section;
      if (section) {
        navigateToSection(section);
      }
    });
  });

  // Expandable menu items
  const expandableItems = document.querySelectorAll('.nav-item.expandable');
  expandableItems.forEach(item => {
    const navLink = item.querySelector('.nav-link');
    if (navLink) {
      navLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        item.classList.toggle('expanded');
      });
    }
  });

  // Sub-menu items
  const subItems = document.querySelectorAll('.sub-item');
  subItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.dataset.section;
      if (section) {
        navigateToSection(section);
      }
    });
  });

  // Breadcrumb navigation
  const breadcrumbLinks = document.querySelectorAll('.breadcrumb-link');
  breadcrumbLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.dataset.section;
      if (section) {
        navigateToSection(section);
      }
    });
  });

  // Start presentation button
  const startBtn = document.getElementById('startPresentation');
  if (startBtn) {
    startBtn.addEventListener('click', function(e) {
      e.preventDefault();
      navigateToSection('resumen');
    });
  }

  // Navigation controls
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      navigatePrevious();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      navigateNext();
    });
  }
  
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleFullscreen();
    });
  }

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboard);

  // Fullscreen change listener
  document.addEventListener('fullscreenchange', updateFullscreenButton);
  document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
  document.addEventListener('mozfullscreenchange', updateFullscreenButton);
  document.addEventListener('MSFullscreenChange', updateFullscreenButton);
}

// Navigate to specific section
function navigateToSection(sectionId) {
  if (!sectionId || sectionId === currentSection) return;

  // Remove active states from all sections and nav items
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  document.querySelectorAll('.sub-item').forEach(item => {
    item.classList.remove('active');
  });

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    currentSection = sectionId;
    visitedSections.add(sectionId);
  }

  // Update navigation active state
  const navItem = document.querySelector(`[data-section="${sectionId}"]`);
  if (navItem) {
    navItem.classList.add('active');
    
    // If it's a sub-item, also expand and activate parent
    if (navItem.classList.contains('sub-item')) {
      const parentItem = navItem.closest('.nav-item.expandable');
      if (parentItem) {
        parentItem.classList.add('expanded', 'active');
      }
    }
  }

  // Update progress and breadcrumbs
  updateProgress();
  updateNavigationButtons();
  
  // Scroll to top of content
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.scrollTop = 0;
  }
}

// Navigate to previous section
function navigatePrevious() {
  const currentIndex = sectionsOrder.indexOf(currentSection);
  if (currentIndex > 0) {
    const previousSection = sectionsOrder[currentIndex - 1];
    navigateToSection(previousSection);
  }
}

// Navigate to next section
function navigateNext() {
  const currentIndex = sectionsOrder.indexOf(currentSection);
  if (currentIndex < sectionsOrder.length - 1) {
    const nextSection = sectionsOrder[currentIndex + 1];
    navigateToSection(nextSection);
  }
}

// Update progress indicators
function updateProgress() {
  const currentIndex = sectionsOrder.indexOf(currentSection);
  const progress = ((currentIndex + 1) / sectionsOrder.length) * 100;
  
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  const sectionProgress = document.getElementById('sectionProgress');
  if (sectionProgress) {
    sectionProgress.textContent = `${currentIndex + 1} / ${sectionsOrder.length}`;
  }
}

// Update navigation buttons
function updateNavigationButtons() {
  const currentIndex = sectionsOrder.indexOf(currentSection);
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (prevBtn) {
    prevBtn.disabled = currentIndex === 0;
    prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
  }

  if (nextBtn) {
    nextBtn.disabled = currentIndex === sectionsOrder.length - 1;
    nextBtn.style.opacity = currentIndex === sectionsOrder.length - 1 ? '0.5' : '1';
  }
}

// Create interactive charts
function createCharts() {
  // Add delay to ensure DOM is ready
  setTimeout(() => {
    createPavimentChart();
    createFlowChart();
    createComparisonChart();
  }, 100);
}

// Create pavement distribution chart
function createPavimentChart() {
  const ctx = document.getElementById('pavimentChart');
  if (!ctx) return;

  try {
    charts.paviment = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Asfalto (Buen Estado)', 'Asfalto No Refinado', 'Tierra'],
        datasets: [{
          data: [30, 60, 10],
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
          borderWidth: 3,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Distribución Actual del Pavimento',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#1e3a8a'
          },
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.parsed}% del área total`;
              }
            }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1000
        },
        onClick: function(event, elements) {
          if (elements.length > 0) {
            const dataIndex = elements[0].index;
            const labels = ['Asfalto en buen estado', 'Asfalto no refinado', 'Tierra'];
            const values = [30, 60, 10];
            const descriptions = [
              'Superficie en condiciones aceptables',
              'Requiere mantenimiento y refinamiento',
              'Área sin pavimentar, genera lodo en lluvias'
            ];
            alert(`${labels[dataIndex]}: ${values[dataIndex]}% del área total\n${descriptions[dataIndex]}`);
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating pavement chart:', error);
  }
}

// Create vehicle flow chart
function createFlowChart() {
  const ctx = document.getElementById('flowChart');
  if (!ctx) return;

  try {
    charts.flow = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Entrada (07:00-07:30)', 'Salida (17:00-17:30)'],
        datasets: [
          {
            label: 'Automóviles',
            data: [60, 60],
            backgroundColor: '#1FB8CD',
            borderRadius: 6,
            borderWidth: 2,
            borderColor: '#ffffff'
          },
          {
            label: 'Motocicletas',
            data: [20, 20],
            backgroundColor: '#FFC185',
            borderRadius: 6,
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Flujo Vehicular en Horas Pico',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#1e3a8a'
          },
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              afterLabel: function(context) {
                if (context.datasetIndex === 0) {
                  return 'Tiempo promedio de maniobra: 5 minutos';
                }
                return 'Mayor riesgo por pavimento irregular';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de Vehículos',
              font: {
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Horarios Críticos',
              font: {
                weight: 'bold'
              }
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating flow chart:', error);
  }
}

// Create before/after comparison chart
function createComparisonChart() {
  const ctx = document.getElementById('comparisonChart');
  if (!ctx) return;

  try {
    charts.comparison = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Capacidad', 'Seguridad', 'Funcionalidad', 'Cumplimiento Normativo', 'Eficiencia'],
        datasets: [
          {
            label: 'Situación Actual',
            data: [75, 30, 60, 0, 50],
            fill: true,
            backgroundColor: 'rgba(180, 65, 60, 0.2)',
            borderColor: '#B4413C',
            pointBackgroundColor: '#B4413C',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#B4413C',
            borderWidth: 3
          },
          {
            label: 'Después del Mejoramiento',
            data: [140, 95, 90, 100, 85],
            fill: true,
            backgroundColor: 'rgba(31, 184, 205, 0.2)',
            borderColor: '#1FB8CD',
            pointBackgroundColor: '#1FB8CD',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#1FB8CD',
            borderWidth: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Comparación: Antes vs Después del Mejoramiento',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#1e3a8a'
          },
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              afterLabel: function(context) {
                const improvements = [
                  'vehículos (+87% incremento)',
                  '% nivel de seguridad',
                  '% eficiencia operacional', 
                  '% cumplimiento normativo',
                  '% eficiencia general'
                ];
                return improvements[context.dataIndex] || '';
              }
            }
          }
        },
        elements: {
          line: {
            borderWidth: 3
          },
          point: {
            radius: 6,
            hoverRadius: 8
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 150,
            ticks: {
              stepSize: 30,
              font: {
                size: 10
              }
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            },
            angleLines: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating comparison chart:', error);
  }
}

// Handle search functionality
function handleSearch(event) {
  const query = event.target.value.toLowerCase().trim();
  
  if (query.length < 2) {
    clearSearchHighlights();
    resetNavigationHighlights();
    return;
  }

  clearSearchHighlights();
  
  // Search through all sections
  const sections = document.querySelectorAll('.content-section');
  let foundResults = [];

  sections.forEach(section => {
    const textContent = section.textContent.toLowerCase();
    const sectionId = section.id;
    
    if (textContent.includes(query)) {
      foundResults.push({
        sectionId: sectionId,
        element: section
      });
      
      // Highlight the search term
      highlightSearchTerm(section, query);
    }
  });

  // Update navigation to show search results
  if (foundResults.length > 0) {
    showSearchResults(foundResults);
  } else {
    resetNavigationHighlights();
  }
}

// Highlight search terms
function highlightSearchTerm(element, query) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];
  let node;

  while (node = walker.nextNode()) {
    if (node.parentElement.tagName !== 'SCRIPT' && 
        node.parentElement.tagName !== 'STYLE') {
      textNodes.push(node);
    }
  }

  textNodes.forEach(textNode => {
    const text = textNode.textContent;
    const regex = new RegExp(`(${query})`, 'gi');
    
    if (regex.test(text)) {
      const highlightedText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
      const span = document.createElement('span');
      span.innerHTML = highlightedText;
      textNode.parentNode.replaceChild(span, textNode);
    }
  });
}

// Clear search highlights
function clearSearchHighlights() {
  const highlights = document.querySelectorAll('.search-highlight');
  highlights.forEach(highlight => {
    const parent = highlight.parentNode;
    parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
    parent.normalize();
  });
}

// Show search results
function showSearchResults(results) {
  const navItems = document.querySelectorAll('.nav-item, .sub-item');
  navItems.forEach(item => {
    const sectionId = item.dataset.section;
    const hasResults = results.some(result => result.sectionId === sectionId);
    
    if (hasResults) {
      item.style.backgroundColor = 'rgba(251, 191, 36, 0.3)';
      item.style.borderLeft = '4px solid #fbbf24';
    } else {
      item.style.backgroundColor = '';
      item.style.borderLeft = '';
    }
  });
}

// Reset navigation highlights
function resetNavigationHighlights() {
  const navItems = document.querySelectorAll('.nav-item, .sub-item');
  navItems.forEach(item => {
    item.style.backgroundColor = '';
    item.style.borderLeft = '';
  });
}

// Handle keyboard navigation
function handleKeyboard(event) {
  // Don't interfere when typing in search box
  if (event.target.id === 'searchInput') return;

  switch(event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      navigatePrevious();
      break;
    case 'ArrowRight':
      event.preventDefault();
      navigateNext();
      break;
    case 'Escape':
      if (isFullscreen()) {
        exitFullscreen();
      }
      break;
    case 'f':
    case 'F':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        toggleFullscreen();
      }
      break;
  }
}

// Fullscreen functionality
function toggleFullscreen() {
  if (!isFullscreen()) {
    enterFullscreen();
  } else {
    exitFullscreen();
  }
}

function enterFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(err => {
      console.log(`Error entering fullscreen: ${err.message}`);
    });
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

function isFullscreen() {
  return !!(document.fullscreenElement || 
           document.webkitFullscreenElement || 
           document.mozFullScreenElement || 
           document.msFullscreenElement);
}

function updateFullscreenButton() {
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  if (fullscreenBtn) {
    if (isFullscreen()) {
      fullscreenBtn.innerHTML = '🗗 Salir Pantalla Completa';
      fullscreenBtn.title = 'Salir de pantalla completa';
    } else {
      fullscreenBtn.innerHTML = '🔳 Pantalla Completa';
      fullscreenBtn.title = 'Activar pantalla completa';
    }
  }
}

// Add interactive behaviors
document.addEventListener('DOMContentLoaded', function() {
  // Add hover effects to stat cards
  const statCards = document.querySelectorAll('.stat-card, .benefit-card, .plan-card');
  statCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px) scale(1.02)';
      this.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Add click handlers for problem items
  const problemItems = document.querySelectorAll('.problem-item');
  problemItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', function() {
      const title = this.querySelector('h4').textContent;
      const description = this.querySelector('p').textContent;
      alert(`${title}\n\n${description}`);
    });
  });

  // Add tooltips to compliance items
  const complianceItems = document.querySelectorAll('.compliance-item');
  complianceItems.forEach(item => {
    item.style.cursor = 'help';
    item.addEventListener('click', function() {
      const title = this.querySelector('h4').textContent;
      const description = this.querySelector('p').textContent;
      const status = this.querySelector('.compliance-status').textContent;
      alert(`${title}\n\nEstado: ${status}\n\nDetalles: ${description}`);
    });
  });
});

// Handle window resize
window.addEventListener('resize', function() {
  // Redraw charts on resize
  Object.values(charts).forEach(chart => {
    if (chart && chart.resize) {
      chart.resize();
    }
  });
});

// CSS for search highlights and animations
const searchStyle = document.createElement('style');
searchStyle.textContent = `
  .search-highlight {
    background-color: #fbbf24 !important;
    color: #000 !important;
    padding: 2px 4px;
    border-radius: 3px;
    font-weight: bold;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  
  .breadcrumb-link {
    color: #1e3a8a;
    cursor: pointer;
    text-decoration: none;
    border-bottom: 1px dotted #1e3a8a;
    transition: all 0.2s ease;
  }
  
  .breadcrumb-link:hover {
    color: #3b82f6;
    border-bottom-style: solid;
  }
  
  .current-section {
    color: #6b7280;
    font-weight: 500;
  }
  
  .nav-link, .sub-link {
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .nav-item:hover .nav-link,
  .sub-item:hover .sub-link {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .content-section {
    opacity: 0;
    transform: translateX(20px);
    transition: all 0.4s ease;
  }
  
  .content-section.active {
    opacity: 1;
    transform: translateX(0);
  }
  
  .stat-card, .benefit-card, .plan-card {
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .problem-item, .compliance-item {
    transition: all 0.2s ease;
  }
  
  .problem-item:hover, .compliance-item:hover {
    background-color: var(--color-bg-2) !important;
    transform: translateX(4px);
  }
  
  @media (max-width: 768px) {
    .content-section {
      transform: translateY(20px);
    }
    
    .content-section.active {
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(searchStyle);