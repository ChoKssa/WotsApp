const getCurrentWalletConnected = async () => {
  if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        console.log(accounts[0]);
        return accounts[0];
        // setWalletAddress(accounts[0]);
      } else {
        console.log("Connect to metamask");
      }
    } catch (error) {
      console.error(error.message);
    }
  } else {
    // Metamask is not installed
    console.log("Install Metamask");
  }
  return null;
};

export { getCurrentWalletConnected };
