# Web Portfolio [nzhussup.dev](https://nzhussup.dev)

This repository contains the source code for my public web portfolio, a responsive frontend designed to present projects, skills, and experience.

## Technologies Used

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React.js](https://img.shields.io/badge/React.js-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io)

## Getting Started

### Prerequisites

- [Kubernetes](https://kubernetes.io/)

### Installation

Apply the k8s config:

```bash
git clone https://github.com/nzhussup/personal-website.git
cd personal-website/k8s
kubectl apply -f web-portfolio-deployment.yml
```

You then need ingress configured to route traffic to port `8000`, or expose `web-portfolio-deployment.yml` through another service type.
