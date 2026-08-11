<div align="center">

# 🐍 SNAKE RUN
### Full-Stack Game App &nbsp;|&nbsp; DevOps · Docker · K8s · AWS · Terraform · CI/CD

<br/>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-K8s-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-AWS-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-Reverse_Proxy-009639?style=for-the-badge&logo=nginx&logoColor=white)

<br/>

> **A full-stack Snake game with a real-time global leaderboard — containerized, orchestrated, and deployed to AWS using modern DevOps practices.**

</div>

---

## 📋 Table of Contents

- [🎮 About the Project](#-about-the-project)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🗂️ Project Structure](#️-project-structure)
- [🚀 Tech Stack](#-tech-stack)
- [⚙️ Local Development](#️-local-development)
- [🐳 Docker Compose Setup](#-docker-compose-setup)
- [☸️ Kubernetes Deployment](#️-kubernetes-deployment)
- [🌍 AWS Infrastructure (Terraform)](#-aws-infrastructure-terraform)
- [🔧 CI/CD Pipelines](#-cicd-pipelines)
- [🌐 Environment Variables & Secrets](#-environment-variables--secrets)
- [📡 API Reference](#-api-reference)
- [🐛 Known Issues & Fixes](#-known-issues--fixes)

---

## 🎮 About the Project

**Snake Run** is a classic Snake game reimagined as a cloud-native application. Players compete on a **real-time global leaderboard**, with every score persisted via a Node.js REST API backend. The entire stack — from the React frontend to the Express backend — is containerized with Docker, orchestrated via Kubernetes, and deployed to AWS EC2 using Infrastructure-as-Code (Terraform) through both Jenkins and GitHub Actions pipelines.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎮 **Classic Snake Gameplay** | Smooth 120ms tick loop, border-wrap, self-collision detection |
| ⌨️ **Dual Controls** | Arrow keys + WASD support |
| 🏆 **Global Leaderboard** | Top 10 scores persisted on the backend, live-fetched every 5 seconds |
| 💀 **Game Over Screen** | In-canvas overlay with final score and instant replay |
| 🔴 **Backend Health Check** | Polls `/api/health` every 5 seconds, shows offline banner on failure |
| 🐳 **Fully Containerized** | Docker multi-stage builds for optimized image sizes |
| ☸️ **Kubernetes Ready** | Deployments, Services, and Ingress manifests included |
| 🌍 **AWS Provisioning** | One-command Terraform infra: VPC, Subnet, IGW, SG, EC2 |
| ⚡ **Dual CI/CD** | Both Jenkins pipeline and GitHub Actions workflows |

---

## 🏗️ Architecture

```
                          ┌─────────────────────────────────────────┐
                          │              AWS EC2 Instance           │
                          │                                         │
  User Browser  ──────►   │   ┌──────────┐    ┌──────────────────┐  │
                          │   │  Nginx   │───►│ React (Frontend) │  │
                          │   │  :80     │    │                  │  │
                          │   │          │    └──────────────────┘  │
                          │   │  /api/*  │    ┌──────────────────┐  │
                          │   │  ──────► │───►│ Express Backend  │  │
                          │   └──────────┘    │   Node.js :5000  │  │
                          │                   └────────┬─────────┘  │
                          │                            │            │
                          │                   ┌────────▼─────────┐  │
                          │                   │   scores.json    │  │
                          │                   │  (Local Storage) │  │
                          │                   └──────────────────┘  │
                          └─────────────────────────────────────────┘

─────────────────────────────────────────────────────────────────────
                     Kubernetes Cluster (Alternative)
─────────────────────────────────────────────────────────────────────

  Internet ──► Nginx Ingress ──► frontend-service (NodePort :80)
                           └──► backend-service  (ClusterIP :5000)
```

---

## 🗂️ Project Structure

```
snake-game-application/
│
├── 📁 .github/workflows/
│   ├── deploy.yml          # GitHub Actions — Provision + Deploy
│   └── destroy.yml         # GitHub Actions — Terraform Destroy
│
├── 📁 snake-game/
│   ├── 📁 backend/         # Express.js REST API
│   │   ├── server.js
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── 📁 client/          # React + Vite + Tailwind Frontend
│       ├── src/
│       │   ├── App.jsx     # Main game component
│       │   ├── main.jsx
│       │   └── index.css
│       ├── Dockerfile
│       └── vite.config.js
│
├── 📁 k8s/                 # Kubernetes manifests
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   └── ingress.yaml
│
├── 📁 terraform/           # AWS IaC
│   ├── main.tf
│   ├── variables.tf
│   ├── provider.tf
│   ├── backend.tf
│   ├── outputs.tf
│   └── modules/
│       ├── vpc/            # VPC, Subnet, IGW, Route Table, SG
│       └── ec2/            # EC2 Instance
│
├── docker-compose.yml      # Local / EC2 multi-service setup
├── nginx.conf              # Nginx reverse proxy config
└── jenkinsfile             # Jenkins declarative pipeline
```

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Nginx (Alpine)** | Serve static build in production |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js 20** | Runtime |
| **Express 5** | REST API framework |
| **CORS** | Cross-origin request handling |
| **fs (built-in)** | JSON file-based score persistence |

### DevOps & Infrastructure
| Technology | Purpose |
|---|---|
| **Docker** | Containerization (multi-stage builds) |
| **Docker Compose** | Local & EC2 multi-container orchestration |
| **Nginx** | Reverse proxy (routes `/api/*` → backend) |
| **Kubernetes** | Container orchestration (k8s manifests) |
| **Terraform** | AWS IaC — VPC, EC2 provisioning |
| **AWS EC2** | Cloud compute target |
| **AWS S3** | Terraform remote state backend |
| **Jenkins** | CI/CD pipeline (self-hosted) |
| **GitHub Actions** | CI/CD pipeline (cloud-native) |

---

## ⚙️ Local Development

### Prerequisites
- Node.js 20+
- npm

### Backend
```bash
cd snake-game/backend
npm install
node server.js
# Server starts on http://localhost:5000
```

### Frontend
```bash
cd snake-game/client
npm install
npm run dev
# Dev server starts on http://localhost:5173
```

> **Note:** For local dev, set up a proxy in `vite.config.js` to forward `/api` requests to `http://localhost:5000`.

---

## 🐳 Docker Compose Setup

The recommended way to run the full stack locally or on a VM:

```bash
# From the repo root
docker compose up -d --build
```

This starts three containers:
- `backend` — Express API on internal port 5000
- `frontend` — Nginx serving the React build on internal port 80
- `nginx` — Reverse proxy exposed on **host port 80**

Access the app at `http://localhost`

To stop:
```bash
docker compose down
```

---

## ☸️ Kubernetes Deployment

Apply all manifests to your cluster:

```bash
kubectl apply -f k8s/
```

This creates:
| Resource | Kind | Details |
|---|---|---|
| `snake-backend` | Deployment | 2 replicas, port 5000 |
| `snake-frontend` | Deployment | 2 replicas, port 80 |
| `backend-service` | Service (ClusterIP) | Internal port 5000 |
| `frontend-service` | Service (NodePort) | Port 80 |
| `snake-ingress` | Ingress | Routes `/api/*` → backend, `/` → frontend |

> **Requires:** An Nginx Ingress Controller installed in your cluster.
> ```bash
> kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml
> ```

Check deployment status:
```bash
kubectl get pods
kubectl get svc
kubectl get ingress
```

---

## 🌍 AWS Infrastructure (Terraform)

### What Gets Provisioned

```
AWS (us-east-1)
└── VPC (10.0.0.0/16)
    ├── Public Subnet (10.0.1.0/24) — us-east-1a
    ├── Internet Gateway
    ├── Public Route Table
    └── Security Group (ports: 22, 80, 3000, 5000)
        └── EC2 t3.micro (Ubuntu, public IP enabled)
```

### Remote State
Terraform state is stored in S3:
- **Bucket:** Update `terraform/backend.tf` with your own S3 bucket name before running `terraform init`
- **Key:** `terraform.tfstate`
- **Region:** `your-region-name`

> Make sure the S3 bucket exists in your AWS account before running `terraform init`.

### Deploy Manually

> **Before deploying**, set your SSH CIDR in `terraform/variables.tf` or pass it directly:
> ```bash
> terraform apply -var="ssh_allowed_cidr=YOUR.IP.ADDRESS/32"
> ```

```bash
cd terraform
terraform init
terraform plan -var="ssh_allowed_cidr=YOUR.IP.ADDRESS/32"
terraform apply -auto-approve -var="ssh_allowed_cidr=YOUR.IP.ADDRESS/32"
```

### Destroy

```bash
cd terraform
terraform destroy -auto-approve
```

---

## 🔧 CI/CD Pipelines

### GitHub Actions

Two workflows are defined in `.github/workflows/`:

#### `deploy.yml` — Triggered on push to `test` branch or manual dispatch
```
Checkout → Configure AWS → Terraform Init → Validate → Plan → Apply
→ Get EC2 IP → Wait 30s → SSH Deploy (git clone + docker compose up)
```

#### `destroy.yml` — Triggered on push to `test` branch or manual dispatch
```
Checkout → Configure AWS → Terraform Init → Terraform Destroy
```

**Required GitHub Secrets:**

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key |
| `EC2_SSH_KEY` | Private key (.pem) for EC2 SSH access |

### Jenkins Pipeline

The `jenkinsfile` defines a declarative pipeline with these stages:

```
Checkout → Terraform Init → Terraform Validate → Terraform Plan
→ Terraform Apply → Get EC2 IP → Wait for EC2 → Deploy Application
```

**Required Jenkins Credentials:**

| Credential ID | Type | Description |
|---|---|---|
| `aws-creds` | AWS Credentials | IAM access key & secret |
| `ec2-key` | SSH Private Key | EC2 .pem key for SSH agent |

---


---

## 📡 API Reference

Base URL (via proxy): `/api`

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `GET` | `/api/health` | Health check | — |
| `GET` | `/api/scores` | Get top 10 leaderboard | — |
| `POST` | `/api/scores` | Submit a new score | `{ "name": "string", "score": number }` |

**Example — Submit Score:**
```bash
curl -X POST http://localhost/api/scores \
  -H "Content-Type: application/json" \
  -d '{"name": "Player", "score": 43}'
```

**Example — Get Leaderboard:**
```bash
curl http://localhost/api/scores
```

---


---

<div align="center">

**Snake Run — Play. Compete. Deploy.**

</div>
