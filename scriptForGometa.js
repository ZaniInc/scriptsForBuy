// import { ethers } from "./ethers.esm.min.js"

let swapFunction;
let connectMetamask;
let approveFunction;
let checkBalance;
let checkCurrency;

const abi = [{
    "inputs": [
        {
            "internalType": "address",
            "name": "sellToken_",
            "type": "address"
        },
        {
            "internalType": "address",
            "name": "buyToken_",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "amountTokensToSwap_",
            "type": "uint256"
        }
    ],
    "name": "swapTokens",
    "outputs": [
        {
            "internalType": "bool",
            "name": "swapStatus_",
            "type": "bool"

        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}
]

const abiERC20 = [{ "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }]
const abiERC20Balance = [{
    "constant": true,
    "inputs": [
        {
            "name": "_owner",
            "type": "address"
        }
    ],
    "name": "balanceOf",
    "outputs": [
        {
            "name": "balance",
            "type": "uint256"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}];

const abiERC20allowances = [{
    "constant": true,
    "inputs": [
        {
            "name": "_owner",
            "type": "address"
        },
        {
            "name": "_spender",
            "type": "address"
        }
    ],
    "name": "allowance",
    "outputs": [
        {
            "name": "",
            "type": "uint256"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}]

//Connect
connectMetamask = async function () {
    if (typeof window.ethereum !== "undefined") {
        const provider = await new ethers.providers.Web3Provider(window.ethereum);
        const chainId = await provider.getNetwork().chainId;
        try {
            if (chainId !== 137 || chainId !== "0x89") {
                await provider.send("wallet_switchEthereumChain", [{ chainId: '0x89' }]);
            }
        } catch (error) {
            alert("Switch chain on Polygon mainnet");
            console.log(error);
            return;
        }
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        let signerAddress = await signer.getAddress();
        let addressFirstFourStrings = signerAddress.slice(0, 5).toString()
        document.getElementById("connect").innerHTML = addressFirstFourStrings.concat("...", signerAddress.slice(38, 42));
        checkBalance();
    }
    else {
        alert("You are not connected !")
    }
}

//Swap
swapFunction = async function () {
    if (ethereum.isConnected()) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let amountToSwap = document.getElementById("field-2").value;
        const contract = await new ethers.Contract("0x01c062C9EC2494788dB1fE50C7A8d435877850f4", abi, signer);
        let currentStablecoinAddress;
        let currentSelect = checkCurrency();
        let newValueToSwap;
        if (amountToSwap < 0.10) {
            alert('You can not swap less then 0.1$');
            return;
        }
        if (currentSelect == 1) {
            currentStablecoinAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
            if (amountToSwap < 1) {
                newValueToSwap = amountToSwap * 1000000;
            }
            else if (amountToSwap >= 1) {
                newValueToSwap = amountToSwap * 1000000;
            }
        }
        if (currentSelect == 2) {
            currentStablecoinAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
            if (amountToSwap < 1) {
                newValueToSwap = amountToSwap * 1000000;
            }
            else if (amountToSwap >= 1) {
                newValueToSwap = amountToSwap * 1000000;
            }
        }
        else {
            alert('Choose currency !');
            return;
        }
        // if (currentSelect == 3) {
        //     currentStablecoinAddress = "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39";
        //     if (amountToSwap < 1) {
        //         newValue = amountToSwap * 1000000000000000000;
        //     }
        //     else if (amountToSwap >= 1) {
        //         newValue = amountToSwap * 1000000000000000000;
        //     }
        // }
        const contractERC20 = await new ethers.Contract(currentStablecoinAddress, abiERC20allowances, signer);
        const currentAllowances = await contractERC20.allowance(signer.getAddress(), "0x01c062C9EC2494788dB1fE50C7A8d435877850f4");
        if (currentAllowances < newValueToSwap) {
            alert('Approve more tokens');
            return
        }
        let tx = await contract.swapTokens(currentStablecoinAddress, "0x90F63bd7E4022AC795168DB9ebeF5CBe0D442fE1", newValueToSwap);
        let txHash = await tx.hash;
        alert("Thank you for the investment , your transaction hash to check transaction status:", txHash);
    }
    else {
        connectMetamask();
    }
}

//Approve
approveFunction = async function () {
    if (ethereum.isConnected()) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let contract;
        let amountToApprove = document.getElementById("field-2").value;
        let newValueToApprove;
        let currentSelect = checkCurrency();
        if (amountToApprove < 0.10) {
            alert('You can not swap less then 0.1$');
            return;
        }
        if (currentSelect == 1) {
            contract = await new ethers.Contract("0xc2132D05D31c914a87C6611C10748AEb04B58e8F", abiERC20, signer);
            if (amountToApprove < 1) {
                newValueToApprove = amountToApprove * 1000000;
            }
            else if (amountToApprove >= 1) {
                newValueToApprove = amountToApprove * 1000000;
            }
        }
        if (currentSelect == 2) {
            contract = await new ethers.Contract("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", abiERC20, signer);
            if (amountToApprove < 1) {
                newValueToApprove = amountToApprove * 1000000;
            }
            else if (amountToApprove >= 1) {
                newValueToApprove = amountToApprove * 1000000;
            }
        }
        else {
            alert('Choose currency !');
            return;
        }
        // if (currentSelect == 3) {
        //     contract = await new ethers.Contract("0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39", abiERC20, signer);
        //     if (amountToApprove < 1) {
        //         newValue = amountToApprove * 1000000000000000000;
        //     }
        //     else if (amountToApprove >= 1) {
        //         newValue = amountToApprove * 1000000000000000000;
        //     }
        // }
        let sendTx = await contract.approve("0x01c062C9EC2494788dB1fE50C7A8d435877850f4", newValueToApprove.toString());
        let txHash = await sendTx.hash;
        alert(txHash);
    }
    else {
        connectMetamask();
    }
}

//BalanceOf
checkBalance = async function () {
    if (ethereum.isConnected()) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let currentSelect = checkCurrency();
        let contract;
        if (currentSelect == 1) {
            contract = await new ethers.Contract("0xc2132D05D31c914a87C6611C10748AEb04B58e8F", abiERC20Balance, signer);
        }
        if (currentSelect == 2) {
            contract = await new ethers.Contract("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", abiERC20Balance, signer);
        }
        // if (document.getElementsByName("currency")[2].checked) {
        //     contract = await new ethers.Contract("0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39", abiERC20Balance, signer);
        // }
        const balance = await contract.balanceOf(await signer.getAddress());
        // if(balance > 10000){
        //     document.getElementById("Balance").innerHTML = "0"
        // }
        // if(balance < 100000 && balance > 10000){
        //     let zero = '0.0';
        //     let convertBalance = balance.toString().slice(0,2);
        //     document.getElementById("Balance").innerHTML = zero.concat(convertBalance);
        // }
        // if(balance < 1000000 && balance > 100000){
        //     let zero = '0.';
        //     let convertBalance = balance.toString().slice(0,2);
        //     document.getElementById("Balance").innerHTML = zero.concat(convertBalance);
        // }
        // if(balance >= 1000000){
        //     // let convertBalance = balance.split('.')[0];
        //     document.getElementById("Balance").innerHTML = balance;
        // }
        // document.getElementById("Balance").innerHTML = balance;
        document.getElementsByClassName("balance").innerHTML = balance;
    }
    else {
        alert("Connect MetaMask to gometaways.com")
    }
}

checkCurrency = function () {
    if (document.getElementsByName("RadioCrypto")[0].checked) {
        return 1;
    }
    if (document.getElementsByName("RadioCrypto")[1].checked) {
        return 2;
    }
    // if (document.getElementsByName("currency")[2].checked) {
    //     return 3;
    // }
}

window.onload = async function () {
    if (ethereum.isConnected()) {
        const provider = await new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let signerAddress = await signer.getAddress();
        let addressFirstFourStrings = signerAddress.slice(0, 5).toString()
        document.getElementById("connect").innerHTML = addressFirstFourStrings.concat("...", signerAddress.slice(38, 42));
    }
    let field1 = document.getElementById("field-2");
    let field2 = document.getElementsByClassName("large_input").innerHTML = field1.value;
    let selectCurrency = document.getElementsByName("currency");
    field1.oninput = () => {
        field2 = document.getElementsByClassName("large_input").innerHTML = field1.value / 0.005;
    }
    selectCurrency[0].onchange = () => {
        checkBalance();
    }
    selectCurrency[1].onchange = () => {
        checkBalance();
    }
}

document.getElementById("connect").onclick = connectMetamask;

// let approveButton = document.getElementsByClassName("button form_submit buy w-button");
// approveButton.addEventListener('click' , approveFunction);

// let swapButton = document.getElementsByClassName("button form_submit buy w-button");
// swapButton.addEventListener('click' , swapFunction);


document.getElementById("buytoken").onclick = swapFunction;
document.getElementById("transfer").onclick = approveFunction;