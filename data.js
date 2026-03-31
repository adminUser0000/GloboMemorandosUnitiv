// Função para determinar o tipo de instituição baseado no nome e descrição
function determinarTipoInstituicao(entidade, descricao) {
    const texto = (entidade + ' ' + descricao).toLowerCase();
    
    if (texto.includes('universidade') || texto.includes('universitário')|| texto.includes('university') || texto.includes('college') || 
        texto.includes('escola') || texto.includes('instituto superior') || texto.includes('academia') ||
        texto.includes('instituto politécnico') || texto.includes('faculdade')) {
        return 'academico';
    }
    if (texto.includes('banco') || texto.includes('bank') || texto.includes('seguros') || 
        texto.includes('investimento') || texto.includes('financeiro') || texto.includes('mercantil') ||
        texto.includes('bci') || texto.includes('bmi')) {
        return 'financeiro';
    }
    if (texto.includes('governo') || texto.includes('ministério') || texto.includes('ministerio') || 
        texto.includes('estado') || texto.includes('publico') || texto.includes('público') ||
        texto.includes('governamental') || texto.includes('conselho') || texto.includes('csprem')) {
        return 'governamental';
    }
    if (texto.includes('empresa') || texto.includes('ltd') || texto.includes('lda') || 
        texto.includes('s.a.') || texto.includes('tecnologia') || texto.includes('industria') ||
        texto.includes('mining') || texto.includes('mineração') || texto.includes('parque industrial') ||
        texto.includes('conecta') || texto.includes('bright') || texto.includes('vodacom') ||
        texto.includes('kenmare') || texto.includes('emose') || texto.includes('filosoft')) {
        return 'empresarial';
    }
    if (texto.includes('hospital') || texto.includes('saude') || texto.includes('saúde') || 
        texto.includes('clinica') || texto.includes('clínica') || texto.includes('health') ||
        texto.includes('philadelphia') || texto.includes('tutors')) {
        return 'saude';
    }
    if (texto.includes('cultural') || texto.includes('cultura') || texto.includes('juventude') || 
        texto.includes('youth') || texto.includes('fellowship') || texto.includes('confúcio') ||
        texto.includes('intercâmbio cultural') || texto.includes('zimfep')) {
        return 'cultural';
    }
    
    return 'outro';
}

// Mapeamento de imagens para cada entidade (nomes reais das imagens na pasta assets)
const imagensPorEntidade = {
    // Brasil
    "Escola Superior Dom Helder Câmara": "dom.jpg",
    "Conecta & Parimpacto": "parimpacto.jpeg",
    
    // Moçambique - Financeiro
    "Banco Mercantil e de Investimentos (BMI)": "bmi.jpeg",
    "First National Bank": "fnb.png",
    "Banco Comercial e de Investimentos": "bci.png",
    "Moza Banco": "moza.jpeg",
    "Associação Moçambicana de Seguradoras (AMS)": "ams.jpeg",
    "EMOSE – Empresa Moçambicana de Seguros, S.A.": "emose.svg",
    
    // Moçambique - Acadêmico
    "Universidade Eduardo Mondlane": "uem.jpg",
    "Universidade Pedagógica de Maputo": "up.jpeg",
    "Universidade Zambeze": "unizambeze.jpeg",
    "Universidade Politécnica": "ispo.jpg",
    "Instituto Superior de Tecnologias e Gestão": "isteg.png",
    "Instituto Superior Politécnico de Tete": "ispt.jpeg",
    "Academia de Geologia e Minas": "academia.png",
    "Grace Mission College": "grace.png",
    "Health Tutors College, Mungo": "know.jpeg",
    "Colégio Paraíso (CICOP)": "paraiso.png",
    
    // Moçambique - Empresarial
    "Bright Adventure, S.A.": "bright.jpeg",
    "Parque Industrial de Beluluane (PIB)": "mozparks.png",
    "Kenmare Moma Mining (Mauritius) Limited": "kenmare.png",
    "Vodacom Moçambique": "vodacom.jpg",
    "LEM – Laboratório de Engenharia de Moçambique": "laboratorioeng.jpg.png",
    "Inbeleza 2006, Lda": "inbeleza.png",
    "Empresa Nacional de Parques de Ciência e Tecnologia (ENPCT)": "ENPCT.png",
    "FILOSOFT – Soluções Informáticas, Lda.": "filosoft.png",
    "Blue Zone": "blue.png",
    "ECOSIDA – Associação dos Empresários contra o SIDA": "sida.png",
    
    // Moçambique - Governamental
    "CSPREM – Conselho dos Serviços Provinciais de Representação do Estado": "ministerio.png",
    "Governo do Distrito de Boane": "ministerio.png",
    "Ministério da Indústria e Comércio": "ministerio.png",
    "Ministério da Ciência e Tecnologia": "ministerio.png",
    "Televisão de Moçambique (TVM)": "tvm.jpg",
    
    // Moçambique - Cultural
    "ZIMFEP": "zimfep.jpeg",
    
    // Moçambique - Saúde
    "Philadelphia Hospital": "phi.jpeg",
    
    // Moçambique - Jurídico
    "Instituto do Patrocínio e Assistência Jurídica": "ipaj.png",
    
    // Índia
    "Chandigarh University": "chandigarh.jpg",
    "Alagappa University": "alagappa.png",
    
    // Coreia do Sul
    "International Youth Fellowship": "if.jpeg",
    "International Youth Fellowship (IYF)": "if.jpeg",
    "Gimcheon University": "gimcheon.png",
    
    // República Checa
    "VŠTE České Budějovice": "Všte.jpg",
    
    // Finlândia
    "Laurea University of Applied Sciences": "laurea.jpg",
    
    // Portugal
    "FILOSOFT – Soluções Informáticas, Lda.": "filosoft.png",
    
    // África do Sul
    "University of Mpumalanga": "universitympumalanga.png",
    "University of the Witwatersrand": "witwartersand.jpg",
    "Sefako Makgatho Health Sciences University": "sefaco.png",
    
    // Angola
    "Instituto Superior Politécnico Internacional de Angola": "isia.png",
    
    // Filipinas
    "Philippine Christian University": "philipinechristian.png",
    
    // Zimbabwe
    "Harare Institute of Technology": "hit.png"
};

