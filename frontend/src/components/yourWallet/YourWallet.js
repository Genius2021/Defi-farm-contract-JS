import { useState } from "react";
import { Box, Tab, Typography } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import WalletBalance from "./WalletBalance";
import StakeForm from "./StakeForm";
import { makeStyles } from "@material-ui/core";
import { useEthers } from "@usedapp/core";

const useStyles = makeStyles((theme) => ({
  tabContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(4),
  },
  box: {
    backgroundColor: "white",
    borderRadius: "25px",
  },
  header: {
    color: "white",
  },
  center: {
    textAlign: "center",
    padding: theme.spacing(2)
}
}));

const YourWallet = ({ supportedTokens }) => {
  const classes = useStyles();
  const { account } = useEthers();
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);

  const {address} = supportedTokens[selectedTokenIndex]

  console.log(address, selectedTokenIndex)

  const handleChange = (e, newValue) => {
    setSelectedTokenIndex(parseInt(newValue));
  };

  return (
    <Box>
      {account && <h2 className={classes.header}>Your Wallet Balances</h2>}
      <Box className={classes.box}>
        {account ? (
          <TabContext value={String(selectedTokenIndex)}>
            <TabList onChange={handleChange} aria-label="stake form tabs">
              {supportedTokens.map((token, index) => {
                return (
                  <Tab key={index} label={token.name} value={String(index)} />
                );
              })}
            </TabList>
            {supportedTokens.map((token, index) => {
              return (
                <TabPanel key={index} value={String(index)}>
                  <div className={classes.tabContent}>
                    <WalletBalance token={token} />
                    <StakeForm token={token} />
                  </div>
                </TabPanel>
              );
            })}
          </TabContext>
        ) : (
          <Box>
            <Typography variant="h4" gutterBottom className={classes.center}>Please connect an account.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default YourWallet;
