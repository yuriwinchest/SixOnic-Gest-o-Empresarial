# 🚨 SOLUÇÃO DEFINITIVA - ERRO 521

## ✅ STATUS ATUAL

O servidor está **100% FUNCIONANDO**:
- ✅ Nginx rodando
- ✅ Porta 80 aberta e respondendo
- ✅ Porta 8080 aberta e respondendo
- ✅ Site carregando localmente (HTTP 200 OK)
- ✅ Backend rodando (PM2)

## ❌ PROBLEMA

O **Cloudflare não consegue conectar** ao servidor.

---

## 🔧 SOLUÇÃO 1: DESATIVAR PROXY DO CLOUDFLARE (RÁPIDO)

### Passo a Passo:

1. **Acesse o Cloudflare:**
   - URL: https://dash.cloudflare.com
   - Login com sua conta

2. **Selecione o domínio:**
   - Clique em `equipcasa.com.br`

3. **Vá em DNS:**
   - Menu lateral → **DNS** → **Records**

4. **Encontre o registro A:**
   - Procure por `equipcasa.com.br` ou `@`
   - Tipo: A
   - Conteúdo: 161.97.124.179

5. **Desative o proxy:**
   - Clique na **nuvem laranja** 🟠
   - Ela deve ficar **cinza** ⚪ (DNS only)
   - Salve

6. **Aguarde:**
   - Espere 2-3 minutos para propagar

7. **Teste:**
   - Abra: http://equipcasa.com.br
   - Deve funcionar!

---

## 🔧 SOLUÇÃO 2: CONFIGURAR CLOUDFLARE PARA FUNCIONAR COM PROXY

Se quiser manter o proxy laranja ativo (recomendado para proteção):

### No Cloudflare:

1. **SSL/TLS:**
   - Vá em **SSL/TLS** → **Overview**
   - Modo: **Flexible** (ou **Full** se tiver SSL no servidor)

2. **Firewall:**
   - Vá em **Security** → **WAF**
   - Verifique se não há regras bloqueando

3. **IP Ranges:**
   - Certifique-se que os IPs do Cloudflare não estão bloqueados

### Na VPS (via SSH):

```bash
# Permitir IPs do Cloudflare
ufw allow from 173.245.48.0/20
ufw allow from 103.21.244.0/22
ufw allow from 103.22.200.0/22
ufw allow from 103.31.4.0/22
ufw allow from 141.101.64.0/18
ufw allow from 108.162.192.0/18
ufw allow from 190.93.240.0/20
ufw allow from 188.114.96.0/20
ufw allow from 197.234.240.0/22
ufw allow from 198.41.128.0/17
ufw allow from 162.158.0.0/15
ufw allow from 104.16.0.0/13
ufw allow from 104.24.0.0/14
ufw allow from 172.64.0.0/13
ufw allow from 131.0.72.0/22

# Recarregar firewall
ufw reload
```

---

## 🔧 SOLUÇÃO 3: ACESSAR DIRETO PELO IP (TEMPORÁRIO)

Enquanto configura o Cloudflare, acesse:

- **Porta 80:** http://161.97.124.179
- **Porta 8080:** http://161.97.124.179:8080
- **API:** http://161.97.124.179/api/health

---

## ✅ TESTE RÁPIDO

Execute no seu computador:

```powershell
# Teste direto no IP
curl http://161.97.124.179

# Teste na porta 8080
curl http://161.97.124.179:8080

# Teste API
curl http://161.97.124.179/api/health
```

Todos devem funcionar!

---

## 📊 DIAGNÓSTICO COMPLETO

Se ainda tiver problemas, execute na VPS:

```bash
ssh root@server.equipcasa.com.br

# Verificar Nginx
systemctl status nginx
nginx -t

# Verificar portas
ss -tulpn | grep nginx

# Testar localmente
curl -I http://localhost
curl -I http://localhost:8080

# Ver logs
tail -50 /var/log/nginx/error.log
tail -50 /var/log/nginx/access.log

# Verificar firewall
ufw status verbose
```

---

## 🎯 RECOMENDAÇÃO

**FAÇA ISSO AGORA:**

1. Acesse o Cloudflare
2. Desative o proxy (nuvem laranja → cinza)
3. Aguarde 2 minutos
4. Acesse: http://equipcasa.com.br
5. **Deve funcionar!**

Depois que confirmar que funciona, você pode:
- Reativar o proxy laranja
- Configurar SSL/TLS como "Flexible"
- Adicionar regras de firewall para IPs do Cloudflare

---

## 📸 PRINT DO CLOUDFLARE

Quando desativar o proxy, deve ficar assim:

```
DNS Records
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type  Name  Content          Proxy status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A     @     161.97.124.179   ⚪ DNS only
```

(A nuvem deve estar CINZA, não laranja)

---

## 🆘 AINDA COM PROBLEMA?

Me envie:
1. Print da tela do Cloudflare (DNS Records)
2. Resultado de: `curl http://161.97.124.179`
3. Se o proxy está ativado ou desativado no Cloudflare
