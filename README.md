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

## API

### /login?redirectUrl=<url for redirect>

- returns loginform
- successful login redirects to redirectUrl?jwt=<jwt>

### /auth

-post username, password and redirectUrl
- successful auth redirects to redirectUrl?jwt=<jwt>

### /lookup

-post user and redirectUrl
- successful lookup redirects to redirectUrl?jwt=<jwt>

## License

[MIT](LICENSE)

![alt text](https://robots.kebabstudios.party/micro-auth-ldap.png "Robohash image of micro-auth-ldap")
