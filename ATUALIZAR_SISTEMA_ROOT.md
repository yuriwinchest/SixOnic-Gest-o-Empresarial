# 🔧 ATUALIZAR SISTEMA COMO ROOT

## ⚠️ IMPORTANTE

O acesso SSH como root requer senha. Você tem duas opções:

---

## OPÇÃO 1: Via Terminal SSH do Painel (RECOMENDADO)

### Passo 1: Acessar Terminal
1. Acesse: https://server.equipcasa.com.br:8083
2. Login com usuário root ou HugoGandy
3. Vá em **Terminal** ou **SSH Access**

### Passo 2: Executar Comandos
Cole e execute estes comandos no terminal:

```bash
# Atualizar lista de pacotes
sudo apt-get update

# Atualizar pacotes instalados
sudo apt-get upgrade -y

# Limpar pacotes desnecessários
sudo apt-get autoremove -y
sudo apt-get autoclean

# Verificar espaço em disco
df -h /

# Verificar memória
free -h

echo "✅ Sistema atualizado com sucesso!"
```

---

## OPÇÃO 2: Via SSH com Senha

Se você tiver a senha do root, execute:

```powershell
ssh root@161.97.124.179
```

Quando pedir a senha, digite a senha do root.

Depois execute:
```bash
apt-get update && apt-get upgrade -y
```

---

## OPÇÃO 3: Via Usuário HugoGandy (Após configurar SSH)

Depois de configurar a chave SSH do HugoGandy (veja INICIO_RAPIDO.md):

```powershell
.\atualizar-sistema.ps1
```

Este script executará automaticamente:
- `sudo apt-get update`
- `sudo apt-get upgrade -y`
- `sudo apt-get autoremove -y`
- `sudo apt-get autoclean`

---

## 📋 COMANDOS INDIVIDUAIS

Se preferir executar um por vez no terminal do painel:

```bash
# 1. Atualizar lista
sudo apt-get update

# 2. Atualizar pacotes
sudo apt-get upgrade -y

# 3. Limpar
sudo apt-get autoremove -y
```

---

## ✅ VERIFICAR SE FUNCIONOU

Após atualizar, verifique:

```bash
# Ver versão do sistema
lsb_release -a

# Ver pacotes que podem ser atualizados
apt list --upgradable

# Ver espaço em disco
df -h
```

---

## 💡 RECOMENDAÇÃO

**Use o Terminal SSH do painel** - é mais rápido e não precisa de configuração adicional!

1. Painel → Terminal
2. Cole os comandos
3. Pronto!

---

## 🎯 PRÓXIMO PASSO

Após atualizar o sistema, configure a chave SSH para deploy automático:

1. Leia: `INICIO_RAPIDO.md`
2. Configure a chave SSH
3. Execute: `.\deploy-auto-hugo.ps1`
