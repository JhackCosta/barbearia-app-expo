# Barbearia App (Versão Expo) 💈

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/status-em_desenvolvimento-yellow?style=for-the-badge)

## 🎯 Sobre o Projeto

Este é um aplicativo móvel multiplataforma (Android/iOS) para gerenciamento de barbearias, desenvolvido como parte de um projeto de extensão acadêmico. A versão original foi criada com React Native CLI e esta é a sua evolução, utilizando o framework **Expo** para facilitar o desenvolvimento e a distribuição.

O objetivo é fornecer uma ferramenta moderna e eficiente para que barbearias possam otimizar sua gestão, substituindo processos manuais de agendamento e controle de clientes por uma solução digital centralizada.

## ✨ Funcionalidades Principais

- 📇 **Gestão de Clientes**: Cadastre, edite e consulte as informações dos seus clientes.
- 📅 **Agendamento de Serviços**: Crie e gerencie agendamentos de forma rápida e intuitiva.
- 📈 **Histórico de Atendimentos**: Acesse o histórico de serviços prestados para cada cliente.
- ⚙️ **Configuração de Preços**: Defina e ajuste os preços dos serviços oferecidos.
- 📊 **Dashboard e Relatórios**: Tenha uma visão geral do seu negócio com um painel principal e relatórios.
- 🔔 **Notificações**: Envie lembretes automáticos para os clientes sobre seus agendamentos.

## 🛠️ Tecnologias Utilizadas

| Ferramenta | Propósito |
|---|---|
| **React Native** | Framework principal para o desenvolvimento mobile. |
| **Expo** | Plataforma para facilitar o build, deploy e atualizações. |
| **TypeScript** | Garante a qualidade e a manutenibilidade do código. |
| **React Navigation** | Gerenciamento da navegação e fluxo entre telas. |
| **React Native Paper** | Biblioteca de componentes de UI seguindo o Material Design. |
| **AsyncStorage / SecureStore** | Armazenamento local e seguro de dados no dispositivo. |
| **Expo Notifications** | Sistema para agendamento de notificações locais e push. |

## 📂 Estrutura do Projeto

O código-fonte está organizado na pasta `src` da seguinte forma:

```
src/
├── assets/          # Imagens e outros recursos estáticos
├── components/      # Componentes React reutilizáveis (Botões, Logo, etc.)
├── hooks/           # Hooks customizados (ex: useDialog)
├── navigation/      # Configuração da navegação do app (React Navigation)
├── screens/         # Telas principais da aplicação
├── services/        # Lógica para serviços externos (Notificações, WhatsApp)
├── storage/         # Abstração para o armazenamento local
└── types/           # Definições de tipos e interfaces TypeScript
```

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
- [Yarn](https://classic.yarnpkg.com/en/docs/install) ou [NPM](https://docs.npmjs.com/cli/v7/commands/npm-install)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Um dispositivo físico (Android/iOS) com o app **Expo Go** ou um emulador/simulador configurado.

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/free-style-app.git
    ```

2.  Navegue até a pasta do projeto:
    ```bash
    cd free-style-app/BarbeariaAppExpo
    ```

3.  Instale as dependências:
    ```bash
    npm install
    ```
    *ou, se preferir usar o Yarn:*
    ```bash
    yarn install
    ```

### Execução

1.  Inicie o servidor de desenvolvimento do Expo:
    ```bash
    npm start
    ```
    *ou com Yarn:*
    ```bash
    yarn start
    ```

2.  Após iniciar o servidor, um QR code será exibido no terminal. Use o aplicativo **Expo Go** no seu celular para escaneá-lo e abrir o app.

3.  Alternativamente, você pode executar o app diretamente em um emulador/simulador:
    ```bash
    # Para Android
    npm run android

    # Para iOS
    npm run ios
    ```

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos e educacionais como parte de uma atividade de extensão universitária. Seu uso é primariamente para demonstração e portfólio.
