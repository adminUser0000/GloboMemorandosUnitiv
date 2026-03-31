// Configuração global
let world;
let currentFilter = 'todos';
let currentSearchTerm = '';
let activeCountry = null;
let allCountries = [...memorandos];

// Posição original da câmera (como estava no código original)
const CAMERA_ORIGINAL = {
    lat: 15,
    lng: 15,
    altitude: 2.8
};

// Elementos DOM
const globeContainer = document.getElementById('globe-container');
const searchPanel = document.getElementById('searchPanel');
const statsPanel = document.getElementById('statsPanel');
const detailDrawer = document.getElementById('detailDrawer');
const drawerTitle = document.getElementById('drawerTitle');
const drawerContent = document.getElementById('drawerContent');
const globalSearch = document.getElementById('globalSearch');
const filterChips = document.getElementById('filterChips');
const resultBadge = document.getElementById('resultBadge');
const resultCount = document.getElementById('resultCount');

// Verificar se é mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Verificar se é mobile pequeno (até 480px)
function isSmallMobile() {
    return window.innerWidth <= 480;
}

// Atualizar estatísticas
document.getElementById('statPaises').textContent = totalPaises;
document.getElementById('statMemorandos').textContent = totalMemorandos;
document.getElementById('statInstituicoes').textContent = totalInstituicoes;

// Função para resetar câmera para posição original
function resetCamera() {
    if (world) {
        world.pointOfView(CAMERA_ORIGINAL, 1000);
    }
}

// Função para resetar todos os filtros e voltar ao estado "Todos"
function resetToTodos() {
    // Resetar filtros
    currentFilter = 'todos';
    currentSearchTerm = '';
    
    // Limpar campo de busca
    if (globalSearch) {
        globalSearch.value = '';
    }
    
    // Atualizar chips - marcar "Todos" como ativo
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    const chipTodos = document.querySelector('[data-tipo="todos"]');
    if (chipTodos) {
        chipTodos.classList.add('active');
    }
    
    // Fechar drawer se estiver aberto
    if (detailDrawer.classList.contains('open')) {
        closeDrawer();
    }
    
    // Resetar câmera
    resetCamera();
    
    // Atualizar globo
    updateGlobeAndCount();
    
    // Esconder badge de resultados
    resultBadge.classList.add('hidden');
}

// Função para aplicar filtros e atualizar tudo
function aplicarFiltros() {
    updateGlobeAndCount();
    
    // Se não houver filtros ativos (todos e sem busca), resetar câmera
    if (currentFilter === 'todos' && (!currentSearchTerm || currentSearchTerm.trim() === '')) {
        resetCamera();
    }
    
    if (activeCountry) {
        const paisAtualizado = allCountries.find(p => p.pais === activeCountry.pais);
        if (paisAtualizado) {
            loadCountryDetails(paisAtualizado);
        }
    }
}

// Renderizar chips de filtro
function renderFilterChips() {
    const isSmall = isSmallMobile();
    
    let html = `
        <span class="chip ${currentFilter === 'todos' ? 'active' : ''}" data-tipo="todos" style="font-size: ${isSmall ? '11px' : '13px'}; padding: ${isSmall ? '6px 10px' : '8px 16px'};">
            <i class="fas fa-globe"></i> ${isSmall ? '' : 'Todos '}(${totalMemorandos})
        </span>
    `;
    
    Object.entries(tiposInstituicao).forEach(([key, value]) => {
        if (value.count > 0) {
            html += `
                <span class="chip ${currentFilter === key ? 'active' : ''}" data-tipo="${key}" style="font-size: ${isSmall ? '11px' : '13px'}; padding: ${isSmall ? '6px 10px' : '8px 16px'};">
                    <i class="fas ${value.icon}"></i> ${isSmall ? '' : value.nome + ' '}(${value.count})
                </span>
            `;
        }
    });
    
    filterChips.innerHTML = html;
    
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.tipo;
            
            // Se clicou em "Todos", resetar busca também
            if (currentFilter === 'todos') {
                currentSearchTerm = '';
                if (globalSearch) {
                    globalSearch.value = '';
                }
                resetCamera();
            }
            
            aplicarFiltros();
            
            // Em mobile, fechar painéis após selecionar filtro
            if (isMobile()) {
                searchPanel.classList.remove('visible');
                statsPanel.classList.remove('visible');
            }
        });
    });
}

