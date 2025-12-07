# ⚠️ AVISO IMPORTANTE: DOMÍNIO PERTENCE AO 'HugoGandy'

Descobri por que o site não atualiza:
- Estamos conectados com o usuário **`ver8wdgr`**.
- Mas o domínio **`equipcasa.com.br`** pertence ao usuário **`HugoGandy`**.
- O usuário `ver8wdgr` **não tem permissão** para mexer nos arquivos do `HugoGandy`.

### ✅ O QUE VOCÊ PRECISA FAZER AGORA

Precisamos habilitar o SSH para o usuário **`HugoGandy`** (igual fizemos pro outro).

1. Acesse o Painel Hestia: **`https://server.equipcasa.com.br:8083`**
2. Vá na aba **Users**.
3. Edite o usuário **`HugoGandy`**.
4. Configure:
   - **SSH Access:** Mude para `bash`.
   - **SSH Key:** Cole a MESMA chave que usamos antes (está abaixo).

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDnagU59F8njYO2lFndFbXkYpwI2iuImB+41sjcghwl2 yuriv@dim
```

5. Salve.

Assim que fizer isso, me avise "Pronto Hugo" e eu rodo o deploy corrigido para o usuário certo!
