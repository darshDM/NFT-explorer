import { useEffect, useState } from 'react';
import NftCard from '../components/nftcard';
import { fetchNFTs } from '../utils/fetchNFTs';
import loadingIcon from "./loading.svg"

function Explore() {

    const [owner, setOwner] = useState("")
    const [contractAddress, setContractAddress] = useState("")
    const [NFTs, setNFTs] = useState("")
    const [loading, setLoading] = useState(false);
    const [eth,setEth] = useState(true);
    const [polygon,setPolygon] = useState(false);
    useEffect(() => {
        if (NFTs != null && NFTs.length > 0) {
            setLoading(false);
        }
        else if(NFTs == null){
            setLoading(false);
        }
    }, [NFTs])

    return (
        <div className='bg-gray-800 w-screen h-full'>
            <header className=' py-24  mb-12 w-full   alchemy'>
                <div className='flex-grow flex justify-end mr-12 mb-12'>
                </div>
                <div className='flex flex-col items-center mb-12'>
                    <div className='mb-16 text-white text-center'>
                        <h1 className='text-5xl  font-bold font-body mb-2'>
                            NFT Explorer
                        </h1>
                        <p>An inspector to find NFTs by owner and contract address </p>
                    </div>
                    <div className='flex flex-col items-center justify-center mb-4 w-2/6 gap-y-2 '>
                        <input className="border rounded-sm focus:outline-none py-2 px-3 w-full" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder='Insert your wallet address'></input>
                        <input className="focus:outline-none rounded-sm py-2 px-3 w-full" value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} placeholder='Insert NFT Contract address (optional)'></input>
                    </div>
                    <div class="flex justify-center">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-purple-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" id="inlineCheckbox1" onClick={()=>setPolygon(!polygon)} value="option1" checked={polygon}/>
                        <label class="form-check-label inline-block text-white" for="inlineCheckbox1" checked={polygon}>Polygon</label>
                    </div>
                    <div class="ml-2 form-check form-check-inline">
                        <input class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-purple-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" id="inlineCheckbox2" onClick={()=>setEth(!eth)} value="option2" checked={eth}/>
                        <label class="form-check-label inline-block text-white" for="inlineCheckbox2">Ethereum</label>
                    </div>

                </div>
                    <div className='w-2/6 mt-3 flex justify-center'>
                        <button className='flex justify-center py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-sm w-full ' onClick={() => { setLoading(true); fetchNFTs(owner, contractAddress, setNFTs,polygon,ethereum) }}>{loading == false ? "Search" : <svg width="28" height="28" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
                            <g fill="none" fill-rule="evenodd">
                                <g transform="translate(1 1)" stroke-width="2">
                                    <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
                                    <path d="M36 18c0-9.94-8.06-18-18-18">
                                        <animateTransform
                                            attributeName="transform"
                                            type="rotate"
                                            from="0 18 18"
                                            to="360 18 18"
                                            dur="1s"
                                            repeatCount="indefinite" />
                                    </path>
                                </g>
                            </g>
                        </svg>
                        }</button>
                    </div>
                    
                </div>
                
            </header>

            <section className='flex flex-wrap justify-center'>
                {
                    NFTs ? NFTs.map(NFT => {
                        return (

                            <NftCard image={NFT.value.image} id={NFT.value.id} title={NFT.value.title} address={NFT.value.contractAddress} description={NFT.value.description} attributes={NFT.value.attributes} ></NftCard>
                        )
                    }) : <div className='text-white mb-20'>No NFTs found</div>
                }
            </section>
        </div>
    )
}


export default Explore