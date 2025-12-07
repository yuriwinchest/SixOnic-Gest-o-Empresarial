# 🔧 SOLUÇÃO - ERR_QUIC_PROTOCOL_ERROR

## ✅ PROGRESSO!

O erro mudou de 521 para ERR_QUIC_PROTOCOL_ERROR - isso é BOM!
Significa que o Cloudflare foi desativado com sucesso.

## ❌ PROBLEMA ATUAL

O navegador está tentando acessar via **HTTPS** mas o servidor só tem **HTTP** configurado.

---

## 🚀 SOLUÇÃO RÁPIDA

### Opção 1: Acessar via HTTP

Digite no navegador (SEM o "s"):
```
http://equipcasa.com.br
```

### Opção 2: Limpar Cache do Navegador

Se o navegador continuar forçando HTTPS:

**Chrome/Edge:**
1. Pressione `Ctrl + Shift + Delete`
2. Selecione "Imagens e arquivos em cache"
3. Selecione "Cookies e outros dados do site"
4. Clique em "Limpar dados"
5. Tente novamente: `http://equipcasa.com.br`

**Ou use modo anônimo:**
1. Pressione `Ctrl + Shift + N`
2. Acesse: `http://equipcasa.com.br`

### Opção 3: Forçar HTTP no Chrome

1. Digite na barra de endereços:
```
chrome://net-internals/#hsts
```

2. Na seção "Delete domain security policies"
3. Digite: `equipcasa.com.br`
4. Clique em "Delete"
5. Tente novamente: `http://equipcasa.com.br`

---

## 🔐 CONFIGURAR HTTPS (OPCIONAL - DEPOIS)

Se quiser que o site funcione com HTTPS:

### Via Let's Encrypt (Grátis):

```bash
ssh root@server.equipcasa.com.br

# Instalar Certbot
apt-get install -y certbot python3-certbot-nginx

# Obter certificado SSL
certbot --nginx -d equipcasa.com.br -d www.equipcasa.com.br

# Seguir as instruções
# Email: seu@email.com
# Aceitar termos: Y
# Compartilhar email: N (opcional)
# Redirecionar HTTP para HTTPS: 2 (recomendado)

# Pronto! Site funcionará em HTTPS
```

---

## ✅ TESTE RÁPIDO

Execute no PowerShell:

```powershell
# Teste HTTP
curl http://equipcasa.com.br

# Deve retornar HTML do site
```

---

## 📊 STATUS ATUAL

- ✅ Servidor funcionando
- ✅ Nginx rodando nas portas 80 e 8080
- ✅ Site acessível via IP: http://161.97.124.179
- ✅ Cloudflare proxy desativado
- ⚠️  HTTPS não configurado (normal, pode configurar depois)
- 🎯 **Acesse via HTTP**: http://equipcasa.com.br

---

## 🎉 PRÓXIMOS PASSOS

1. **Acesse**: `http://equipcasa.com.br` (sem HTTPS)
2. **Confirme** que o site carrega
3. **Depois** podemos configurar HTTPS com Let's Encrypt (5 minutos)

---

## 🆘 SE NÃO FUNCIONAR

Tente:
1. Modo anônimo: `Ctrl + Shift + N`
2. Acesse: `http://equipcasa.com.br`
3. Me diga o que aparece