// Função para definir a imagem de cada acordo
function definirImagemAcordo(acordo) {
    // Verificar se existe imagem mapeada para esta entidade
    if (imagensPorEntidade[acordo.entidade]) {
        acordo.imagem = imagensPorEntidade[acordo.entidade];
    } else {
        // Se não houver imagem específica, usar imagem padrão baseada no tipo
        const imagensPadrao = {
            'academico': 'padrao_academico.jpg',
            'financeiro': 'padrao_financeiro.jpg',
            'governamental': 'padrao_governo.jpg',
            'empresarial': 'padrao_empresa.jpg',
            'saude': 'padrao_saude.jpg',
            'cultural': 'padrao_cultural.jpg',
            'outro': 'padrao_instituicao.jpg'
        };
        acordo.imagem = imagensPadrao[acordo.tipo_instituicao] || 'padrao.jpg';
    }
    
    // Adicionar o caminho completo da imagem
    acordo.caminho_imagem = `assets/${acordo.imagem}`;
}

const memorandos = [
    {
    pais: "Brasil",
    continente: "América do Sul",
    lat: -14.2350,
    lng: -51.9253,
    acordos: [
        {
            numero: 1,
            entidade: "Escola Superior Dom Helder Câmara",
            data: "2024-05-02",
            duracao: "10 anos",
            tipo_renovacao: "Renovação por períodos iguais",
            descricao: "Cooperação científica e académica para investigação conjunta e intercâmbio de docentes e estudantes.",
            assinante_unitiva: "Nelson Júlio Chacha",
            assinante_parceiro: "Paulo Umberto Stumpf",
            data_assinatura: "2024-05-02"
        },
        {
            numero: 34,
            entidade: "Conecta & Parimpacto",
            data: "2022-03-24",
            duracao: "4 anos",
            tipo_renovacao: "NS",
            descricao: "Cursos de extensão e cooperação empresarial.",
            assinante_unitiva: "Nelson Júlio Chacha",
            assinante_parceiro: "Marcelo Vivacqua / Mariangela Lückmann",
            data_assinatura: "2022-03-24"
        }
    ]
},
    {
        pais: "Moçambique",
        continente: "África",
        lat: -18.665695,
        lng: 35.529562,
        acordos: [
          
            {
                numero: 3,
                entidade: "First National Bank",
                data: "2011-11-28",
                duracao: "Indefinido",
                tipo_renovacao: "NS",
                descricao: "Bolsas de estudo e estágios profissionais para estudantes da área financeira.",
                assinante_unitiva: "Samaria Tovela",
                assinante_parceiro: "Ranjith Balliram",
                data_assinatura: "2011-11-28"
            },
            {
                numero: 4,
                entidade: "Banco Comercial e de Investimentos",
                data: "2011-02-12",
                duracao: "2 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Estágios curriculares e profissionais para estudantes.",
                assinante_unitiva: "Samaria Tovela",
                assinante_parceiro: "José Rodrigues / Kalpna Kirtikumar",
                data_assinatura: "2011-02-12"
            },
            {
                numero: 6,
                entidade: "Moza Banco",
                data: "2011-12-14",
                duracao: "Indefinido",
                tipo_renovacao: "NS",
                descricao: "Projectos académicos, estágios e organização de seminários.",
                assinante_unitiva: "Benjamim Alfredo",
                assinante_parceiro: "Inaete Merali",
                data_assinatura: "2011-12-14"
            },
            {
                numero: 7,
                entidade: "Universidade Eduardo Mondlane",
                data: "2015-09-11",
                duracao: "5 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Ensino, investigação científica e partilha de infraestruturas académicas.",
                assinante_unitiva: "Inocente Mutimucuio",
                assinante_parceiro: "Orlando Quilambo",
                data_assinatura: "2015-09-11"
            },
            {
                numero: 15,
                entidade: "Universidade Pedagógica de Maputo",
                data: "2019-11-07",
                duracao: "5 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Mobilidade académica e actividades científicas.",
                assinante_unitiva: "Inocente Mutimucuio",
                assinante_parceiro: "Jorge Ferrão",
                data_assinatura: "2019-11-07"
            },
            {
                numero: 16,
                entidade: "Universidade Zambeze",
                data: "2019-11-29",
                duracao: "5 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Programas conjuntos de formação e investigação.",
                assinante_unitiva: "Inocente Mutimucuio",
                assinante_parceiro: "Nobre dos Santos",
                data_assinatura: "2019-11-29"
            },
           
            {
                numero: 20,
                entidade: "Instituto do Patrocínio e Assistência Jurídica",
                data: "2012-03-15",
                duracao: "3 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Assistência jurídica e formação prática de estudantes de Direito.",
                assinante_unitiva: "Samaria Tovela",
                assinante_parceiro: "Pedro Nhatitima",
                data_assinatura: "2012-03-15"
            },
            {
                numero: 21,
                entidade: "Academia de Geologia e Minas",
                data: "2013-02-11",
                duracao: "5 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Investigação e formação nas áreas de geologia e recursos minerais.",
                assinante_unitiva: "Samaria Tovela",
                assinante_parceiro: "Danilo Nhantumbo",
                data_assinatura: "2013-02-11"
            },
            {
                numero: 22,
                entidade: "Instituto Superior Politécnico de Tete",
                data: "NS",
                duracao: "5 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Mobilidade académica e investigação conjunta.",
                assinante_unitiva: "Inocente Mutimucuio",
                assinante_parceiro: "Bernardo Bene",
                data_assinatura: "NS"
            },
            {
                numero: 25,
                entidade: "Blue Zone",
                data: "NS",
                duracao: "NS",
                tipo_renovacao: "Alteração com aviso prévio",
                descricao: "Desenvolvimento de projectos institucionais conjuntos.",
                assinante_unitiva: "Benjamim Alfredo",
                assinante_parceiro: "NS",
                data_assinatura: "NS"
            },
            
            {
                numero: 27,
                entidade: "Televisão de Moçambique (TVM)",
                data: "2009-12-29",
                duracao: "4 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Cooperação institucional e prestação recíproca de serviços entre universidade e TVM.",
                assinante_unitiva: "Brazão Mazula",
                assinante_parceiro: "Bernardo Gabriel Mavanga / Eduardo Manuel Fernando",
                data_assinatura: "2009-12-29"
            },
            {
                numero: 29,
                entidade: "EMOSE – Empresa Moçambicana de Seguros, S.A.",
                data: "NS",
                duracao: "NS",
                tipo_renovacao: "NS",
                descricao: "Cooperação institucional e desenvolvimento de actividades conjuntas.",
                assinante_unitiva: "Benjamim Alfredo",
                assinante_parceiro: "César Bento Madivádula",
                data_assinatura: "NS"
            },
            {
                numero: 30,
                entidade: "LEM – Laboratório de Engenharia de Moçambique",
                data: "2018-09-21",
                duracao: "5 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Investigação científica, estágios e utilização de laboratórios.",
                assinante_unitiva: "Inocente Mutimucuio",
                assinante_parceiro: "Nelson Matsinhe",
                data_assinatura: "2018-09-21"
            },
            
            {
                numero: 32,
                entidade: "Parque Industrial de Beluluane (PIB)",
                data: "NS",
                duracao: "NS",
                tipo_renovacao: "NS",
                descricao: "Estágios profissionais e cooperação técnico-científica.",
                assinante_unitiva: "Inocente Vasco Mutimucuio",
                assinante_parceiro: "Adrian Walter Fray",
                data_assinatura: "NS"
            },
            {
                numero: 33,
                entidade: "Kenmare Moma Mining (Mauritius) Limited",
                data: "2018-06-28",
                duracao: "3 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Cooperação em geologia, mineração, estágios e investigação.",
                assinante_unitiva: "Inocente Mutimucuio",
                assinante_parceiro: "Caetano Amurane",
                data_assinatura: "2018-06-28"
            },
            {
                numero: 35,
                entidade: "Inbeleza 2006, Lda",
                data: "2017-03-15",
                duracao: "2 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Fornecimento de trajes de graduação.",
                assinante_unitiva: "Graçinda Tivane",
                assinante_parceiro: "Joana Fernando Gomes Salia",
                data_assinatura: "2017-03-15"
            },
            {
                numero: 36,
                entidade: "Academia de Geologia e Minas",
                data: "2013-02-11",
                duracao: "5 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Ensino e investigação nas áreas de recursos minerais.",
                assinante_unitiva: "Samaria Tovela",
                assinante_parceiro: "Danilo Nhantumbo",
                data_assinatura: "2013-02-11"
            },
            {
                numero: 37,
                entidade: "Vodacom Moçambique",
                data: "2008-12",
                duracao: "Tempo indeterminado",
                tipo_renovacao: "NS",
                descricao: "Intercâmbio académico e estágios.",
                assinante_unitiva: "Brazão Mazula",
                assinante_parceiro: "José dos Santos",
                data_assinatura: "2008-12"
            },
            {
                numero: 39,
                entidade: "CSPREM – Conselho dos Serviços Provinciais de Representação do Estado",
                data: "2021-10-28",
                duracao: "5 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Projectos sociais, empreendedorismo e capacitação.",
                assinante_unitiva: "Nelson Júlio Chacha",
                assinante_parceiro: "Célia Nataniel Zandamela",
                data_assinatura: "2021-10-28"
            },
            {
                numero: 40,
                entidade: "Universidade Politécnica",
                data: "2023-12-08",
                duracao: "2 anos",
                tipo_renovacao: "Renovável",
                descricao: "Cooperação em ensino, pesquisa e inovação.",
                assinante_unitiva: "Nelson Júlio Chacha",
                assinante_parceiro: "Narciso Matos",
                data_assinatura: "2023-12-08"
            },
            {
                numero: 44,
                entidade: "Philadelphia Hospital",
                data: "2025-07-09",
                duracao: "NS",
                tipo_renovacao: "NS",
                descricao: "Projectos educacionais na área da saúde.",
                assinante_unitiva: "Nelson Júlio Chacha",
                assinante_parceiro: "Representante do hospital",
                data_assinatura: "2025-07-09"
            },
            {
                numero: 45,
                entidade: "Health Tutors College, Mungo",
                data: "2025-07-09",
                duracao: "NS",
                tipo_renovacao: "NS",
                descricao: "Programas educacionais na área da saúde.",
                assinante_unitiva: "Nelson Júlio Chacha",
                assinante_parceiro: "Representante do colégio",
                data_assinatura: "2025-07-09"
            },
            {
                numero: 47,
                entidade: "ZIMFEP",
                data: "2025-07-09",
                duracao: "NS",
                tipo_renovacao: "NS",
                descricao: "Intercâmbio académico e actividades juvenis.",
                assinante_unitiva: "Nelson Júlio Chacha",
                assinante_parceiro: "Representante ZIMFEP",
                data_assinatura: "2025-07-09"
            },
            {
                numero: 48,
                entidade: "Grace Mission College",
                data: "2025-07-09",
                duracao: "NS",
                tipo_renovacao: "NS",
                descricao: "Programas educacionais e intercâmbio cultural.",
                assinante_unitiva: "Nelson Júlio Chacha",
                assinante_parceiro: "Babylin M. Mendoza",
                data_assinatura: "2025-07-09"
            },
            {
                numero: 50,
                entidade: "Colégio Paraíso (CICOP)",
                data: "2022-10-27",
                duracao: "3 anos",
                tipo_renovacao: "Renovável mediante termo aditivo",
                descricao: "Cooperação académica, cultural e desportiva incluindo partilha de experiências científicas e utilização de instalações.",
                assinante_unitiva: "Prof. Doutor Nelson Chacha",
                assinante_parceiro: "Dr. Chihitane Ernesto Lambo Magul",
                data_assinatura: "2022-10-27"
            },
            {
                numero: 51,
                entidade: "Empresa Nacional de Parques de Ciência e Tecnologia (ENPCT)",
                data: "2021-08-31",
                duracao: "5 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Cooperação em ciência, tecnologia e inovação com investigação conjunta e partilha de infraestruturas.",
                assinante_unitiva: "Prof. Doutor Nelson Chacha",
                assinante_parceiro: "Julião João Cumbane",
                data_assinatura: "2021-08-31"
            },
            {
                numero: 52,
                entidade: "Governo do Distrito de Boane",
                data: "2011-05-12",
                duracao: "5 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Cooperação institucional para investigação, formação técnico-profissional, eventos científicos e estágios.",
                assinante_unitiva: "Prof.ª Dra. Samaria F. Tovele",
                assinante_parceiro: "Dr. Zeferino Cavela",
                data_assinatura: "2011-05-12"
            },
            {
                numero: 53,
                entidade: "Ministério da Indústria e Comércio",
                data: "2013-06-28",
                duracao: "5 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Parceria para estágios e capacitação profissional de estudantes finalistas do ISTEG.",
                assinante_unitiva: "Prof.ª Dra. Samaria dos Anjos Filemon Tovele",
                assinante_parceiro: "Dr. Armando Inroga",
                data_assinatura: "2013-06-28"
            },
            {
                numero: 54,
                entidade: "Ministério da Ciência e Tecnologia",
                data: "2014-09-24",
                duracao: "5 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Cooperação científica e tecnológica para investigação, formação de recursos humanos e desenvolvimento tecnológico.",
                assinante_unitiva: "Prof. Doutor Inocente Vasco Mutimucuio",
                assinante_parceiro: "Prof. Doutor Louis Augusto Pelembe",
                data_assinatura: "2014-09-24"
            },
            {
                numero: 55,
                entidade: "Associação Moçambicana de Seguradoras (AMS)",
                data: "2025-09-30",
                duracao: "5 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Parceria institucional para cooperação nas áreas de formação, investigação científica, extensão universitária e actividades no domínio dos seguros, incluindo estágios, eventos científicos e troca de informação técnica.",
                assinante_unitiva: "Prof. Doutor Nelson Júlio Chacha",
                assinante_parceiro: "Dr. Manuel Alfredo de Brito Gamito",
                data_assinatura: "2025-09-30"
        }
        ]
    },
    {
        pais: "Índia",
        continente: "Ásia",
        lat: 20.5937,
        lng: 78.9629,
        acordos: [
            {
                numero: 8,
                entidade: "Chandigarh University",
                data: "2016-07-07",
                duracao: "5 anos",
                tipo_renovacao: "Renovação por acordo",
                descricao: "Intercâmbio académico e investigação conjunta.",
                assinante_unitiva: "Inocente Mutimucuio",
                assinante_parceiro: "Rajinder Singh Bawa",
                data_assinatura: "2016-07-07"
            },
            {
                numero: 9,
                entidade: "Alagappa University",
                data: "2016-07-07",
                duracao: "NS",
                tipo_renovacao: "NS",
                descricao: "Intercâmbio académico e programas educacionais conjuntos.",
                assinante_unitiva: "Inocente Mutimucuio",
                assinante_parceiro: "S. Subbiah",
                data_assinatura: "2016-07-07"
            }
        ]
    },
    {
        pais: "Coreia do Sul",
        continente: "Ásia",
        lat: 36.2048,
        lng: 127.7630,
        acordos: [
            {
                numero: 10,
                entidade: "International Youth Fellowship",
                data: "2016-07-07",
                duracao: "NS",
                tipo_renovacao: "NS",
                descricao: "Programas educacionais, culturais e formação em liderança.",
                assinante_unitiva: "Inocente Mutimucuio",
                assinante_parceiro: "Moon Taek Park",
                data_assinatura: "2016-07-07"
            },
           
            {
                numero: 43,
                entidade: "Gimcheon University",
                data: "2025-07-10",
                duracao: "NS",
                tipo_renovacao: "NS",
                descricao: "Cooperação educacional e intercâmbio académico.",
                assinante_unitiva: "Nelson Júlio Chacha",
                assinante_parceiro: "Ok-Hyun Yoon",
                data_assinatura: "2025-07-10"
            }
        ]
    },
    {
        pais: "República Checa",
        continente: "Europa",
        lat: 49.8175,
        lng: 15.4730,
        acordos: [
            {
                numero: 11,
                entidade: "VŠTE České Budějovice",
                data: "2016-07-06",
                duracao: "NS",
                tipo_renovacao: "NS",
                descricao: "Intercâmbio de estudantes e docentes e investigação conjunta.",
                assinante_unitiva: "Inocente Mutimucuio",
                assinante_parceiro: "Josef Korda",
                data_assinatura: "2016-07-06"
            }
        ]
    },
    {
        pais: "Finlândia",
        continente: "Europa",
        lat: 61.9241,
        lng: 25.7482,
        acordos: [
            {
                numero: 12,
                entidade: "Laurea University of Applied Sciences",
                data: "2016-07-06",
                duracao: "NS",
                tipo_renovacao: "NS",
                descricao: "Intercâmbio académico e desenvolvimento de programas conjuntos.",
                assinante_unitiva: "Inocente Mutimucuio",
                assinante_parceiro: "Jouni Koski",
                data_assinatura: "2016-07-06"
            }
        ]
    },
    {
        pais: "Portugal",
        continente: "Europa",
        lat: 39.3999,
        lng: -8.2245,
        acordos: [
            {
                numero: 28,
                entidade: "FILOSOFT – Soluções Informáticas, Lda.",
                data: "2017-05-12",
                duracao: "2 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Disponibilização de software de gestão e apoio académico.",
                assinante_unitiva: "Inocente Vasco Mutimucuio",
                assinante_parceiro: "Carlos Manuel Ferreira Lopes",
                data_assinatura: "2017-05-12"
            }
        ]
    },
    {
        pais: "África do Sul",
        continente: "África",
        lat: -30.5595,
        lng: 22.9375,
        acordos: [
            {
                numero: 17,
                entidade: "University of Mpumalanga",
                data: "2023-04-18",
                duracao: "5 anos",
                tipo_renovacao: "Rescisão com aviso prévio",
                descricao: "Intercâmbio académico e investigação conjunta.",
                assinante_unitiva: "Nelson Chacha",
                assinante_parceiro: "Thoko Mayekiso",
                data_assinatura: "2023-04-18"
            },
            {
                numero: 41,
                entidade: "University of the Witwatersrand",
                data: "2025-01-01",
                duracao: "Até 31/12/2029",
                tipo_renovacao: "NS",
                descricao: "Desenvolvimento profissional e cooperação científica.",
                assinante_unitiva: "Domingos Vasco Tivane",
                assinante_parceiro: "Carol Hartmann",
                data_assinatura: "2025-01-01"
            },
            {
                numero: 56,
                entidade: "Sefako Makgatho Health Sciences University",
                data: "2025-11-19",
                duracao: "6 anos",
                tipo_renovacao: "Sem renovação automática",
                descricao: "Colaboração em educação médica, formação académica e investigação científica entre as instituições, incluindo projectos de investigação conjunta, partilha de conhecimento académico e cooperação institucional.",
                assinante_unitiva: "Prof. Doutor Nelson Júlio Chacha",
                assinante_parceiro: "Prof. Tandi Matsha-Erasmus",
                data_assinatura: "2025-11-19"
        }
            
            
        ]
    },
    {
        pais: "Angola",
        continente: "África",
        lat: -11.2027,
        lng: 17.8739,
        acordos: [
            {
                numero: 38,
                entidade: "Instituto Superior Politécnico Internacional de Angola",
                data: "2023-06-21",
                duracao: "5 anos",
                tipo_renovacao: "Renovação automática",
                descricao: "Intercâmbio académico e investigação conjunta.",
                assinante_unitiva: "Nelson Júlio Chacha",
                assinante_parceiro: "Maria Augusta Almeida da Silva Martins",
                data_assinatura: "2023-06-21"
            }
        ]
    },
    {
        pais: "Filipinas",
        continente: "Ásia",
        lat: 12.8797,
        lng: 121.7740,
        acordos: [
            {
                numero: 46,
                entidade: "Philippine Christian University",
                data: "2025-07-09",
                duracao: "NS",
                tipo_renovacao: "NS",
                descricao: "Cooperação educacional e cultural.",
                assinante_unitiva: "Nelson Júlio Chacha",
                assinante_parceiro: "Representante da PCU",
                data_assinatura: "2025-07-09"
            }
        ]
    },
    {
        pais: "Zimbabwe",
        continente: "África",
        lat: -19.0154,
        lng: 29.1549,
        acordos: [
            {
                numero: 49,
                entidade: "Harare Institute of Technology",
                data: "2025-07-09",
                duracao: "NS",
                tipo_renovacao: "NS",
                descricao: "Cooperação técnica e académica.",
                assinante_unitiva: "Nelson Júlio Chacha",
                assinante_parceiro: "Representante HIT",
                data_assinatura: "2025-07-09"
            }
        ]
    }
];

