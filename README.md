# Maily 



- [Maily](#maily)
    - [Overview -](#overview--)
    - [Project Architecture -](#project-architecture--)
    - [Installation -](#installation--)
      - [**Build from repository**:](#build-from-repository)
      - [**Install with installer**:](#install-with-installer)
    - [User guide -](#user-guide--)
    - [Docker deploy -](#docker-deploy--)
    - [Licence -](#licence--)


### Overview -

Maily is a free, open-source software which  allows you to manage mass mailings and avoid proprietary software.


### Project Architecture -

A view of the project's architecture:
```
MAILY/client
├─ src/
│  ├─ pages/                 # main pages (home, archives, login, smtp)
│  ├─ components/            # Pages items (topbar, sidebar, toogle-theme, ...)
│  └─ assets/                # Icons 
├─ client.cjs                # Electron client 
└─ Other config files        # tsconfig, components, ...
```

### Installation -

#### **Build from repository**:

``` shell
git clone  https://github.com/dorydev/Maily.git
cd Maily/client
npm run build
```

#### **Install with installer**:

**(1) MacOs**: 

Download the `.xxx` installer

**(2) Linux**: 

Download the `.xxx` installer

### User guide -

### Docker deploy -

### Licence -
