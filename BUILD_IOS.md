# 📱 Como Fazer Build iOS (Sem Mac!)

## Pré-requisitos
- ✅ Conta Apple (pode ser gratuita)
- ✅ Conta Expo (gratuita)
- ✅ iPhone para testes

## Passo 1: Instalar EAS CLI

```bash
npm install -g eas-cli
```

## Passo 2: Login no Expo

```bash
eas login
```

Se não tiver conta:
```bash
# Criar conta em: https://expo.dev/signup
```

## Passo 3: Configurar Projeto

```bash
cd BarbeariaAppExpo
eas build:configure
```

Isso vai criar o arquivo `eas.json` com as configurações de build.

## Passo 4: Build iOS na Nuvem

```bash
# Build de desenvolvimento (para testar no seu iPhone)
eas build --platform ios --profile development

# OU Build de produção (para App Store)
eas build --platform ios --profile production
```

### O que acontece:
1. 📤 Código é enviado para servidores do Expo
2. ☁️ Expo compila o app em máquinas macOS na nuvem
3. ⏳ Aguarde ~15-20 minutos
4. 📥 Baixe o arquivo `.ipa` ou `.app`

## Passo 5: Instalar no iPhone

### Método A: Expo Go (Mais Rápido - Para Desenvolvimento)
```bash
# Não precisa de build! Teste instantaneamente:
npx expo start

# No iPhone:
# 1. Baixe o app "Expo Go" na App Store
# 2. Escaneie o QR code que aparece no terminal
# 3. App abre no Expo Go!
```

### Método B: Build de Desenvolvimento (Custom)
Após o build completar:

1. **Instalar via TestFlight** (Mais fácil)
   ```bash
   # Após o build, rode:
   eas submit --platform ios
   ```
   - Expo envia para TestFlight automaticamente
   - Você recebe email da Apple
   - Instale no iPhone via app TestFlight

2. **Instalar Manualmente**
   - Baixe o `.ipa` do dashboard Expo
   - Use uma ferramenta como **Apple Configurator** ou **Xcode**
   - Conecte iPhone via USB e instale

### Método C: Simulador (Se tiver Mac)
```bash
# Baixe o .app e rode no simulador
npx expo run:ios
```

## 📊 Planos Expo EAS

| Plano | Builds iOS/mês | Preço |
|-------|----------------|-------|
| **Free** | 30 | Grátis |
| **Production** | Ilimitado | $29/mês |

Para desenvolvimento, **30 builds grátis é suficiente**!

## 🔧 Configuração Apple Developer

### Para Testes (Grátis)
- Conta Apple ID gratuita
- 7 dias de validade do app
- Até 3 dispositivos

### Para Produção (App Store)
- Precisa conta Apple Developer ($99/ano)
- Sem limite de tempo
- Distribuição pública

## 🎯 Workflow Recomendado

1. **Desenvolvimento Rápido**: Use Expo Go
   ```bash
   npx expo start
   # Escaneia QR no iPhone
   ```

2. **Testes Avançados**: Build de desenvolvimento
   ```bash
   eas build --platform ios --profile development
   # Instala via TestFlight
   ```

3. **Lançamento**: Build de produção
   ```bash
   eas build --platform ios --profile production
   eas submit --platform ios
   ```

## ⚡ Teste AGORA (Sem Build!)

A forma mais rápida de testar no iPhone é usar o **Expo Go**:

```bash
cd BarbeariaAppExpo
npx expo start
```

1. Baixe "Expo Go" na App Store
2. Abra o app
3. Escaneie o QR code que aparece no terminal
4. Pronto! App rodando no iPhone! 🎉

**Limitações do Expo Go:**
- ✅ Ótimo para desenvolvimento
- ⚠️ Algumas funcionalidades nativas podem não funcionar 100%
- ⚠️ Notificações podem ter comportamento diferente

**Para app completo com notificações funcionando:**
- Use `eas build` para gerar um build customizado

## 🐛 Troubleshooting

### Erro: "Apple Developer account required"
```bash
# Para desenvolvimento, use perfil gratuito:
eas build --platform ios --profile development
# Expo vai pedir suas credenciais Apple
```

### Erro: "Build failed"
```bash
# Veja logs detalhados:
eas build:list
# Clique no build para ver erro completo
```

### App não instala no iPhone
- Confira se iPhone permite apps de "desenvolvedor não confiável"
- Settings → General → VPN & Device Management
- Confie no perfil do desenvolvedor

## 📚 Links Úteis

- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [TestFlight](https://developer.apple.com/testflight/)
- [Expo Dashboard](https://expo.dev/accounts/[username]/projects/barbearia-app)
- [Como usar Expo Go](https://docs.expo.dev/get-started/expo-go/)

---

## 🎉 Resumo

Você TEM 3 opções:

1. **Expo Go (Grátis, 2 min)** ← Comece aqui!
2. **EAS Build Development (Grátis, 20 min)**
3. **EAS Build Production (Grátis, 20 min, precisa Apple Developer)**

Todas funcionam **SEM precisar de Mac**! 🚀
