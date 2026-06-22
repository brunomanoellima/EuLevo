# EuLevo — Documento de Especificação do Sistema

> **Universidade Federal do Amazonas — UFAM**  
> **Instituto de Ciências Exatas e Tecnologia — ICET**  
> **Curso:** Sistemas de Informação  
> **Local e ano:** Itacoatiara/AM, 2026

---

## Ficha Técnica

### Equipe responsável pela elaboração

| Papel | Integrante |
|---|---|
| Desenvolvedor 1 | Ana Clarissy |
| Desenvolvedor 2 | Bruno Manoel |
| Desenvolvedor 3 | Carlos Eduardo |
| Desenvolvedor 4 | Cintia Seixas |
| Desenvolvedor 5 | Nelio Tobias |

### Público-alvo do documento

Este documento destina-se aos integrantes responsáveis pelo desenvolvimento do projeto EuLevo, ao cliente que utilizará o produto final, aos avaliadores e aos demais interessados em compreender as funcionalidades, restrições e decisões técnicas do sistema.

### Registro de alterações

| Versão | Responsáveis | Data | Alterações |
|---|---|---:|---|
| 1.0 | Desenvolvedores 2, 3, 4 e 5 | 29/05/2026 | Atualização dos diagramas de casos de uso, classes e objetos; revisão dos requisitos; escolha de arquitetura e padrões de projeto. |
| 1.1 | Desenvolvedores 1 e 4 | 04/06/2026 | Construção dos diagramas de sequência. |
| 1.2 | Desenvolvedor 2 | 04/06/2026 | Construção do diagrama de classes. |
| 1.3 | Desenvolvedor 3 | 05/06/2026 | Construção do diagrama de objetos. |
| 1.4 | Desenvolvedor 2 | 05/06/2026 | Revisão geral da documentação. |

---

## Sumário

