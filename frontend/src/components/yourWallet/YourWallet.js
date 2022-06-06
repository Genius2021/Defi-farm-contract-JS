import { useState } from 'react';
import { Box, Tab } from "@material-ui/core";
import { TabContext, TabList } from "@material-ui/lab";


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
        </TabContext>
    </Box>
}

export default YourWallet;