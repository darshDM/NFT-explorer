import {polygonEndpoint,ethEndpoint} from "../../config";
// const ethEndpoint = "https://eth-mainnet.alchemyapi.io/v2/i2Qq4uItLWLPqf4vRTiwL7LWFytTcRER";
const getAddressNFTsEth = async(owner,contractAddress,retryAttempt) =>{
    if(retryAttempt === 3) return;
    if(owner){
        let data={};
        try{
            if(contractAddress){
                let temp = await fetch(`${ethEndpoint}/getNFTs?owner=${owner}&contractAddresses%5B%5D=${contractAddress}`).then(data=> data.json());
                data = {
                    ...data,
                    ...temp.ownedNfts
                }
            }
            else{
                let temp = await fetch(`${ethEndpoint}/getNFTs?owner=${owner}`).then(data =>data.json());
                data = {
                    ...data,
                    ...temp.ownedNfts
                }
            }    
        }
        catch(e){
            getAddressNFTsEth(owner,contractAddress,retryAttempt + 1);
        }
        return data;
    }
}
const getAddressNFTsPolygon = async(owner,contractAddress,retryAttempt) =>{
    if(retryAttempt === 3) return;
    if(owner){
        let data={};
        try{
            if(contractAddress){
                let temp = await fetch(`${polygonEndpoint}/getNFTs?owner=${owner}&contractAddresses%5B%5D=${contractAddress}`).then(data=> data.json());

                data = {
                    ...data,
                    ...temp.ownedNfts
                }
            }
            else{
                let temp = await fetch(`${polygonEndpoint}/getNFTs?owner=${owner}`).then(data =>data.json());
                data = {
                    ...data,
                    ...temp.ownedNfts
                }
            }    
            
        }
        catch(e){
            getAddressNFTsPolygon(owner,contractAddress,retryAttempt + 1);
        }
        return data;
    }
}

const getNFTMetadata = async(nfts) =>{
    const nftMetaData = await Promise.allSettled(nfts.map(async(NFT)=>{
        const metadata = await fetch(`${ethEndpoint}/getNFTMetadata?contractAddress=${NFT.contract.address}&tokenId=${NFT.id.tokenId}`).then(data =>data.json());
        let imgurl;
        if(metadata.media[0].gateway.length){
            console.log(metadata.media[0].gateway);
            imgurl = metadata.media[0].gateway
        }
        else{
            imgurl = "https://via.placeholder.com/500"
        }
        
        return{
            id:NFT.id.tokenId,
            contractAddress:NFT.contract.address,
            image:imgurl,
            title:metadata.metadata.name,
            description:metadata.metadata.description,
            attributes:metadata.metadata.attributes 
        }
    }))
    return nftMetaData;
}
const getNFTMetadataPolygon = async(nfts) =>{
    const nftMetaData = await Promise.allSettled(nfts.map(async(NFT)=>{
        const metadata = await fetch(`${polygonEndpoint}/getNFTMetadata?contractAddress=${NFT.contract.address}&tokenId=${NFT.id.tokenId}`).then(data =>data.json());
        let imgurl;
        if(metadata.media[0].gateway.length){
            console.log(metadata.media[0].gateway);
            imgurl = metadata.media[0].gateway
        }
        else{
            imgurl = "https://via.placeholder.com/500"
        }
        
        return{
            id:NFT.id.tokenId,
            contractAddress:NFT.contract.address,
            image:imgurl,
            title:metadata.metadata.name,
            description:metadata.metadata.description,
            attributes:metadata.metadata.attributes 
        }
    }))
    return nftMetaData;
}
const fetchNFTs = async(owner,contractAddress,setNFT,polygon,ethereum) =>{
    let data={}
    let fullFilledNFTs=[];
    if(ethereum) {
        try{
            let temp = await getAddressNFTsEth(owner,contractAddress,0);
            data = {...data,...temp};
            if(Object.keys(data).length){  
                const NFTs = await getNFTMetadata(Object.values(data));
                const filteredNFTs = NFTs.filter(NFT => NFT.status == "fulfilled")
                fullFilledNFTs = [...fullFilledNFTs,...filteredNFTs];
                
            }
            setNFT(fullFilledNFTs)
        }
        catch(e){
            setNFT(null);
        }
        
    }
    if(polygon){
        try{
            let temp = await getAddressNFTsPolygon(owner,contractAddress,0);
            data = {...data,...temp};
            if(Object.keys(data).length){  
                const NFTs = await getNFTMetadataPolygon(Object.values(data));
                const filteredNFTs = NFTs.filter(NFT => NFT.status == "fulfilled")
                fullFilledNFTs = [...fullFilledNFTs,...filteredNFTs]; 
            }
        }
        catch(e) {
            console.log(e);
        }
        
    }
    if(fullFilledNFTs.length == 0){
        setNFT(null);
    }
    else{
        setNFT(fullFilledNFTs)
    }
    
}
export {fetchNFTs};