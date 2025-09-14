# Carbono Experience MVP

Una aplicación web simple y funcional para interactuar con los contratos inteligentes de Carbono Experience en la red Sepolia de Ethereum.

## Características

- **Conexión de Wallet**: Conecta MetaMask y verifica la red Sepolia
- **Compra de CBO**: Adquiere tokens Carbono (CBO) con ETH (0.001 ETH = 1 CBO)
- **Balances en tiempo real**: Muestra balance de CBO y NFTs propiedad del usuario
- **Aprobación de tokens**: Aprueba el gasto de CBO para el contrato de Experiencia
- **Minting de NFTs**: Crea NFTs de Experiencia pagando con tokens CBO

## Cómo usar

1. Abre `mvp.html` en un navegador web
2. Conecta tu wallet MetaMask (debe estar en la red Sepolia)
3. Compra tokens CBO con ETH
4. Aprueba el contrato de Experiencia para gastar tus CBO
5. Míntea tus NFTs de Experiencia

## Contratos

- **Carbono (CBO)**: `0x00d7de742a7951f0cb2ff9dd26722cf4c51162d3`
- **Experiencia (EXP)**: `0xaf9cc0235eef4976ab42f5f353f17cb4bcde7f04`

## Tecnologías

- HTML5, CSS3, JavaScript
- Web3.js para interacción con blockchain
- MetaMask para conexión de wallet
- Red Sepolia de Ethereum

## Despliegue en Vercel

Este proyecto está diseñado para ser desplegado fácilmente en Vercel. Solo conecta tu repositorio de GitHub a Vercel y el archivo `mvp.html` se servirá automáticamente.