// Mini estatísticas por tipo
function renderTipoMiniStats() {
    const container = document.getElementById('tipoMiniStats');
    const isSmall = isSmallMobile();
    let html = '';
    Object.entries(tiposInstituicao).forEach(([key, value]) => {
        if (value.count > 0) {
            html += `<div class="mini-tipo" style="border-left-color: ${value.cor}; font-size: ${isSmall ? '10px' : '12px'}; padding: ${isSmall ? '6px 8px' : '8px 12px'};">${value.nome}: ${value.count}</div>`;
        }
    });
    container.innerHTML = html;
}

// Formatar data para DD/MM/AAAA
function formatarData(dataStr) {
    if (!dataStr || dataStr === 'NS') return 'Não especificada';
    try {
        const data = new Date(dataStr);
        return data.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch {
        return dataStr;
    }
}

// Função para filtrar acordos de um país
function filtrarAcordosDoPais(pais) {
    if (!pais) return [];
    
    let acordosFiltrados = [...pais.acordos];
    
    if (currentFilter !== 'todos') {
        acordosFiltrados = acordosFiltrados.filter(a => a.tipo_instituicao === currentFilter);
    }
    
    if (currentSearchTerm && currentSearchTerm.trim() !== '') {
        const term = currentSearchTerm.toLowerCase().trim();
        acordosFiltrados = acordosFiltrados.filter(a => 
            a.entidade.toLowerCase().includes(term) ||
            a.descricao.toLowerCase().includes(term) ||
            a.assinante_unitiva.toLowerCase().includes(term) ||
            a.assinante_parceiro.toLowerCase().includes(term)
        );
    }
    
    return acordosFiltrados;
}

// Renderizar filtros dentro do drawer
function renderDrawerFilters(pais, acordosFiltrados) {
    const isMobileDevice = isMobile();
    const isSmall = isSmallMobile();
    
    const contagemTipos = {
        todos: pais.acordos.length
    };
    
    Object.keys(tiposInstituicao).forEach(key => {
        contagemTipos[key] = pais.acordos.filter(a => a.tipo_instituicao === key).length;
    });
    
    let filtrosHtml = `
        <div style="margin-bottom: ${isSmall ? '15px' : '20px'};">
            <h5 style="color: var(--primary); margin-bottom: ${isSmall ? '8px' : '12px'}; font-size: ${isSmall ? '13px' : '16px'};">
                <i class="fas fa-filter"></i> Filtrar por tipo:
            </h5>
            <div style="display: flex; flex-wrap: wrap; gap: ${isSmall ? '6px' : '10px'};">
    `;
    
    filtrosHtml += `
        <button class="drawer-filter-btn ${currentFilter === 'todos' ? 'active' : ''}" data-tipo="todos" style="
            padding: ${isSmall ? '6px 10px' : (isMobileDevice ? '8px 14px' : '10px 18px')};
            border: 2px solid ${currentFilter === 'todos' ? '#C41E3A' : '#e2e8f0'};
            background: ${currentFilter === 'todos' ? '#C41E3A' : 'white'};
            color: ${currentFilter === 'todos' ? 'white' : '#475569'};
            border-radius: 30px;
            font-size: ${isSmall ? '11px' : (isMobileDevice ? '12px' : '14px')};
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: ${isSmall ? '4px' : '6px'};
        ">
            <i class="fas fa-globe"></i> ${isSmall ? '' : 'Todos '}(${contagemTipos.todos})
        </button>
    `;
    
    Object.entries(tiposInstituicao).forEach(([key, value]) => {
        if (contagemTipos[key] > 0) {
            filtrosHtml += `
                <button class="drawer-filter-btn ${currentFilter === key ? 'active' : ''}" data-tipo="${key}" style="
                    padding: ${isSmall ? '6px 10px' : (isMobileDevice ? '8px 14px' : '10px 18px')};
                    border: 2px solid ${currentFilter === key ? value.cor : '#e2e8f0'};
                    background: ${currentFilter === key ? value.cor : 'white'};
                    color: ${currentFilter === key ? 'white' : '#475569'};
                    border-radius: 30px;
                    font-size: ${isSmall ? '11px' : (isMobileDevice ? '12px' : '14px')};
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: ${isSmall ? '4px' : '6px'};
                ">
                    <i class="fas ${value.icon}"></i> ${isSmall ? '' : value.nome + ' '}(${contagemTipos[key]})
                </button>
            `;
        }
    });
    
    filtrosHtml += `
            </div>
        </div>
    `;
    
    return filtrosHtml;
}

// Função para carregar detalhes do país
function loadCountryDetails(pais) {
    if (!pais) return;
    
    activeCountry = pais;
    const acordosFiltrados = filtrarAcordosDoPais(pais);
    const isMobileDevice = isMobile();
    const isSmall = isSmallMobile();
    
    const totalFiltrado = acordosFiltrados.length;
    const totalOriginal = pais.acordos.length;
    drawerTitle.innerHTML = `
        ${pais.pais} · ${pais.continente}
        <span style="font-size: ${isSmall ? '0.7rem' : '0.9rem'}; background: rgba(255,255,255,0.2); padding: ${isSmall ? '3px 8px' : '4px 12px'}; border-radius: 30px; margin-left: ${isSmall ? '4px' : '8px'};">
            ${totalFiltrado}/${totalOriginal}
        </span>
    `;

    const filtrosDrawerHtml = renderDrawerFilters(pais, acordosFiltrados);

    if (acordosFiltrados.length === 0) {
        drawerContent.innerHTML = `
            ${filtrosDrawerHtml}
            <div class="empty-state">
                <i class="fas fa-filter" style="font-size: ${isSmall ? '2rem' : '3rem'}; margin-bottom: 15px;"></i>
                <h3 style="color: var(--primary); margin-bottom: 10px; font-size: ${isSmall ? '16px' : (isMobileDevice ? '18px' : '22px')};">Nenhum memorando encontrado</h3>
                <p style="color: #64748b; font-size: ${isSmall ? '12px' : (isMobileDevice ? '13px' : '15px')};">Tente remover alguns filtros para ver mais resultados</p>
                <button onclick="resetToTodos()" style="
                    background: var(--accent);
                    color: white;
                    border: none;
                    padding: ${isSmall ? '8px 16px' : (isMobileDevice ? '10px 20px' : '12px 24px')};
                    border-radius: 30px;
                    margin-top: 20px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: ${isSmall ? '12px' : (isMobileDevice ? '13px' : '15px')};
                    box-shadow: 0 4px 10px rgba(196,30,58,0.3);
                    transition: all 0.3s;
                ">
                    <i class="fas fa-times"></i> Limpar filtros
                </button>
            </div>
        `;
        detailDrawer.classList.add('open');
        adicionarEventListenersFiltrosDrawer();
        return;
    }

    let html = filtrosDrawerHtml;
    
    html += `
        <div style="
            background: linear-gradient(135deg, var(--primary) 0%, #1a365d 100%);
            color: white;
            padding: ${isSmall ? '12px' : (isMobileDevice ? '15px' : '20px')};
            border-radius: 16px;
            margin-bottom: ${isSmall ? '15px' : '20px'};
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: ${isSmall ? '12px' : (isMobileDevice ? '13px' : '16px')};"><i class="fas fa-file-signature"></i> <strong>${acordosFiltrados.length}</strong> memorandos</span>
                <span style="background: rgba(255,255,255,0.2); padding: ${isSmall ? '3px 8px' : '5px 12px'}; border-radius: 30px; font-size: ${isSmall ? '10px' : (isMobileDevice ? '11px' : '13px')};">
                    <i class="fas fa-filter"></i> ${currentFilter === 'todos' ? 'Todos' : tiposInstituicao[currentFilter]?.nome}
                </span>
            </div>
            ${currentSearchTerm ? `
                <div style="font-size: ${isSmall ? '10px' : (isMobileDevice ? '11px' : '13px')}; background: rgba(255,255,255,0.1); padding: ${isSmall ? '6px' : '8px'}; border-radius: 8px;">
                    <i class="fas fa-search"></i> Busca: "${currentSearchTerm.substring(0, 30)}${currentSearchTerm.length > 30 ? '...' : ''}"
                </div>
            ` : ''}
        </div>
    `;
    
    acordosFiltrados.sort((a, b) => b.numero - a.numero).forEach(a => {
        const tipoInfo = tiposInstituicao[a.tipo_instituicao] || tiposInstituicao.outro;
        const dataFormatada = a.data !== 'NS' ? formatarData(a.data) : 'Não especificada';
        const duracao = a.duracao !== 'NS' ? a.duracao : 'Não especificada';
        const renovacao = a.tipo_renovacao !== 'NS' ? a.tipo_renovacao : 'Não especificada';
        
        // Ajustar tamanhos para mobile pequeno
        const logoSize = isSmall ? '50px' : (isMobileDevice ? '60px' : '80px');
        const iconSize = isSmall ? '12px' : (isMobileDevice ? '13px' : '14px');
        const titleSize = isSmall ? '14px' : (isMobileDevice ? '16px' : '20px');
        const descSize = isSmall ? '11px' : (isMobileDevice ? '12px' : '15px');
        
        html += `
            <div class="agreement-card" id="acordo-${a.numero}" style="padding: ${isSmall ? '12px' : (isMobileDevice ? '15px' : '18px')};">
                <div style="display: flex; gap: ${isSmall ? '10px' : (isMobileDevice ? '12px' : '20px')}; align-items: flex-start;">
                    <div style="flex-shrink: 0;">
                        <div style="width: ${logoSize}; height: ${logoSize}; background: #f8fafc; border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; overflow: hidden;">
                            <img src="${a.caminho_imagem}" alt="${a.entidade}" 
                                 style="width: 100%; height: 100%; object-fit: cover;"
                                 onerror="this.src='https://placehold.co/${logoSize}/e2e8f0/475569?text=Logo'">
                        </div>
                    </div>
                    
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: ${isSmall ? '6px' : '8px'}; flex-wrap: wrap; gap: 6px;">
                            <span class="agreement-number" style="font-size: ${isSmall ? '10px' : (isMobileDevice ? '11px' : '14px')}; font-weight: 600;">Memorando nº ${a.numero}</span>
                            <span class="tipo-badge-card" style="background: ${tipoInfo.cor}; font-size: ${isSmall ? '9px' : (isMobileDevice ? '10px' : '13px')}; padding: ${isSmall ? '2px 8px' : '4px 12px'}; border-radius: 20px; white-space: nowrap;">${isSmall ? tipoInfo.nome.substring(0, 8) : tipoInfo.nome}</span>
                        </div>
                        
                        <h4 style="font-size: ${titleSize}; margin: 0 0 ${isSmall ? '6px' : '10px'} 0; line-height: 1.3; color: var(--primary); font-weight: 700; word-break: break-word;">${a.entidade}</h4>
                        
                        <div style="display: flex; flex-wrap: wrap; gap: ${isSmall ? '6px' : (isMobileDevice ? '8px' : '15px')}; margin-bottom: ${isSmall ? '6px' : '10px'};">
                            <div style="display: flex; align-items: center; gap: 4px;">
                                <i class="fas fa-calendar" style="width: 12px; font-size: ${iconSize}; color: #64748b;"></i>
                                <span style="font-size: ${iconSize};"><strong>Data:</strong> ${dataFormatada.substring(0, isSmall ? 8 : 100)}${isSmall && dataFormatada.length > 8 ? '...' : ''}</span>
                            </div>
                            
                            <div style="display: flex; align-items: center; gap: 4px;">
                                <i class="fas fa-hourglass-half" style="width: 12px; font-size: ${iconSize}; color: #64748b;"></i>
                                <span style="font-size: ${iconSize};"><strong>Duração:</strong> ${duracao.substring(0, isSmall ? 12 : 100)}${isSmall && duracao.length > 12 ? '...' : ''}</span>
                            </div>
                            
                            <div style="display: flex; align-items: center; gap: 4px;">
                                <i class="fas fa-sync-alt" style="width: 12px; font-size: ${iconSize}; color: #64748b;"></i>
                                <span style="font-size: ${iconSize};"><strong>Renovação:</strong> ${renovacao.substring(0, isSmall ? 12 : 100)}${isSmall && renovacao.length > 12 ? '...' : ''}</span>
                            </div>
                        </div>
                        
                        <div class="agreement-desc" style="font-size: ${descSize}; margin-bottom: ${isSmall ? '8px' : '12px'}; line-height: 1.4; color: #475569;">
                            <i class="fas fa-quote-left" style="opacity: 0.5; font-size: 0.7rem;"></i>
                            ${a.descricao.length > (isSmall ? 60 : (isMobileDevice ? 80 : 120)) ? a.descricao.substring(0, (isSmall ? 60 : (isMobileDevice ? 80 : 120))) + '...' : a.descricao}
                        </div>
                        
                        <button class="ver-mais-btn" onclick="toggleDetalhes(${a.numero})" style="font-size: ${isSmall ? '10px' : (isMobileDevice ? '11px' : '13px')}; padding: ${isSmall ? '4px 8px' : (isMobileDevice ? '5px 10px' : '8px 16px')}; background: none; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; color: #C41E3A; font-weight: 500;">
                            <i class="fas fa-chevron-down"></i> Ver detalhes
                        </button>
                        
                        <div id="detalhes-${a.numero}" style="display: none; margin-top: ${isSmall ? '8px' : '12px'}; padding-top: ${isSmall ? '8px' : '12px'}; border-top: 1px dashed #e2e8f0;">
                            <h5 style="color: var(--primary); margin-bottom: ${isSmall ? '6px' : '10px'}; font-size: ${isSmall ? '11px' : (isMobileDevice ? '12px' : '14px')};">
                                <i class="fas fa-pen-fancy"></i> Detalhes da assinatura
                            </h5>
                            
                            <div style="margin-bottom: ${isSmall ? '4px' : '8px'};">
                                <i class="fas fa-user-graduate" style="color: var(--primary); width: 16px; font-size: ${iconSize};"></i>
                                <div style="font-size: ${iconSize}; margin-top: 4px; word-break: break-word;">
                                    <strong>UNITIVA:</strong><br>
                                    ${a.assinante_unitiva.length > (isSmall ? 40 : 80) ? a.assinante_unitiva.substring(0, (isSmall ? 40 : 80)) + '...' : a.assinante_unitiva}
                                </div>
                            </div>
                            
                            <div>
                                <i class="fas fa-user-tie" style="color: var(--primary); width: 16px; font-size: ${iconSize};"></i>
                                <div style="font-size: ${iconSize}; margin-top: 4px; word-break: break-word;">
                                    <strong>Parceiro:</strong><br>
                                    ${a.assinante_parceiro.length > (isSmall ? 40 : 80) ? a.assinante_parceiro.substring(0, (isSmall ? 40 : 80)) + '...' : a.assinante_parceiro}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    drawerContent.innerHTML = html;
    detailDrawer.classList.add('open');
    adicionarEventListenersFiltrosDrawer();
}

function adicionarEventListenersFiltrosDrawer() {
    document.querySelectorAll('.drawer-filter-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const novoTipo = this.dataset.tipo;
            currentFilter = novoTipo;
            
            document.querySelectorAll('.chip').forEach(chip => {
                if (chip.dataset.tipo === novoTipo) {
                    chip.classList.add('active');
                } else {
                    chip.classList.remove('active');
                }
            });
            
            // Se selecionou "Todos", resetar busca também
            if (novoTipo === 'todos') {
                currentSearchTerm = '';
                if (globalSearch) {
                    globalSearch.value = '';
                }
                resetCamera();
            }
            
            if (activeCountry) {
                loadCountryDetails(activeCountry);
            }
            
            updateGlobeAndCount();
        });
    });
}

window.toggleDetalhes = function(numero) {
    const detalhesDiv = document.getElementById(`detalhes-${numero}`);
    const botao = document.querySelector(`#acordo-${numero} .ver-mais-btn`);
    
    if (detalhesDiv.style.display === 'none') {
        detalhesDiv.style.display = 'block';
        botao.innerHTML = '<i class="fas fa-chevron-up"></i> Ver menos';
    } else {
        detalhesDiv.style.display = 'none';
        botao.innerHTML = '<i class="fas fa-chevron-down"></i> Ver detalhes';
    }
};

window.resetFilters = function() {
    resetToTodos();
};

function closeDrawer() {
    detailDrawer.classList.remove('open');
    activeCountry = null;
    
    // Limpar todos os filtros ao fechar o drawer
    if (currentFilter !== 'todos' || (currentSearchTerm && currentSearchTerm.trim() !== '')) {
        currentFilter = 'todos';
        currentSearchTerm = '';
        
        // Limpar campo de busca global
        if (globalSearch) {
            globalSearch.value = '';
        }
        
        // Atualizar chips - marcar "Todos" como ativo
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        const chipTodos = document.querySelector('[data-tipo="todos"]');
        if (chipTodos) {
            chipTodos.classList.add('active');
        }
        
        // Atualizar o globo com os filtros resetados
        updateGlobeAndCount();
    }
    
    resetCamera();
}

function initGlobe() {
    const pointsData = allCountries.map(p => ({
        lat: p.lat,
        lng: p.lng,
        pais: p.pais,
        totalAcordos: p.acordos.length,
        acordos: p.acordos,
        continente: p.continente
    }));

    world = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .htmlElementsData(pointsData)
        .htmlLat(d => d.lat)
        .htmlLng(d => d.lng)
        .htmlElement(d => {
            const container = document.createElement('div');
            container.style.cursor = 'pointer';
            container.style.pointerEvents = 'auto';
            
            // Ajustar tamanho do marcador para mobile
            const isSmall = isSmallMobile();
            const markerSize = isSmall ? 36 : (isMobile() ? 40 : 56);
            const iconSize = isSmall ? 16 : (isMobile() ? 18 : 26);
            const fontSize = isSmall ? 10 : (isMobile() ? 11 : 15);
            const topOffset = isSmall ? -38 : (isMobile() ? -44 : -48);
            
            const marker = document.createElement('div');
            marker.style.cssText = `
                background: white;
                width: ${markerSize}px;
                height: ${markerSize}px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 25px rgba(0,0,0,0.5);
                border: 4px solid #C41E3A;
                transition: all 0.3s ease;
                position: relative;
                animation: pulse 2s infinite;
            `;
            
            const paisNome = d.pais.length > (isSmall ? 10 : 15) ? d.pais.substring(0, (isSmall ? 8 : 12)) + '...' : d.pais;
            
            marker.innerHTML = `
                <i class="fas fa-handshake" style="font-size: ${iconSize}px; color: #C41E3A;"></i>
                <span style="
                    position: absolute;
                    top: ${topOffset}px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #002147;
                    color: white;
                    padding: ${isSmall ? '4px 8px' : (isMobile() ? '6px 10px' : '8px 16px')};
                    border-radius: 40px;
                    font-size: ${fontSize}px;
                    font-weight: bold;
                    white-space: nowrap;
                    border: 2px solid #FFB81C;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
                    pointer-events: none;
                    z-index: 1000;
                    letter-spacing: 0.3px;
                ">${paisNome} (${d.totalAcordos})</span>
            `;
            
            container.appendChild(marker);
            
            container.onclick = (e) => {
                e.stopPropagation();
                const pais = allCountries.find(p => p.pais === d.pais);
                if (pais) {
                    loadCountryDetails(pais);
                    world.pointOfView({
                        lat: d.lat,
                        lng: d.lng,
                        altitude: 1.8
                    }, 1000);
                }
            };
            
            container.onmouseenter = () => {
                marker.style.transform = 'scale(1.2)';
                marker.style.boxShadow = '0 12px 30px rgba(196,30,58,0.6)';
            };
            
            container.onmouseleave = () => {
                marker.style.transform = 'scale(1)';
                marker.style.boxShadow = '0 8px 25px rgba(196,30,58,0.5)';
            };
            
            return container;
        })
        .onGlobeReady(() => {
            world.pointOfView(CAMERA_ORIGINAL);
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0% { box-shadow: 0 8px 25px rgba(196, 30, 58, 0.4); }
                    50% { box-shadow: 0 8px 35px rgba(196, 30, 58, 0.8); }
                    100% { box-shadow: 0 8px 25px rgba(196, 30, 58, 0.4); }
                }
            `;
            document.head.appendChild(style);
        })
        (globeContainer);

    world.renderer().setClearColor(0x0a0f1c, 1);
}

function updateGlobeAndCount() {
    let filteredCountries = allCountries.map(pais => ({
        ...pais,
        acordosFiltrados: pais.acordos.filter(a => {
            if (currentFilter !== 'todos' && a.tipo_instituicao !== currentFilter) return false;
            if (currentSearchTerm && currentSearchTerm.trim() !== '') {
                const term = currentSearchTerm.toLowerCase().trim();
                return a.entidade.toLowerCase().includes(term) ||
                       a.descricao.toLowerCase().includes(term);
            }
            return true;
        })
    })).filter(pais => pais.acordosFiltrados.length > 0);

    const pointsData = filteredCountries.map(p => ({
        lat: p.lat,
        lng: p.lng,
        pais: p.pais,
        totalAcordos: p.acordosFiltrados.length
    }));

    world.htmlElementsData(pointsData);

    const totalResultados = filteredCountries.reduce((acc, p) => acc + p.acordosFiltrados.length, 0);
    resultCount.textContent = totalResultados;
    
    if (currentSearchTerm || currentFilter !== 'todos') {
        resultBadge.classList.remove('hidden');
    } else {
        resultBadge.classList.add('hidden');
    }
}

// Função para limpar busca (chamada pelo X)
window.clearSearch = function() {
    resetToTodos();
};

// Event listeners
document.getElementById('searchToggle').addEventListener('click', () => {
    searchPanel.classList.toggle('visible');
    statsPanel.classList.remove('visible');
});

document.getElementById('statsToggle').addEventListener('click', () => {
    statsPanel.classList.toggle('visible');
    searchPanel.classList.remove('visible');
});

document.getElementById('closeDrawer').addEventListener('click', closeDrawer);

// Event listener para o campo de busca - quando perder o foco e estiver vazio
globalSearch.addEventListener('blur', (e) => {
    if (globalSearch.value.trim() === '' && currentFilter === 'todos') {
        resetCamera();
    }
});

globalSearch.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value;
    
    // Se a busca ficou vazia, resetar para "Todos"
    if (currentSearchTerm.trim() === '') {
        resetToTodos();
    } else {
        aplicarFiltros();
    }
});

// Botão de limpar busca (X) - se existir no HTML
const clearSearchBtn = document.querySelector('.search-clear') || document.getElementById('clearSearch');
if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetToTodos();
    });
}

document.addEventListener('click', (e) => {
    if (!searchPanel.contains(e.target) && !document.getElementById('searchToggle').contains(e.target)) {
        searchPanel.classList.remove('visible');
    }
    if (!statsPanel.contains(e.target) && !document.getElementById('statsToggle').contains(e.target)) {
        statsPanel.classList.remove('visible');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDrawer();
    }
});

// Adicionar listener para redimensionamento da janela
window.addEventListener('resize', () => {
    // Atualizar o globo se necessário
    if (world) {
        world.renderer().setSize(globeContainer.clientWidth, globeContainer.clientHeight);
    }
    // Re-renderizar chips e stats quando redimensionar
    renderFilterChips();
    renderTipoMiniStats();
    if (activeCountry) {
        loadCountryDetails(activeCountry);
    }
});

// Inicializar tudo
renderFilterChips();
renderTipoMiniStats();
initGlobe();
updateGlobeAndCount();
resultBadge.classList.remove('hidden');
resultCount.textContent = totalMemorandos;