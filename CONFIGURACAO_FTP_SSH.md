# 🔧 CONFIGURAÇÃO FTP E DIRETÓRIOS - BASEADO NA SUA TELA

## 📸 O QUE VI NA IMAGEM

Você está em: **Contas de FTP adicionais** no painel Hestia

Configuração atual:
- **Usuário:** equipcas
- **Senha:** Hugo2025
- **Caminho:** /home/HugoGandy/web/equipcasa.com.br

---

## ✅ CONFIGURAÇÃO RECOMENDADA

### Para Deploy do Sistema:

**Usuário FTP:**
```
HugoGandy_equipcas
```
(O sistema adiciona automaticamente o prefixo HugoGandy_)

**Senha:**
```
Hugo2025
```
(Ou a senha que você preferir)

**Caminho (Diretório):**
```
/home/HugoGandy/web/equipcasa.com.br
```

---

## 📁 ESTRUTURA DE DIRETÓRIOS

Baseado no que você precisa:

### Frontend (Site):
```
/home/HugoGandy/web/equipcasa.com.br/public_html
```
Aqui vão os arquivos da pasta `dist` (HTML, CSS, JS)

### Backend (Node.js):
```
/home/HugoGandy/gestao-vendas/backend
```
Aqui vão os arquivos do servidor (index.js, db.js, sql.js)

### Banco de Dados SQL:
```
/home/HugoGandy/gestao-vendas/tabelas_sistema.sql
```

---

## 🎯 CONFIGURAÇÃO COMPLETA NO PAINEL

### 1️⃣ Conta FTP (o que você está fazendo agora)

**Preencha assim:**

| Campo | Valor |
|-------|-------|
| **Usuário** | `equipcas` |
| **Senha** | `Hugo2025` |
| **Caminho** | `/home/HugoGandy/web/equipcasa.com.br` |

Depois clique em **Salvar** ou **Adicionar**

### 2️⃣ SSH Access (para deploy automático)

Depois de criar o FTP, configure o SSH:

1. Vá em **Users** → **Edit HugoGandy**
2. Procure **"SSH Access"** ou **"SSH"**
3. **SSH Keys:** Cole a chave:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```
4. **SSH Access:** Mude para `bash`
5. **Salvar**

---

## 🚀 DEPOIS DE CONFIGURAR

### Opção A: Upload via FTP (WinSCP ou FileZilla)

**Credenciais:**
- Host: `161.97.124.179`
- Porta: `21` (FTP) ou `22` (SFTP)
- Usuário: `HugoGandy_equipcas`
- Senha: `Hugo2025`

**Upload:**
- `dist/*` → `/home/HugoGandy/web/equipcasa.com.br/public_html/`
- `server/*` → `/home/HugoGandy/gestao-vendas/backend/`

### Opção B: Deploy Automático via SSH (RECOMENDADO)

Depois de configurar SSH, execute:

```powershell
cd C:\Users\yuriv\Desktop\SixOnic-Gest-o-Empresarial
.\testar-ssh-nova-chave.ps1
.\deploy-auto-hugo.ps1
```

---

## 📋 RESUMO DAS SENHAS E ACESSOS

### Painel Web Hestia:
- URL: `https://161.97.124.179:8083`
- Usuário: `ver8wdgr`
- Email: `hugogandy45@gmail.com`
- Senha: (senha do painel)

### FTP/SFTP:
- Host: `161.97.124.179`
- Usuário: `HugoGandy_equipcas`
- Senha: `Hugo2025`
- Caminho: `/home/HugoGandy/web/equipcasa.com.br`

### SSH (após configurar chave):
- Host: `161.97.124.179`
- Usuário: `HugoGandy`
- Chave: `C:\Users\yuriv\.ssh\hugo_key`

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Termine de criar a conta FTP** (clique em Salvar)
2. ✅ **Configure SSH** (Users → Edit HugoGandy → SSH Keys)
3. ✅ **Teste SSH:**
   ```powershell
   .\testar-ssh-nova-chave.ps1
   ```
4. ✅ **Faça deploy:**
   ```powershell
   .\deploy-auto-hugo.ps1
   ```

---

## 💡 DICA

**FTP é bom para upload manual**, mas **SSH é melhor para deploy automático**.

Configure ambos:
- FTP: Para uploads manuais quando precisar
- SSH: Para deploy automático rápido (30 segundos)

---

## ✅ ESTÁ NO CAMINHO CERTO!

A configuração que você está fazendo está correta! Depois de salvar o FTP, configure o SSH e você terá deploy automático funcionando. 🚀
