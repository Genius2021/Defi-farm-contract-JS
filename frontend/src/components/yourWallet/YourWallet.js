import { useState } from 'react';
import { Box, Tab } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import WalletBalance from "./WalletBalance"
import StakeForm from './StakeForm';


const YourWallet = ({supportedTokens})=>{
    const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
    console.log(supportedTokens)

    const handleChange = (e, newValue)=>{
        setSelectedTokenIndex(parseInt(newValue))
    }

    return <Box>
        <h2>Your Wallet</h2>
        <TabContext value={String(selectedTokenIndex)}>
            <TabList onChange={handleChange} aria-label="stake form tabs">
                { supportedTokens.map((token, index) =>{
                    return <Tab key={index} label={token.name} value={String(index)} />
                    })
                }
            </TabList>
                { supportedTokens.map((token, index) =>{
                    return <TabPanel key={index} value={String(index)}>
                        <div>
                            <WalletBalance token={token} />
                            <StakeForm token={token} />
                        </div>
                    </TabPanel>
                    })
                }
        </TabContext>
    </Box>
}

export default YourWallet;