1. [Introdução](#1-introdução)  
2. [Requisitos Gerais do Sistema](#2-requisitos-gerais-do-sistema)  
3. [Diagramas UML](#3-diagramas-uml)  
4. [Arquitetura do Sistema](#4-arquitetura-do-sistema)  
5. [Padrões de Projeto](#5-padrões-de-projeto)  
6. [Prototipação das Telas](#6-prototipação-das-telas)  
7. [Análise de Riscos](#7-análise-de-riscos)  
8. [Apêndice](#8-apêndice)  

---

# 1. Introdução

## 1.1. Estrutura e visão geral do documento

Este documento apresenta a especificação do sistema **EuLevo**, descrevendo sua finalidade, público-alvo, requisitos, regras de negócio, modelagem UML, arquitetura, padrões de projeto, análise de riscos e demais informações necessárias para orientar o desenvolvimento da aplicação.

Inicialmente, a documentação contextualiza o problema que o sistema busca resolver e identifica seus usuários. Em seguida, apresenta os requisitos funcionais e não funcionais, além das regras de negócio que estabelecem condições e restrições para o funcionamento adequado da aplicação.

A modelagem é apresentada por meio de diagramas UML, permitindo representar a estrutura e o comportamento esperado do sistema. Posteriormente, a arquitetura baseada no padrão MVC é detalhada, bem como os padrões de projeto selecionados para favorecer a organização, a manutenção e a evolução da aplicação.

## 1.2. Audiência do documento

| Tipo de público | Descrição |
|---|---|
| Desenvolvedores | Responsáveis pela implementação, manutenção e evolução do sistema. |
| Product Owner | Responsável por validar os requisitos e as funcionalidades entregues. |
| Equipe do projeto | Integrantes envolvidos no planejamento, modelagem, desenvolvimento e testes. |
| Avaliadores e interessados | Pessoas que desejam compreender o funcionamento e as especificações do sistema. |

## 1.3. Convenções, termos e abreviações

| Termo | Definição |
|---|---|
| **RF** | Requisito Funcional: descreve uma funcionalidade que o sistema deve executar. |
| **RNF** | Requisito Não Funcional: estabelece critérios de qualidade, desempenho, segurança ou usabilidade. |
| **RN** | Regra de Negócio: define condições, restrições e comportamentos necessários ao funcionamento do sistema. |
| **Usuário** | Pessoa cadastrada que utiliza o aplicativo. |
| **Organizador** | Usuário responsável pela criação e administração de uma lista de evento. |
| **Participante** | Usuário convidado para colaborar em uma lista de evento. |
| **Lista** | Conjunto de itens organizados para uma confraternização ou evento. |
| **Item** | Produto, alimento, bebida ou objeto que deverá ser levado para o evento. |
| **Evento** | Confraternização organizada por meio de uma lista colaborativa. |

## 1.4. Descrição geral do sistema

O **EuLevo** é um aplicativo de listas colaborativas voltado para a organização de confraternizações. A solução permite que usuários criem eventos, adicionem itens necessários, convidem participantes e acompanhem quais itens serão levados e por quem.

O sistema busca reduzir falhas de comunicação e duplicidade de itens em eventos coletivos. Para isso, os participantes podem visualizar a lista compartilhada, assumir a responsabilidade por determinados itens, editar informações quando possuírem permissão e acompanhar atualizações realizadas na organização.

Além da colaboração por listas, o aplicativo prevê um bate-papo integrado, permitindo que os participantes conversem, tirem dúvidas e combinem detalhes relacionados ao evento.

## 1.5. Descrição dos usuários

### Usuários organizadores

São responsáveis por criar listas de eventos, preencher informações do evento, convidar participantes e administrar os itens da lista. Também podem editar dados da lista, remover listas e acompanhar ações realizadas pelos participantes.

### Usuários participantes

São usuários convidados para uma lista. Podem visualizar os itens, assumir a responsabilidade por itens disponíveis, colaborar na organização, receber notificações, interagir pelo bate-papo e, quando autorizado, adicionar, editar ou remover itens.

---

# 2. Requisitos Gerais do Sistema

## 2.1. Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF1 | Como usuário, quero criar uma lista no aplicativo para registrar uma confraternização que desejo organizar. | Alta |
| RF2 | Como participante de um evento, quero assumir um item da lista para indicar que serei responsável por levá-lo. | Alta |
| RF3 | Como organizador de um evento, quero convidar outras pessoas para participar da lista da confraternização, para que possam colaborar com a organização dos itens. | Alta |
| RF4 | Como usuário, quero usar um bate-papo dentro da lista para combinar com os demais usuários quais itens ainda faltam e tirar dúvidas sobre a organização. | Média |
| RF5 | Como organizador de um evento, quero adicionar itens a uma lista para incluir tudo o que será necessário para a confraternização. | Alta |
| RF6 | Como participante de um evento, quero receber notificações quando novos itens forem adicionados ou modificados na lista, para ficar atualizado. | Média |
| RF7 | Como organizador de um evento, quero excluir uma lista para remover eventos que não serão mais realizados. | Baixa |
| RF8 | Como organizador de um evento, quero editar a lista para corrigir ou atualizar suas informações. | Média |
| RF9 | Como organizador de um evento, quero visualizar o histórico de atividades da lista para acompanhar as ações realizadas pelos participantes. | Baixa |
| RF10 | Como participante de um evento, quero sair de uma lista para deixar de participar quando desejar. | Média |
| RF11 | Como usuário, quero me cadastrar no aplicativo para acessar e utilizar suas funcionalidades. | Alta |
| RF12 | Como usuário, quero fazer login no aplicativo para acessar o sistema e utilizar suas funcionalidades. | Alta |
| RF13 | Como usuário, quero recuperar minha senha para acessar minha conta caso esqueça os dados de login. | Média |
| RF14 | Como usuário, quero editar meu perfil para atualizar minhas informações pessoais no sistema. | Baixa |
| RF15 | Como organizador de um evento, quero editar itens de uma lista para corrigir ou atualizar suas informações. | Média |
| RF16 | Como organizador de um evento, quero remover itens de uma lista para excluir itens que não serão mais necessários. | Média |
| RF17 | Como usuário, quero encerrar minha sessão para sair do aplicativo com segurança. | Baixa |

## 2.2. Requisitos não funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RNF1 | O sistema deve responder rapidamente às ações do usuário, proporcionando uma experiência fluida. | Média |
| RNF2 | O aplicativo deve ser fácil de usar, permitindo que os usuários realizem suas tarefas sem dificuldade. | Média |
| RNF3 | O sistema deve possuir uma interface simples, intuitiva e coerente. | Média |
| RNF4 | As informações dos usuários e das listas devem ser protegidas por autenticação, garantindo acesso apenas a participantes autorizados. | Alta |
| RNF5 | O sistema deve suportar múltiplos usuários simultâneos sem perda significativa de desempenho. | Média |
| RNF6 | O sistema deve apresentar tempo de resposta adequado ao criar eventos e assumir itens da lista. | Média |
| RNF7 | O sistema deve garantir consistência dos dados, evitando duplicidade ou conflitos nas informações de listas e itens. | Alta |
| RNF8 | O sistema deve realizar backup automático das informações de eventos e listas, possibilitando recuperação em caso de falhas. | Baixa |
| RNF9 | O sistema deve registrar ações realizadas pelos usuários para controle e auditoria. | Baixa |
| RNF10 | O sistema deve possuir alta disponibilidade, permanecendo acessível aos usuários na maior parte do tempo. | Baixa |

## 2.3. Regras de negócio

### RF1 — Criar lista

| ID | Regra de negócio |
|---|---|
| RN1.1 | Cada evento deve possuir um identificador único. |
| RN1.2 | O sistema deve validar todos os campos obrigatórios antes de salvar. |
| RN1.3 | O evento deve ser armazenado de forma persistente no sistema. |

### RF2 — Assumir item

| ID | Regra de negócio |
|---|---|
| RN2.1 | Apenas participantes do evento podem assumir itens. |
| RN2.2 | O primeiro usuário que marcar o item torna-se o responsável por levá-lo. |
| RN2.3 | O nome do responsável deve ser exibido ao lado do item. |
| RN2.4 | Apenas um usuário pode ser responsável por cada item. |
| RN2.5 | Caso o responsável desmarque o item, ele deve voltar a ficar disponível para os demais participantes. |

### RF3 — Convidar participantes

| ID | Regra de negócio |
|---|---|
| RN3.1 | Apenas o organizador do evento pode convidar participantes. |
| RN3.2 | O convite deve ser enviado somente para usuários cadastrados no sistema. |
| RN3.3 | Um mesmo usuário não pode ser adicionado mais de uma vez ao mesmo evento. |
| RN3.4 | Após ser adicionado, o participante pode acessar a lista vinculada ao evento. |
| RN3.5 | O organizador deve poder visualizar os participantes já adicionados. |

### RF4 — Usar bate-papo

| ID | Regra de negócio |
|---|---|
| RN4.1 | Apenas participantes do evento podem acessar o bate-papo. |
| RN4.2 | As mensagens devem estar vinculadas ao evento correspondente. |
| RN4.3 | Todos os participantes do evento podem enviar e visualizar mensagens. |
| RN4.4 | As mensagens devem ser exibidas em ordem de envio. |
| RN4.5 | O bate-papo não pode ser acessado por usuários que não participam do evento. |

### RF5 — Adicionar item

| ID | Regra de negócio |
|---|---|
| RN5.1 | O nome do item não pode estar vazio. |
| RN5.2 | A quantidade do item deve ser maior que zero. |
| RN5.3 | Apenas participantes da lista podem adicionar itens. |

### RF6 — Receber notificações

| ID | Regra de negócio |
|---|---|
| RN6.1 | As notificações devem ser enviadas somente para usuários com status de participante confirmado no evento. |
| RN6.2 | O sistema deve agrupar notificações para evitar excesso de avisos quando muitas alterações forem realizadas em sequência. |
| RN6.3 | Caso um item assumido por um usuário seja excluído, ele deve receber uma notificação prioritária de atenção ou cancelamento. |

### RF7 — Excluir lista

| ID | Regra de negócio |
|---|---|
| RN7.1 | Apenas o organizador pode excluir uma lista. |
| RN7.2 | A exclusão deve ser confirmada antes de ser realizada. |
| RN7.3 | Após a exclusão, os dados não poderão ser recuperados. |

### RF8 — Editar lista

| ID | Regra de negócio |
|---|---|
| RN8.1 | Apenas o organizador pode alterar o nome e a descrição da lista. |
| RN8.2 | O nome da lista não pode estar vazio. |
| RN8.3 | A alteração deve ser refletida para todos os participantes. |

### RF9 — Visualizar histórico

| ID | Regra de negócio |
|---|---|
| RN9.1 | O sistema deve permitir a visualização de ações realizadas no evento, como inclusão, alteração e remoção de itens. |

### RF10 — Sair da lista

| ID | Regra de negócio |
|---|---|
| RN10.1 | O sistema deve registrar a saída do participante e atualizar a relação de participantes vinculados ao evento. |

### RF11 — Cadastrar usuário

| ID | Regra de negócio |
|---|---|
| RN11.1 | O e-mail informado deve ser único no sistema. |
| RN11.2 | A senha deve possuir, no mínimo, seis caracteres. |
| RN11.3 | Todos os campos obrigatórios devem ser preenchidos. |
| RN11.4 | O sistema deve validar o formato do e-mail. |

### RF12 — Fazer login

| ID | Regra de negócio |
|---|---|
| RN12.1 | As senhas devem ser armazenadas de forma criptografada. |
| RN12.2 | O sistema deve oferecer a opção “Esqueci minha senha” para recuperação por e-mail. |
| RN12.3 | Após cinco tentativas de login malsucedidas, o sistema deve bloquear temporariamente a conta por segurança. |
| RN12.4 | O sistema deve manter a sessão ativa por um período determinado. |

### RF13 — Recuperar senha

| ID | Regra de negócio |
|---|---|
| RN13.1 | O e-mail informado deve estar cadastrado no sistema. |
| RN13.2 | O link de recuperação deve possuir tempo de expiração. |
| RN13.3 | A nova senha deve atender aos critérios mínimos de segurança. |
| RN13.4 | O link de recuperação pode ser utilizado somente uma vez. |

### RF14 — Editar perfil

| ID | Regra de negócio |
|---|---|
| RN14.1 | Os campos obrigatórios não podem permanecer vazios. |
| RN14.2 | O sistema deve validar o formato dos dados informados. |
| RN14.3 | Apenas o próprio usuário pode editar seu perfil. |

### RF15 — Editar item

| ID | Regra de negócio |
|---|---|
| RN15.1 | Apenas participantes da lista podem editar itens. |
| RN15.2 | Itens reservados devem apresentar aviso antes da edição. |
| RN15.3 | O sistema deve validar os dados informados. |

### RF16 — Remover item

| ID | Regra de negócio |
|---|---|
| RN16.1 | Apenas participantes da lista podem remover itens. |
| RN16.2 | A remoção deve exigir confirmação do usuário. |
| RN16.3 | Itens reservados devem apresentar aviso antes da remoção. |

### RF17 — Encerrar sessão

| ID | Regra de negócio |
|---|---|
| RN17.1 | Apenas usuários autenticados podem encerrar a sessão. |
| RN17.2 | O sistema deve invalidar a sessão ativa quando o logout for realizado. |
| RN17.3 | Após o logout, áreas restritas não poderão ser acessadas sem um novo login. |

---

# 3. Diagramas UML

## 3.1. Diagrama de casos de uso

O diagrama de casos de uso apresenta as principais interações entre os usuários e o sistema EuLevo, incluindo cadastro, autenticação, gerenciamento de listas, colaboração por itens, comunicação e controle de participantes.

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1g9EIYtu3fVnQnBFMJ-nTLqEvS2hiD089" alt="Diagrama de Casos de Uso" width="900">
</p>

**Figura 1 — Diagrama de Casos de Uso.**

## 3.2. Especificação dos casos de uso

### UC1 — Cadastrar

| Campo | Descrição |
|---|---|
| Caso de uso geral | Cadastrar usuário |
| Ator principal | Usuário |
| Atores secundários | Não se aplica |
| Resumo | Descreve as etapas necessárias para criar o cadastro de um usuário na aplicação. |
| Pré-condições | O usuário deve possuir acesso à internet e informar os dados corretamente. |
| Pós-condições | Quando os dados forem válidos, o usuário será cadastrado e redirecionado para a tela de login. |
| Restrições e validações | Os campos obrigatórios devem ser preenchidos e o e-mail deve ser único no sistema. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | Clica na opção de realizar cadastro. | Exibe o formulário de cadastro. |
| 2 | Informa nome, e-mail e senha. | Recebe os dados preenchidos. |
| 3 | Clica no botão de cadastro. | Valida os campos informados. |
| 4 | — | Verifica se o e-mail já está cadastrado. |
| 5 | — | Registra o usuário no sistema quando os dados são válidos. |
| 6 | — | Redireciona o usuário para a tela de login. |

### UC2 — Logar

| Campo | Descrição |
|---|---|
| Caso de uso geral | Autenticar usuário |
| Ator principal | Usuário |
| Atores secundários | Não se aplica |
| Resumo | Descreve o fluxo de login para acesso à aplicação. |
| Pré-condições | O usuário deve possuir acesso à internet, estar cadastrado e informar os dados corretamente. |
| Pós-condições | Quando os dados forem válidos, o usuário será redirecionado para a tela inicial. |
| Restrições e validações | Caso os dados sejam inválidos, o login não será efetivado. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | Informa e-mail e senha nos campos destinados. | Recebe as credenciais. |
| 2 | Clica no botão de login. | Valida as informações. |
| 3 | — | Confirma as informações do usuário. |
| 4 | — | Permite o acesso à aplicação ou apresenta mensagem de erro. |

### UC3 — Criar lista

| Campo | Descrição |
|---|---|
| Caso de uso geral | Criar lista de evento |
| Ator principal | Usuário |
| Atores secundários | Não se aplica |
| Resumo | Descreve o fluxo de criação de uma lista no sistema. |
| Pré-condições | Usuário autenticado e com acesso à internet. |
| Pós-condições | Lista criada com sucesso e vinculada ao organizador. |
| Restrições e validações | Os campos obrigatórios devem ser preenchidos corretamente. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | Clica na opção de criar lista. | Exibe o formulário de evento. |
| 2 | Informa os dados do evento. | Recebe os dados preenchidos. |
| 3 | Confirma a criação. | Valida os dados informados. |
| 4 | — | Registra o evento no sistema. |
| 5 | — | Associa o usuário como organizador. |
| 6 | — | Exibe o evento e a lista criados. |

### UC4 — Assumir item

| Campo | Descrição |
|---|---|
| Caso de uso geral | Assumir responsabilidade por item |
| Ator principal | Usuário participante |
| Atores secundários | Não se aplica |
| Resumo | Descreve o fluxo em que o participante informa que será responsável por levar um item. |
| Pré-condições | Usuário autenticado, participante da lista e item disponível. |
| Pós-condições | O item fica vinculado ao usuário responsável. |
| Restrições e validações | Um item não pode ser assumido por mais de um usuário. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | Visualiza a lista de itens. | Exibe os itens disponíveis e assumidos. |
| 2 | Seleciona um item disponível. | Verifica a disponibilidade do item. |
| 3 | Confirma a ação. | Registra o usuário como responsável. |
| 4 | — | Atualiza a lista de itens e exibe o responsável. |

### UC5 — Usar bate-papo

| Campo | Descrição |
|---|---|
| Caso de uso geral | Trocar mensagens no evento |
| Ator principal | Usuário participante |
| Atores secundários | Não se aplica |
| Resumo | Descreve o fluxo de comunicação entre os usuários de uma lista. |
| Pré-condições | Usuário autenticado e participante da lista. |
| Pós-condições | A mensagem é enviada e exibida no bate-papo do evento. |
| Restrições e validações | A mensagem não pode estar vazia. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | Acessa o bate-papo. | Exibe as mensagens do evento. |
| 2 | Digita uma mensagem. | Recebe o conteúdo informado. |
| 3 | Envia a mensagem. | Valida, registra e exibe a mensagem para os participantes. |

### UC6 — Receber notificações

| Campo | Descrição |
|---|---|
| Caso de uso geral | Receber notificações sobre alterações |
| Ator principal | Usuário participante |
| Atores secundários | Não se aplica |
| Resumo | Descreve o envio de notificações relacionadas às atualizações da lista. |
| Pré-condições | O usuário deve ser participante confirmado do evento. |
| Pós-condições | A notificação é exibida ao usuário. |
| Restrições e validações | Apenas participantes confirmados podem receber notificações do evento. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | — | Detecta uma alteração relevante no evento. |
| 2 | — | Gera uma notificação. |
| 3 | — | Envia ou exibe a notificação ao usuário participante. |

### UC7 — Editar lista

| Campo | Descrição |
|---|---|
| Caso de uso geral | Editar lista de evento |
| Ator principal | Organizador |
| Atores secundários | Não se aplica |
| Resumo | Descreve o fluxo de atualização das informações de uma lista. |
| Pré-condições | Usuário autenticado e identificado como organizador da lista. |
| Pós-condições | Lista atualizada. |
| Restrições e validações | Somente o organizador pode editar as informações da lista. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | Seleciona a lista desejada. | Exibe os dados atuais da lista. |
| 2 | Altera as informações necessárias. | Recebe os novos dados. |
| 3 | Confirma as alterações. | Valida e atualiza os dados da lista. |
| 4 | — | Exibe as informações atualizadas aos participantes. |

### UC8 — Excluir lista

| Campo | Descrição |
|---|---|
| Caso de uso geral | Excluir lista de evento |
| Ator principal | Organizador |
| Atores secundários | Não se aplica |
| Resumo | Permite excluir uma lista do sistema. |
| Pré-condições | A lista deve existir e o usuário deve ser seu organizador. |
| Pós-condições | A lista é removida do sistema. |
| Restrições e validações | Apenas o organizador pode excluir a lista e a exclusão deve ser confirmada. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | Seleciona a opção de excluir lista. | Solicita confirmação. |
| 2 | Confirma a exclusão. | Valida a solicitação e a permissão do usuário. |
| 3 | — | Remove a lista do sistema. |
| 4 | — | Atualiza a visualização da aplicação. |

### UC9 — Sair da lista

| Campo | Descrição |
|---|---|
| Caso de uso geral | Sair de uma lista de evento |
| Ator principal | Usuário participante |
| Atores secundários | Não se aplica |
| Resumo | Permite ao usuário deixar de participar de uma lista. |
| Pré-condições | O usuário deve estar vinculado à lista. |
| Pós-condições | O usuário é removido da lista. |
| Restrições e validações | O usuário deve ser participante do evento. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | Seleciona a opção de sair da lista. | Solicita confirmação. |
| 2 | Confirma a ação. | Valida a solicitação. |
| 3 | — | Remove o usuário da lista vinculada ao evento. |

### UC10 — Convidar participantes

| Campo | Descrição |
|---|---|
| Caso de uso geral | Convidar participantes |
| Ator principal | Organizador |
| Atores secundários | Não se aplica |
| Resumo | Permite convidar novos usuários para colaborar em uma lista. |
| Pré-condições | O usuário deve ser o organizador do evento. |
| Pós-condições | O convite é enviado ao usuário selecionado. |
| Restrições e validações | Apenas o organizador pode convidar participantes cadastrados. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | Informa os dados do participante. | Recebe e valida os dados informados. |
| 2 | Envia o convite. | Registra o convite no sistema. |
| 3 | — | Notifica o participante convidado. |

### UC11 — Visualizar histórico

| Campo | Descrição |
|---|---|
| Caso de uso geral | Visualizar histórico de atividades |
| Ator principal | Usuário autorizado |
| Atores secundários | Não se aplica |
| Resumo | Permite visualizar as ações realizadas em uma lista de evento. |
| Pré-condições | A lista deve existir e o usuário deve possuir autorização de acesso. |
| Pós-condições | O histórico de ações é exibido. |
| Restrições e validações | Apenas usuários autorizados podem visualizar o histórico. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | Acessa a opção de histórico. | Busca os registros vinculados ao evento. |
| 2 | — | Exibe o histórico de ações realizadas. |

### UC12 — Recuperar senha

| Campo | Descrição |
|---|---|
| Caso de uso geral | Recuperar senha |
| Ator principal | Usuário |
| Atores secundários | Não se aplica |
| Resumo | Permite redefinir a senha de um usuário cadastrado. |
| Pré-condições | O usuário deve possuir cadastro no sistema. |
| Pós-condições | A senha é redefinida com sucesso. |
| Restrições e validações | O e-mail informado deve existir no sistema. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | Informa o e-mail cadastrado. | Valida o e-mail informado. |
| 2 | Solicita a redefinição de senha. | Gera e envia um link ou token de recuperação. |
| 3 | Define a nova senha. | Valida e atualiza a senha do usuário. |

### UC13 — Editar perfil

| Campo | Descrição |
|---|---|
| Caso de uso geral | Editar informações do perfil |
| Ator principal | Usuário |
| Atores secundários | Não se aplica |
| Resumo | Permite atualizar os dados pessoais do usuário. |
| Pré-condições | O usuário deve estar autenticado. |
| Pós-condições | O perfil é atualizado. |
| Restrições e validações | Somente o próprio usuário pode editar suas informações. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | Altera as informações do perfil. | Recebe os dados atualizados. |
| 2 | Confirma as alterações. | Valida e atualiza o perfil. |

### UC14 — Adicionar item

| Campo | Descrição |
|---|---|
| Caso de uso geral | Adicionar item à lista |
| Ator principal | Organizador ou participante autorizado |
| Atores secundários | Não se aplica |
| Resumo | Descreve o fluxo de adição de um novo item à lista do evento. |
| Pré-condições | Usuário autenticado, com permissão para adicionar itens, e lista existente. |
| Pós-condições | O item é adicionado à lista com sucesso. |
| Restrições e validações | O item deve possuir nome válido e não pode estar vazio. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | Acessa a lista de itens. | Exibe os itens atuais. |
| 2 | Clica na opção de adicionar item. | Exibe o formulário de inclusão. |
| 3 | Informa os dados do item. | Recebe os dados preenchidos. |
| 4 | Confirma a adição. | Valida e registra o item na lista. |
| 5 | — | Atualiza a lista e exibe o item adicionado. |

### UC15 — Editar item

| Campo | Descrição |
|---|---|
| Caso de uso geral | Editar item de lista |
| Ator principal | Organizador ou participante autorizado |
| Atores secundários | Não se aplica |
| Resumo | Descreve o fluxo de edição de um item já existente na lista. |
| Pré-condições | Usuário autenticado, com permissão para editar, e item existente. |
| Pós-condições | O item é atualizado com sucesso. |
| Restrições e validações | Os dados devem ser válidos; itens reservados devem apresentar aviso antes da edição. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | Acessa a lista de itens. | Exibe os itens disponíveis. |
| 2 | Seleciona o item desejado. | Exibe as informações do item. |
| 3 | Clica na opção de editar item. | Permite alterar os dados. |
| 4 | Confirma a edição. | Valida e atualiza o item no sistema. |
| 5 | — | Atualiza a lista e exibe o item atualizado. |

### UC16 — Remover item

| Campo | Descrição |
|---|---|
| Caso de uso geral | Remover item de lista |
| Ator principal | Organizador ou participante autorizado |
| Atores secundários | Não se aplica |
| Resumo | Descreve o fluxo de remoção de um item da lista. |
| Pré-condições | Usuário autenticado, com permissão para remover, e item existente. |
| Pós-condições | O item é removido da lista com sucesso. |
| Restrições e validações | A remoção deve ser confirmada pelo usuário e itens reservados devem apresentar aviso. |

| Etapa | Ação do usuário | Resposta do sistema |
|---|---|---|
| 1 | Acessa a lista de itens. | Exibe os itens cadastrados. |
| 2 | Seleciona o item desejado. | Exibe as opções disponíveis. |
| 3 | Clica na opção de remover item. | Solicita confirmação da remoção. |
| 4 | Confirma a remoção. | Valida a solicitação e exclui o item. |
| 5 | — | Atualiza a lista e exibe os dados atualizados. |

## 3.3. Diagramas de sequência

Os diagramas de sequência representam a ordem das mensagens trocadas entre o usuário, a interface, o controlador, os serviços e o banco de dados durante a execução das principais funcionalidades do EuLevo.

### 3.3.1. Sequência — Cadastrar usuário

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1oc6M_ZLzKlBQziNHcC1njO4GTxXQ7fPe" alt="Diagrama de sequência de cadastro" width="900">
</p>

**Figura 2 — Sequência Cadastrar.**

**Fluxo:** o usuário acessa a tela de cadastro, informa nome, e-mail e senha e envia os dados à interface. A interface valida os campos obrigatórios e encaminha a solicitação ao controlador. O controlador aciona o serviço, que consulta o banco de dados para verificar a existência do e-mail. Caso o e-mail não exista, o novo usuário é inserido e o sistema retorna uma mensagem de sucesso; caso contrário, apresenta um erro informando que o e-mail já está cadastrado.

### 3.3.2. Sequência — Logar

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1EhCz461Dor4Q4IWIUPe-VdZsiC09xpAX" alt="Diagrama de sequência de login" width="900">
</p>

**Figura 3 — Sequência Logar.**

**Fluxo:** o usuário informa e-mail e senha na tela de login. A interface valida os campos e envia a solicitação ao controlador. O controlador aciona o serviço de autenticação, que consulta o banco de dados para localizar o usuário. Quando as credenciais forem válidas, o sistema cria uma sessão ou token e redireciona o usuário para a tela inicial. Caso contrário, a interface apresenta a mensagem **“E-mail ou senha incorretos”**.

### 3.3.3. Sequência — Assumir item

> **Observação:** entre os arquivos disponibilizados, não há uma imagem identificada como `SequenciaAssumirItem`. O fluxo funcional abaixo permanece documentado e a imagem poderá ser inserida quando o arquivo correspondente for disponibilizado.

**Fluxo:** o participante seleciona um item pendente e escolhe a opção **“Assumir item”**. A interface encaminha a solicitação ao controlador, que aciona o serviço responsável por verificar a disponibilidade do item. Se o item estiver disponível, o serviço registra o participante como responsável, atualiza o item e grava a ação no histórico. Caso o item já esteja assumido, o sistema retorna a mensagem **“Item já foi assumido”**.

### 3.3.4. Sequência — Adicionar item

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1obc4V0PtbsAfC4SYXwuTd-agsKzE13NU" alt="Diagrama de sequência de adicionar item" width="900">
</p>

**Figura 4 — Sequência Adicionar Item.**

**Fluxo:** o usuário seleciona **“Adicionar item”**, informa nome, quantidade e categoria e envia os dados. A interface encaminha a solicitação ao controlador, que aciona o serviço para validar as informações. Quando os dados forem válidos, o item é inserido no banco de dados, a ação é registrada no histórico e os participantes podem ser notificados. Em caso de erro, a interface apresenta a mensagem correspondente.

### 3.3.5. Sequência — Criar lista

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1KuYAXbT2ThTGIMNlhQgUBgQAiIZ2t0ZL" alt="Diagrama de sequência de criar lista" width="900">
</p>

**Figura 5 — Sequência Criar Lista.**

**Fluxo:** o organizador seleciona a opção **“Criar lista”**, preenche o nome e a data do evento e confirma a criação. A interface encaminha os dados ao controlador e o serviço valida as informações. Quando válidos, o banco de dados salva o evento e cria a lista inicial vinculada ao organizador. Ao final, o usuário é redirecionado para a lista criada.

### 3.3.6. Sequência — Editar item

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1gTBG1G0zN3lTfYsps0_A0AwZtTVZhUYS" alt="Diagrama de sequência de editar item" width="900">
</p>

**Figura 6 — Sequência Editar Item.**

**Fluxo:** o usuário seleciona um item, escolhe **“Editar item”**, informa os novos dados e confirma a alteração. O serviço valida as informações e verifica se o item está reservado. Caso esteja reservado, o sistema apresenta um aviso e solicita confirmação para prosseguir. Quando a atualização é confirmada, o item é atualizado no banco de dados, a ação é registrada no histórico e os participantes são notificados.

### 3.3.7. Sequência — Remover item

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1YSEIZSDPvV1xxH_77UoHnA5cNHcKQ0QP" alt="Diagrama de sequência de remover item" width="900">
</p>

**Figura 7 — Sequência Remover Item.**

**Fluxo:** o usuário seleciona o item que deseja remover, escolhe a opção **“Remover item”** e confirma a ação. O controlador solicita ao serviço a validação de permissão e a verificação da situação do item. Caso o item esteja reservado, um aviso é apresentado antes da exclusão. Quando a remoção é confirmada, o item é excluído, o histórico é atualizado e os participantes são notificados.

### 3.3.8. Sequência complementar — Remover itens

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=127tVQw_lCTCYGsLcuk8jpyRL3NQRB6U-" alt="Diagrama de sequência complementar de remover itens" width="900">
</p>

**Figura 8 — Sequência Remover Itens.**

### 3.3.9. Sequência — Convidar participantes

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1zFUQk_JbGXYWo-8kq4ahyZKBo31bsMl1" alt="Diagrama de sequência de convidar participantes" width="900">
</p>

**Figura 9 — Sequência Convidar Participantes.**

**Fluxo:** o organizador acessa a lista do evento, escolhe a opção **“Convidar participantes”** e informa o nome do usuário. A interface encaminha a busca ao controlador, que aciona o serviço para consultar o banco de dados. Se o usuário for encontrado, a interface o apresenta para seleção. Após a confirmação, o sistema registra o convite e notifica o participante. Caso não seja encontrado, a interface exibe a mensagem **“Usuário não encontrado”**.

## 3.4. Diagramas de atividades

### 3.4.1. Adicionar item

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1FUXhqCMGzVFsN6lZ2L3MMbt2lbIEQNuz" alt="Diagrama de atividade de adicionar item" width="900">
</p>

**Figura 10 — Diagrama de Atividade: Adicionar Item.**

### 3.4.2. Cadastrar usuário

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1ew6OYyrL2J9RXGLaggpGrdZ1Nor6y5ZZ" alt="Diagrama de atividade de cadastrar usuário" width="900">
</p>

**Figura 11 — Diagrama de Atividade: Cadastrar Usuário.**

### 3.4.3. Fazer login

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1YTCilYaXTcMeYROHZlmoRIQDa6LbEzi3" alt="Diagrama de atividade de fazer login" width="900">
</p>

**Figura 12 — Diagrama de Atividade: Fazer Login.**

### 3.4.4. Criar lista

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1psz8vflR4WPaHCTI8e8Z0y_6Ws7OVqLx" alt="Diagrama de atividade de criar lista" width="900">
</p>

**Figura 13 — Diagrama de Atividade: Criar Lista.**

### 3.4.5. Assumir item

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1zxNLXozQkH7jRxlnyFdJ-b5N24HxG7mN" alt="Diagrama de atividade de assumir item" width="900">
</p>

**Figura 14 — Diagrama de Atividade: Assumir Item.**

### 3.4.6. Editar item

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1AGXFzXfuox5ijZLbb3qRA56UlQs2M8tS" alt="Diagrama de atividade de editar item" width="900">
</p>

**Figura 15 — Diagrama de Atividade: Editar Item.**

### 3.4.7. Remover item

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1yDpderbcSJnRmYSVBTp_kJCLzrLAUz44" alt="Diagrama de atividade de remover item" width="900">
</p>

**Figura 16 — Diagrama de Atividade: Remover Item.**

### 3.4.8. Convidar participante

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=17oDC19xyX_IbpfMRx_LFno55cCTRvsV9" alt="Diagrama de atividade de convidar participante" width="900">
</p>

**Figura 17 — Diagrama de Atividade: Convidar Participante.**

## 3.5. Diagrama de classes

O diagrama de classes representa a estrutura estática do sistema, suas principais entidades, atributos, relacionamentos e responsabilidades.

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1NTdPtueg5PchpYFIyS7u74zcArAIGjPt" alt="Diagrama de Classes" width="900">
</p>

**Figura 18 — Diagrama de Classes.**

## 3.6. Diagrama de objetos

O diagrama de objetos apresenta uma visão de instâncias concretas das classes e de seus relacionamentos em um determinado momento da execução do sistema.

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1Tgbn6H6q2VNfUo2oI8xCI41H0szzhtv3" alt="Diagrama de Objetos" width="900">
</p>

**Figura 19 — Diagrama de Objetos.**

---

# 4. Arquitetura do Sistema

## 4.1. Visão do sistema

O EuLevo é uma aplicação voltada à organização de confraternizações por meio de listas colaborativas. A plataforma permite que usuários criem eventos, adicionem itens, convidem participantes e acompanhem as responsabilidades assumidas por cada pessoa.

A interação ocorre principalmente por meio das listas de eventos. Nelas, os participantes podem visualizar itens, assumir responsabilidades, comunicar-se pelo bate-papo e acompanhar alterações realizadas durante a organização.

A estrutura do sistema foi planejada para favorecer organização, clareza, manutenção e evolução das funcionalidades.

## 4.2. Estilo arquitetural do sistema — MVC

O EuLevo adota o padrão arquitetural **Model-View-Controller (MVC)**, que separa as responsabilidades da aplicação em componentes distintos. Essa organização contribui para um código mais estruturado, compreensível e de fácil manutenção.

### Model — Modelo

É responsável por representar os dados do sistema e suas regras de negócio. Inclui entidades como usuários, eventos, listas, itens, participantes, mensagens e notificações, além das validações e operações relacionadas a esses dados.

### View — Visão

É responsável pela interface com o usuário. Exibe informações, recebe dados informados pelos usuários e apresenta as respostas geradas pelo sistema.

### Controller — Controlador

É responsável por intermediar a comunicação entre a View e o Model. Recebe as ações realizadas na interface, coordena o processamento das requisições e aciona as operações necessárias para atender às funcionalidades.

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1ow3HVZHom8AXeBxD1tCgDagR0Ze8uK-U" alt="Arquitetura MVC" width="900">
</p>

**Figura 20 — Arquitetura MVC.**

A separação proporcionada pelo MVC contribui para:

- Melhor organização do código;
- Facilidade de manutenção;
- Maior clareza na estrutura da aplicação;
- Separação de responsabilidades;
- Facilidade para evolução e expansão do sistema;
- Melhor reutilização de componentes e regras de negócio.

---

# 5. Padrões de Projeto

## 5.1. Singleton

O padrão **Singleton** será utilizado para garantir que determinadas classes possuam uma única instância durante toda a execução do sistema. Esse padrão é adequado para componentes que necessitam de controle centralizado e acesso compartilhado.

No EuLevo, o Singleton pode ser aplicado em componentes como:

- Gerenciamento de sessão do usuário;
- Configurações gerais da aplicação;
- Gerenciamento de conexão com banco de dados;
- Serviços centralizados de notificação.

A utilização desse padrão evita a criação desnecessária de múltiplas instâncias, reduz o consumo de recursos e auxilia na manutenção da consistência de informações compartilhadas.

## 5.2. Observer

O padrão **Observer** será utilizado para estruturar o mecanismo de notificações do sistema. Sempre que ocorrer uma alteração relevante em um item ou lista, os usuários interessados poderão ser notificados automaticamente.

Nesse modelo:

- O item ou a lista atua como o **objeto observado** (*subject*);
- Os participantes vinculados ao evento atuam como **observadores** (*observers*);
- Alterações como criação, edição, remoção ou reserva de itens podem disparar atualizações;
- Os observadores recebem notificações sem que seja necessário criar dependência direta entre todos os componentes.

O uso do Observer promove baixo acoplamento, facilita a evolução do mecanismo de notificações e permite a inclusão de novos tipos de aviso sem alterações significativas na lógica principal do sistema.

---

# 6. Prototipação das Telas

A prototipação das telas tem o objetivo de representar visualmente as interfaces do EuLevo antes ou durante a implementação, facilitando a validação da experiência do usuário e a identificação de melhorias de usabilidade.

As principais telas previstas para a aplicação são:

| Tela | Objetivo |
|---|---|
| Cadastro | Permitir o registro de novos usuários. |
| Login | Permitir a autenticação de usuários cadastrados. |
| Tela inicial | Exibir as listas e eventos vinculados ao usuário. |
| Criar lista | Permitir o cadastro de uma nova confraternização. |
| Detalhes da lista | Exibir itens, participantes, bate-papo e ações disponíveis. |
| Adicionar item | Permitir incluir novos itens na lista. |
| Editar item | Permitir atualizar as informações de um item existente. |
| Convidar participante | Permitir localizar e convidar usuários cadastrados. |
| Perfil | Permitir visualizar e editar dados pessoais. |
| Histórico | Permitir acompanhar as ações realizadas no evento. |

> **Nota:** não foram disponibilizadas imagens ou links dos protótipos de interface. Esta seção pode ser atualizada quando os protótipos forem enviados.

---

# 7. Análise de Riscos

A análise de riscos identifica situações que podem afetar o prazo, a qualidade, a disponibilidade ou a continuidade do desenvolvimento e do uso do EuLevo.

| Identificador | Risco | Probabilidade | Impacto | Estratégia preventiva | Plano de resposta |
|---|---|---|---|---|---|
| CR001 | Indisponibilidade do servidor. | Média | Alto | Monitorar o serviço de hospedagem, manter backups e utilizar mecanismos de disponibilidade. | Informar os usuários, restaurar o serviço e recuperar dados a partir do backup mais recente. |
| CR002 | Falha na coleta ou persistência de dados. | Média | Alto | Validar campos, aplicar testes de integração e registrar erros do sistema. | Corrigir registros inconsistentes, restaurar dados quando necessário e revisar a causa da falha. |
| CR003 | Falta de mão de obra disponível. | Média | Médio | Planejar entregas, distribuir tarefas e manter documentação atualizada. | Repriorizar funcionalidades, redistribuir atividades e ajustar o cronograma. |
| CR004 | Mão de obra com habilidades inadequadas. | Média | Médio | Promover estudo das tecnologias e revisão de código entre os integrantes. | Realizar capacitação, buscar orientação e redistribuir tarefas conforme as habilidades da equipe. |
| CR005 | Alterações frequentes de requisitos. | Média | Médio | Validar requisitos com antecedência e manter registro de decisões. | Avaliar impacto, atualizar a documentação e reorganizar o planejamento. |
| CR006 | Acesso indevido a listas e dados de usuários. | Baixa | Alto | Aplicar autenticação, autorização por perfil, controle de sessão e criptografia de senhas. | Bloquear acessos suspeitos, invalidar sessões e revisar as permissões afetadas. |
| CR007 | Conflitos ao assumir ou editar um mesmo item. | Média | Médio | Aplicar validações transacionais e verificar disponibilidade antes de atualizar o item. | Exibir mensagem ao usuário, manter o primeiro registro válido e atualizar a lista. |

---

# 8. Apêndice

## 8.1. Relato de experiência

O desenvolvimento do EuLevo permitiu aplicar conceitos de levantamento de requisitos, modelagem UML, arquitetura MVC e padrões de projeto. A equipe realizou a organização das funcionalidades principais de uma aplicação colaborativa, identificando regras importantes relacionadas a permissões, controle de participantes, atualizações de itens e notificações.

A elaboração dos diagramas contribuiu para visualizar a estrutura do sistema e os fluxos de interação entre usuário, interface, controlador, serviços e banco de dados. Além disso, a análise de riscos auxiliou na identificação de situações que podem comprometer a entrega ou a qualidade do produto.
