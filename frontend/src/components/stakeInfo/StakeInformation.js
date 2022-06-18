import { useEffect, useState } from "react";
import { Box, Button, Tab } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import StakedAmount from "./StakedAmount";
import { makeStyles } from "@material-ui/core";
import { useEthers } from "@usedapp/core";
import useUnstakeTokens from "../../hooks/useUnstakeTokens";

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
}));

const StakeInformation = ({ supportedTokens }) => {
  const classes = useStyles();
  const { account } = useEthers();
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);

  const {address} = supportedTokens[selectedTokenIndex]


  const handleChange = (e, newValue) => {
    setSelectedTokenIndex(parseInt(newValue));
  };

  const {unstakeSend, stakedBalance, state: unstakeState} = useUnstakeTokens(address)

    const handleUnstake = ()=>{
      unstakeSend(address)
    }

  return (
    <Box sx={{mb:"3rem"}}>
      {account && <h2 className={classes.header}>Stake Information</h2>}
      <Box className={classes.box}>
        {account && (
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
                  <Box className={classes.tabContent}>
                    <StakedAmount token={token} stakedBalance={stakedBalance} />
                    <Button color="primary" variant="contained" disableElevation size="medium" onClick={handleUnstake}>Unstake</Button>
                  </Box>
                </TabPanel>
              );
            })}
          </TabContext>
        )}
      </Box>
    </Box>
  );
};

export default StakeInformation;
