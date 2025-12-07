# 🔐 ACESSAR VPS COMO ROOT

## ✅ Conexão SSH Funcionando!

O SSH está respondendo e pedindo senha. Você tem 2 opções:

---

## 🌐 OPÇÃO 1: Painel Web Hestia (RECOMENDADO - Mais Fácil)

### Acesso
1. **URL**: https://server.equipcasa.com.br:8083
   - Ou: https://161.97.124.179:8083

2. **Login**:
   - Usuário: `admin` ou `root`
   - Senha: [sua senha de root]

### O que você pode fazer:
- ✅ Gerenciar MySQL via interface gráfica
- ✅ Criar/editar bancos de dados
- ✅ Configurar firewall
- ✅ Acessar terminal web
- ✅ Gerenciar arquivos via File Manager

---

## 💻 OPÇÃO 2: SSH via Terminal (Linha de Comando)

### Comando para conectar:
```powershell
ssh root@server.equipcasa.com.br
```

Ou com IP:
```powershell
ssh root@161.97.124.179
```

### Quando pedir senha:
Digite a senha de root e pressione Enter

### Comandos úteis após conectar:

#### 1. Verificar MySQL
```bash
systemctl status mysql
```

#### 2. Acessar MySQL
```bash
mysql -u root -p
```

#### 3. Listar bancos de dados
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

#### 4. Verificar usuários MySQL
```bash
mysql -u root -p -e "SELECT user, host FROM mysql.user;"
```

#### 5. Liberar porta 3306 para acesso remoto
```bash
# Verificar firewall
ufw status

# Liberar porta MySQL
ufw allow 3306/tcp

# Recarregar firewall
ufw reload
```

#### 6. Configurar MySQL para aceitar conexões remotas
```bash
# Editar configuração
nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Procure a linha:
# bind-address = 127.0.0.1

# Altere para:
# bind-address = 0.0.0.0

# Salve (Ctrl+O, Enter, Ctrl+X)

# Reinicie MySQL
systemctl restart mysql
```

#### 7. Criar usuário MySQL com acesso remoto
```bash
mysql -u root -p

# Dentro do MySQL:
CREATE USER 'ver8wdgr_root-14'@'%' IDENTIFIED BY 'Hugo2025/*-+';
GRANT ALL PRIVILEGES ON ver8wdgr_root-14.* TO 'ver8wdgr_root-14'@'%';
FLUSH PRIVILEGES;
EXIT;
```

---

## 🎯 PARA LIBERAR ACESSO REMOTO AO MYSQL

### Via Painel Hestia (Mais Fácil):

1. Acesse: https://server.equipcasa.com.br:8083
2. Vá em **Server** → **Firewall**
3. Clique em **Add Rule**
4. Configure:
   - **Action**: ACCEPT
   - **Protocol**: TCP
   - **Port**: 3306
   - **IP Address**: deixe vazio (ou coloque seu IP para mais segurança)
5. Clique em **Save**

### Via Terminal SSH:

```bash
# Conectar
ssh root@server.equipcasa.com.br

# Liberar porta
ufw allow 3306/tcp
ufw reload

# Configurar MySQL
sed -i 's/bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
systemctl restart mysql

# Criar usuário com acesso remoto
mysql -u root -p -e "
CREATE USER IF NOT EXISTS 'ver8wdgr_root-14'@'%' IDENTIFIED BY 'Hugo2025/*-+';
GRANT ALL PRIVILEGES ON ver8wdgr_root-14.* TO 'ver8wdgr_root-14'@'%';
FLUSH PRIVILEGES;
"

echo "✅ MySQL configurado para acesso remoto!"
```

---

## 🧪 TESTAR CONEXÃO REMOTA

Depois de liberar o acesso, teste localmente:

```powershell
node test-db-simple.js
```

Deve mostrar:
```
✅ CONECTADO COM SUCESSO!
✅ Query teste OK: 2
✅ Tabelas encontradas: X
```

---

## 📝 PRÓXIMOS PASSOS

1. **Acesse o painel**: https://server.equipcasa.com.br:8083
2. **Libere a porta 3306** no firewall
3. **Configure MySQL** para aceitar conexões remotas
4. **Teste a conexão** com `node test-db-simple.js`
5. **Crie as tabelas** acessando `http://localhost:3001/api/setup`
6. **Teste criar cliente** no sistema

---

## ⚠️ SEGURANÇA

### Mais Seguro (Recomendado):
- Use **túnel SSH** em vez de liberar a porta 3306
- Comando: `ssh -L 3306:127.0.0.1:3306 root@server.equipcasa.com.br -N`

### Menos Seguro:
- Liberar porta 3306 para qualquer IP
- Use apenas se necessário e considere restringir por IP

---

## 🆘 PROBLEMAS?

### "Connection timeout"
- Firewall bloqueando
- Solução: Libere porta 22 (SSH) ou 3306 (MySQL)

### "Permission denied"
- Senha incorreta
- Solução: Verifique a senha de root

### "Connection refused"
- Serviço não está rodando
- Solução: `systemctl start mysql` ou `systemctl start ssh`

---

## 📞 COMANDOS RÁPIDOS

```bash
# Status dos serviços
systemctl status mysql
systemctl status nginx
systemctl status ssh

# Reiniciar serviços
systemctl restart mysql
systemctl restart nginx

# Ver logs
journalctl -u mysql -f
journalctl -u nginx -f

# Verificar portas abertas
netstat -tulpn | grep LISTEN

# Verificar firewall
ufw status verbose
```
