# 🔍 PROBLEMA ENCONTRADO!

## ⚠️ O QUE ESTÁ NO ARQUIVO

Você tem **2 chaves** no `authorized_keys`:

### Chave 1 (BLOQUEADA - DELETAR):
```
from="127.0.0.1",command="internal-sftp",restrict ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAAgQDIkTQjX/0eZiocTn4vYGcuL4JIDsc23/YS2PPRhfsLwGFPlJXiVo0XjttclLvPEThql3EBF1VAxHHzjEbztnGQ/NjIib5S5oodmK9TP9xke8PqA2itFWQ3sToiaGtjmLnfcA7yo/Q4COSPDVQXEQN7l09HaB97gT2NQ9kRth6URQ== root@server.equipcasa.com.br
```

❌ **Problema:** Tem `command="internal-sftp"` e `restrict` - bloqueia SSH!

### Chave 2 (CORRETA - MANTER):
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

✅ **Esta é nossa chave!** Sem restrições!

---

## ✅ SOLUÇÃO: SUBSTITUIR O ARQUIVO

### No Terminal SSH do painel, execute:

```bash
# Fazer backup
cp /home/HugoGandy/.ssh/authorized_keys /home/HugoGandy/.ssh/authorized_keys.backup

# Substituir com apenas a chave correta
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa" > /home/HugoGandy/.ssh/authorized_keys

# Configurar permissões
chmod 600 /home/HugoGandy/.ssh/authorized_keys
chown HugoGandy:HugoGandy /home/HugoGandy/.ssh/authorized_keys

# Verificar
cat /home/HugoGandy/.ssh/authorized_keys
```

---

## ✅ RESULTADO ESPERADO

Você deve ver APENAS:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOfkiT5K4Azr3cYja0b6dU6TvJoIAfO5gwF7csOrPpo7 deploy-hugo-equipcasa
```

---

## 🎯 DEPOIS DE EXECUTAR

Teste no Windows:

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

## 🚀 SE FUNCIONAR

```powershell
.\deploy-auto-hugo.ps1
```

**Deploy em 30 segundos!** ⚡

---

## 💡 POR QUE ISSO?

A primeira chave é do File Manager do Hestia e tem restrições que bloqueiam SSH normal. Ela só permite SFTP interno.

Nossa chave (a segunda) está correta, mas o SSH tenta usar a primeira chave primeiro e falha por causa das restrições.

**Solução:** Manter apenas nossa chave sem restrições!

---

**Execute os comandos no terminal do painel agora!** 🎯
