// Elementos del DOM
const connectWalletBtn = document.getElementById('connectWallet');
const buyCBOBtn = document.getElementById('buyCBO');
const approveBtn = document.getElementById('approveBtn');
const mintBtn = document.getElementById('mintBtn');
const accountInfo = document.getElementById('accountInfo');
const cboSection = document.getElementById('cboSection');
const mintSection = document.getElementById('mintSection');
const walletAddress = document.getElementById('walletAddress');
const networkIndicator = document.getElementById('networkIndicator');
const status = document.getElementById('status');
const statusMessage = document.getElementById('statusMessage');
const cboBalance = document.getElementById('cboBalance');
const expBalance = document.getElementById('expBalance');
const expPrice = document.getElementById('expPrice');

// Direcciones de contratos
const carbonoAddress = "0x00d7de742a7951f0cb2ff9dd26722cf4c51162d3";
const experienciaAddress = "0xaf9cc0235eef4976ab42f5f353f17cb4bcde7f04";

// ABIs simplificadas
const carbonoABI = [
    {
        "inputs": [],
        "name": "buyCarbono",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {"internalType": "uint256", "name": "value", "type": "uint256"}],
        "name": "approve",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const experienciaABI = [
    {
        "inputs": [{"internalType": "uint256", "name": "qty", "type": "uint256"}],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "priceInCBO",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// Variables globales
let web3;
let account;
let carbonoContract;
let experienciaContract;

// Inicialización
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask está instalado!');

        try {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await connectWallet();
            }
        } catch (error) {
            console.error("Error al reconectar la wallet:", error);
        }

        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);
    } else {
        showStatus('MetaMask no está instalado. Por favor, instálalo para usar esta DApp.', 'error');
        connectWalletBtn.disabled = true;
        connectWalletBtn.innerText = 'MetaMask no instalado';
    }
});

// Conectar wallet
connectWalletBtn.addEventListener('click', connectWallet);

async function connectWallet() {
    try {
        showStatus('Conectando con MetaMask...', 'warning');

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        account = accounts[0];

        web3 = new Web3(window.ethereum);

        walletAddress.textContent = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
        accountInfo.classList.remove('hidden');
        cboSection.classList.remove('hidden');
        mintSection.classList.remove('hidden');
        connectWalletBtn.innerText = 'Wallet Conectada';
        connectWalletBtn.classList.add('btn-success');

        await checkNetwork();
        initContracts();
        await updateBalances();

        showStatus('Wallet conectada correctamente.', 'success');
    } catch (error) {
        console.error("Error al conectar la wallet:", error);
        showStatus('Error al conectar la wallet: ' + error.message, 'error');
    }
}

function initContracts() {
    carbonoContract = new web3.eth.Contract(carbonoABI, carbonoAddress);
    experienciaContract = new web3.eth.Contract(experienciaABI, experienciaAddress);
}

async function updateBalances() {
    try {
        const cboBal = await carbonoContract.methods.balanceOf(account).call();
        const expBal = await experienciaContract.methods.balanceOf(account).call();
        const price = await experienciaContract.methods.priceInCBO().call();

        cboBalance.textContent = `Balance CBO: ${web3.utils.fromWei(cboBal, 'ether')}`;
        expBalance.textContent = `Tus NFTs: ${expBal}`;
        expPrice.textContent = web3.utils.fromWei(price, 'ether');
    } catch (error) {
        console.error("Error actualizando balances:", error);
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        showStatus('Por favor, conecta tu wallet de MetaMask.', 'error');
        resetUI();
    } else if (accounts[0] !== account) {
        account = accounts[0];
        walletAddress.textContent = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
        updateBalances();
        showStatus('Cuenta cambiada correctamente.', 'success');
    }
}

function handleChainChanged(chainId) {
    window.location.reload();
}

async function checkNetwork() {
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    const correctChainId = '0xaa36a7'; // Sepolia

    if (chainId === correctChainId) {
        networkIndicator.classList.add('network-connected');
        networkIndicator.classList.remove('network-disconnected');
        return true;
    } else {
        networkIndicator.classList.remove('network-connected');
        networkIndicator.classList.add('network-disconnected');
        showStatus('Por favor, cambia a la red Sepolia en MetaMask.', 'error');
        return false;
    }
}

// Comprar CBO
buyCBOBtn.addEventListener('click', buyCBO);

async function buyCBO() {
    try {
        const ethAmount = document.getElementById('ethAmount').value;
        if (!ethAmount || ethAmount <= 0) {
            showStatus('Por favor, ingresa una cantidad válida de ETH.', 'error');
            return;
        }

        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) return;

        showStatus('Comprando CBO...', 'warning');

        const weiAmount = web3.utils.toWei(ethAmount, 'ether');

        await carbonoContract.methods.buyCarbono().send({
            from: account,
            value: weiAmount
        });

        showStatus('CBO comprado exitosamente!', 'success');
        await updateBalances();
    } catch (error) {
        console.error("Error comprando CBO:", error);
        showStatus('Error comprando CBO: ' + error.message, 'error');
    }
}

// Aprobar CBO
approveBtn.addEventListener('click', approveCBO);

async function approveCBO() {
    try {
        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) return;

        showStatus('Aprobando gasto de CBO...', 'warning');

        // Aprobar una cantidad grande
        const maxAmount = web3.utils.toWei('1000000', 'ether');

        await carbonoContract.methods.approve(experienciaAddress, maxAmount).send({
            from: account
        });

        showStatus('CBO aprobado para gastar. Ahora puedes mintear!', 'success');
        mintBtn.disabled = false;
        approveBtn.disabled = true;
    } catch (error) {
        console.error("Error aprobando CBO:", error);
        showStatus('Error aprobando CBO: ' + error.message, 'error');
    }
}

// Mint NFT
mintBtn.addEventListener('click', mintNFT);

async function mintNFT() {
    try {
        const qty = document.getElementById('mintQty').value;
        if (!qty || qty < 1) {
            showStatus('Por favor, ingresa una cantidad válida.', 'error');
            return;
        }

        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) return;

        showStatus('Minteando NFTs...', 'warning');

        await experienciaContract.methods.mint(qty).send({
            from: account
        });

        showStatus(`${qty} NFT(s) minteado(s) exitosamente!`, 'success');
        await updateBalances();
    } catch (error) {
        console.error("Error minteando NFT:", error);
        showStatus('Error minteando NFT: ' + error.message, 'error');
    }
}

function showStatus(message, type) {
    status.classList.remove('hidden');
    status.classList.remove('success', 'error', 'warning');
    status.classList.add(type);
    statusMessage.textContent = message;
}

function resetUI() {
    accountInfo.classList.add('hidden');
    cboSection.classList.add('hidden');
    mintSection.classList.add('hidden');
    connectWalletBtn.innerText = 'Conectar Wallet';
    connectWalletBtn.classList.remove('btn-success');
}