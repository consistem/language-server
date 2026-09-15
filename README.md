<p align="center">
  <img alt="Consistem" src="https://raw.githubusercontent.com/consistem/language-server/master/images/logo-consistem-horizontal.png" width="280" />
</p>

# Consistem Language Server

Servidor de linguagem compatível com o padrão [LSP](https://microsoft.github.io/language-server-protocol/) para
[InterSystems](http://www.intersystems.com/our-products/) ObjectScript, executado em **Node.js** e escrito
principalmente em **TypeScript**.

Este repositório é o **fork mantido pela [Consistem&reg;](https://consistem.com.br/)** do projeto oficial
[`intersystems/language-server`](https://github.com/intersystems/language-server). Ele preserva todos os recursos do
projeto original e acrescenta integrações, ajustes e padrões internos voltados ao ecossistema de desenvolvimento do
Consistem ERP.

## Documentação oficial

A documentação de uso (instalação, configuração, atalhos e funcionalidades do ambiente) fica na Cuka:

**[VS Code - Ambiente de Desenvolvimento Consistem](https://cuka.consistem.com.br/doc/vs-code-ambiente-de-desenvolvimento-consistem-6rRtIWzvzz)**

Atalhos úteis:

- [Configuração do Ambiente de Desenvolvimento Consistem](https://cuka.consistem.com.br/doc/configuracao-do-ambiente-de-desenvolvimento-consistem-iqzsJjpwG5)
- [Configuração Server-Side](https://cuka.consistem.com.br/doc/configuracao-server-side-H7y5eAuSgF)
- [Funcionalidades implementadas pela Consistem](https://cuka.consistem.com.br/doc/conheca-as-funcionalidades-implementadas-pela-consistem-522jh8dn92)
- [Resolução de Erros](https://cuka.consistem.com.br/doc/resolucao-de-erros-uFVNgLxrjz)

Este README cobre o **repositório** (o que o fork muda, como compilar e empacotar). Para o passo a passo de uso diário,
siga a documentação acima.

## Instalação

> **Importante:** as extensões da Consistem **não são publicadas no Visual Studio Marketplace**. A instalação é feita
> a partir do arquivo `.vsix`.

O ambiente completo depende de quatro extensões, todas em versão Consistem:

| Extensão                        | Papel                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| `consistem-vscode-objectscript` | Integração com o servidor IRIS (conexão, compilação, server-side) — **dependência obrigatória** |
| `consistem-servermanager`       | Cadastro e autenticação dos servidores                                                        |
| `consistem-language-server`     | Este projeto: realce semântico, IntelliSense, diagnósticos e formatação                       |
| `consistem-tools`               | Ferramentas internas (geradores, análise de global, pesquisa de fontes)                       |

### Instalando o pacote interno (recomendado)

1. No VS Code, abra a aba de extensões e use **Install from VSIX...**
2. Selecione os arquivos em `C:\workspacecsw\config\vscode-workspace\Extensões`

O passo a passo detalhado (perfil do VS Code, conexão com o IRIS, workspace e credenciais) está em
[Configuração do Ambiente de Desenvolvimento Consistem](https://cuka.consistem.com.br/doc/configuracao-do-ambiente-de-desenvolvimento-consistem-iqzsJjpwG5).

### Instalando a partir das releases do GitHub

Cada build publica um `.vsix` por plataforma em
[Releases](https://github.com/consistem/language-server/releases). Baixe o arquivo correspondente ao seu
sistema/arquitetura (ex.: `consistem-language-server-<versão>-win32-x64.vsix`) e instale via **Install from VSIX...**.

## O que este fork adiciona

As customizações da Consistem ficam concentradas em `client/src/ccs/**` e `server/src/ccs/**`, com pequenos "ganchos"
no núcleo, para manter os merges com o upstream simples.

- **Signature help para rotinas e labels.** Ao digitar `$$Label^ROTINA(` ou `do Label^ROTINA(`, a extensão lê o fonte
  da rotina (no documento atual ou no servidor, via Atelier API), localiza o label e mostra a assinatura com o nome
  real do parâmetro na origem. Cobre o padrão de chamadas do ERP, que o upstream só oferece para métodos de classe.
- **Hover com o parâmetro na origem.** Ao passar o mouse sobre um argumento de uma chamada de rotina ou de método
  (`##class(...).Metodo(...)`, inclusive `%New` resolvendo para `%OnNew`), é exibido a qual parâmetro da definição
  aquele argumento corresponde.
- **Controle da formatação automática.** Evita que a formatação de documento seja disparada em salvamentos e
  compilações automáticas, preservando o formato do fonte; a formatação manual
  (`editor.action.formatDocument`) continua funcionando normalmente.
- **Dependências repactuadas.** O cliente consome `@consistem-sistemas/consistem-servermanager` (em `client/vendor/`)
  e declara dependência da extensão `consistem-sistemas.consistem-vscode-objectscript`.
- **Empacotamento multiplataforma próprio.** `scripts/select-isclexer.js` seleciona o lexer nativo por SO/arquitetura
  e `scripts/package-vsce.js` gera o `.vsix` por _target_, permitindo cross-build.
- **Sincronização automática com o upstream.** O workflow `.github/workflows/sync-upstream.yml` roda diariamente
  (03:00 UTC) e abre PR de `bot/sync-upstream-master` para `master`, sem escrita direta na branch protegida.

## Recursos

- Colorização baseada em [tokens semânticos](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide)
  para classes, rotinas e arquivos CSP do InterSystems ObjectScript, com suporte a linguagens embutidas como SQL,
  Python, HTML, XML, Java, JavaScript e CSS.
- Informações em _hover_ para comandos ObjectScript, funções e variáveis de sistema, classes, membros de classe,
  macros, diretivas de pré-processador, _keywords_ de classe, tipos de Parameter, _keywords_ de definição de Storage e
  tabelas, campos, métodos e _queries_ de SQL embutido invocados como _procedures_.
- [Ir para definição](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition) para classes, membros
  de classe, macros, rotinas, labels de rotina, parâmetros de nome de classe, `##super()` e tabelas, campos, métodos e
  _queries_ de SQL embutido.
- _Code completion_ para classes, membros de classe, funções e variáveis de sistema, macros, arquivos include, imports
  de pacote, diretivas de pré-processador, _keywords_ de classe e seus valores, tipos de Parameter, _keywords_ de
  Storage, rotinas e globais. Para propriedades referenciadas por sintaxe de variável de instância
  (`i%NomeDaPropriedade`), o _completion_ precisa ser acionado manualmente com `Ctrl+Space`, com o cursor imediatamente
  após o `i%`.
- _Code completion_ para nomes de elementos, nomes de atributos e valores de atributos XML dentro de blocos XData cuja
  _keyword_ XMLNamespace aponta para uma URL correspondente a um Studio Assist Schema (SASchema).
- _Signature help_ para métodos e macros que aceitam argumentos.
- Símbolos de documento para classes, rotinas e arquivos include.
- Formatação de documento completo ou por intervalo, que permite:
  - Normalizar a caixa de comandos, funções e variáveis de sistema.
  - Normalizar o uso da forma curta ou longa de comandos, funções e variáveis de sistema.
  - Expandir nomes curtos de classe para incluir o pacote (desativado por padrão).
- _Linting_ para classes, rotinas e arquivos CSP, verificando:
  - Erros de sintaxe, inclusive em linguagens embutidas.
  - Referências a variáveis locais possivelmente indefinidas.
  - Classes e rotinas inexistentes no banco de dados.
  - Tipos inválidos de Parameter de classe.
  - Divergências entre o tipo declarado do Parameter e o valor atribuído.
  - Classes, Métodos, Parameters e Propriedades marcados como
    [Deprecated](https://docs.intersystems.com/irislatest/csp/docbook/Doc.View.cls?KEY=ROBJ_method_deprecated).
  - Funções `$ZUTIL` [obsoletas ou substituídas](https://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=RCOS_replacements).
  - [Palavras reservadas de SQL](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=RSQL_reservedwords)
    usadas em nomes de classe e de propriedade de classes persistentes.
  - Valor do Parameter DEFAULTGLOBAL, em classe persistente, que não seja um nome de global válido prefixado por acento
    circunflexo.
- [Regiões de dobra](https://code.visualstudio.com/docs/editor/codebasics#_folding) para:
  - Blocos de código ObjectScript (If/ElseIf/Else, Try/Catch, For, While etc.)
  - Membros de classe
  - Labels de rotina
  - Descrições de classe
  - Comentários de documentação (`///` na primeira coluna)
  - Tags XML em blocos XData
  - Tags XML de Storage
  - JSON em blocos XData
  - %DynamicObject e %DynamicArray
  - Blocos de pré-processador
  - Definições de macro multilinha
  - Blocos Do com ponto
  - Blocos de código embutido (SQL, HTML, JavaScript)
  - Marcadores de região:
    - Em ObjectScript: `#;#region` ou `//#region` para abrir e `#;#endregion` ou `//#endregion` para fechar
    - Em comentários de classe: `//#region` para abrir e `//#endregion` para fechar
- [Renomeação de símbolos](https://code.visualstudio.com/docs/editor/refactoring#_rename-symbol) para variáveis locais
  e argumentos de método dentro de definições de classe.
- [Ir para definição de tipo](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-type-definition) para
  métodos, propriedades, argumentos de método e variáveis.
- Ir para declaração de argumentos de método, variáveis declaradas com `#Dim` e variáveis na
  [PublicList](https://docs.intersystems.com/irislatest/csp/docbook/Doc.View.cls?KEY=ROBJ_method_publiclist).
- Comando para sobrescrever membros herdados. Para acioná-lo, clique com o botão direito em uma linha em branco do
  corpo de uma definição de classe e selecione **Override Class Members**. As definições selecionadas são inseridas na
  posição do cursor.
- [Evaluatable Expression Provider](https://code.visualstudio.com/api/references/vscode-api#EvaluatableExpressionProvider),
  que permite ao _hover_ de depuração avaliar:
  - Globais
  - Parameters de classe
  - Parâmetros de método
  - Variáveis privadas
  - Variáveis públicas
  - [Variáveis de sistema](https://docs.intersystems.com/irislatest/csp/docbook/Doc.View.cls?KEY=RCOS_VARIABLES)
- [Document Links](https://code.visualstudio.com/api/references/vscode-api#DocumentLink) para as
  [tags HTML CLASS, METHOD, PROPERTY e QUERY](https://docs.intersystems.com/irislatest/csp/docbook/Doc.View.cls?KEY=GOBJ_classes#GOBJ_classdoc_html)
  e para a sintaxe `##class()` em comentários de documentação.
- [Quick Fixes](https://code.visualstudio.com/docs/editor/refactoring#_code-actions-quick-fixes-and-refactorings) que
  resolvem os seguintes diagnósticos:
  - [Referências de classe não qualificadas](https://docs.intersystems.com/irislatest/csp/docbook/Doc.View.cls?KEY=GOBJ_packages#GOBJ_packages_in_classname)
    que não existem no banco de dados:
    - Selecionar um pacote que contenha o nome não qualificado para importar.
  - Tipos inválidos de Parameter e divergências entre tipo declarado e valor atribuído:
    - Remover o tipo inválido.
    - Selecionar um tipo válido para substituí-lo.
  - Funções `$ZUTIL` substituídas por ClassMethods:
    - Substituir a chamada `$ZUTIL` pelo ClassMethod correspondente.
- IntelliSense para as linguagens embutidas abaixo (via
  [request forwarding](https://code.visualstudio.com/api/language-extensions/embedded-languages#request-forwarding)):
  - _Hover_ e _code completion_ para tags HTML e CSS embutidos em arquivos CSP/CSR, HTML embutido em ObjectScript pela
    diretiva `&html` e CSS embutido em blocos XData de XML.
  - _Hover_, _code completion_ e _signature help_ para métodos JavaScript em classes, JavaScript embutido em CSP por
    tags `<script>` e JavaScript embutido em ObjectScript pela diretiva `&js`.
- [Refatorações](https://code.visualstudio.com/docs/editor/refactoring#_code-actions-quick-fixes-and-refactorings):
  - Envolver um bloco de código em [Try/Catch](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=ATRYCATCHFAQ).

    ![](images/TryCatch.gif)

  - Extrair um bloco de código de um método existente para um novo método.

    ![](images/ExtractMethod.gif)

- [Type Hierarchy Provider](https://code.visualstudio.com/api/references/vscode-api#TypeHierarchyProvider) para exibir
  subclasses e superclasses em árvore:

  ![](images/TypeHierarchy.gif)

## Plataformas suportadas

|              |                |
| ------------ | -------------- |
| `alpine-x64` | `alpine-arm64` |
| `darwin-x64` | `darwin-arm64` |
| `linux-x64`  | `linux-arm64`  |
| `win32-x64`  | `win32-arm64`  |

## Compatibilidade com produtos InterSystems

São suportados todos os produtos InterSystems que incluem as Atelier APIs (Caché/Ensemble a partir de 2016.2 e todas as
versões do InterSystems IRIS).

## Notas de configuração

Se o usuário configurado para a conexão **não** tiver a _role_ `%All`, execute a consulta abaixo no servidor para
habilitar todos os recursos da extensão. Isso não é necessário ao conectar em InterSystems IRIS 2021.1.3+, 2022.1.2+ ou
2022.2+.

```SQL
GRANT SELECT ON SCHEMA %Dictionary TO %Developer
```

## Configurações da extensão

A lista completa das configurações está na
[Settings Reference](https://docs.intersystems.com/components/csp/docbook/DocBook.UI.Page.cls?KEY=GVSCO_settings#GVSCO_settings_langserv)
da documentação da InterSystems. As alterações podem ser feitas pelo
[editor de configurações do VS Code](https://code.visualstudio.com/docs/getstarted/settings#_edit-settings).

## Personalização das cores de sintaxe

A extensão acompanha quatro temas padrão — dois claros e dois escuros — em conformidade com o nível AAA das
[Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/) (WCAG) 2.0 na edição de
arquivos InterSystems. Eles foram desenvolvidos com foco em usabilidade e acessibilidade e são recomendados para todos
os usuários.

Também é possível usar qualquer tema do Marketplace ou nativo do VS Code. A coloração continuará sintaticamente
correta, mas nem todo tema dá suporte a recursos avançados, como colorir argumentos de método de forma diferente de
variáveis locais. Para customizar as cores atribuídas aos tokens semânticos, há duas abordagens.

> A Consistem mantém um conjunto de cores customizadas documentado em
> [Configuração de Cores customizadas](https://cuka.consistem.com.br/doc/configuracao-do-ambiente-de-desenvolvimento-consistem-iqzsJjpwG5#h-configuracao-de-cores-customizadas).

### Regras de estilo customizadas

Para customizar as cores de um ou mais tokens semânticos, adicione o bloco
[editor.semanticTokenColorCustomizations](https://code.visualstudio.com/docs/getstarted/themes#_editor-semantic-highlighting)
ao seu [settings.json](https://code.visualstudio.com/docs/getstarted/settings#_settings-file-locations) de usuário ou de
workspace. Por exemplo:

```json
"editor.semanticTokenColorCustomizations": {
    "enabled": true, // habilita para todos os temas, mas veja a observação abaixo
    "rules": {
        "ISC_Error":{"foreground":"#F44747","fontStyle":"bold"}
    }
}
```

Atenção: definir `"enabled": false` no objeto acima não desabilita apenas as regras contidas nele. Isso desabilita a
coloração por tokens semânticos em todos os temas e linguagens, a menos que você também tenha alterado
`"editor.semanticHighlighting.enabled"` do valor padrão `"configuredByTheme"`.

### Temas customizados

Para criar seu próprio tema com suporte aos tokens semânticos InterSystems (ou adaptar um tema existente), use as
configurações [semanticHighlighting e semanticTokenColors](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#theming)
no arquivo json de definição do tema. Por exemplo:

```json
"semanticHighlighting": true,
"semanticTokenColors": {
  "ISC_Error": {"foreground": "#ff8484", "bold": true},
  "ISC_Comment": "#80bd66",
  "ISC_StringLiteral": "#d4b57c",
  "ISC_NumericLiteral": "#d4b57c",
  "ISC_ClassName": "#4EC9B0",
  "ISC_ClassMember": "#DCDCAA",
  "ISC_DocComment": "#80bd66",
  "ISC_Parameter": "#ff75f4",
  "ISC_System": "#85a6ff",
  "ISC_Command": "#ffffff",
  "ISC_Keyword": "#85a6ff",
  "ISC_LocalVariable": "#ade2ff",
  "ISC_LocalVariableUnset": "#ade2ff",
  "ISC_PublicVariable": "#64c9ff",
  "ISC_SQLKeyword": "#ffffff",
  "ISC_SQLFunction": "#85a6ff",
  "ISC_Neutral": {"foreground": "#ffffff", "italic": true},
  "XML_Grayout": "#aaaaaa",
  "ISC_Operator": "#ffffff",
  "ISC_Delimiter": "#ffffff",
  "ISC_MarkupText": "#ffffff"
}
```

### Referência de tokens semânticos

A extensão fornece os seguintes tokens semânticos de alto nível, usados para colorir recursos equivalentes em todas as
linguagens suportadas:

| ID                         | Descrição                                  |
| -------------------------- | ------------------------------------------ |
| `"ISC_ClassMember"`        | Token de membro de classe.                 |
| `"ISC_ClassName"`          | Token de nome de classe e de rotina.       |
| `"ISC_Command"`            | Token de comando.                          |
| `"ISC_Comment"`            | Token de comentário.                       |
| `"ISC_Delimiter"`          | Token de delimitador.                      |
| `"ISC_DocComment"`         | Token de comentário de documentação.       |
| `"ISC_Error"`              | Token de erro.                             |
| `"ISC_Keyword"`            | Token de palavra-chave.                    |
| `"ISC_LocalVariable"`      | Token de variável local.                   |
| `"ISC_LocalVariableUnset"` | Token de variável local não atribuída.     |
| `"ISC_MarkupText"`         | Token de texto de marcação.                |
| `"ISC_Neutral"`            | Token neutro.                              |
| `"ISC_NumericLiteral"`     | Token de literal numérico.                 |
| `"ISC_Operator"`           | Token de operador.                         |
| `"ISC_Parameter"`          | Token de parâmetro.                        |
| `"ISC_PublicVariable"`     | Token de variável pública e global.        |
| `"ISC_SQLFunction"`        | Token de função SQL.                       |
| `"ISC_SQLKeyword"`         | Token de palavra-chave e tipo de dado SQL. |
| `"ISC_StringLiteral"`      | Token de literal string.                   |
| `"ISC_System"`             | Token de função e variável de sistema.     |

## Desenvolvimento

Pré-requisito: Node.js 24 (mesma versão usada no CI).

```bash
npm install          # instala dependências da raiz, client/, server/ e common/
npm run compile      # build TypeScript de common/ + client/ + server/
npm run watch        # build incremental
npm run webpack:dev  # build webpack para debug local
npm run lint         # eslint + prettier
```

O `server/src/**` importa `server/lib/isclexer.node`, que é _gitignored_. Gere o arquivo localmente com:

```bash
npm run select-isclexer                            # detecta SO/arquitetura automaticamente
ISCLEXER_TARGET=win32-x64 npm run select-isclexer  # cross-build
```

Para gerar o `.vsix`:

```bash
npm run package:current      # target da máquina atual
npm run package:win32-x64    # target específico
```

Depuração: use `.vscode/launch.json` → **Launch Client** e, se necessário, **Attach to Server** (porta 6009).

Convenções de código, fluxo de PR e detalhes da estrutura do projeto estão em [CONTRIBUTING.md](CONTRIBUTING.md).
Diretrizes para agentes de IA estão em [AGENTS.md](AGENTS.md) e nos arquivos `AGENTS.md` de cada subpasta.

## Versionamento e releases

- A numeração acompanha a versão do upstream (`2.8.x`); a branch `master` mantém o sufixo `-SNAPSHOT`.
- Cada push em `master` gera uma _pre-release_ `v<versão>-beta.N` com os `.vsix` de todas as plataformas.
- Releases publicadas anexam os `.vsix` definitivos e disparam o _bump_ automático de versão.
- O histórico de mudanças do projeto original está em [CHANGELOG.md](CHANGELOG.md).

## Licença e créditos

Projeto originalmente desenvolvido e mantido pela [InterSystems&reg;](http://www.intersystems.com) — veja
[LICENSE.txt](LICENSE.txt). Este fork é mantido pela [Consistem&reg;](https://consistem.com.br/) para uso no seu
ecossistema de desenvolvimento.
