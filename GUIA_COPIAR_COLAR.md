# 📋 GUIA PASSO A PASSO - COPIAR E COLAR

## 🎯 PASSO 1: FAZER BACKUP

**Copie e cole no terminal:**

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.original
```

---

## 🎯 PASSO 2: EDITAR ARQUIVO

**Copie e cole no terminal:**

```bash
sudo nano /etc/ssh/sshd_config
```

Isso vai abrir o editor.

---

## 🎯 PASSO 3: SUBSTITUIR CONTEÚDO

No editor nano:

1. **Apague TUDO** (Ctrl+K várias vezes até limpar)
2. **Cole o conteúdo do arquivo:** `sshd_config_limpo.txt`
3. **Salve:** Ctrl+O, Enter
4. **Saia:** Ctrl+X

---

## 🎯 PASSO 4: TESTAR E REINICIAR

**Copie e cole no terminal:**

```bash
sudo sshd -t
sudo systemctl restart sshd
sudo systemctl status sshd
```

Se aparecer "active (running)" em verde, está OK!

---

## 🎯 PASSO 5: TESTAR NO WINDOWS

No seu computador:

```powershell
.\testar-ssh-nova-chave.ps1
```

---

## 📁 ARQUIVOS CRIADOS

| Arquivo | Conteúdo |
|---------|----------|
| `comandos-editar.txt` | Comandos para abrir editor |
| `sshd_config_limpo.txt` | Conteúdo limpo para colar |
| `comandos-testar.txt` | Comandos para testar |

---

## ✅ RESUMO

1. Cole: `sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.original`
2. Cole: `sudo nano /etc/ssh/sshd_config`
3. Apague tudo (Ctrl+K)
4. Cole conteúdo de `sshd_config_limpo.txt`
5. Salve (Ctrl+O, Enter, Ctrl+X)
6. Cole: `sudo sshd -t`
7. Cole: `sudo systemctl restart sshd`
8. Teste: `.\testar-ssh-nova-chave.ps1`

---

**Siga os passos na ordem!** 🎯
