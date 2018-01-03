[![Build Status](https://travis-ci.org/telemark/micro-auth-ldap.svg?branch=master)](https://travis-ci.org/telemark/micro-auth-ldap)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Greenkeeper badge](https://badges.greenkeeper.io/telemark/micro-auth-ldap.svg)](https://greenkeeper.io/)

# micro-auth-ldap

ldap auth microservice

## config docker.env

```bash
JWT_SECRET=Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go
ENCRYPTOR_SECRET=Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go
SESSION_STORAGE_URL=https://tmp.storage.micro.t-fk.no
LDAP_URL=ldap://ldap.forumsys.com:389
LDAP_BIND_DN=cn=read-only-admin,dc=example,dc=com
LDAP_BIND_CREDENTIALS=password
LDAP_SEARCH_BASE=dc=example,dc=com
LDAP_SEARCH_FILTER=(uid={{username}})
```

Optional

```
REDIRECT_LOGOUT_URL=<url to redirect to after logout>
```

## API

### GET ```/login?origin=<url for redirect>```

- returns loginform
- successful login redirects to ```origin?jwt=<jwt>```

### GET ```/logout?origin=<url for redirect>```

- redirects to ```origin```

### POST ```/auth```

- post username, password and origin
- successful auth redirects to ```origin?jwt=<jwt>```

### GET ```/?jwt=<jwt>```

- jwt needs userName and origin
- successful lookup of user redirects to ```origin?jwt=<jwt>```

### GET ```/lookup```

- jwt needs userName
- successful lookup of user returns data

## License

[MIT](LICENSE)

![Robohash image of micro-auth-ldap](https://robots.kebabstudios.party/micro-auth-ldap.png "Robohash image of micro-auth-ldap")
