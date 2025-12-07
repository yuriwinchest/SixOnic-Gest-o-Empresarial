# ⚠️ PROBLEMA IDENTIFICADO - CHAVES SSH

## 🔍 O QUE ESTÁ NO PAINEL AGORA

Você tem **DUAS chaves** no campo SSH Keys:

### Chave 1 (NOSSA - CORRETA):
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```
✅ Esta é a chave correta que geramos!

### Chave 2 (ANTIGA - COM RESTRIÇÕES):
```
from="127.0.0.1",command="internal-sftp",restrict ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAAgQC5BOf0YKRTtnZQtqGSExFrDLy9vdjlsEfqIRZh9knYaM+db1OdtUlBTXdJYlSgN1RuyN3GWqNUqXRRoz7/3+1IA9ZVG1Ii5i7YvAMYu9BAMednfAMiH6O3FiNo3C6dpOPgXk97ON1rsYWmlvfFJZ27uYTWHbpU9UywypxXUVVHGQ== root@server.equipcasa.com.br
```
❌ Esta chave tem restrições:
- `from="127.0.0.1"` = Só funciona localmente
- `command="internal-sftp"` = Só permite SFTP, não SSH
- `restrict` = Restrições adicionais

---

## ✅ SOLUÇÃO: SUBSTITUIR AS CHAVES

### PASSO 1: Deletar Tudo

No painel, no campo **SSH Keys**:
1. **DELETE todo o conteúdo** (ambas as chaves)
2. Deixe o campo vazio

### PASSO 2: Adicionar Apenas a Chave Correta

Cole **SOMENTE** esta chave (uma linha):

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

### PASSO 3: Verificar SSH Access

Certifique-se que:
- **SSH Access:** está como **`bash`** (não `nologin`)

### PASSO 4: Salvar

Clique em **Save** (Salvar)

---

## 🎯 COMO DEVE FICAR

### Campo SSH Keys (deve conter APENAS):
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

### Campo SSH Access:
```
bash
```

---

## ✅ DEPOIS DE CORRIGIR

Execute o teste:

```powershell
.\testar-ssh-nova-chave.ps1
```

**Resultado esperado:**
```
✅ CONEXÃO SSH FUNCIONANDO PERFEITAMENTE!
HugoGandy
/home/HugoGandy
```

---

## 📋 RESUMO DO PROBLEMA

| Item | Problema | Solução |
|------|----------|---------|
| Chave 1 | ✅ Correta | Manter |
| Chave 2 | ❌ Tem restrições | **DELETAR** |
| SSH Access | ? | Deve ser `bash` |

---

## 💡 POR QUE A CHAVE ANTIGA NÃO FUNCIONA?

A chave antiga tem estas restrições:

```
from="127.0.0.1"          ← Só aceita conexões de localhost
command="internal-sftp"   ← Só permite SFTP, não SSH
restrict                  ← Restrições extras
```

Por isso o SSH não funciona! Ela foi criada pelo File Manager do painel apenas para SFTP interno.

---

## 🎯 AÇÃO NECESSÁRIA

1. ✅ Acesse o painel
2. ✅ Users → Edit HugoGandy
3. ✅ SSH Keys: **DELETE tudo**
4. ✅ SSH Keys: Cole **SOMENTE** a chave nova (linha única)
5. ✅ SSH Access: `bash`
6. ✅ Save
7. ✅ Teste: `.\testar-ssh-nova-chave.ps1`

---

## 🔑 CHAVE CORRETA (copie daqui)

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

**Importante:** Cole APENAS esta linha, sem nada antes ou depois!

---

**Corrija isso e teste novamente!** 🚀
