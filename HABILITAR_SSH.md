# 🚀 HABILITAR DEPLOY AUTOMÁTICO (SSH)

Para que o deploy funcione 100% automático (sem senha e podendo reiniciar o servidor), precisamos fazer **2 COISAS** no seu Painel da VPS (Hestia/Vesta).

### PASSO 1: Liberar o Terminal (Shell)
O erro `This service allows sftp connections only` acontece porque o usuário está bloqueado de usar comandos.

1. Acesse o Painel: **`https://server.equipcasa.com.br:8083`**
2. Vá na aba **Users** (Usuários).
3. Clique no botão **Editar** (Lápis) do usuário **`ver8wdgr`**.
4. Procure a opção **SSH Access** (ou Shell).
   - Deve estar marcado como `nologin` ou `rssh`.
   - **MUDE PARA:** `bash` (ou `sh`).
5. Clique em **Save**.

---

### PASSO 2: Adicionar a Chave SSH
Isso vai permitir conectar sem senha.

1. Ainda editando o usuário **`ver8wdgr`** no painel.
2. Procure o campo **SSH Keys** ou "Add SSH Key".
3. Cole a chave abaixo (que acabei de gerar para você):

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDnagU59F8njYO2lFndFbXkYpwI2iuImB+41sjcghwl2 yuriv@dim
```

4. Clique em **Save**.

---

### DEPOIS DE SALVAR
Me avise com um "Pronto" e eu rodo o deploy automático!
