import {Route, Routes} from 'react-router-dom'
import App from './App';
import BuyWater from './BuyWater';
import Payment from './Payment';
import BuyElectric from './BuyElectric';
import Market from './Market';
const Routess = () =>{
    return(
        <>
        <Routes>
            <Route path="/" element={<Market/>}/>
            <Route path="/buywater" element={<BuyWater/>}></Route>
            <Route path="/payment" element={<Payment/>}></Route>
            <Route path="/buyelectric" element={<BuyElectric/>}></Route>
        </Routes>
        </>
    );
};

export default Routess;