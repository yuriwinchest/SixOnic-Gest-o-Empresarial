# 🔍 DIAGNÓSTICO SSH - HugoGandy@161.97.124.179

## ❌ RESULTADO DO TESTE

```
ssh: connect to host 161.97.124.179 port 22: Connection timed out
```

## ⚠️ O QUE ISSO SIGNIFICA

**Connection timed out** = A conexão SSH não está respondendo para o usuário HugoGandy.

Possíveis causas:
1. ❌ SSH não está habilitado para HugoGandy
2. ❌ SSH Access está como `nologin` ao invés de `bash`
3. ❌ Chave SSH não foi configurada
4. ⚠️ Firewall pode estar bloqueando

---

## ✅ SOLUÇÃO: CONFIGURAR SSH NO PAINEL

### PASSO 1: Habilitar SSH para HugoGandy

1. **Acesse:** https://161.97.124.179:8083
2. **Login:** ver8wdgr / sua senha
3. **Vá em:** Users (menu lateral)
4. **Encontre:** HugoGandy
5. **Clique em:** Edit (Editar)

### PASSO 2: Configurar SSH

Na página de edição do usuário HugoGandy, procure:

**Seção "SSH" ou "SSH Access":**

| Campo | Configuração |
|-------|--------------|
| **SSH Access** | Mude de `nologin` para **`bash`** |
| **SSH Keys** | Cole a chave abaixo |

**Chave SSH para colar:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

### PASSO 3: Salvar

Clique em **Save** (Salvar) no final da página.

### PASSO 4: Aguardar

Aguarde 10-30 segundos para as configurações serem aplicadas.

---

## 🧪 TESTAR NOVAMENTE

Depois de configurar, execute:

```powershell
.\testar-ssh-nova-chave.ps1
```

**Resultado esperado:**
```
✅ CONEXÃO SSH FUNCIONANDO PERFEITAMENTE!
```

---

## 🔄 ALTERNATIVA: Usar Usuário que Já Funciona

Vejo que você tem conexões SSH ativas com o usuário `deploy`:

```
ssh -o StrictHostKeyChecking=no deploy@161.97.124.179
```

**Opção temporária:**
Você pode usar o usuário `deploy` para fazer o deploy, mas precisará ajustar os caminhos.

---

## 📋 CHECKLIST DE CONFIGURAÇÃO

Marque cada item conforme for fazendo:

- [ ] Acessei o painel (https://161.97.124.179:8083)
- [ ] Fui em Users → Edit HugoGandy
- [ ] Encontrei a seção SSH
- [ ] Mudei SSH Access para `bash`
- [ ] Colei a chave SSH completa
- [ ] Cliquei em Save
- [ ] Aguardei 30 segundos
- [ ] Testei: `.\testar-ssh-nova-chave.ps1`

---

## 🎯 ONDE ENCONTRAR NO PAINEL

### Caminho no menu:
```
Painel Hestia
└── Users (Usuários)
    └── HugoGandy
        └── Edit (Editar)
            └── Seção "SSH" ou "Advanced"
                ├── SSH Access: bash
                └── SSH Keys: (cole a chave)
```

### Aparência visual:
Procure por campos com estes nomes:
- "SSH Access" ou "Shell Access"
- "SSH Keys" ou "Public Keys"
- Dropdown com opções: `nologin`, `bash`, `sh`

---

## 💡 IMPORTANTE

**SSH Access DEVE estar como `bash`!**

Se estiver como `nologin`, o SSH não funcionará mesmo com a chave configurada.

---

## 🆘 SE AINDA NÃO FUNCIONAR

### Opção 1: Verificar logs no painel
No painel, vá em **Server** → **Logs** e procure por erros de SSH.

### Opção 2: Usar FTP/SFTP
Você já configurou FTP. Pode usar para upload manual:
- Host: `161.97.124.179`
- Usuário: `HugoGandy_equipcas`
- Senha: `Hugo2025`

### Opção 3: Terminal Web do Painel
Use o terminal web integrado no painel para executar comandos.

---

## ✅ PRÓXIMO PASSO

**Configure SSH no painel agora!**

Depois execute:
```powershell
.\testar-ssh-nova-chave.ps1
.\deploy-auto-hugo.ps1
```

🚀 **Deploy automático em 30 segundos!**