// Adicionar tipo e imagem a cada acordo
memorandos.forEach(pais => {
    pais.acordos.forEach(acordo => {
        acordo.tipo_instituicao = determinarTipoInstituicao(acordo.entidade, acordo.descricao);
        definirImagemAcordo(acordo);
    });
});

// Estatísticas
const totalPaises = memorandos.length;
const totalMemorandos = memorandos.reduce((acc, pais) => acc + pais.acordos.length, 0);
const totalInstituicoes = totalMemorandos;

// Estatísticas por tipo de instituição
const tiposInstituicao = {
    academico: { nome: 'Académico', icon: 'fa-graduation-cap', cor: '#002147', count: 0 },
    financeiro: { nome: 'Financeiro', icon: 'fa-building-columns', cor: '#C41E3A', count: 0 },
    governamental: { nome: 'Governamental', icon: 'fa-landmark', cor: '#FFB81C', count: 0 },
    empresarial: { nome: 'Empresarial', icon: 'fa-briefcase', cor: '#2E7D32', count: 0 },
    saude: { nome: 'Saúde', icon: 'fa-hospital', cor: '#00A896', count: 0 },
    cultural: { nome: 'Cultural', icon: 'fa-handshake', cor: '#9C27B0', count: 0 },
    outro: { nome: 'Outro', icon: 'fa-building', cor: '#757575', count: 0 }
};

// Contar por tipo
memorandos.forEach(pais => {
    pais.acordos.forEach(acordo => {
        if (tiposInstituicao[acordo.tipo_instituicao]) {
            tiposInstituicao[acordo.tipo_instituicao].count++;
        }
    });
});

console.log('=' .repeat(70));
console.log('📊 MEMORANDOS COM ESTRUTURA DE IMAGENS');
console.log('=' .repeat(70));
console.log(`\n📈 TOTAL: ${totalMemorandos} memorandos em ${totalPaises} países`);
console.log(`🖼️ TODOS OS MEMORANDOS POSSUEM IMAGEM ASSOCIADA\n`);

console.log('📋 DISTRIBUIÇÃO POR TIPO:');
Object.entries(tiposInstituicao).forEach(([key, value]) => {
    if (value.count > 0) {
        console.log(`   ${value.nome}: ${value.count} memorandos`);
    }
});

console.log('\n✅ Cada memorando agora possui as propriedades:');
console.log('   • tipo_instituicao - Classificação da instituição');
console.log('   • imagem - Nome do arquivo da imagem');
console.log('   • caminho_imagem - Caminho completo para a imagem (assets/nome.jpg)');